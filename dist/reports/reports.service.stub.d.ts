import { Connection } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/shared/prisma.service';
export declare class ReportsService {
  private readonly connection;
  private readonly usersService;
  private readonly prisma;
  constructor(
    connection: Connection,
    usersService: UsersService,
    prisma: PrismaService,
  );
  getReports(): Promise<{
    message: string;
  }>;
  getReportSubmissions(): Promise<{
    message: string;
  }>;
  createReport(data: any): Promise<void>;
  updateReport(id: number, data: any): Promise<void>;
  deleteReport(id: number): Promise<void>;
}
