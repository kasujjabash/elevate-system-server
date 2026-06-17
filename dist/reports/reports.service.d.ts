import { Connection } from 'typeorm';
import { UserDto } from 'src/auth/dto/user.dto';
import { Report } from './entities/report.entity';
import { ReportSubmissionDto } from './dto/report-submission.dto';
import { ReportDto } from './dto/report.dto';
import {
  ReportSubmissionsApiResponse,
  ApiResponse,
  ReportSubmissionDataDto,
} from './types/report-api.types';
import { UsersService } from 'src/users/users.service';
export declare class ReportsService {
  private readonly usersService;
  private readonly reportRepository;
  private readonly reportSubmissionRepository;
  private readonly reportSubmissionDataRepository;
  private readonly userRepository;
  private readonly reportFieldRepository;
  constructor(connection: Connection, usersService: UsersService);
  createReport(reportDto: ReportDto, user: UserDto): Promise<ReportDto>;
  submitReport(
    submissionDto: ReportSubmissionDto,
    user: UserDto,
  ): Promise<ApiResponse<ReportSubmissionDataDto>>;
  getAllReports(): Promise<{
    reports: any[];
  }>;
  getReport(reportId: number): Promise<Report>;
  getWeekNumber(date: Date): number;
  getAllSmallGroups(): Promise<any[]>;
  generateReport(
    reportId: number,
    startDate?: Date,
    endDate?: Date,
    smallGroupIdList?: string,
    parentGroupIdList?: string,
  ): Promise<any>;
  private buildSubmissionQuery;
  getSmallGroupSummaryAttendance(
    report: Report,
    startDate?: Date,
    endDate?: Date,
    smallGroupIdList?: string,
    parentGroupIdList?: string,
  ): Promise<ReportSubmissionsApiResponse>;
  getSmallGroupReportSubmissionStatus(
    report: Report,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any>;
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
  updateReport(id: number, updateDto: ReportDto): Promise<Report>;
  updateReportFields(
    reportId: number,
    fieldsData: Record<string, any>,
  ): Promise<void>;
  sendWeeklyEmailSummary(
    reportId: number,
    smallGroupIdList?: string,
    parentGroupIdList?: string,
  ): Promise<string>;
  sendMail(to: string, subject: string, mailArgs: any): Promise<string>;
  getMySubmissions(
    user: any,
    options: {
      limit?: number;
      offset?: number;
      reportId?: number;
    },
  ): Promise<any>;
  getTeamSubmissions(
    user: any,
    options: {
      reportId?: number;
    },
  ): Promise<any>;
  getSubmissionDetails(submissionId: number, user: any): Promise<any>;
  private validateUserGroupPermission;
  private getUserGroupsInCategory;
}
