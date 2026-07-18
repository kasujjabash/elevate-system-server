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
Object.defineProperty(exports, '__esModule', { value: true });
exports.HubsService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
let HubsService = class HubsService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async create(createHubDto) {
    return this.prisma.hub.create({
      data: createHubDto,
    });
  }
  async findAll() {
    return this.prisma.hub.findMany({
      include: {
        students: true,
        courses: true,
        instructors: true,
      },
    });
  }
  async getCombo() {
    const hubs = await this.prisma.hub.findMany({
      select: { id: true, name: true },
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return hubs.map((h) => ({ id: h.id.toString(), name: h.name }));
  }
  async findOne(id) {
    return this.prisma.hub.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            contact: {
              include: {
                person: true,
              },
            },
          },
        },
        courses: {
          include: {
            instructor: {
              include: {
                contact: {
                  include: {
                    person: true,
                  },
                },
              },
            },
            skillCategory: true,
          },
        },
        instructors: {
          include: {
            contact: {
              include: {
                person: true,
              },
            },
          },
        },
      },
    });
  }
  async findByCode(code) {
    return this.prisma.hub.findUnique({
      where: { code },
      include: {
        students: true,
        courses: true,
        instructors: true,
      },
    });
  }
  async update(id, updateHubDto) {
    return this.prisma.hub.update({
      where: { id },
      data: updateHubDto,
    });
  }
  async remove(id) {
    return this.prisma.hub.delete({
      where: { id },
    });
  }
  async getHubStatistics(id) {
    const hub = await this.prisma.hub.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            courses: true,
            instructors: true,
          },
        },
      },
    });
    if (!hub) {
      throw new Error('Hub not found');
    }
    return {
      ...hub,
      statistics: hub._count,
    };
  }
};
exports.HubsService = HubsService;
exports.HubsService = HubsService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  HubsService,
);
//# sourceMappingURL=hubs.service.js.map
