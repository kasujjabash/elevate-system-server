-- Add isCoursePlayer flag to assignment
ALTER TABLE "assignment" ADD COLUMN "isCoursePlayer" BOOLEAN NOT NULL DEFAULT false;

-- Add Late and Approved values to submission_status_enum
ALTER TYPE "submission_status_enum" ADD VALUE IF NOT EXISTS 'Late';
ALTER TYPE "submission_status_enum" ADD VALUE IF NOT EXISTS 'Approved';
