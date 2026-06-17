'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getContactModel = void 0;
const contact_entity_1 = require('../entities/contact.entity');
const contactCategory_1 = require('../enums/contactCategory');
const person_entity_1 = require('../entities/person.entity');
const crm_helpers_1 = require('../crm.helpers');
const validation_1 = require('../../utils/validation');
const phone_entity_1 = require('../entities/phone.entity');
const phoneCategory_1 = require('../enums/phoneCategory');
const email_entity_1 = require('../entities/email.entity');
const emailCategory_1 = require('../enums/emailCategory');
const address_entity_1 = require('../entities/address.entity');
const addressCategory_1 = require('../enums/addressCategory');
const getContactModel = (personDto, place) => {
  const model = new contact_entity_1.default();
  model.category = contactCategory_1.ContactCategory.Person;
  model.person = new person_entity_1.default();
  model.person.firstName = personDto.firstName;
  model.person.middleName = personDto.middleName;
  model.person.lastName = personDto.lastName;
  model.person.civilStatus = personDto.civilStatus;
  model.person.salutation = null;
  model.person.dateOfBirth = personDto.dateOfBirth;
  model.person.avatar = (0, crm_helpers_1.createAvatar)(personDto.email);
  model.person.gender = personDto.gender;
  model.person.placeOfWork = personDto.placeOfWork;
  model.person.ageGroup = personDto.ageGroup;
  model.phones = [];
  if ((0, validation_1.hasValue)(personDto.phone)) {
    const p = new phone_entity_1.default();
    p.category = phoneCategory_1.PhoneCategory.Mobile;
    p.isPrimary = true;
    p.value = personDto.phone;
    model.phones.push(p);
  }
  model.emails = [];
  if ((0, validation_1.hasValue)(personDto.email)) {
    const e = new email_entity_1.default();
    e.category = emailCategory_1.EmailCategory.Personal;
    e.isPrimary = true;
    e.value = personDto.email;
    model.emails.push(e);
  }
  model.addresses = [];
  if (place) {
    const address = new address_entity_1.default();
    address.category = addressCategory_1.AddressCategory.Home;
    address.isPrimary = true;
    address.freeForm = place.name;
    address.placeId = place.placeId;
    address.longitude = place.longitude;
    address.latitude = place.latitude;
    address.country = place.country;
    address.district = place.district;
    model.addresses.push(address);
  }
  return model;
};
exports.getContactModel = getContactModel;
//# sourceMappingURL=creationUtils.js.map
