/*
  Warnings:

  - The values [VERTICAL,HORIZONTAL] on the enum `StageOrientation` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StageOrientation_new" AS ENUM ('UNSET', 'PORTRAIT', 'LANDSCAPE', 'SQUARE');
ALTER TABLE "public"."stages" ALTER COLUMN "orientation" DROP DEFAULT;
ALTER TABLE "stages" ALTER COLUMN "orientation" TYPE "StageOrientation_new" USING ("orientation"::text::"StageOrientation_new");
ALTER TYPE "StageOrientation" RENAME TO "StageOrientation_old";
ALTER TYPE "StageOrientation_new" RENAME TO "StageOrientation";
DROP TYPE "public"."StageOrientation_old";
ALTER TABLE "stages" ALTER COLUMN "orientation" SET DEFAULT 'UNSET';
COMMIT;
