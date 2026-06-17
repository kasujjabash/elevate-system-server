import { URLCategory } from '../enums/URLCategory';
export declare class CreateHelpDto {
  id: number;
  category: URLCategory;
  title: string;
  url?: string;
  createdOn: Date;
  modifiedOn: Date;
}
