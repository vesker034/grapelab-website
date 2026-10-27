/*
  Warnings:

  - You are about to drop the column `callout_content` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `hero_content` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "callout_content",
DROP COLUMN "hero_content";
