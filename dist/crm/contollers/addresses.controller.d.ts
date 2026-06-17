import Address from '../entities/address.entity';
import { Connection } from 'typeorm';
import SearchDto from '../../shared/dto/search.dto';
import { AddressesService } from '../addresses.service';
export declare class AddressesController {
  private readonly service;
  private readonly repository;
  constructor(connection: Connection, service: AddressesService);
  findAll(req: SearchDto): Promise<Address[]>;
  create(data: Address): Promise<Address>;
  update(data: Address): Promise<Address>;
  findOne(id: number): Promise<Address>;
  remove(id: number): Promise<void>;
}
