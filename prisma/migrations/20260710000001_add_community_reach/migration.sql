-- CreateTable
CREATE TABLE "community_reach" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(30),
    "gender" VARCHAR(20),
    "hubId" INTEGER NOT NULL,
    "reachMethod" VARCHAR(20) NOT NULL,
    "eventName" VARCHAR(150),
    "courseInterest" VARCHAR(150),
    "notes" TEXT,
    "followUpStatus" VARCHAR(20) NOT NULL DEFAULT 'New',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_reach_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "community_reach" ADD CONSTRAINT "community_reach_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
