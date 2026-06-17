'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getLocation =
  exports.getCellGroup =
  exports.getPhone =
  exports.getEmailObj =
  exports.getEmail =
  exports.getPhoneObj =
  exports.createAvatar =
  exports.crmEntities =
  exports.getPersonFullName =
    void 0;
const contact_entity_1 = require('./entities/contact.entity');
const person_entity_1 = require('./entities/person.entity');
const company_entity_1 = require('./entities/company.entity');
const email_entity_1 = require('./entities/email.entity');
const phone_entity_1 = require('./entities/phone.entity');
const address_entity_1 = require('./entities/address.entity');
const occasion_entity_1 = require('./entities/occasion.entity');
const identification_entity_1 = require('./entities/identification.entity');
const validation_1 = require('../utils/validation');
const crypto = require('crypto');
const relationship_entity_1 = require('./entities/relationship.entity');
const request_entity_1 = require('./entities/request.entity');
const getPersonFullName = (person) => {
  if ((0, validation_1.hasNoValue)(person)) {
    return '';
  }
  const name = `${person.firstName || ''} ${person.middleName || ''} ${
    person.lastName || ''
  }`;
  return name.trim().replace(/\s+/g, ' ');
};
exports.getPersonFullName = getPersonFullName;
exports.crmEntities = [
  contact_entity_1.default,
  person_entity_1.default,
  company_entity_1.default,
  email_entity_1.default,
  phone_entity_1.default,
  address_entity_1.default,
  occasion_entity_1.default,
  identification_entity_1.default,
  relationship_entity_1.default,
  request_entity_1.default,
];
const createAvatar = (email, size = 200) => {
  if ((0, validation_1.hasValue)(email)) {
    const md5 = crypto.createHash('md5').update(email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
  }
  return `https://gravatar.com/avatar/?s=${size}&d=retro`;
};
exports.createAvatar = createAvatar;
const getPhoneObj = (data) => {
  const { phones } = data;
  if (phones && phones.length > 0) {
    const pri = phones.find((it) => it.isPrimary);
    if (pri) return pri;
    else return phones[0];
  }
  return {};
};
exports.getPhoneObj = getPhoneObj;
const getEmail = (data) => {
  const { emails } = data;
  if (emails && emails.length > 0) {
    const pri = emails.find((it) => it.isPrimary);
    if (pri) return pri.value;
    else return emails[0].value;
  }
  return '';
};
exports.getEmail = getEmail;
const getEmailObj = (data) => {
  const { emails } = data;
  if (emails && emails.length > 0) {
    const pri = emails.find((it) => it.isPrimary);
    if (pri) return pri;
    else return emails[0];
  }
  return {};
};
exports.getEmailObj = getEmailObj;
const getPhone = (data) => {
  const { phones } = data;
  if (phones && phones.length > 0) {
    const pri = phones.find((it) => it.isPrimary);
    if (pri) return pri.value;
    else return phones[0].value;
  }
  return '';
};
exports.getPhone = getPhone;
const getCellGroup = (_data) => {
  return null;
};
exports.getCellGroup = getCellGroup;
const getLocation = (_data) => {
  return null;
};
exports.getLocation = getLocation;
//# sourceMappingURL=crm.helpers.js.map
