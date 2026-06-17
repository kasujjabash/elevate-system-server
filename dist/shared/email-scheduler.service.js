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
var EmailSchedulerService_1;
Object.defineProperty(exports, '__esModule', { value: true });
exports.EmailSchedulerService = void 0;
const common_1 = require('@nestjs/common');
const schedule_1 = require('@nestjs/schedule');
let EmailSchedulerService =
  (EmailSchedulerService_1 = class EmailSchedulerService {
    constructor() {
      this.logger = new common_1.Logger(EmailSchedulerService_1.name);
    }
    async sendEmailOnSchedule() {
      const today = new Date().getDay();
      if ([0, 3, 4, 5, 6].includes(today)) {
        try {
          this.logger.log('Email sent successfully.');
        } catch (error) {
          this.logger.error('Error sending email: ' + error.message);
        }
      }
    }
  });
exports.EmailSchedulerService = EmailSchedulerService;
__decorate(
  [
    (0, schedule_1.Cron)('* * * * * *', {
      timeZone: 'EAT',
    }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise),
  ],
  EmailSchedulerService.prototype,
  'sendEmailOnSchedule',
  null,
);
exports.EmailSchedulerService =
  EmailSchedulerService =
  EmailSchedulerService_1 =
    __decorate(
      [(0, common_1.Injectable)(), __metadata('design:paramtypes', [])],
      EmailSchedulerService,
    );
//# sourceMappingURL=email-scheduler.service.js.map
