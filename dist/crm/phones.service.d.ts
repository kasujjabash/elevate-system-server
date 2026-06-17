import Phone from './entities/phone.entity';
import { Connection } from 'typeorm';
import { PhoneDto } from './dto/phone.dto';
export declare class PhonesService {
  private readonly repository;
  constructor(connection: Connection);
  create(data: PhoneDto): Promise<Phone[]>;
}
