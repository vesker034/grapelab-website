/*
  Warnings:

  - Made the column `nickname` on table `employees` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "nickname" SET NOT NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "raw_name" DROP NOT NULL;
