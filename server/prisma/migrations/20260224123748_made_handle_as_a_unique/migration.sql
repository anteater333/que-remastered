/*
  Warnings:

  - A unique constraint covering the columns `[handle]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `handle` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "handle" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_handle_key" ON "users"("handle");
