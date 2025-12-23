import 'reflect-metadata';

export async function register(): Promise<void> {
  // Only run on the server (Node.js runtime)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamically import to avoid issues during build
    const { ConfigServiceLocator, BackupServiceLocator } = await import(
      '@/infrastructure/container'
    );
    const { Logger } = await import('@/application/shared/Logger');
    const { initializeDatabase } = await import(
      '@/infrastructure/shared/databaseInitialization'
    );

    const logger = new Logger();
    logger.info('Instrumentation register() called', {
      runtime: process.env.NEXT_RUNTIME,
    });

    try {
      // Initialize database connection first - required for schedulers to fetch config
      await initializeDatabase();
      logger.info('Database initialized successfully');

      // Initialize restart scheduler
      const restartScheduler = ConfigServiceLocator.getRestartScheduler();
      await restartScheduler.start();
      logger.info('Restart scheduler initialized successfully');

      // Initialize backup scheduler
      const backupScheduler = BackupServiceLocator.getBackupScheduler();
      await backupScheduler.start();
      logger.info('Backup scheduler initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize schedulers', error);
    }
  }
}
