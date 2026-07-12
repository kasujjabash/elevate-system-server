-- Replace student_status_enum values (Active, Inactive, Graduated, Suspended)
-- with (Active, Completed, Graduated, OnBreak, Dropped).
-- Existing data remapping: Inactive -> OnBreak, Suspended -> Dropped.

ALTER TYPE "student_status_enum" RENAME TO "student_status_enum_old";

CREATE TYPE "student_status_enum" AS ENUM ('Active', 'Completed', 'Graduated', 'OnBreak', 'Dropped');

ALTER TABLE "student" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "student" ALTER COLUMN "status" TYPE "student_status_enum" USING (
  CASE "status"::text
    WHEN 'Active' THEN 'Active'
    WHEN 'Inactive' THEN 'OnBreak'
    WHEN 'Graduated' THEN 'Graduated'
    WHEN 'Suspended' THEN 'Dropped'
  END
)::"student_status_enum";

ALTER TABLE "student" ALTER COLUMN "status" SET DEFAULT 'Active';

DROP TYPE "student_status_enum_old";
