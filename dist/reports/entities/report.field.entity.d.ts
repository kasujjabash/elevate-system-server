import { Report } from './report.entity';
export declare enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  DATE = 'date',
  DATETIME = 'datetime',
  SELECT = 'select',
}
export declare class ReportField {
  id: number;
  report: Report;
  name: string;
  type: FieldType;
  label: string;
  required: boolean;
  hidden: boolean;
  options: any[];
}
