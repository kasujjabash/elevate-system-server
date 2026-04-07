export const jwtConstants = {
  secret: process.env.JWT_KEY || 'dWhaRFJETW5BTG01Znl1eA==',
};

// ─── Permissions used in this system ────────────────────────────────────────
export const PERMISSIONS = {
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
} as const;

const ALL = Object.values(PERMISSIONS);

export const roleSuperAdmin = {
  role: 'SUPER_ADMIN',
  description: 'Full access across all hubs',
  permissions: ALL,
  isActive: true,
};

export const roleAdmin = {
  role: 'ADMIN',
  description: 'Admin — full access',
  permissions: ALL,
  isActive: true,
};

export const roleHubManager = {
  role: 'HUB_MANAGER',
  description: 'Manages students and timetable within their hub',
  permissions: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.STUDENT_EDIT,
    PERMISSIONS.COURSE_VIEW,
    PERMISSIONS.CLASS_VIEW,
    PERMISSIONS.CLASS_EDIT,
    PERMISSIONS.HUB_VIEW,
    PERMISSIONS.ANNOUNCEMENT,
  ],
  isActive: true,
};

export const roleTrainer = {
  role: 'TRAINER',
  description: 'Can view students, manage classes and courses',
  permissions: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.COURSE_VIEW,
    PERMISSIONS.COURSE_EDIT,
    PERMISSIONS.CLASS_VIEW,
    PERMISSIONS.CLASS_EDIT,
  ],
  isActive: true,
};

export const roleStudent = {
  role: 'STUDENT',
  description: 'Student portal access',
  permissions: [
    PERMISSIONS.DASHBOARD,
    PERMISSIONS.COURSE_VIEW,
    PERMISSIONS.CLASS_VIEW,
  ],
  isActive: true,
};

// Keep appPermissions keys the same so existing UI guards still work
export const appPermissions = {
  roleDashboard: PERMISSIONS.DASHBOARD,
  roleUserView: PERMISSIONS.USER_VIEW,
  roleUserEdit: PERMISSIONS.USER_EDIT,
  roleEdit: PERMISSIONS.ROLE_EDIT,
  roleStudentView: PERMISSIONS.STUDENT_VIEW,
  roleStudentEdit: PERMISSIONS.STUDENT_EDIT,
  roleCourseView: PERMISSIONS.COURSE_VIEW,
  roleCourseEdit: PERMISSIONS.COURSE_EDIT,
  roleClassView: PERMISSIONS.CLASS_VIEW,
  roleClassEdit: PERMISSIONS.CLASS_EDIT,
  roleHubView: PERMISSIONS.HUB_VIEW,
  roleHubEdit: PERMISSIONS.HUB_EDIT,
  roleAnnouncement: PERMISSIONS.ANNOUNCEMENT,
  // Legacy aliases so any remaining references don't break
  roleCrmView: PERMISSIONS.STUDENT_VIEW,
  roleCrmEdit: PERMISSIONS.STUDENT_EDIT,
  roleGroupView: PERMISSIONS.CLASS_VIEW,
  roleGroupEdit: PERMISSIONS.CLASS_EDIT,
  roleEventView: PERMISSIONS.CLASS_VIEW,
  roleEventEdit: PERMISSIONS.CLASS_EDIT,
  roleReportView: PERMISSIONS.DASHBOARD,
  roleReportViewSubmissions: PERMISSIONS.DASHBOARD,
  roleReportEdit: PERMISSIONS.DASHBOARD,
  roleTagView: PERMISSIONS.DASHBOARD,
  roleTagEdit: PERMISSIONS.ROLE_EDIT,
  roleSmallGroupView: PERMISSIONS.CLASS_VIEW,
};

export const permissionsList = [...new Set(Object.values(appPermissions))];
