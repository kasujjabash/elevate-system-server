import { ReportSubmission } from './report.submission.entity';
import { ReportField } from './report.field.entity';
export declare class ReportSubmissionData {
  id: number;
  reportSubmission: ReportSubmission;
  reportField: ReportField;
  fieldValue: string;
}
