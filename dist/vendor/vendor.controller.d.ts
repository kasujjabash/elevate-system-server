import { GoogleService } from './google.service';
import GooglePlaceDto from './google-place.dto';
export declare class VendorController {
  private googleService;
  constructor(googleService: GoogleService);
  findOne(placeId: string): Promise<GooglePlaceDto>;
}
