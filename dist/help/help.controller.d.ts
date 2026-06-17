import { HelpService } from './help.service';
import { CreateHelpDto } from './dto/create-help.dto';
import { UpdateHelpDto } from './dto/update-help.dto';
import SearchDto from '../shared/dto/search.dto';
import HelpDto from './dto/help.dto';
export declare class HelpController {
  private readonly helpService;
  constructor(helpService: HelpService);
  findAll(req: SearchDto): Promise<HelpDto[]>;
  create(createHelpDto: CreateHelpDto): Promise<HelpDto>;
  findOne(id: number): Promise<HelpDto>;
  update(data: UpdateHelpDto): Promise<HelpDto>;
  remove(id: number): Promise<void>;
}
