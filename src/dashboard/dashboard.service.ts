import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { ReportSubmission } from '../reports/entities/report.submission.entity';
import Group from '../groups/entities/group.entity';
import Contact from '../crm/entities/contact.entity';
import { GroupPermissionsService } from '../groups/services/group-permissions.service';

@Injectable()
export class DashboardService {
  private readonly reportSubmissionRepository: Repository<ReportSubmission>;
  private readonly groupRepository: Repository<Group>;
  private readonly contactRepository: Repository<Contact>;

  constructor(
    @Inject('CONNECTION') connection: Connection,
    private groupPermissionsService: GroupPermissionsService,
  ) {
    this.reportSubmissionRepository = connection.getRepository(ReportSubmission);
    this.groupRepository = connection.getRepository(Group);
    this.contactRepository = connection.getRepository(Contact);
  }

  async getSummary(user: any): Promise<any> {
    // Get groups the user has access to
    const userGroupIds = await this.groupPermissionsService.getUserGroupIds(user);
    
    // Mock dashboard summary data - replace with real queries
    const summary = {
      overview: {
        totalGroups: userGroupIds.length,
        totalMembers: await this.getTotalMembers(userGroupIds),
        reportsSubmitted: await this.getReportsSubmittedCount(userGroupIds),
        reportsOverdue: await this.getOverdueReportsCount(userGroupIds),
      },
      recentActivity: await this.getRecentActivity(userGroupIds),
      upcomingDeadlines: await this.getUpcomingDeadlines(userGroupIds),
    };

    return summary;
  }

  private async getTotalMembers(groupIds: number[]): Promise<number> {
    if (groupIds.length === 0) return 0;
    
    // This is a simplified count - implement proper member counting logic
    const groups = await this.groupRepository.findByIds(groupIds);
    return groups.reduce((total, group) => total + (group.members?.length || 0), 0);
  }

  private async getReportsSubmittedCount(groupIds: number[]): Promise<number> {
    if (groupIds.length === 0) return 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return this.reportSubmissionRepository.count({
      where: {
        submittedAt: oneWeekAgo,
        // Add groupId filter when available
      },
    });
  }

  private async getOverdueReportsCount(groupIds: number[]): Promise<number> {
    // Mock implementation - replace with real overdue calculation
    return Math.floor(groupIds.length * 0.2); // Assume 20% are overdue
  }

  private async getRecentActivity(groupIds: number[]): Promise<any[]> {
    if (groupIds.length === 0) return [];

    const recentSubmissions = await this.reportSubmissionRepository.find({
      relations: ['report', 'user'],
      order: { submittedAt: 'DESC' },
      take: 5,
    });

    return recentSubmissions.map(submission => ({
      type: 'report_submission',
      description: `${submission.user?.username || 'Someone'} submitted ${submission.report?.name || 'a report'}`,
      timestamp: submission.submittedAt,
      userId: submission.user?.id,
      reportId: submission.report?.id,
    }));
  }

  private async getUpcomingDeadlines(groupIds: number[]): Promise<any[]> {
    // Mock upcoming deadlines - implement real deadline logic
    const mockDeadlines = [
      {
        type: 'weekly_report',
        title: 'Weekly MC Report',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        groupsCount: Math.min(5, groupIds.length),
      },
      {
        type: 'monthly_report',
        title: 'Monthly Service Report',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        groupsCount: Math.min(3, groupIds.length),
      },
    ];

    return mockDeadlines;
  }
}