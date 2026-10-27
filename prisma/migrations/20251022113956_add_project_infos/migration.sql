-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "aspects_list" JSONB,
ADD COLUMN     "callout_content" TEXT,
ADD COLUMN     "gallery_images" JSONB,
ADD COLUMN     "hero_content" TEXT,
ADD COLUMN     "project_tech_stack" JSONB;
