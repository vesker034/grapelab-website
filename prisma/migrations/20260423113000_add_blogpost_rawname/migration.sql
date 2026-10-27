ALTER TABLE "blog_posts"
ADD COLUMN "raw_name" TEXT;

CREATE UNIQUE INDEX "blog_posts_raw_name_key"
ON "blog_posts"("raw_name");
