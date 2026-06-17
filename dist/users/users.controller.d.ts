import { UsersService } from './users.service';
import SearchDto from '../shared/dto/search.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListDto } from './dto/user.dto';
export declare class UsersController {
  private readonly service;
  constructor(service: UsersService);
  findAll(req: SearchDto): Promise<UserListDto[]>;
  create(data: CreateUserDto): Promise<UserListDto>;
  update(data: UpdateUserDto): Promise<UserListDto>;
  updateById(id: number, data: UpdateUserDto): Promise<UserListDto>;
  findOne(id: number): Promise<UserListDto>;
  remove(id: number): Promise<void>;
}
