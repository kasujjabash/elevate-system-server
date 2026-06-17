/// <reference types="multer" />
import { CsvParser } from 'nest-csv-parser';
import { ContactsService } from '../contacts.service';
import { Connection } from 'typeorm';
import CompanyListDto from '../dto/company-list.dto';
import { UsersService } from 'src/users/users.service';
export declare class ContactImportController {
  private readonly service;
  private readonly csvParser;
  private readonly usersService;
  private readonly companyRepository;
  constructor(
    connection: Connection,
    service: ContactsService,
    csvParser: CsvParser,
    usersService: UsersService,
  );
  GetSample(res: any): Promise<CompanyListDto[]>;
  uploadFile(file: Express.Multer.File): Promise<any[]>;
  uploadGroupLeaders(file: Express.Multer.File): Promise<any[]>;
}
