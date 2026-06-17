import { User } from '../users/entities/user.entity';
import { UserDto } from './dto/user.dto';
export declare const cleanUpUser: (user: User) => void;
export declare const createUserDto: (user: User) => UserDto;
