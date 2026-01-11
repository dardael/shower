import { NextRequest, NextResponse } from 'next/server';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { ZipImporter } from '@/infrastructure/config/adapters/ZipImporter';
import { ImportConfiguration } from '@/application/config/use-cases/ImportConfiguration';
import {
  MenuServiceLocator,
  PagesServiceLocator,
  SettingsServiceLocator,
  ProductServiceLocator,
  AppointmentServiceLocator,
  LoggerServiceLocator,
} from '@/infrastructure/container';
import { ILogger } from '@/application/shared/ILogger';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface ImportDependencies {
  importer: ZipImporter;
  importUseCase: ImportConfiguration;
  logger: ILogger;
}

function createImportDependencies(): ImportDependencies {
  const menuItemRepository = MenuServiceLocator.getMenuItemRepository();
  const pageContentRepository = PagesServiceLocator.getPageContentRepository();
  const websiteSettingsRepository =
    SettingsServiceLocator.getWebsiteSettingsRepository();
  const socialNetworkRepository =
    SettingsServiceLocator.getSocialNetworkRepository();
  const productRepository = ProductServiceLocator.getProductRepository();
  const categoryRepository = ProductServiceLocator.getCategoryRepository();
  const activityRepository = AppointmentServiceLocator.getActivityRepository();
  const availabilityRepository =
    AppointmentServiceLocator.getAvailabilityRepository();
  const logger = LoggerServiceLocator.getBaseLogger();

  const importer = new ZipImporter(
    menuItemRepository,
    pageContentRepository,
    websiteSettingsRepository,
    socialNetworkRepository,
    productRepository,
    categoryRepository,
    activityRepository,
    availabilityRepository,
    logger
  );

  const importUseCase = new ImportConfiguration(importer);

  return { importer, importUseCase, logger };
}

async function handlePreview(request: NextRequest): Promise<NextResponse> {
  const { importUseCase, logger } = createImportDependencies();
  logger.logInfo('Processing import preview request');

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const result = await importUseCase.preview(buffer);

  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    valid: true,
    package: result.package
      ? {
          schemaVersion: result.package.schemaVersion.toString(),
          exportDate: result.package.exportDate.toISOString(),
          sourceIdentifier: result.package.sourceIdentifier,
          summary: result.package.summary,
        }
      : null,
  });
}

async function handleImport(request: NextRequest): Promise<NextResponse> {
  const { importUseCase, logger } = createImportDependencies();
  logger.logInfo('Processing import request');

  const formData = await request.formData();
  const file = formData.get('file');
  const confirmed = formData.get('confirmed');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  if (confirmed !== 'true') {
    return NextResponse.json(
      { error: 'Import must be confirmed' },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await importUseCase.execute(buffer);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        restored: result.restored,
      },
      { status: 500 }
    );
  }

  logger.logInfo('Configuration imported successfully');

  return NextResponse.json({
    success: true,
    message: result.message,
    imported: result.imported,
  });
}

export const POST = withApi(
  async (request: NextRequest) => {
    const url = new URL(request.url);
    const isPreview = url.searchParams.get('preview') === 'true';

    if (isPreview) {
      return handlePreview(request);
    }

    return handleImport(request);
  },
  { requireAuth: true }
);
