import {
  ReportType,
  ReportFieldType,
  ReportSubmissionFrequency,
} from '../enums/report.enum';
export declare class ReportFieldDto {
  name: string;
  type: ReportFieldType;
  label: string;
  required: boolean;
  options?: OptionDto[];
}
export declare class OptionDto {
  label: string;
  value: string;
}
export interface ReportDto {
  id: number;
  name: string;
  description: string;
  viewType: ReportType;
  fields: Record<string, any>;
  displayColumns: Record<string, any>;
  footer: string[];
  submissionFrequency: ReportSubmissionFrequency;
}
