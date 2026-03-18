export const jwtConstants = {
  secret: process.env.JWT_KEY || 'dWhaRFJETW5BTG01Znl1eA==',
};

export const roleAdmin = {
  role: 'RoleAdmin',
  description: 'Role required for managing All other Roles',
  permissions: [
    'DASHBOARD',
    'ROLE_EDIT',
    'USER_VIEW',
    'USER_EDIT',
    'STUDENT_VIEW',
    'STUDENT_EDIT',
    'COURSE_VIEW',
    'COURSE_EDIT',
    'CLASS_VIEW',
    'CLASS_EDIT',
    'HUB_VIEW',
    'HUB_EDIT',
    'REPORT_VIEW',
    'REPORT_VIEW_SUBMISSIONS',
    'TAG_VIEW',
    'TAG_EDIT',
    'MANAGE_HELP',
  ],
  isActive: true,
};

export const roleTrainer = {
  role: 'RoleTrainer',
  description: 'Trainer / staff access',
  permissions: [
    'DASHBOARD',
    'STUDENT_VIEW',
    'COURSE_VIEW',
    'COURSE_EDIT',
    'CLASS_VIEW',
    'CLASS_EDIT',
    'REPORT_VIEW',
    'REPORT_VIEW_SUBMISSIONS',
  ],
  isActive: true,
};

export const roleStudent = {
  role: 'STUDENT',
  description: 'Student portal access',
  permissions: ['DASHBOARD', 'COURSE_VIEW', 'CLASS_VIEW'],
  isActive: true,
};

export const appPermissions = {
  roleDashboard: 'DASHBOARD',
  roleCrmView: 'CRM_VIEW',
  roleCrmEdit: 'CRM_EDIT',

  roleUserView: 'USER_VIEW',
  roleUserEdit: 'USER_EDIT',

  roleEdit: 'ROLE_EDIT',

  roleTagView: 'TAG_VIEW',
  roleTagEdit: 'TAG_EDIT',

  roleGroupView: 'GROUP_VIEW',
  roleGroupEdit: 'GROUP_EDIT',

  roleEventView: 'EVENT_VIEW',
  roleEventEdit: 'EVENT_EDIT',

  roleReportView: 'REPORT_VIEW',
  roleReportViewSubmissions: 'REPORT_VIEW_SUBMISSIONS',
  roleReportEdit: 'REPORT_EDIT',
};

export const permissionsList = Object.values(appPermissions);
