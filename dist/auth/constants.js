'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.permissionsList =
  exports.appPermissions =
  exports.roleStudent =
  exports.roleTrainer =
  exports.roleHubManager =
  exports.roleAdmin =
  exports.roleSuperAdmin =
  exports.PERMISSIONS =
  exports.jwtConstants =
    void 0;
exports.jwtConstants = {
  secret: process.env.JWT_KEY || 'dWhaRFJETW5BTG01Znl1eA==',
};
exports.PERMISSIONS = {
  DASHBOARD: 'DASHBOARD',
  USER_VIEW: 'USER_VIEW',
  USER_EDIT: 'USER_EDIT',
  ROLE_EDIT: 'ROLE_EDIT',
  STUDENT_VIEW: 'STUDENT_VIEW',
  STUDENT_EDIT: 'STUDENT_EDIT',
  COURSE_VIEW: 'COURSE_VIEW',
  COURSE_EDIT: 'COURSE_EDIT',
  CLASS_VIEW: 'CLASS_VIEW',
  CLASS_EDIT: 'CLASS_EDIT',
  HUB_VIEW: 'HUB_VIEW',
  HUB_EDIT: 'HUB_EDIT',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
};
const ALL = Object.values(exports.PERMISSIONS);
exports.roleSuperAdmin = {
  role: 'SUPER_ADMIN',
  description: 'Full access across all hubs',
  permissions: ALL,
  isActive: true,
};
exports.roleAdmin = {
  role: 'ADMIN',
  description: 'Admin — full access',
  permissions: ALL,
  isActive: true,
};
exports.roleHubManager = {
  role: 'HUB_MANAGER',
  description: 'Manages students and timetable within their hub',
  permissions: [
    exports.PERMISSIONS.DASHBOARD,
    exports.PERMISSIONS.USER_VIEW,
    exports.PERMISSIONS.USER_EDIT,
    exports.PERMISSIONS.STUDENT_VIEW,
    exports.PERMISSIONS.STUDENT_EDIT,
    exports.PERMISSIONS.COURSE_VIEW,
    exports.PERMISSIONS.CLASS_VIEW,
    exports.PERMISSIONS.CLASS_EDIT,
    exports.PERMISSIONS.HUB_VIEW,
    exports.PERMISSIONS.ANNOUNCEMENT,
  ],
  isActive: true,
};
exports.roleTrainer = {
  role: 'TRAINER',
  description: 'Can view students, manage classes and courses',
  permissions: [
    exports.PERMISSIONS.DASHBOARD,
    exports.PERMISSIONS.STUDENT_VIEW,
    exports.PERMISSIONS.COURSE_VIEW,
    exports.PERMISSIONS.COURSE_EDIT,
    exports.PERMISSIONS.CLASS_VIEW,
    exports.PERMISSIONS.CLASS_EDIT,
  ],
  isActive: true,
};
exports.roleStudent = {
  role: 'STUDENT',
  description: 'Student portal access',
  permissions: [
    exports.PERMISSIONS.DASHBOARD,
    exports.PERMISSIONS.COURSE_VIEW,
    exports.PERMISSIONS.CLASS_VIEW,
  ],
  isActive: true,
};
exports.appPermissions = {
  roleDashboard: exports.PERMISSIONS.DASHBOARD,
  roleUserView: exports.PERMISSIONS.USER_VIEW,
  roleUserEdit: exports.PERMISSIONS.USER_EDIT,
  roleEdit: exports.PERMISSIONS.ROLE_EDIT,
  roleStudentView: exports.PERMISSIONS.STUDENT_VIEW,
  roleStudentEdit: exports.PERMISSIONS.STUDENT_EDIT,
  roleCourseView: exports.PERMISSIONS.COURSE_VIEW,
  roleCourseEdit: exports.PERMISSIONS.COURSE_EDIT,
  roleClassView: exports.PERMISSIONS.CLASS_VIEW,
  roleClassEdit: exports.PERMISSIONS.CLASS_EDIT,
  roleHubView: exports.PERMISSIONS.HUB_VIEW,
  roleHubEdit: exports.PERMISSIONS.HUB_EDIT,
  roleAnnouncement: exports.PERMISSIONS.ANNOUNCEMENT,
  roleCrmView: exports.PERMISSIONS.STUDENT_VIEW,
  roleCrmEdit: exports.PERMISSIONS.STUDENT_EDIT,
  roleGroupView: exports.PERMISSIONS.CLASS_VIEW,
  roleGroupEdit: exports.PERMISSIONS.CLASS_EDIT,
  roleEventView: exports.PERMISSIONS.CLASS_VIEW,
  roleEventEdit: exports.PERMISSIONS.CLASS_EDIT,
  roleReportView: exports.PERMISSIONS.DASHBOARD,
  roleReportViewSubmissions: exports.PERMISSIONS.DASHBOARD,
  roleReportEdit: exports.PERMISSIONS.DASHBOARD,
  roleTagView: exports.PERMISSIONS.DASHBOARD,
  roleTagEdit: exports.PERMISSIONS.ROLE_EDIT,
  roleSmallGroupView: exports.PERMISSIONS.CLASS_VIEW,
};
exports.permissionsList = [...new Set(Object.values(exports.appPermissions))];
//# sourceMappingURL=constants.js.map
