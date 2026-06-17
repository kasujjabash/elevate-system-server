import { SearchService } from './search.service';
export declare class SearchController {
  private readonly searchService;
  constructor(searchService: SearchService);
  search(
    query: string,
    type: string,
    limit: number,
    request: any,
  ): Promise<any>;
}
