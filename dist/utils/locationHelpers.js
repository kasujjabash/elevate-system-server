'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.stringToPoint = void 0;
const validation_1 = require('./validation');
const stringToPoint = (str) => {
  if ((0, validation_1.hasValue)(str)) {
    const parts = str.split(',');
    if (parts.length === 2)
      return {
        x: parseFloat(parts[0]),
        y: parseFloat(parts[1]),
      };
  }
};
exports.stringToPoint = stringToPoint;
//# sourceMappingURL=locationHelpers.js.map
