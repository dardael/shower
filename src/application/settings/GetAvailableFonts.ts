import { injectable } from 'tsyringe';
import type { IGetAvailableFonts } from '@/application/settings/IGetAvailableFonts';
import {
  AVAILABLE_FONTS,
  type FontMetadata,
} from '@/domain/settings/constants/AvailableFonts';

/**
 * Use case for retrieving available fonts
 */
@injectable()
export class GetAvailableFonts implements IGetAvailableFonts {
  async execute(): Promise<FontMetadata[]> {
    return AVAILABLE_FONTS;
  }
}
