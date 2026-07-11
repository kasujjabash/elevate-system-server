-- AlterTable
ALTER TABLE "job_placement" ADD COLUMN "isPaidInternship" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "job_placement" ADD COLUMN "internshipStipend" DOUBLE PRECISION;
