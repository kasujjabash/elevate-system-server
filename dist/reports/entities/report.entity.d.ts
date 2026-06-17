import { ReportSubmission } from './report.submission.entity';
import { User } from 'src/users/entities/user.entity';
import { ReportField } from './report.field.entity';
import { ReportStatus } from '../enums/report.enum';
import { Tenant } from '../../tenants/entities/tenant.entity';
export declare class Report {
  id: number;
  tenant: Tenant;
  name: string;
  description: string | null;
  functionName: string | null;
  viewType:
    | 'table'
    | 'piechart'
    | 'bargraph'
    | 'linechart'
    | 'scatterplot'
    | 'heatmap'
    | 'gaugechart'
    | 'treemap'
    | 'donutchart';
  sqlQuery: string;
  fields: ReportField[];
  displayColumns: Record<string, any>;
  footer: string[];
  labels: string[];
  dataPoints: number[];
  submissionFrequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  submissions: ReportSubmission[];
  user: User;
  active: boolean;
  groupFieldName?: string;
  status: ReportStatus;
}
