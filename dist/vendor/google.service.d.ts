import { HttpService } from '@nestjs/axios';
import GooglePlaceDto from './google-place.dto';
export declare class GoogleService {
  private httpService;
  constructor(httpService: HttpService);
  getPlaceDetails(placeId: string): Promise<GooglePlaceDto>;
}
