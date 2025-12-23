export interface IBackupScheduler {
  start(): Promise<void>;
  stop(): void;
  updateSchedule(): Promise<void>;
  isScheduled(): boolean;
}
