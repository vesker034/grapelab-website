/*
  Warnings:

  - A unique constraint covering the columns `[raw_name]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "raw_name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "projects_raw_name_key" ON "projects"("raw_name");
