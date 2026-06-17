export declare class CreateUserDto {
  contactId?: number;
  firstName?: string;
  lastName?: string;
  username: string;
  password: string;
  roles: string[];
  isActive: boolean;
  hubId?: number;
  courseIds?: number[];
  phone?: string;
  dateOfBirth?: string;
}
