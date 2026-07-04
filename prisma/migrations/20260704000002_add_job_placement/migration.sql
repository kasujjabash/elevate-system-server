-- CreateTable
CREATE TABLE "job_placement" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "gender" VARCHAR(20),
    "phone" VARCHAR(30),
    "courseId" INTEGER NOT NULL,
    "hubId" INTEGER NOT NULL,
    "yearCompleted" INTEGER,
    "placementType" VARCHAR(20) NOT NULL,
    "jobTitle" VARCHAR(150),
    "salaryBeforeProgram" DOUBLE PRECISION,
    "salaryAfterProgram" DOUBLE PRECISION,
    "companyName" VARCHAR(150),
    "industry" VARCHAR(20),
    "employmentType" VARCHAR(20),
    "referredBy" VARCHAR(150),
    "internshipOrganization" VARCHAR(150),
    "internshipRole" VARCHAR(150),
    "internshipSupervisor" VARCHAR(150),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_placement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_placement" ADD CONSTRAINT "job_placement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_placement" ADD CONSTRAINT "job_placement_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
