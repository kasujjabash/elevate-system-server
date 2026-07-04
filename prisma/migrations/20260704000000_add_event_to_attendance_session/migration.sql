-- AlterTable
ALTER TABLE "attendance_session" ADD COLUMN "eventId" INTEGER;

-- AddForeignKey
ALTER TABLE "attendance_session" ADD CONSTRAINT "attendance_session_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "calendar_event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
