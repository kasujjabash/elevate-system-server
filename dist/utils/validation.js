'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isValidPassword =
  exports.removeDuplicates =
  exports.getArray =
  exports.isEmptyObject =
  exports.isArray =
  exports.isValidNumber =
  exports.hasNoValue =
  exports.hasValue =
    void 0;
const lodash_1 = require('lodash');
const date_fns_1 = require('date-fns');
const hasValue = (text) => {
  return !(0, exports.hasNoValue)(text);
};
exports.hasValue = hasValue;
const hasNoValue = (text) => {
  if ((0, date_fns_1.isDate)(text)) return false;
  if ((0, lodash_1.isNumber)(text)) return false;
  return (0, lodash_1.isEmpty)(text);
};
exports.hasNoValue = hasNoValue;
const isValidNumber = (data) => {
  return (
    (0, lodash_1.isNumber)(data) &&
    (0, lodash_1.isInteger)(data) &&
    parseInt(`${data}`) > 0
  );
};
exports.isValidNumber = isValidNumber;
const isArray = (data) => {
  return (0, lodash_1.isArray)(data);
};
exports.isArray = isArray;
const isEmptyObject = (data) => {
  return (0, lodash_1.isEmpty)(data);
};
exports.isEmptyObject = isEmptyObject;
function getArray(data) {
  return Array.isArray(data) ? data : [data];
}
exports.getArray = getArray;
function removeDuplicates(data) {
  const result = [];
  data.forEach((i) => {
    if (result.indexOf(i) < 0) {
      result.push(i);
    }
  });
  return result;
}
exports.removeDuplicates = removeDuplicates;
const PasswordValidator = require('password-validator');
const schema = new PasswordValidator();
schema
  .is()
  .min(8)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123', 'password']);
function isValidPassword(pass) {
  return !!schema.validate(pass);
}
exports.isValidPassword = isValidPassword;
//# sourceMappingURL=validation.js.map
