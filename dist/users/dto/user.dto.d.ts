export declare class UserPermissions {
  permissions?: string[];
}
export declare class UserListDto extends UserPermissions {
  id: number;
  username: string;
  fullName: string;
  contactId: number;
  contact: any;
  avatar: string;
  roles: string[];
  isActive: boolean;
}
export declare class UserDto {
  id: number;
  username: string;
  isActive: boolean;
}
