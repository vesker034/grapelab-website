-- 1. Добавляем raw_name, если ещё нет
ALTER TABLE "public"."devdirections" ADD COLUMN IF NOT EXISTS "raw_name" TEXT;

-- 2. Заполняем данные (копируем из name)
UPDATE "public"."devdirections"
SET raw_name = name
WHERE raw_name IS NULL;

-- 3. Генерируем дефолтные ключи для null
UPDATE "public"."devdirections"
SET raw_name = 'autogen_' || id::text
WHERE raw_name IS NULL;

-- 4. Делаем колонку обязательной и уникальной
ALTER TABLE "public"."devdirections" ALTER COLUMN "raw_name" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "devdirections_raw_name_key" ON "public"."devdirections"("raw_name");
