import Request from '../entities/request.entity';
import { Connection } from 'typeorm';
import SearchDto from '../../shared/dto/search.dto';
export declare class RequestsController {
  private readonly repository;
  constructor(connection: Connection);
  findAll(req: SearchDto): Promise<Request[]>;
  create(data: Request): Promise<Request>;
  update(data: Request): Promise<Request>;
  findOne(id: number): Promise<Request>;
  remove(id: number): Promise<void>;
}
