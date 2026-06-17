import { Connection } from 'typeorm';
export declare class SearchService {
  private readonly contactRepository;
  constructor(connection: Connection);
  search(query: string, type: string, limit: number, _user: any): Promise<any>;
  private searchContacts;
}
