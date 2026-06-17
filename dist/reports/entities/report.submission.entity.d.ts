import { User } from 'src/users/entities/user.entity';
import { Report } from './report.entity';
import { ReportSubmissionData } from './report.submission.data.entity';
export declare class ReportSubmission {
  id: number;
  submittedAt: Date;
  user: User;
  report: Report;
  data: Record<string, any>;
  submissionData: ReportSubmissionData[];
}
