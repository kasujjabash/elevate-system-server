import { ContactsService } from '../contacts.service';
import { Connection } from 'typeorm';
import { CreatePersonDto } from '../dto/create-person.dto';
import ContactListDto from '../dto/contact-list.dto';
import { UsersService } from 'src/users/users.service';
export declare class RegisterController {
  private readonly service;
  private readonly userService;
  private readonly personRepository;
  private readonly userRepository;
  constructor(
    connection: Connection,
    service: ContactsService,
    userService: UsersService,
  );
  create(data: CreatePersonDto): Promise<ContactListDto | Error>;
}
