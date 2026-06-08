-- CreateEnum
CREATE TYPE "StageOrientation" AS ENUM ('UNSET', 'VERTICAL', 'HORIZONTAL');

-- AlterTable
ALTER TABLE "stages" ADD COLUMN     "orientation" "StageOrientation" NOT NULL DEFAULT 'UNSET';
