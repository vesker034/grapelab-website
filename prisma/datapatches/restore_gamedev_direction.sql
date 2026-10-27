-- Restore mobile apps and move GameDev to the end slot instead of IoT.

UPDATE "devdirections"
SET
  "raw_name" = 'mobile_apps',
  "short_name" = 'Bot',
  "image_path" = 'icons/android-sketched-logo.png'
WHERE "id" = 1;

UPDATE "devdirections"
SET
  "raw_name" = 'game_dev',
  "short_name" = 'GameDev',
  "image_path" = 'icons/gamedev.svg'
WHERE "raw_name" = 'iot';

DELETE FROM "localizations"
WHERE "section" IN ('devdirections', 'devdirections_description')
  AND "raw_name" IN ('mobile_apps', 'game_dev');

INSERT INTO "localizations" ("section", "raw_name", "locale_code", "content", "created_at", "updated_at")
VALUES
  ('devdirections', 'mobile_apps', 'ru', 'Мобильные приложения', NOW(), NOW()),
  ('devdirections', 'mobile_apps', 'en', 'Mobile Applications', NOW(), NOW()),
  ('devdirections', 'mobile_apps', 'ar', 'تطبيقات الهاتف المحمول', NOW(), NOW()),
  ('devdirections_description', 'mobile_apps', 'ru', 'Разработка нативных и кроссплатформенных решений для iOS и Android.', NOW(), NOW()),
  ('devdirections_description', 'mobile_apps', 'en', 'Development of native and cross-platform solutions for iOS and Android.', NOW(), NOW()),
  ('devdirections_description', 'mobile_apps', 'ar', 'تطوير حلول أصلية ومتعددة المنصات لنظامي iOS وAndroid.', NOW(), NOW()),
  ('devdirections', 'game_dev', 'ru', 'GameDev', NOW(), NOW()),
  ('devdirections', 'game_dev', 'en', 'GameDev', NOW(), NOW()),
  ('devdirections', 'game_dev', 'ar', 'GameDev', NOW(), NOW()),
  ('devdirections_description', 'game_dev', 'ru', 'Разработка игр для мобильных устройств, ПК и веб-платформ.', NOW(), NOW()),
  ('devdirections_description', 'game_dev', 'en', 'Game development for mobile devices, desktop, and web platforms.', NOW(), NOW()),
  ('devdirections_description', 'game_dev', 'ar', 'تطوير الألعاب للهواتف المحمولة وأجهزة الكمبيوتر ومنصات الويب.', NOW(), NOW())
ON CONFLICT ("section", "raw_name", "locale_code") DO UPDATE
SET
  "content" = EXCLUDED."content",
  "updated_at" = NOW();
