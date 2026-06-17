import { ContactsService } from '../contacts.service';
import { ContactSearchDto } from '../dto/contact-search.dto';
import Contact from '../entities/contact.entity';
import ContactListDto from '../dto/contact-list.dto';
export declare class ContactsController {
  private readonly service;
  constructor(service: ContactsService);
  findAll(req: ContactSearchDto): Promise<ContactListDto[]>;
  create(data: Contact, req: any): Promise<Contact>;
  updateLegacy(data: Contact): Promise<Contact>;
  update(id: number, data: Partial<Contact>): Promise<Contact>;
  findOne(id: number): Promise<Contact>;
  remove(id: number): Promise<void>;
}
