import { container } from '@/infrastructure/container';
import type { IConfigurationExporter } from '@/domain/config/ports/IConfigurationExporter';
import type { IConfigurationImporter } from '@/domain/config/ports/IConfigurationImporter';

/**
 * Service locator for configuration export/import services.
 */
export class ConfigurationServiceLocator {
  static getConfigurationExporter(): IConfigurationExporter {
    return container.resolve('IConfigurationExporter');
  }

  static getConfigurationImporter(): IConfigurationImporter {
    return container.resolve('IConfigurationImporter');
  }
}
