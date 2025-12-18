import 'reflect-metadata';

export async function register() {
  // Only run on the server (Node.js runtime)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamically import to avoid issues during build
    const { ConfigServiceLocator } = await import('@/infrastructure/container');
    const { Logger } = await import('@/application/shared/Logger');

    const logger = new Logger();

    try {
      const scheduler = ConfigServiceLocator.getRestartScheduler();
      await scheduler.start();
      logger.info('Restart scheduler initialized');
    } catch (error) {
      logger.error('Failed to initialize scheduler', error);
    }
  }
}
