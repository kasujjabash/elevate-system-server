import { UserPermissions } from 'src/users/dto/user.dto';
export declare class UserDto extends UserPermissions {
  id: number;
  contactId: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
  permissions?: string[];
}
