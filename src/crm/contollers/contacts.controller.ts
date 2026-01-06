import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ContactsService } from '../contacts.service';
import { ContactSearchDto } from '../dto/contact-search.dto';
import Contact from '../entities/contact.entity';
import { ApiTags } from '@nestjs/swagger';
import ContactListDto from '../dto/contact-list.dto';
import { SentryInterceptor } from 'src/utils/sentry.interceptor';
import { TenantContextInterceptor } from '../../interceptors/tenant-context.interceptor';

@UseInterceptors(SentryInterceptor, TenantContextInterceptor)
@ApiTags('Crm')
@Controller('api/crm/contacts')
export class ContactsController {
  constructor(private readonly service: ContactsService) {}

  @Get()
  async findAll(@Query() req: ContactSearchDto): Promise<ContactListDto[]> {
    return this.service.findAll(req);
  }

  @Post()
  async create(@Body() data: Contact, @Req() req: any): Promise<Contact> {
    return await this.service.create(data, req);
  }

  @Put()
  async updateLegacy(@Body() data: Contact): Promise<Contact> {
    return await this.service.update(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<Contact>
  ): Promise<Contact> {
    return await this.service.updatePartial(id, data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Contact> {
    return await this.service.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.service.remove(id);
  }
}
