import { CreateHelpDto } from './create-help.dto';
import { URLCategory } from '../enums/URLCategory';
declare const UpdateHelpDto_base: import('@nestjs/mapped-types').MappedType<
  Partial<CreateHelpDto>
>;
export declare class UpdateHelpDto extends UpdateHelpDto_base {
  title: string;
  url: string;
  category: URLCategory;
}
export {};
