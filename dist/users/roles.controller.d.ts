import { RolesService } from './roles.service';
import { RolesDto } from './dto/roles.dto';
import SearchDto from 'src/shared/dto/search.dto';
export declare class RolesController {
  private readonly rolesService;
  constructor(rolesService: RolesService);
  create(userRole: RolesDto): Promise<RolesDto>;
  findAll(data: SearchDto): Promise<RolesDto[]>;
  findOne(id: number): Promise<RolesDto>;
  update(userRole: RolesDto): Promise<RolesDto>;
  remove(id: number): Promise<void>;
}
