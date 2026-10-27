/*
  Warnings:

  - The primary key for the `localizations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[section,raw_name,locale_code]` on the table `localizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "localizations" DROP CONSTRAINT "localizations_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "localizations_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "localizations_section_raw_name_locale_code_key" ON "localizations"("section", "raw_name", "locale_code");
