/*
  Warnings:

  - A unique constraint covering the columns `[scope,source_id]` on the table `dynamic_translations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "dynamic_translations_index" ON "public"."dynamic_translations"("scope");

-- CreateIndex
CREATE UNIQUE INDEX "dynamic_translations_scope_source_id_key" ON "public"."dynamic_translations"("scope", "source_id");
