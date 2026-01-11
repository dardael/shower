// This file is automatically imported by Next.js when the server starts
// See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import { container } from '@/infrastructure/container';
import type { IAppointmentReminderScheduler } from '@/infrastructure/appointment/services/AppointmentReminderScheduler';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Start appointment reminder scheduler
    try {
      const reminderScheduler =
        container.resolve<IAppointmentReminderScheduler>(
          'IAppointmentReminderScheduler'
        );

      if (!reminderScheduler.isRunning()) {
        reminderScheduler.schedule();
        console.log('✓ Appointment reminder scheduler started');
      }
    } catch (error) {
      console.error('Failed to start appointment reminder scheduler:', error);
    }
  }
}
