-- AlterTable
ALTER TABLE "community_reach" DROP COLUMN "gender";
ALTER TABLE "community_reach" DROP COLUMN "courseInterest";
ALTER TABLE "community_reach" DROP COLUMN "notes";
ALTER TABLE "community_reach" RENAME COLUMN "eventName" TO "eventId";
ALTER TABLE "community_reach" ALTER COLUMN "eventId" TYPE INTEGER USING NULL;

-- AddForeignKey
ALTER TABLE "community_reach" ADD CONSTRAINT "community_reach_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "calendar_event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
