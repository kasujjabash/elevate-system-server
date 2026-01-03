import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Query,
  Param,
  Request,
  ParseIntPipe,
  UseGuards,
  Body,
  UseInterceptors,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SentryInterceptor } from "src/utils/sentry.interceptor";
import { ApiTags } from "@nestjs/swagger";
import { ReportsService } from "./reports.service";
import { Repository, Connection } from "typeorm";
import { ReportSubmissionDto } from "./dto/report-submission.dto";
import { ReportDto } from "./dto/report.dto";
import { Report } from "./entities/report.entity";
import {
  ApiResponse,
  ReportSubmissionsApiResponse,
  ReportSubmissionDataDto,
} from "./types/report-api.types";
import { getFormattedDateString } from "src/utils/stringHelpers";
import { ReportSubmission } from "./entities/report.submission.entity";

@UseInterceptors(SentryInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags("Reports")
@Controller("api/reports")
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Post()
  createReport(
    @Body() reportDto: ReportDto,
    @Request() request,
  ): Promise<ReportDto> {
    return this.reportService.createReport(reportDto, request.user);
  }

  @Post(":reportId/submissions")
  async submitReport(
    @Param("reportId", ParseIntPipe) reportId: number,
    @Body() submissionDto: ReportSubmissionDto,
    @Request() request,
  ): Promise<ApiResponse<ReportSubmissionDataDto>> {
    console.log('📝 ReportsController.submitReport() - Called with reportId:', reportId);
    submissionDto.reportId = reportId;
    return await this.reportService.submitReport(submissionDto, request.user);
  }

  @Get("submissions/me")
  async getMySubmissions(
    @Query("limit") limit: number = 20,
    @Query("offset") offset: number = 0,
    @Query("reportId") reportId: number | undefined,
    @Request() request: any,
  ): Promise<any> {
    console.log('👤 ReportsController.getMySubmissions() - Called');
    return await this.reportService.getMySubmissions(request.user, { limit, offset, reportId });
  }

  @Get("submissions/team")
  async getTeamSubmissions(
    @Query("reportId") reportId: number | undefined,
    @Request() request: any,
  ): Promise<any> {
    return await this.reportService.getTeamSubmissions(request.user, { reportId });
  }

  @Get("submissions/:id")
  async getSubmissionDetails(
    @Param("id", ParseIntPipe) id: number,
    @Request() request,
  ): Promise<any> {
    console.log('📋 ReportsController.getSubmissionDetails() - Called with id:', id);
    return await this.reportService.getSubmissionDetails(id, request.user);
  }

  @Get(":id")
  async getReport(@Param("id") reportId: number): Promise<Report> {
    console.log('📄 ReportsController.getReport() - Called with reportId:', reportId);
    return await this.reportService.getReport(reportId);
  }

  @Put(":id")
  async updateReport(
    @Param("id") id: number,
    @Body() updateDto: ReportDto,
  ): Promise<Report> {
    return await this.reportService.updateReport(id, updateDto);
  }

  @Get()
  async getAllReports(): Promise<{ reports: any[] }> {
    console.log('📋 ReportsController.getAllReports() - Starting execution');
    try {
      const result = await this.reportService.getAllReports();
      console.log('📋 ReportsController.getAllReports() - Success, returning:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('📋 ReportsController.getAllReports() - Error:', error);
      throw error;
    }
  }

  @Get(":reportId/submissions")
  async getReportSubmissions(
    @Param("reportId", ParseIntPipe) reportId: number,
    @Query("from") startDate?: string,
    @Query("to") endDate?: string,
    @Query("groupIdList") smallGroupIdList?: string,
    @Query("parentGroupIdList") parentGroupIdList?: string,
  ): Promise<ReportSubmissionsApiResponse> {
    console.log('📊 ReportsController.getReportSubmissions() - Called with reportId:', reportId);
    const formattedStartDate = startDate ? new Date(startDate) : undefined;
    const formattedEndDate = endDate ? new Date(endDate) : undefined;
    return await this.reportService.generateReport(
      reportId,
      formattedStartDate,
      formattedEndDate,
      smallGroupIdList,
      parentGroupIdList,
    );
  }

  @Get(":reportId/submissions/:submissionId")
  async getReportSubmission(
    @Param("reportId") reportId: number,
    @Param("submissionId") submissionId: number,
  ) {
    console.log('🔍 ReportsController.getReportSubmission() - Called with reportId:', reportId, 'submissionId:', submissionId);
    return this.reportService.getReportSubmission(reportId, submissionId);
  }

  @Post(":reportId/send-weekly-email")
  async sendReportSubmissionsWeeklyEmail(
    @Param("reportId", ParseIntPipe) reportId: number,
    @Query("groupIdList") smallGroupIdList?: string,
    @Query("parentGroupIdList") parentGroupIdList?: string,
  ): Promise<string> {
    console.log('📧 ReportsController.sendReportSubmissionsWeeklyEmail() - Called with reportId:', reportId);
    return await this.reportService.sendWeeklyEmailSummary(
      reportId,
      smallGroupIdList,
      parentGroupIdList,
    );
  }
}
