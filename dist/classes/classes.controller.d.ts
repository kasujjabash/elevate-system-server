import { ClassesService } from './classes.service';
export declare class ClassesController {
  private readonly classesService;
  constructor(classesService: ClassesService);
  findAll(
    from?: string,
    to?: string,
    hubId?: string,
    courseId?: string,
    limit?: string,
    skip?: string,
  ): Promise<any[]>;
  create(body: any): Promise<any>;
  getMember(contactId?: string): any[];
  getAttendance(classId?: string): any[];
  markAttendance(body: { classId: string; studentIds: string[] }): {
    marked: number;
  };
  getRegistrations(classId?: string, contactId?: string): any[];
  register(body: any): {
    message: string;
  };
  getCategories(): any[];
  getFields(): any[];
  getActivities(): any[];
  getMetricsRaw(
    from?: string,
    to?: string,
  ): Promise<
    {
      id: string;
      categoryId: string;
      attendance: number;
      metaData: {
        tuitionFees: number;
        noOfCertifications: number;
        noOfEnrollments: number;
        noOfInstructors: number;
        totalCourseAttendance: number;
        totalClassAttendance: number;
        totalStudents: number;
      };
    }[]
  >;
  getDaysOff(): any[];
}
