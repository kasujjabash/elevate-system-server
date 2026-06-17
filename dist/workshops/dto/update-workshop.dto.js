'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UpdateWorkshopDto = void 0;
const openapi = require('@nestjs/swagger');
const swagger_1 = require('@nestjs/swagger');
const create_workshop_dto_1 = require('./create-workshop.dto');
class UpdateWorkshopDto extends (0, swagger_1.PartialType)(
  create_workshop_dto_1.CreateWorkshopDto,
) {
  static _OPENAPI_METADATA_FACTORY() {
    return {};
  }
}
exports.UpdateWorkshopDto = UpdateWorkshopDto;
//# sourceMappingURL=update-workshop.dto.js.map
