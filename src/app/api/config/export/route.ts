import { NextRequest, NextResponse } from 'next/server';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { ZipExporter } from '@/infrastructure/config/adapters/ZipExporter';
import { ConfigurationService } from '@/application/config/services/ConfigurationService';
import {
  MenuServiceLocator,
  PagesServiceLocator,
  SettingsServiceLocator,
  ProductServiceLocator,
  AppointmentServiceLocator,
  LoggerServiceLocator,
} from '@/infrastructure/container';
import type { Logger } from '@/application/shared/Logger';

interface ExportErrorResponse {
  error: string;
}

interface ExportDependencies {
  configService: ConfigurationService;
  logger: Logger;
}

function createExportDependencies(): ExportDependencies {
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
  const logger = LoggerServiceLocator.getBaseLogger() as Logger;

  const exporter = new ZipExporter(
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

  const configService = new ConfigurationService(exporter);

  return { configService, logger };
}

export const GET = withApi(
  async (
    request: NextRequest
  ): Promise<NextResponse<Buffer | ExportErrorResponse>> => {
    const startTime = Date.now();
    const { configService, logger } = createExportDependencies();

    try {
      logger.logApiRequest(
        'GET',
        '/api/config/export',
        request.headers.get('x-user-id') || undefined
      );

      // Execute export
      const zipBuffer = await configService.exportConfiguration();

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `export-${timestamp}.zip`;

      const duration = Date.now() - startTime;
      logger.logApiResponse('GET', '/api/config/export', 200, duration, {
        filename,
        size: zipBuffer.length,
      });

      // Return ZIP file as download
      return new NextResponse(new Uint8Array(zipBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': zipBuffer.length.toString(),
        },
      });
    } catch (error) {
      logger.logErrorWithObject(error, 'Error exporting configuration', {
        method: 'GET',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse('GET', '/api/config/export', 500, duration);

      const errorResponse: ExportErrorResponse = {
        error: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }
  },
  { requireAuth: true }
);
