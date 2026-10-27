/*
  Warnings:

  - A unique constraint covering the columns `[scope,source_id,locale_code]` on the table `dynamic_translations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX IF EXISTS "dynamic_translations_scope_source_id_key";
DROP INDEX IF EXISTS "dynamic_translations_scope_source_id_locale_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "dynamic_translations_scope_source_id_locale_code_key" ON "dynamic_translations"("scope", "source_id", "locale_code");
