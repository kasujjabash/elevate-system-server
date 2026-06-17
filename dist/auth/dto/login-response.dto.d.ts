import { UserListDto } from 'src/users/dto/user.dto';
import { UserDto } from './user.dto';
export declare class GroupHierarchyDto {
  id: number;
  name: string;
  type: string;
  memberCount: number;
}
export declare class HierarchyDto {
  myGroups: GroupHierarchyDto[];
  canManageGroupIds?: number[];
  canViewGroupIds?: number[];
}
export declare class LoginResponseDto {
  token: string;
  user: UserDto | UserListDto;
  hierarchy?: HierarchyDto;
}
export declare class RefreshTokenResponseDto {
  token: string;
  refreshToken: string;
}
