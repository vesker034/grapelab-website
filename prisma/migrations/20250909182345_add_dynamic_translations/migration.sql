-- CreateTable
CREATE TABLE "public"."dynamic_translations" (
    "id" SERIAL NOT NULL,
    "scope" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "locale_code" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "originalMessageHash" BIGINT NOT NULL,

    CONSTRAINT "dynamic_translations_pkey" PRIMARY KEY ("id")
);
