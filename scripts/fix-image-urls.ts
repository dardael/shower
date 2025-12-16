/**
 * Script to fix absolute URLs in database to relative URLs
 * This allows images to work from any domain (localhost, IP address, etc.)
 */
import 'reflect-metadata';
import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/shower';

interface SettingDocument {
  key: string;
  value: any;
}

const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const Setting = mongoose.model<SettingDocument>('Setting', SettingSchema);

/**
 * Converts absolute URL to relative URL
 * Example: http://localhost:3000/api/icons/logo.png -> /api/icons/logo.png
 */
function convertToRelativeUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;

  // Match pattern: http(s)://domain:port/path or http(s)://domain/path
  const urlPattern = /^https?:\/\/[^\/]+(\/.*)/;
  const match = url.match(urlPattern);

  if (match && match[1]) {
    return match[1]; // Return the path part only
  }

  return url; // Already relative or invalid
}

/**
 * Recursively process object values to convert URLs
 */
function processValue(value: any): any {
  if (typeof value === 'string') {
    return convertToRelativeUrl(value);
  }

  if (Array.isArray(value)) {
    return value.map(processValue);
  }

  if (value && typeof value === 'object') {
    const processed: any = {};
    for (const [key, val] of Object.entries(value)) {
      if (key === 'url' && typeof val === 'string') {
        processed[key] = convertToRelativeUrl(val);
      } else {
        processed[key] = processValue(val);
      }
    }
    return processed;
  }

  return value;
}

async function fixImageUrls(): Promise<void> {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all settings that might contain URLs
    const settings = await Setting.find({});
    console.log(`Found ${settings.length} settings to process`);

    let updatedCount = 0;

    for (const setting of settings) {
      const originalValue = JSON.stringify(setting.value);
      const processedValue = processValue(setting.value);
      const newValue = JSON.stringify(processedValue);

      if (originalValue !== newValue) {
        console.log(`\nUpdating setting: ${setting.key}`);
        console.log(`  Before: ${originalValue}`);
        console.log(`  After:  ${newValue}`);

        await Setting.updateOne(
          { key: setting.key },
          {
            $set: {
              value: processedValue,
              updatedAt: new Date(),
            },
          }
        );
        updatedCount++;
      }
    }

    console.log(`\nMigration complete! Updated ${updatedCount} settings.`);
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
fixImageUrls()
  .then(() => {
    console.log('\n✓ Migration successful');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  });
