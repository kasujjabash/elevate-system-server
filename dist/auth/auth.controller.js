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
exports.AuthController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const local_auth_guard_1 = require('./guards/local-auth.guard');
const auth_service_1 = require('./auth.service');
const swagger_1 = require('@nestjs/swagger');
const login_dto_1 = require('./dto/login.dto');
const refresh_token_dto_1 = require('./dto/refresh-token.dto');
const reset_password_dto_1 = require('./dto/reset-password.dto');
const validation_1 = require('../utils/validation');
const sentry_interceptor_1 = require('../utils/sentry.interceptor');
const stringHelpers_1 = require('../utils/stringHelpers');
const public_decorator_1 = require('./decorators/public.decorator');
let AuthController = class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
  async login(req) {
    const tenant = req.body['hubName']
      ? (0, stringHelpers_1.lowerCaseRemoveSpaces)(req.body['hubName'])
      : 'default';
    return this.authService.generateToken(req.user, tenant);
  }
  getMe(req) {
    return req.user;
  }
  getProfile(req) {
    return this.authService.getFullProfile(req.user.contactId);
  }
  updateProfile(req, body) {
    return this.authService.updateProfile(req.user.contactId, body);
  }
  async refreshToken(refreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
  async logout() {
    return this.authService.logout();
  }
  async forgotPassword(data) {
    return this.authService.forgotPassword(data.username);
  }
  async resetPassword(token, data) {
    if (await (0, validation_1.isValidPassword)(data.password)) {
      return this.authService.resetPassword(token, data.password);
    }
    throw new common_1.HttpException(
      "Invalid Password (Password Doesn't Meet Criteria)",
      404,
    );
  }
};
exports.AuthController = AuthController;
__decorate(
  [
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiBody)({ type: login_dto_1.default }),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    openapi.ApiResponse({
      status: 201,
      type: require('./dto/login-response.dto').LoginResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  AuthController.prototype,
  'login',
  null,
);
__decorate(
  [
    (0, common_1.Get)('me'),
    openapi.ApiResponse({
      status: 200,
      type: require('./dto/login-response.dto').LoginResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  AuthController.prototype,
  'getMe',
  null,
);
__decorate(
  [
    (0, common_1.Get)('profile'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  AuthController.prototype,
  'getProfile',
  null,
);
__decorate(
  [
    (0, common_1.Put)('profile'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  AuthController.prototype,
  'updateProfile',
  null,
);
__decorate(
  [
    (0, common_1.Post)('refresh'),
    openapi.ApiResponse({
      status: 201,
      type: require('./dto/login-response.dto').RefreshTokenResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [refresh_token_dto_1.RefreshTokenDto]),
    __metadata('design:returntype', Promise),
  ],
  AuthController.prototype,
  'refreshToken',
  null,
);
__decorate(
  [
    (0, common_1.Post)('logout'),
    openapi.ApiResponse({ status: 201 }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise),
  ],
  AuthController.prototype,
  'logout',
  null,
);
__decorate(
  [
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgot-password'),
    openapi.ApiResponse({
      status: 201,
      type: require('./dto/forgot-password-response.dto')
        .ForgotPasswordResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [reset_password_dto_1.ValidateEmailDto]),
    __metadata('design:returntype', Promise),
  ],
  AuthController.prototype,
  'forgotPassword',
  null,
);
__decorate(
  [
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)('reset-password/:token'),
    openapi.ApiResponse({
      status: 200,
      type: require('./dto/reset-password-response.dto')
        .ResetPasswordResponseDto,
    }),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [
      String,
      reset_password_dto_1.ValidatePasswordDto,
    ]),
    __metadata('design:returntype', Promise),
  ],
  AuthController.prototype,
  'resetPassword',
  null,
);
exports.AuthController = AuthController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, swagger_1.ApiTags)('Index'),
    (0, common_1.Controller)('api/auth'),
    __metadata('design:paramtypes', [auth_service_1.AuthService]),
  ],
  AuthController,
);
//# sourceMappingURL=auth.controller.js.map
