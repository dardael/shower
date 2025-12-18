import 'reflect-metadata';

export async function register(): Promise<void> {
  // Only run on the server (Node.js runtime)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamically import to avoid issues during build
    const { ConfigServiceLocator } = await import('@/infrastructure/container');
    const { Logger } = await import('@/application/shared/Logger');
    const { initializeDatabase } = await import(
      '@/infrastructure/shared/databaseInitialization'
    );

    const logger = new Logger();
    logger.info('Instrumentation register() called', {
      runtime: process.env.NEXT_RUNTIME,
    });

    try {
      // Initialize database connection first - required for scheduler to fetch config
      await initializeDatabase();
      logger.info('Database initialized successfully');

      const scheduler = ConfigServiceLocator.getRestartScheduler();
      await scheduler.start();
      logger.info('Restart scheduler initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize scheduler', error);
    }
  }
}
