DO $$
DECLARE
    emp RECORD;
    has_first_name_new BOOLEAN;
    has_last_name_new BOOLEAN;
    has_site_description_new BOOLEAN;
    target_locale TEXT;
    content_val TEXT;
    old_raw_name_id TEXT;
    old_raw_name_nick TEXT;
    deleted_count INT;
BEGIN
    RAISE NOTICE 'Starting final employee localizations migration...';

    FOR emp IN
        SELECT id, first_name, last_name, nickname
        FROM employees
        WHERE nickname IS NOT NULL AND nickname <> ''
        ORDER BY id
    LOOP
        RAISE NOTICE 'Processing employee id=%, nickname=%', emp.id, emp.nickname;

        SELECT EXISTS (
            SELECT 1 FROM localizations
            WHERE section = 'employees_firstName' AND raw_name = emp.nickname
        ) INTO has_first_name_new;

        SELECT EXISTS (
            SELECT 1 FROM localizations
            WHERE section = 'employees_lastName' AND raw_name = emp.nickname
        ) INTO has_last_name_new;

        SELECT EXISTS (
            SELECT 1 FROM localizations
            WHERE section = 'employees_siteDescription' AND raw_name = emp.nickname
        ) INTO has_site_description_new;

        IF has_first_name_new AND has_last_name_new AND has_site_description_new THEN
            RAISE NOTICE '  Already in new format, skipping.';
            CONTINUE;
        END IF;

        old_raw_name_id := 'employee_' || emp.id::TEXT;
        old_raw_name_nick := 'employee_' || emp.nickname;

        FOREACH target_locale IN ARRAY ARRAY['ru', 'en', 'ar']
        LOOP
            IF NOT has_first_name_new THEN
                content_val := NULL;

                SELECT content INTO content_val
                FROM localizations
                WHERE section = 'employees'
                  AND raw_name IN (
                      old_raw_name_id || '_first_name',
                      old_raw_name_nick || '_first_name'
                  )
                  AND locale_code = target_locale
                LIMIT 1;

                IF content_val IS NULL AND target_locale = 'ru' THEN
                    content_val := emp.first_name;
                END IF;

                IF content_val IS NOT NULL THEN
                    INSERT INTO localizations (section, raw_name, locale_code, content, created_at, updated_at)
                    VALUES ('employees_firstName', emp.nickname, target_locale, content_val, NOW(), NOW())
                    ON CONFLICT (section, raw_name, locale_code) DO UPDATE
                        SET content = EXCLUDED.content, updated_at = NOW();
                END IF;
            END IF;

            IF NOT has_last_name_new THEN
                content_val := NULL;

                SELECT content INTO content_val
                FROM localizations
                WHERE section = 'employees'
                  AND raw_name IN (
                      old_raw_name_id || '_last_name',
                      old_raw_name_nick || '_last_name'
                  )
                  AND locale_code = target_locale
                LIMIT 1;

                IF content_val IS NULL AND target_locale = 'ru' THEN
                    content_val := emp.last_name;
                END IF;

                IF content_val IS NOT NULL THEN
                    INSERT INTO localizations (section, raw_name, locale_code, content, created_at, updated_at)
                    VALUES ('employees_lastName', emp.nickname, target_locale, content_val, NOW(), NOW())
                    ON CONFLICT (section, raw_name, locale_code) DO UPDATE
                        SET content = EXCLUDED.content, updated_at = NOW();
                END IF;
            END IF;

            IF NOT has_site_description_new THEN
                content_val := NULL;

                SELECT content INTO content_val
                FROM localizations
                WHERE section = 'employees'
                  AND raw_name IN (
                      old_raw_name_id || '_site_description',
                      old_raw_name_nick || '_site_description'
                  )
                  AND locale_code = target_locale
                LIMIT 1;

                IF content_val IS NOT NULL THEN
                    INSERT INTO localizations (section, raw_name, locale_code, content, created_at, updated_at)
                    VALUES ('employees_siteDescription', emp.nickname, target_locale, content_val, NOW(), NOW())
                    ON CONFLICT (section, raw_name, locale_code) DO UPDATE
                        SET content = EXCLUDED.content, updated_at = NOW();
                END IF;
            END IF;
        END LOOP;

        RAISE NOTICE '  Done for nickname=%', emp.nickname;
    END LOOP;

    DELETE FROM localizations
    WHERE section = 'employees'
      AND raw_name ~ '^employee_(.+)_(first_name|last_name|site_description)$';

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted old-format rows: %', deleted_count;

    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE tablename = 'employees' AND indexname = 'employees_nickname_key'
    ) THEN
        ALTER TABLE employees ADD CONSTRAINT employees_nickname_key UNIQUE (nickname);
        RAISE NOTICE 'Added UNIQUE constraint on employees.nickname';
    ELSE
        RAISE NOTICE 'UNIQUE constraint on employees.nickname already exists';
    END IF;

    RAISE NOTICE 'Migration completed successfully.';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Migration error: %', SQLERRM;
        RAISE;
END $$;
