/*
  Warnings:

  - You are about to drop the column `originalMessageHash` on the `dynamic_translations` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `dynamic_translations` table. All the data in the column will be lost.
  - Added the required column `message_hash` to the `dynamic_translations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_id` to the `dynamic_translations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."dynamic_translations"
RENAME COLUMN "originalMessageHash" TO "message_hash";

ALTER TABLE "public"."dynamic_translations"
RENAME COLUMN "sourceId" TO "source_id";


