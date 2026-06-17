import { Connection } from 'typeorm';
import Contact from './entities/contact.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { ContactSearchDto } from './dto/contact-search.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import ContactListDto from './dto/contact-list.dto';
import { GoogleService } from 'src/vendor/google.service';
import { PrismaService } from '../shared/prisma.service';
import { GroupFinderService } from './group-finder/group-finder.service';
import { AddressesService } from './addresses.service';
export declare class ContactsService {
  private googleService;
  private prisma;
  private groupFinderService;
  private addressesService;
  private readonly repository;
  private readonly personRepository;
  private readonly companyRepository;
  private readonly phoneRepository;
  private readonly emailRepository;
  private readonly addressRepository;
  private readonly tenantRepository;
  constructor(
    connection: Connection,
    googleService: GoogleService,
    prisma: PrismaService,
    groupFinderService: GroupFinderService,
    addressesService: AddressesService,
  );
  findAll(req: ContactSearchDto): Promise<ContactListDto[]>;
  static toListDto(it: Contact): ContactListDto;
  create(data: Contact, request?: any): Promise<Contact>;
  update(data: Contact): Promise<Contact>;
  updatePartial(id: number, data: Partial<Contact>): Promise<Contact>;
  createPerson(createPersonDto: CreatePersonDto): Promise<Contact>;
  getGroupRequest(_createPersonDto: CreatePersonDto): Promise<void>;
  getClosestGroups(_data: any): Promise<any[]>;
  findOne(id: number): Promise<Contact>;
  remove(id: number): Promise<void>;
  findByName(username: string): Promise<Contact | undefined>;
  createCompany(data: CreateCompanyDto): Promise<Contact>;
  private validateUpdateData;
  private updateEmailsEfficiently;
  private updatePhonesEfficiently;
  private updateAddressesEfficiently;
}
