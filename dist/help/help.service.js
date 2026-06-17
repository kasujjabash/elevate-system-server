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
exports.HelpService = void 0;
const common_1 = require('@nestjs/common');
const typeorm_1 = require('typeorm');
const help_entity_1 = require('./entities/help.entity');
let HelpService = class HelpService {
  constructor(connection) {
    this.repository = connection.getRepository(help_entity_1.default);
  }
  async create(data) {
    return this.repository.save(data);
  }
  async findAll(req) {
    const data = await this.repository.find({
      select: ['id', 'title', 'category', 'url'],
    });
    return data;
  }
  async findOne(id) {
    const data = await this.repository.findOne({
      select: ['id', 'title', 'category', 'url'],
    });
    return data;
  }
  async update(data) {
    const newFile = await this.repository
      .createQueryBuilder()
      .update(help_entity_1.default)
      .set({
        ...data,
      })
      .where('id = :id', { id: data.id })
      .execute();
    if (newFile.affected)
      common_1.Logger.log(
        `Update.Help id:${data.id} affected:${newFile.affected} complete`,
      );
    return await this.repository.findOne({ where: { id: data.id } });
  }
  async remove(id) {
    await this.repository.delete(id);
  }
};
exports.HelpService = HelpService;
exports.HelpService = HelpService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [typeorm_1.Connection]),
  ],
  HelpService,
);
//# sourceMappingURL=help.service.js.map
