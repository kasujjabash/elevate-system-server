import { GoogleService } from 'src/vendor/google.service';
import { Connection } from 'typeorm';
import Address from './entities/address.entity';
export declare class AddressesService {
  private googleService;
  private readonly repository;
  constructor(connection: Connection, googleService: GoogleService);
  create(data: Address): Promise<Address>;
}
