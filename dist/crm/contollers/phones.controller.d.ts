import Phone from '../entities/phone.entity';
import { Connection } from 'typeorm';
import SearchDto from '../../shared/dto/search.dto';
import { PhoneDto } from '../dto/phone.dto';
import { PhonesService } from '../phones.service';
export declare class PhonesController {
  private readonly service;
  private readonly repository;
  constructor(connection: Connection, service: PhonesService);
  findAll(req: SearchDto): Promise<Phone[]>;
  create(data: PhoneDto): Promise<Phone[]>;
  update(data: PhoneDto): Promise<Phone>;
  findOne(id: number): Promise<Phone>;
  remove(id: number): Promise<void>;
}
