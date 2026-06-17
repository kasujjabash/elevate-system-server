import { User } from './entities/user.entity';
import Roles from './entities/roles.entity';
import UserRoles from './entities/userRoles.entity';
export declare const usersEntities: (
  | typeof UserRoles
  | typeof User
  | typeof Roles
)[];
