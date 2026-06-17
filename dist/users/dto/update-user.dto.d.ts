export declare class UpdateUserDto {
  id: number;
  roles?: string[];
  oldPassword?: string;
  password?: string;
  isActive?: boolean;
  contactId?: number;
  hubId?: number;
  courseIds?: number[];
  phone?: string;
  dateOfBirth?: string;
  firstName?: string;
  lastName?: string;
}
