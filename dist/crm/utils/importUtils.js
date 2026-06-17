'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.parseContact =
  exports.parseDateOfBirth =
  exports.parseGender =
  exports.parseName =
    void 0;
const date_fns_1 = require('date-fns');
const gender_1 = require('../enums/gender');
const removeEmptySpaces = (str) => {
  try {
    return str.replace(/\s+/g, ' ').trim();
  } catch (e) {
    console.log('Invalid text', str);
  }
};
const parseName = (name) => {
  try {
    const [firstName, middleName, ...others] =
      removeEmptySpaces(name).split(' ');
    if (others.length > 0) {
      return {
        firstName,
        middleName,
        lastName: others.join(' '),
      };
    }
    return {
      firstName,
      lastName: middleName,
    };
  } catch (e) {
    console.log('Invalid name', name);
    return null;
  }
};
exports.parseName = parseName;
const parseGender = (value) => {
  try {
    const clean = removeEmptySpaces(value).toLowerCase();
    if (clean === 'male' || clean === 'm') return gender_1.Gender.Male;
    if (clean === 'female' || clean === 'f') return gender_1.Gender.Female;
  } catch (e) {
    console.log('Invalid Gender', value);
    return null;
  }
};
exports.parseGender = parseGender;
const parseDateOfBirth = (dateOfBirthRaw) => {
  try {
    const dateFormats = ['dd/MM/yyyy', 'dd/MMM/yyyy', 'dd/MMMM/yyyy'];
    const dateOfBirthArray = removeEmptySpaces(dateOfBirthRaw).split(/[\s-]+/);
    if (/st|nd|rd|th/.test(dateOfBirthArray[0])) {
      dateOfBirthArray[0] = dateOfBirthArray[0].replace(/st|nd|rd|th/gi, '');
    }
    const formattedDayMonth = dateOfBirthArray.join('/');
    const dateString = `${formattedDayMonth}/1900`;
    const referenceDate = new Date(1900, 1, 1, 12, 0, 0);
    let dateOfBirth = null;
    for (const dateFormat of dateFormats) {
      try {
        dateOfBirth = (0, date_fns_1.parse)(
          dateString,
          dateFormat,
          referenceDate,
        );
        if ((0, date_fns_1.isValid)(dateOfBirth)) break;
      } catch (e) {}
    }
    if ((0, date_fns_1.isValid)(dateOfBirth))
      return (0, date_fns_1.format)(dateOfBirth, 'yyyy-MM-dd');
  } catch (e) {
    console.error(e);
  }
  return null;
};
exports.parseDateOfBirth = parseDateOfBirth;
function parseContact({
  phone,
  name,
  email,
  birthday,
  gender,
  residence,
  placeOfWork,
  ageGroup,
}) {
  try {
    const { firstName, lastName, middleName } = (0, exports.parseName)(name);
    return {
      firstName,
      lastName,
      middleName,
      gender: (0, exports.parseGender)(gender),
      dateOfBirth: (0, exports.parseDateOfBirth)(birthday),
      email: removeEmptySpaces(email),
      phone: removeEmptySpaces(phone),
      placeOfWork: removeEmptySpaces(placeOfWork),
      residence: removeEmptySpaces(residence),
      ageGroup: removeEmptySpaces(ageGroup),
    };
  } catch (e) {
    console.error(e);
  }
  return null;
}
exports.parseContact = parseContact;
//# sourceMappingURL=importUtils.js.map
