/*
  Warnings:

  - You are about to drop the column `description` on the `devdirections` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `devdirections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."devdirections" DROP COLUMN "description",
DROP COLUMN "name";
