-- Fix project name: Kompressor34 / Kompressor134 -> Compressor134
-- File: prisma/datapatches/fix_compressor134_text.sql
-- Encoding: UTF-8

UPDATE localizations
SET content = REPLACE(
  REPLACE(content, 'Kompressor34', 'Compressor134'),
  'Kompressor134',
  'Compressor134'
)
WHERE raw_name = 'kompressor34_site'
  AND (
    content ILIKE '%Kompressor34%'
    OR content ILIKE '%Kompressor134%'
  );

UPDATE localizations
SET content = REPLACE(content, 'Kompressor34', 'Compressor134')
WHERE content ILIKE '%Kompressor34%';

UPDATE localizations
SET content = REPLACE(content, 'Kompressor134', 'Compressor134')
WHERE content ILIKE '%Kompressor134%'
  AND content NOT ILIKE '%Compressor134%';
