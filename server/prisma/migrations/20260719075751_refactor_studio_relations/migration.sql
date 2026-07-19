/*
  Warnings:

  - You are about to drop the column `uploaderId` on the `stages` table. All the data in the column will be lost.
  - You are about to drop the `_UserFollows` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `studioId` to the `stages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_UserFollows" DROP CONSTRAINT "_UserFollows_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserFollows" DROP CONSTRAINT "_UserFollows_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."stages" DROP CONSTRAINT "stages_uploaderId_fkey";

-- DropIndex
DROP INDEX "public"."stages_uploaderId_idx";

-- DropTable
DROP TABLE "public"."_UserFollows";

-- CreateTable
CREATE TABLE "stageLikes" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stageLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stageScores" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vocalScore" INTEGER NOT NULL,
    "visualScore" INTEGER NOT NULL,
    "vibeScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stageScores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stageViews" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stageViews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studios" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferredGenres" TEXT[],
    "preferredArtists" TEXT[],
    "recommendedTrackArtist" TEXT,
    "recommendedTrackTitle" TEXT,
    "recommendedTrackLink" TEXT,
    "avgVocalScore" DECIMAL(65,30) DEFAULT 0,
    "avgVisualScore" DECIMAL(65,30) DEFAULT 0,
    "avgVibeScore" DECIMAL(65,30) DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "studios_pkey" PRIMARY KEY ("id")
);

-- stages의 usserId -> studioId로 변경
ALTER TABLE "stages" ADD COLUMN "studioId" TEXT;
UPDATE "stages" s
SET "studioId" = st.id
FROM "studios" st
WHERE st."userId" = s."uploaderId";
ALTER TABLE "stages" ALTER COLUMN "studioId" SET NOT NULL;
ALTER TABLE "stages" DROP COLUMN "uploaderId";


-- CreateIndex
CREATE INDEX "stageLikes_userId_idx" ON "stageLikes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "stageLikes_stageId_userId_key" ON "stageLikes"("stageId", "userId");

-- CreateIndex
CREATE INDEX "stageScores_userId_idx" ON "stageScores"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "stageScores_stageId_userId_key" ON "stageScores"("stageId", "userId");

-- CreateIndex
CREATE INDEX "stageViews_userId_idx" ON "stageViews"("userId");

-- CreateIndex
CREATE INDEX "stageViews_stageId_idx" ON "stageViews"("stageId");

-- CreateIndex
CREATE UNIQUE INDEX "studios_userId_key" ON "studios"("userId");

-- CreateIndex
CREATE INDEX "stages_studioId_idx" ON "stages"("studioId");

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stageLikes" ADD CONSTRAINT "stageLikes_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stageLikes" ADD CONSTRAINT "stageLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stageScores" ADD CONSTRAINT "stageScores_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stageScores" ADD CONSTRAINT "stageScores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stageViews" ADD CONSTRAINT "stageViews_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studios" ADD CONSTRAINT "studios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
