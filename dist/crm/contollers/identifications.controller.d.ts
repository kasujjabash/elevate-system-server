import Identification from '../entities/identification.entity';
import { Connection } from 'typeorm';
import SearchDto from '../../shared/dto/search.dto';
export declare class IdentificationsController {
  private readonly repository;
  constructor(connection: Connection);
  findAll(req: SearchDto): Promise<Identification[]>;
  create(data: Identification): Promise<Identification>;
  update(data: Identification): Promise<Identification>;
  findOne(id: number): Promise<Identification>;
  remove(id: number): Promise<void>;
}
