import SearchDto from '../../shared/dto/search.dto';
export declare class ContactSearchDto extends SearchDto {
  email?: string;
  phone?: string;
  skipUsers?: boolean;
  cellGroups?: number[];
  ageGroups?: number[];
  churchLocations?: number[];
}
