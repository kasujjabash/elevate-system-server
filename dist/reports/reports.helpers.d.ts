import { Report } from './entities/report.entity';
import { ReportSubmission } from './entities/report.submission.entity';
import { ReportSubmissionData } from './entities/report.submission.data.entity';
import { ReportField } from './entities/report.field.entity';
export declare const reportsEntities: (
  | typeof ReportField
  | typeof Report
  | typeof ReportSubmissionData
  | typeof ReportSubmission
)[];
