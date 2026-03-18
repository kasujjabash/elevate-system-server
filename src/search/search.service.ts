import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository, ILike } from 'typeorm';
import Contact from '../crm/entities/contact.entity';

@Injectable()
export class SearchService {
  private readonly contactRepository: Repository<Contact>;

  constructor(@Inject('CONNECTION') connection: Connection) {
    this.contactRepository = connection.getRepository(Contact);
  }

  async search(
    query: string,
    type: string,
    limit: number,
    _user: any,
  ): Promise<any> {
    const results = {
      contacts: [],
      groups: [],
      total: 0,
    };

    if (!query || query.trim().length === 0) {
      return results;
    }

    const searchQuery = `%${query.trim()}%`;

    if (type === 'all' || type === 'contacts') {
      const contacts = await this.searchContacts(searchQuery, limit);
      results.contacts = contacts;
      results.total += contacts.length;
    }

    return results;
  }

  private async searchContacts(
    searchQuery: string,
    limit: number,
  ): Promise<any[]> {
    try {
      const contacts = await this.contactRepository
        .createQueryBuilder('contact')
        .leftJoinAndSelect('contact.person', 'person')
        .leftJoinAndSelect('contact.emails', 'emails')
        .leftJoinAndSelect('contact.phones', 'phones')
        .where('person.firstName ILIKE :query', { query: searchQuery })
        .orWhere('person.lastName ILIKE :query', { query: searchQuery })
        .orWhere('emails.value ILIKE :query', { query: searchQuery })
        .take(limit)
        .getMany();

      return contacts.map((contact) => ({
        id: contact.id,
        type: 'contact',
        fullName: `${contact.person?.firstName || ''} ${
          contact.person?.lastName || ''
        }`.trim(),
        email: contact.emails?.[0]?.value || null,
        phone: contact.phones?.[0]?.value || null,
        category: contact.category,
      }));
    } catch (error) {
      console.error('Error searching contacts:', error);
      return [];
    }
  }
}
