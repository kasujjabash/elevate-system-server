'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.SearchService = void 0;
const common_1 = require('@nestjs/common');
const typeorm_1 = require('typeorm');
const contact_entity_1 = require('../crm/entities/contact.entity');
let SearchService = class SearchService {
  constructor(connection) {
    this.contactRepository = connection.getRepository(contact_entity_1.default);
  }
  async search(query, type, limit, _user) {
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
  async searchContacts(searchQuery, limit) {
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
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [typeorm_1.Connection]),
  ],
  SearchService,
);
//# sourceMappingURL=search.service.js.map
