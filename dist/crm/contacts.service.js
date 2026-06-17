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
var ContactsService_1;
Object.defineProperty(exports, '__esModule', { value: true });
exports.ContactsService = void 0;
const common_1 = require('@nestjs/common');
const tenant_entity_1 = require('../tenants/entities/tenant.entity');
const lodash_1 = require('lodash');
const typeorm_1 = require('typeorm');
const contact_entity_1 = require('./entities/contact.entity');
const crm_helpers_1 = require('./crm.helpers');
const phone_entity_1 = require('./entities/phone.entity');
const email_entity_1 = require('./entities/email.entity');
const person_entity_1 = require('./entities/person.entity');
const company_entity_1 = require('./entities/company.entity');
const validation_1 = require('../utils/validation');
const address_entity_1 = require('./entities/address.entity');
const google_service_1 = require('../vendor/google.service');
const prisma_service_1 = require('../shared/prisma.service');
const creationUtils_1 = require('./utils/creationUtils');
const group_finder_service_1 = require('./group-finder/group-finder.service');
const addresses_service_1 = require('./addresses.service');
let ContactsService = (ContactsService_1 = class ContactsService {
  constructor(
    connection,
    googleService,
    prisma,
    groupFinderService,
    addressesService,
  ) {
    this.googleService = googleService;
    this.prisma = prisma;
    this.groupFinderService = groupFinderService;
    this.addressesService = addressesService;
    this.repository = connection.getRepository(contact_entity_1.default);
    this.personRepository = connection.getRepository(person_entity_1.default);
    this.companyRepository = connection.getRepository(company_entity_1.default);
    this.phoneRepository = connection.getRepository(phone_entity_1.default);
    this.emailRepository = connection.getRepository(email_entity_1.default);
    this.addressRepository = connection.getRepository(address_entity_1.default);
    this.tenantRepository = connection.getRepository(tenant_entity_1.Tenant);
  }
  async findAll(req) {
    try {
      let hasFilter = false;
      let idList = [];
      if ((0, validation_1.hasValue)(req.query)) {
        hasFilter = true;
        const resp = await this.personRepository.find({
          select: ['contactId'],
          where: [
            {
              firstName: (0, typeorm_1.ILike)(`%${req.query.trim()}%`),
            },
            {
              lastName: (0, typeorm_1.ILike)(`%${req.query.trim()}%`),
            },
            {
              middleName: (0, typeorm_1.ILike)(`%${req.query.trim()}%`),
            },
          ],
        });
        if ((0, validation_1.hasValue)(idList)) {
          idList = (0, lodash_1.intersection)(
            idList,
            resp.map((it) => it.contactId),
          );
        } else {
          idList.push(...resp.map((it) => it.contactId));
        }
      }
      if ((0, validation_1.hasValue)(req.phone)) {
        hasFilter = true;
        const resp = await this.phoneRepository.find({
          select: ['contactId'],
          where: { value: (0, typeorm_1.Like)(`%${req.phone}%`) },
        });
        console.log('resp', resp);
        if ((0, validation_1.hasValue)(idList)) {
          idList = (0, lodash_1.intersection)(
            idList,
            resp.map((it) => it.contactId),
          );
        } else {
          idList.push(...resp.map((it) => it.contactId));
        }
      }
      if ((0, validation_1.hasValue)(req.email)) {
        hasFilter = true;
        const resp = await this.emailRepository.find({
          select: ['contactId'],
          where: {
            value: (0, typeorm_1.ILike)(`%${req.email.trim().toLowerCase()}%`),
          },
        });
        common_1.Logger.log(`searching by email: ${resp.join(',')}`);
        if ((0, validation_1.hasValue)(idList)) {
          idList = (0, lodash_1.intersection)(
            idList,
            resp.map((it) => it.contactId),
          );
        } else {
          idList.push(...resp.map((it) => it.contactId));
        }
      }
      console.log('IdList', idList);
      if (hasFilter && (0, validation_1.hasNoValue)(idList)) {
        return [];
      }
      const data = await this.repository.find({
        relations: ['person', 'emails', 'phones'],
        skip: req.skip,
        take: req.limit,
        where: (0, validation_1.hasValue)(idList)
          ? { id: (0, typeorm_1.In)(idList) }
          : undefined,
      });
      return data.map((it) => {
        return ContactsService_1.toListDto(it);
      });
    } catch (e) {
      common_1.Logger.error(e?.message ?? e);
      return [];
    }
  }
  static toListDto(it) {
    const cellGroup = (0, crm_helpers_1.getCellGroup)(it);
    const location = (0, crm_helpers_1.getLocation)(it);
    return {
      id: it.id,
      name: (0, crm_helpers_1.getPersonFullName)(it.person),
      avatar: it.person.avatar,
      ageGroup: it.person.ageGroup,
      dateOfBirth: it.person.dateOfBirth,
      email: (0, crm_helpers_1.getEmail)(it),
      phone: (0, crm_helpers_1.getPhone)(it),
      cellGroup: (0, validation_1.hasValue)(cellGroup)
        ? { id: cellGroup.id, name: cellGroup.name }
        : null,
      location: (0, validation_1.hasValue)(location)
        ? { id: location.id, name: location.name }
        : null,
    };
  }
  async create(data, request) {
    if (!data.tenant && request?.tenant) {
      data.tenant = request.tenant;
    }
    return await this.repository.save(data);
  }
  async update(data) {
    return await this.repository.save(data);
  }
  async updatePartial(id, data) {
    this.validateUpdateData(data);
    const existingContact = await this.repository.findOne({
      where: { id },
      relations: ['person', 'emails', 'phones', 'addresses'],
    });
    if (!existingContact) {
      throw new common_1.BadRequestException('Contact not found');
    }
    if (data.person) {
      if (existingContact.person) {
        Object.assign(existingContact.person, data.person);
      } else {
        const person = this.personRepository.create(data.person);
        person.contactId = existingContact.id;
        existingContact.person = person;
      }
    }
    if (data.emails) {
      await this.updateEmailsEfficiently(existingContact, data.emails);
    }
    if (data.phones) {
      await this.updatePhonesEfficiently(existingContact, data.phones);
    }
    if (data.addresses) {
      await this.updateAddressesEfficiently(existingContact, data.addresses);
    }
    const { person, emails, phones, addresses, ...contactData } = data;
    if (Object.keys(contactData).length > 0) {
      Object.assign(existingContact, contactData);
    }
    try {
      const savedContact = await this.repository.save(existingContact);
      return savedContact;
    } catch (error) {
      common_1.Logger.error(`Failed to save contact ID: ${id}`, error.stack);
      throw new common_1.BadRequestException(
        `Failed to update contact: ${error.message}`,
      );
    }
  }
  async createPerson(createPersonDto) {
    const emailData = await this.emailRepository.find({
      where: [{ value: createPersonDto.email }],
    });
    if (emailData.length > 0) {
      throw new common_1.BadRequestException({
        message:
          'Email already exists. This email has already been registered.',
      });
    }
    const model = (0, creationUtils_1.getContactModel)(createPersonDto);
    await this.getGroupRequest(createPersonDto);
    const newPerson = await this.repository.save(model, { reload: true });
    if ((0, validation_1.hasValue)(createPersonDto.residence)) {
      createPersonDto.residence.contactId = newPerson.id;
      await this.addressesService.create(createPersonDto.residence);
    }
    return newPerson;
  }
  async getGroupRequest(_createPersonDto) {
    return;
  }
  async getClosestGroups(_data) {
    return [];
  }
  async findOne(id) {
    return await this.repository.findOne({
      where: { id },
      relations: [
        'person',
        'emails',
        'phones',
        'addresses',
        'identifications',
        'requests',
        'relationships',
      ],
    });
  }
  async remove(id) {
    await this.repository.delete(id);
  }
  async findByName(username) {
    return await this.repository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .leftJoinAndSelect('user.contact', 'contact')
      .leftJoinAndSelect('contact.person', 'person')
      .getOne();
  }
  async createCompany(data) {
    throw 'Not yet implemented';
  }
  validateUpdateData(data) {
    if (!data || Object.keys(data).length === 0) {
      throw new common_1.BadRequestException('Update data cannot be empty');
    }
    if (data.emails) {
      if (!Array.isArray(data.emails)) {
        throw new common_1.BadRequestException('Emails must be an array');
      }
      data.emails.forEach((email, index) => {
        if (!email.value || typeof email.value !== 'string') {
          throw new common_1.BadRequestException(
            `Email at index ${index} must have a valid value`,
          );
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          throw new common_1.BadRequestException(
            `Email at index ${index} has invalid format`,
          );
        }
      });
    }
    if (data.phones) {
      if (!Array.isArray(data.phones)) {
        throw new common_1.BadRequestException('Phones must be an array');
      }
      data.phones.forEach((phone, index) => {
        if (!phone.value || typeof phone.value !== 'string') {
          throw new common_1.BadRequestException(
            `Phone at index ${index} must have a valid value`,
          );
        }
      });
    }
    if (data.addresses) {
      if (!Array.isArray(data.addresses)) {
        throw new common_1.BadRequestException('Addresses must be an array');
      }
      data.addresses.forEach((address, index) => {
        if (!address.country || typeof address.country !== 'string') {
          throw new common_1.BadRequestException(
            `Address at index ${index} must have a country`,
          );
        }
        if (!address.district || typeof address.district !== 'string') {
          throw new common_1.BadRequestException(
            `Address at index ${index} must have a district`,
          );
        }
      });
    }
  }
  async updateEmailsEfficiently(existingContact, newEmails) {
    const existingEmails = existingContact.emails || [];
    const emailsToKeep = [];
    const emailsToUpdate = [];
    const emailsToCreate = [];
    newEmails.forEach((newEmail, index) => {
      if (newEmail.id && index < existingEmails.length) {
        const existingEmail = existingEmails.find((e) => e.id === newEmail.id);
        if (existingEmail) {
          Object.assign(existingEmail, newEmail);
          emailsToUpdate.push(existingEmail);
          emailsToKeep.push(existingEmail);
        }
      } else {
        emailsToCreate.push({
          ...newEmail,
          contactId: existingContact.id,
        });
      }
    });
    const emailsToRemove = existingEmails.filter(
      (email) => !emailsToKeep.some((kept) => kept.id === email.id),
    );
    if (emailsToRemove.length > 0) {
      await this.emailRepository.remove(emailsToRemove);
    }
    if (emailsToUpdate.length > 0) {
      await this.emailRepository.save(emailsToUpdate);
    }
    if (emailsToCreate.length > 0) {
      const createdEmails = await this.emailRepository.save(
        emailsToCreate.map((emailData) =>
          this.emailRepository.create(emailData),
        ),
      );
      emailsToKeep.push(...createdEmails);
    }
    existingContact.emails = emailsToKeep;
  }
  async updatePhonesEfficiently(existingContact, newPhones) {
    const existingPhones = existingContact.phones || [];
    const phonesToKeep = [];
    const phonesToUpdate = [];
    const phonesToCreate = [];
    newPhones.forEach((newPhone, index) => {
      if (newPhone.id && index < existingPhones.length) {
        const existingPhone = existingPhones.find((p) => p.id === newPhone.id);
        if (existingPhone) {
          Object.assign(existingPhone, newPhone);
          phonesToUpdate.push(existingPhone);
          phonesToKeep.push(existingPhone);
        }
      } else {
        phonesToCreate.push({
          ...newPhone,
          contactId: existingContact.id,
        });
      }
    });
    const phonesToRemove = existingPhones.filter(
      (phone) => !phonesToKeep.some((kept) => kept.id === phone.id),
    );
    if (phonesToRemove.length > 0) {
      await this.phoneRepository.remove(phonesToRemove);
    }
    if (phonesToUpdate.length > 0) {
      await this.phoneRepository.save(phonesToUpdate);
    }
    if (phonesToCreate.length > 0) {
      const createdPhones = await this.phoneRepository.save(
        phonesToCreate.map((phoneData) =>
          this.phoneRepository.create(phoneData),
        ),
      );
      phonesToKeep.push(...createdPhones);
    }
    existingContact.phones = phonesToKeep;
  }
  async updateAddressesEfficiently(existingContact, newAddresses) {
    const existingAddresses = existingContact.addresses || [];
    const addressesToKeep = [];
    const addressesToUpdate = [];
    const addressesToCreate = [];
    newAddresses.forEach((newAddress, index) => {
      if (newAddress.id && index < existingAddresses.length) {
        const existingAddress = existingAddresses.find(
          (a) => a.id === newAddress.id,
        );
        if (existingAddress) {
          Object.assign(existingAddress, newAddress);
          addressesToUpdate.push(existingAddress);
          addressesToKeep.push(existingAddress);
        }
      } else {
        addressesToCreate.push({
          ...newAddress,
          contactId: existingContact.id,
        });
      }
    });
    const addressesToRemove = existingAddresses.filter(
      (address) => !addressesToKeep.some((kept) => kept.id === address.id),
    );
    if (addressesToRemove.length > 0) {
      await this.addressRepository.remove(addressesToRemove);
    }
    if (addressesToUpdate.length > 0) {
      await this.addressRepository.save(addressesToUpdate);
    }
    if (addressesToCreate.length > 0) {
      const createdAddresses = await this.addressRepository.save(
        addressesToCreate.map((addressData) =>
          this.addressRepository.create(addressData),
        ),
      );
      addressesToKeep.push(...createdAddresses);
    }
    existingContact.addresses = addressesToKeep;
  }
});
exports.ContactsService = ContactsService;
exports.ContactsService =
  ContactsService =
  ContactsService_1 =
    __decorate(
      [
        (0, common_1.Injectable)(),
        __param(0, (0, common_1.Inject)('CONNECTION')),
        __metadata('design:paramtypes', [
          typeorm_1.Connection,
          google_service_1.GoogleService,
          prisma_service_1.PrismaService,
          group_finder_service_1.GroupFinderService,
          addresses_service_1.AddressesService,
        ]),
      ],
      ContactsService,
    );
//# sourceMappingURL=contacts.service.js.map
