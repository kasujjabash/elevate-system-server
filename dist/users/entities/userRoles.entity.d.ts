import Roles from './roles.entity';
import { User } from './user.entity';
export default class UserRoles {
  id: number;
  user: User;
  userId: number;
  roles: Roles;
  rolesId: number;
}
