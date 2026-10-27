-- Migration: cases from ref_tables to projects
-- File: prisma/datapatches/migrate_cases_to_projects.sql
-- Encoding: UTF-8

DO $$
DECLARE
cases_json jsonb;
    case_item jsonb;
    case_title text;
    case_category text;
    case_image_url text;
    case_description text;
    direction_id int;
BEGIN
    -- Get JSON with cases from ref_tables
SELECT content INTO cases_json
FROM ref_tables
WHERE name = 'cases';

-- If record not found, exit
IF cases_json IS NULL THEN
        RAISE NOTICE 'Table cases not found in ref_tables';
        RETURN;
END IF;

    RAISE NOTICE 'Starting migration of cases to projects...';

    -- Iterate through each array element
FOR case_item IN SELECT * FROM jsonb_array_elements(cases_json)
                                   LOOP
                               -- Extract fields from JSON
    case_title := case_item->>'title';
case_category := case_item->>'category';
        case_image_url := case_item->>'image_url';
        case_description := case_item->>'description';

        -- Map category to direction_id (you need to adjust these mappings)
        direction_id := CASE case_category
            WHEN 'WEB' THEN (SELECT id FROM devdirections WHERE raw_name = 'web' LIMIT 1)
            WHEN 'Bot' THEN (SELECT id FROM devdirections WHERE raw_name = 'bot' LIMIT 1)
            WHEN 'System' THEN (SELECT id FROM devdirections WHERE raw_name = 'system' LIMIT 1)
            ELSE NULL
END;

        -- Insert into projects if not exists
INSERT INTO projects (
    name,
    image_path,
    start_date,
    is_visible,
    partner_id,
    direction_id,
    created_at,
    updated_at
)
VALUES (
           case_title,
           case_image_url,
           CURRENT_DATE, -- default start date, adjust if needed
           true, -- default visible
           NULL, -- no partner info in JSON
           direction_id,
           NOW(),
           NOW()
       )
    ON CONFLICT (id) DO NOTHING;

RAISE NOTICE 'Migrated case: % (category: %)', case_title, case_category;
END LOOP;

    RAISE NOTICE 'Migration completed successfully';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Migration error: %', SQLERRM;
END $$;

DELETE FROM ref_tables WHERE name = 'cases';