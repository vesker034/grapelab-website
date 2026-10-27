-- WEB projects -> web_dev (id=2)
UPDATE projects
SET direction_id = 2
WHERE name IN ('poas_site', 'grapelab_site', 'way_tourism', 'kompressor34_site');

-- Bot projects -> software_design (id=58) or mobile_apps (id=1)?
-- Assuming bots are software design:
UPDATE projects
SET direction_id = 58
WHERE name IN ('aevisual_neurobot', 'beauty_neurobot', 'telegram_mini_app');

-- System projects -> desktop_solutions (id=5) or software_design (id=58)?
-- Assuming systems are desktop solutions:
UPDATE projects
SET direction_id = 5
WHERE name IN ('zhar_ptica_monitoring', 'article_tracking_module');

-- Check results
SELECT id, name, direction_id,
       (SELECT raw_name FROM devdirections WHERE id = projects.direction_id) as direction_name
FROM projects
WHERE id >= 6
ORDER BY id;