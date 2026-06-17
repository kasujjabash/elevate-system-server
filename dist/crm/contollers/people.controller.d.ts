import { ContactsService } from '../contacts.service';
import Person from '../entities/person.entity';
import { Connection } from 'typeorm';
import { ContactSearchDto } from '../dto/contact-search.dto';
import { CreatePersonDto } from '../dto/create-person.dto';
import PersonListDto from '../dto/person-list.dto';
import ContactListDto from '../dto/contact-list.dto';
import { PersonEditDto } from '../dto/person-edit.dto';
export declare class PeopleController {
  private readonly service;
  private readonly personRepository;
  private readonly userRepository;
  constructor(connection: Connection, service: ContactsService);
  findAll(req: ContactSearchDto): Promise<Person[]>;
  findCombo(req: ContactSearchDto): Promise<PersonListDto[]>;
  create(data: CreatePersonDto): Promise<ContactListDto>;
  upload(file: any): Promise<void>;
  update({ id, ...data }: PersonEditDto): Promise<Person>;
}
