import Occasion from '../entities/occasion.entity';
import { Connection } from 'typeorm';
import SearchDto from '../../shared/dto/search.dto';
export declare class OccasionsController {
  private readonly repository;
  constructor(connection: Connection);
  findAll(req: SearchDto): Promise<Occasion[]>;
  create(data: Occasion): Promise<Occasion>;
  update(data: Occasion): Promise<Occasion>;
  findOne(id: number): Promise<Occasion>;
  remove(id: number): Promise<void>;
}
