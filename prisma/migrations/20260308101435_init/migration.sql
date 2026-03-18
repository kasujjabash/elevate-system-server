-- CreateEnum
CREATE TYPE "address_category_enum" AS ENUM ('Work', 'Home', 'Other');

-- CreateEnum
CREATE TYPE "contact_category_enum" AS ENUM ('Person');

-- CreateEnum
CREATE TYPE "email_category_enum" AS ENUM ('Work', 'Personal', 'School', 'Other');

-- CreateEnum
CREATE TYPE "phone_category_enum" AS ENUM ('Mobile', 'Office', 'Home', 'Other');

-- CreateEnum
CREATE TYPE "identification_category_enum" AS ENUM ('Nin', 'Passport', 'DrivingPermit', 'StudentId', 'Other');

-- CreateEnum
CREATE TYPE "person_gender_enum" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "course_level_enum" AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- CreateEnum
CREATE TYPE "student_status_enum" AS ENUM ('Active', 'Inactive', 'Graduated', 'Suspended');

-- CreateEnum
CREATE TYPE "enrollment_status_enum" AS ENUM ('Enrolled', 'InProgress', 'Completed', 'Dropped');

-- CreateEnum
CREATE TYPE "study_resource_type_enum" AS ENUM ('Document', 'Video', 'Audio', 'Image', 'Link', 'Software');

-- CreateEnum
CREATE TYPE "submission_status_enum" AS ENUM ('Submitted', 'Graded', 'Returned');

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "category" "address_category_enum" NOT NULL DEFAULT 'Home',
    "isPrimary" BOOLEAN NOT NULL,
    "country" VARCHAR NOT NULL,
    "district" VARCHAR NOT NULL,
    "county" VARCHAR,
    "subCounty" VARCHAR,
    "village" VARCHAR,
    "parish" VARCHAR,
    "postalCode" VARCHAR,
    "street" VARCHAR,
    "freeForm" VARCHAR,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "geoCoordinates" point,
    "placeId" VARCHAR,
    "contactId" INTEGER NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" SERIAL NOT NULL,
    "category" "contact_category_enum" NOT NULL DEFAULT 'Person',

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email" (
    "id" SERIAL NOT NULL,
    "category" "email_category_enum" NOT NULL DEFAULT 'Personal',
    "value" VARCHAR NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "contactId" INTEGER NOT NULL,

    CONSTRAINT "email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone" (
    "id" SERIAL NOT NULL,
    "category" "phone_category_enum" NOT NULL DEFAULT 'Mobile',
    "value" VARCHAR NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,
    "contactId" INTEGER NOT NULL,

    CONSTRAINT "phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identification" (
    "id" SERIAL NOT NULL,
    "value" VARCHAR NOT NULL,
    "cardNumber" VARCHAR NOT NULL,
    "issuingCountry" VARCHAR NOT NULL,
    "startDate" TIMESTAMP(6) NOT NULL,
    "expiryDate" TIMESTAMP(6) NOT NULL,
    "category" "identification_category_enum" NOT NULL DEFAULT 'Nin',
    "isPrimary" BOOLEAN NOT NULL,
    "contactId" INTEGER NOT NULL,

    CONSTRAINT "identification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(40) NOT NULL,
    "lastName" VARCHAR(40) NOT NULL,
    "middleName" VARCHAR(40),
    "gender" "person_gender_enum" NOT NULL,
    "avatar" VARCHAR,
    "dateOfBirth" DATE,
    "contactId" INTEGER NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hub" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "description" VARCHAR(500),
    "location" VARCHAR(100) NOT NULL,
    "address" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_category" (
    "id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),

    CONSTRAINT "skill_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "duration" VARCHAR(50),
    "level" "course_level_enum" NOT NULL DEFAULT 'Beginner',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxStudents" INTEGER,
    "hubId" INTEGER NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "skillCategoryId" VARCHAR(40) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "studentId" VARCHAR(20) NOT NULL,
    "contactId" INTEGER NOT NULL,
    "hubId" INTEGER NOT NULL,
    "status" "student_status_enum" NOT NULL DEFAULT 'Active',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructor" (
    "id" SERIAL NOT NULL,
    "employeeId" VARCHAR(20) NOT NULL,
    "contactId" INTEGER NOT NULL,
    "hubId" INTEGER NOT NULL,
    "specialization" VARCHAR(200),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "status" "enrollment_status_enum" NOT NULL DEFAULT 'Enrolled',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_resource" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(1000),
    "type" "study_resource_type_enum" NOT NULL DEFAULT 'Document',
    "url" VARCHAR(500),
    "filePath" VARCHAR(500),
    "courseId" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "maxScore" INTEGER DEFAULT 100,
    "courseId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "content" TEXT,
    "filePath" VARCHAR(500),
    "score" INTEGER,
    "feedback" TEXT,
    "status" "submission_status_enum" NOT NULL DEFAULT 'Submitted',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradedAt" TIMESTAMP(3),

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(40) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "contactId" INTEGER NOT NULL,
    "roles" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_contactId_key" ON "person"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "hub_code_key" ON "hub"("code");

-- CreateIndex
CREATE UNIQUE INDEX "student_studentId_key" ON "student"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "student_contactId_key" ON "student"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_employeeId_key" ON "instructor"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_contactId_key" ON "instructor"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_studentId_courseId_key" ON "enrollment"("studentId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "submission_studentId_assignmentId_key" ON "submission"("studentId", "assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_contactId_key" ON "user"("contactId");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email" ADD CONSTRAINT "email_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone" ADD CONSTRAINT "phone_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identification" ADD CONSTRAINT "identification_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_skillCategoryId_fkey" FOREIGN KEY ("skillCategoryId") REFERENCES "skill_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor" ADD CONSTRAINT "instructor_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor" ADD CONSTRAINT "instructor_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_resource" ADD CONSTRAINT "study_resource_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
