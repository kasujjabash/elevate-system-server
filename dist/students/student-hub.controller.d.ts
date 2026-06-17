import { StudentsService } from './students.service';
export declare class StudentHubController {
  private readonly studentsService;
  constructor(studentsService: StudentsService);
  getByHub(): Promise<
    {
      hub: string;
      hubName: string;
      count: number;
    }[]
  >;
  search(): any[];
}
