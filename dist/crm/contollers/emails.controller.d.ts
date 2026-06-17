import Email from '../entities/email.entity';
import { Connection } from 'typeorm';
import SearchDto from '../../shared/dto/search.dto';
export declare class EmailsController {
  private readonly repository;
  constructor(connection: Connection);
  findAll(req: SearchDto): Promise<Email[]>;
  create(data: Email): Promise<Email>;
  update(data: Email): Promise<Email>;
  findOne(id: number): Promise<Email>;
  remove(id: number): Promise<void>;
}
