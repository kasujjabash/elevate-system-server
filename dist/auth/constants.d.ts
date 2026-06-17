export declare const jwtConstants: {
  secret: string;
};
export declare const PERMISSIONS: {
  readonly DASHBOARD: 'DASHBOARD';
  readonly USER_VIEW: 'USER_VIEW';
  readonly USER_EDIT: 'USER_EDIT';
  readonly ROLE_EDIT: 'ROLE_EDIT';
  readonly STUDENT_VIEW: 'STUDENT_VIEW';
  readonly STUDENT_EDIT: 'STUDENT_EDIT';
  readonly COURSE_VIEW: 'COURSE_VIEW';
  readonly COURSE_EDIT: 'COURSE_EDIT';
  readonly CLASS_VIEW: 'CLASS_VIEW';
  readonly CLASS_EDIT: 'CLASS_EDIT';
  readonly HUB_VIEW: 'HUB_VIEW';
  readonly HUB_EDIT: 'HUB_EDIT';
  readonly ANNOUNCEMENT: 'ANNOUNCEMENT';
};
export declare const roleSuperAdmin: {
  role: string;
  description: string;
  permissions: (
    | 'DASHBOARD'
    | 'USER_VIEW'
    | 'USER_EDIT'
    | 'ROLE_EDIT'
    | 'STUDENT_VIEW'
    | 'STUDENT_EDIT'
    | 'COURSE_VIEW'
    | 'COURSE_EDIT'
    | 'CLASS_VIEW'
    | 'CLASS_EDIT'
    | 'HUB_VIEW'
    | 'HUB_EDIT'
    | 'ANNOUNCEMENT'
  )[];
  isActive: boolean;
};
export declare const roleAdmin: {
  role: string;
  description: string;
  permissions: (
    | 'DASHBOARD'
    | 'USER_VIEW'
    | 'USER_EDIT'
    | 'ROLE_EDIT'
    | 'STUDENT_VIEW'
    | 'STUDENT_EDIT'
    | 'COURSE_VIEW'
    | 'COURSE_EDIT'
    | 'CLASS_VIEW'
    | 'CLASS_EDIT'
    | 'HUB_VIEW'
    | 'HUB_EDIT'
    | 'ANNOUNCEMENT'
  )[];
  isActive: boolean;
};
export declare const roleHubManager: {
  role: string;
  description: string;
  permissions: (
    | 'DASHBOARD'
    | 'USER_VIEW'
    | 'USER_EDIT'
    | 'STUDENT_VIEW'
    | 'STUDENT_EDIT'
    | 'COURSE_VIEW'
    | 'CLASS_VIEW'
    | 'CLASS_EDIT'
    | 'HUB_VIEW'
    | 'ANNOUNCEMENT'
  )[];
  isActive: boolean;
};
export declare const roleTrainer: {
  role: string;
  description: string;
  permissions: (
    | 'DASHBOARD'
    | 'STUDENT_VIEW'
    | 'COURSE_VIEW'
    | 'COURSE_EDIT'
    | 'CLASS_VIEW'
    | 'CLASS_EDIT'
  )[];
  isActive: boolean;
};
export declare const roleStudent: {
  role: string;
  description: string;
  permissions: ('DASHBOARD' | 'COURSE_VIEW' | 'CLASS_VIEW')[];
  isActive: boolean;
};
export declare const appPermissions: {
  roleDashboard: 'DASHBOARD';
  roleUserView: 'USER_VIEW';
  roleUserEdit: 'USER_EDIT';
  roleEdit: 'ROLE_EDIT';
  roleStudentView: 'STUDENT_VIEW';
  roleStudentEdit: 'STUDENT_EDIT';
  roleCourseView: 'COURSE_VIEW';
  roleCourseEdit: 'COURSE_EDIT';
  roleClassView: 'CLASS_VIEW';
  roleClassEdit: 'CLASS_EDIT';
  roleHubView: 'HUB_VIEW';
  roleHubEdit: 'HUB_EDIT';
  roleAnnouncement: 'ANNOUNCEMENT';
  roleCrmView: 'STUDENT_VIEW';
  roleCrmEdit: 'STUDENT_EDIT';
  roleGroupView: 'CLASS_VIEW';
  roleGroupEdit: 'CLASS_EDIT';
  roleEventView: 'CLASS_VIEW';
  roleEventEdit: 'CLASS_EDIT';
  roleReportView: 'DASHBOARD';
  roleReportViewSubmissions: 'DASHBOARD';
  roleReportEdit: 'DASHBOARD';
  roleTagView: 'DASHBOARD';
  roleTagEdit: 'ROLE_EDIT';
  roleSmallGroupView: 'CLASS_VIEW';
};
export declare const permissionsList: (
  | 'DASHBOARD'
  | 'USER_VIEW'
  | 'USER_EDIT'
  | 'ROLE_EDIT'
  | 'STUDENT_VIEW'
  | 'STUDENT_EDIT'
  | 'COURSE_VIEW'
  | 'COURSE_EDIT'
  | 'CLASS_VIEW'
  | 'CLASS_EDIT'
  | 'HUB_VIEW'
  | 'HUB_EDIT'
  | 'ANNOUNCEMENT'
)[];
