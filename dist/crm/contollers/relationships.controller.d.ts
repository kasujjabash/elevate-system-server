import Relationship from '../entities/relationship.entity';
import { Connection } from 'typeorm';
import SearchDto from '../../shared/dto/search.dto';
export declare class RelationshipsController {
  private readonly repository;
  constructor(connection: Connection);
  findAll(req: SearchDto): Promise<Relationship[]>;
  create(data: Relationship): Promise<Relationship>;
  update(data: Relationship): Promise<Relationship>;
  findOne(id: number): Promise<Relationship>;
  remove(id: number): Promise<void>;
}
