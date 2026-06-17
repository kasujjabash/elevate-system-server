import { ReportsService } from './reports.service';
import { ReportSubmissionDto } from './dto/report-submission.dto';
import { ReportDto } from './dto/report.dto';
import { Report } from './entities/report.entity';
import {
  ApiResponse,
  ReportSubmissionsApiResponse,
  ReportSubmissionDataDto,
} from './types/report-api.types';
export declare class ReportsController {
  private readonly reportService;
  constructor(reportService: ReportsService);
  createReport(reportDto: ReportDto, request: any): Promise<ReportDto>;
  submitReport(
    reportId: number,
    submissionDto: ReportSubmissionDto,
    request: any,
  ): Promise<ApiResponse<ReportSubmissionDataDto>>;
  getAllSubmissions(limit: number, offset: number, request: any): Promise<any>;
  getMySubmissions(
    limit: number,
    offset: number,
    reportId: number | undefined,
    request: any,
  ): Promise<any>;
  getTeamSubmissions(reportId: number | undefined, request: any): Promise<any>;
  getSubmissionDetails(id: number, request: any): Promise<any>;
  getReport(reportId: number): Promise<Report>;
  updateReport(id: number, updateDto: ReportDto): Promise<Report>;
  getAllReports(): Promise<{
    reports: any[];
  }>;
  getReportSubmissions(
    reportId: number,
    startDate?: string,
    endDate?: string,
    smallGroupIdList?: string,
    parentGroupIdList?: string,
  ): Promise<ReportSubmissionsApiResponse>;
  getReportSubmission(
    reportId: number,
    submissionId: number,
  ): Promise<{
    id: number;
    data: {};
    labels: {
      name: string;
      label: string;
    }[];
    submittedAt: string;
    submittedBy: string;
  }>;
  sendReportSubmissionsWeeklyEmail(
    reportId: number,
    smallGroupIdList?: string,
    parentGroupIdList?: string,
  ): Promise<string>;
}
