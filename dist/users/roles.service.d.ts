import SearchDto from 'src/shared/dto/search.dto';
import { Connection } from 'typeorm';
import { RolesDto } from './dto/roles.dto';
export declare class RolesService {
  private readonly repository;
  constructor(connection: Connection);
  create(userRole: RolesDto): Promise<RolesDto>;
  findAll(req: SearchDto): Promise<RolesDto[]>;
  findOne(id: number): Promise<RolesDto>;
  update(userRole: RolesDto): Promise<RolesDto>;
  remove(roleId: number): Promise<void>;
}
