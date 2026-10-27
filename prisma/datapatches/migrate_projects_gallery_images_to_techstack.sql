-- Migration: projects.gallery_images from string[] to techstack[] shape
-- Old item: "api/uploads/projects/IPhone_grapelab.webp"
-- New item: {"alt":"IPhone_grapelab","image_url":"api/uploads/projects/IPhone_grapelab.webp"}

UPDATE projects p
SET
  gallery_images = COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'alt',
          regexp_replace(
            regexp_replace(elem.value #>> '{}', '^.*/', ''),
            '\.[^.]+$',
            ''
          ),
          'image_url',
          elem.value #>> '{}'
        )
        ORDER BY elem.ordinality
      )
      FROM jsonb_array_elements(p.gallery_images) WITH ORDINALITY AS elem(value, ordinality)
    ),
    '[]'::jsonb
  ),
  updated_at = NOW()
WHERE
  p.gallery_images IS NOT NULL
  AND jsonb_typeof(p.gallery_images) = 'array'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p.gallery_images) AS e(value)
    WHERE jsonb_typeof(e.value) = 'string'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p.gallery_images) AS e(value)
    WHERE jsonb_typeof(e.value) <> 'string'
  );
