import { ContactsService } from '../contacts.service';
import { Connection } from 'typeorm';
import { ContactSearchDto } from '../dto/contact-search.dto';
import { CreateCompanyDto } from '../dto/create-company.dto';
import Company from '../entities/company.entity';
import CompanyListDto from '../dto/company-list.dto';
import ContactListDto from '../dto/contact-list.dto';
export declare class CompaniesController {
  private readonly service;
  private readonly personRepository;
  constructor(connection: Connection, service: ContactsService);
  findAll(req: ContactSearchDto): Promise<Company[]>;
  findCombo(req: ContactSearchDto): Promise<CompanyListDto[]>;
  create(data: CreateCompanyDto): Promise<ContactListDto>;
  update(data: Company): Promise<Company>;
}
