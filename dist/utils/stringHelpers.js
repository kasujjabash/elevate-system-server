'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getHumanReadableDate =
  exports.getUserDisplayName =
  exports.getFormattedDateString =
  exports.generateRandomPassword =
  exports.lowerCaseRemoveSpaces =
    void 0;
const lowerCaseRemoveSpaces = (name) => {
  return name?.toLowerCase().replace(/\s/g, '');
};
exports.lowerCaseRemoveSpaces = lowerCaseRemoveSpaces;
function generateRandomPassword(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }
  return password;
}
exports.generateRandomPassword = generateRandomPassword;
function getFormattedDateString(currentDate) {
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
exports.getFormattedDateString = getFormattedDateString;
function getUserDisplayName(user) {
  const firstName = user?.contact?.person?.firstName ?? '';
  const lastName = user?.contact?.person?.lastName ?? '';
  const fullName = `${firstName} ${lastName}`;
  const displayName =
    fullName.trim() !== '' ? fullName : user ? user.username : '';
  return displayName;
}
exports.getUserDisplayName = getUserDisplayName;
function getHumanReadableDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
}
exports.getHumanReadableDate = getHumanReadableDate;
//# sourceMappingURL=stringHelpers.js.map
