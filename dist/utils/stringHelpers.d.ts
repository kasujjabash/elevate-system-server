import { User } from 'src/users/entities/user.entity';
export declare const lowerCaseRemoveSpaces: (name: string) => string;
export declare function generateRandomPassword(length: any): string;
export declare function getFormattedDateString(currentDate: Date): string;
export declare function getUserDisplayName(user: User): string;
export declare function getHumanReadableDate(date: Date): string;
