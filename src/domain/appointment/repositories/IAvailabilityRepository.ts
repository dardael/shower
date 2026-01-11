import { Availability } from '../entities/Availability';

export interface IAvailabilityRepository {
  find(): Promise<Availability | null>;
  save(availability: Availability): Promise<Availability>;
  update(availability: Availability): Promise<Availability>;
}
