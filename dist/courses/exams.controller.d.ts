export declare class ExamsController {
  findAll(_courseId?: string): {
    exams: any[];
    total: number;
  };
  getSchedule(_limit?: string): {
    schedule: any[];
    total: number;
  };
  getResults(_contactId?: string): any[];
  findOne(_id: string): any;
  create(_dto: any): {
    message: string;
  };
}
