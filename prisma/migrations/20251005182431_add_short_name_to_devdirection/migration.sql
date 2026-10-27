-- AlterTable
ALTER TABLE "public"."devdirections" ADD COLUMN     "short_name" TEXT;

-- Data Patch: Fill short_name for existing development directions
-- Этот скрипт заполняет новое поле short_name на основе raw_name.
-- Он не упадет, если каких-то из этих направлений не будет в БД.

UPDATE "devdirections" SET "short_name" = 'WEB' WHERE "raw_name" = 'web_dev';
UPDATE "devdirections" SET "short_name" = 'Bot' WHERE "raw_name" = 'mobile_apps';
UPDATE "devdirections" SET "short_name" = 'QA' WHERE "raw_name" = 'qa_testing';
UPDATE "devdirections" SET "short_name" = 'UI/UX' WHERE "raw_name" = 'ui_ux_design';
UPDATE "devdirections" SET "short_name" = 'System' WHERE "raw_name" = 'desktop_solutions';
UPDATE "devdirections" SET "short_name" = 'Bots' WHERE "raw_name" = 'software_design';
UPDATE "devdirections" SET "short_name" = 'IoT' WHERE "raw_name" = 'iot';
UPDATE "devdirections" SET "short_name" = 'R&D' WHERE "raw_name" = 'rd';