import { Activity } from '../entities/Activity';

export interface IActivityRepository {
  findById(id: string): Promise<Activity | null>;
  findAll(): Promise<Activity[]>;
  save(activity: Activity): Promise<Activity>;
  update(activity: Activity): Promise<Activity>;
  delete(id: string): Promise<void>;
}
