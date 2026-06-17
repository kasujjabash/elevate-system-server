import { CreateHelpDto } from './dto/create-help.dto';
import { UpdateHelpDto } from './dto/update-help.dto';
import { Connection } from 'typeorm';
import HelpDto from './dto/help.dto';
import SearchDto from '../shared/dto/search.dto';
export declare class HelpService {
  private readonly repository;
  constructor(connection: Connection);
  create(data: CreateHelpDto): Promise<HelpDto>;
  findAll(req: SearchDto): Promise<HelpDto[]>;
  findOne(id: number): Promise<HelpDto>;
  update(data: UpdateHelpDto): Promise<HelpDto>;
  remove(id: number): Promise<void>;
}
