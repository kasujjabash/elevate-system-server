import { ReportType } from '../enums/report.enum';
export declare class UpdateDto {
  name?: string;
  type?: ReportType;
  fields?: string[];
  headers?: string[];
  footer?: string;
}
