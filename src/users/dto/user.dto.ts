export class UserPermissions {
  permissions?: string[];
}

export class UserListDto extends UserPermissions {
  id: number;
  username: string;
  fullName: string;
  contactId: number;
  contact: any;
  avatar: string;
  roles: string[];
  isActive: boolean;
  hubId?: number | null;
  hubName?: string | null;
  courseIds?: number[];
  courses?: { id: number; name: string }[];
}

export class UserDto {
  id: number;
  username: string;
  isActive: boolean;
}
