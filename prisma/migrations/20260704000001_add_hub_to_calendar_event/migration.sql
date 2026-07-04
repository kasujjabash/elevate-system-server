-- AlterTable
ALTER TABLE "calendar_event" ADD COLUMN "hubId" INTEGER;

-- AddForeignKey
ALTER TABLE "calendar_event" ADD CONSTRAINT "calendar_event_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "hub"("id") ON DELETE SET NULL ON UPDATE CASCADE;
