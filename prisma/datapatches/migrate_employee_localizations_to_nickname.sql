DO $$
-- Начало анонимного блока кода на языке PL/pgSQL.
-- Это позволяет использовать переменные, циклы и обработку ошибок.

DECLARE
    -- Объявление переменных, которые будут использоваться внутри блока.

    -- old_employee_id: хранит старый числовой ID сотрудника,
    -- извлеченный из колонки `raw_name`.
old_employee_id TEXT;

    -- employee_nickname: хранит новый никнейм сотрудника,
    -- полученный из таблицы `employees`.
    employee_nickname TEXT;

    -- first_name_ru, last_name_ru: хранят русские имя и фамилию,
    -- найденные в таблице `localizations`. Они используются для поиска сотрудника.
    first_name_ru TEXT;
    last_name_ru TEXT;

    -- deleted_rows: используется как счетчик для логирования количества
    -- удаленных строк при разрешении конфликтов.
    deleted_rows INT;

BEGIN
    -- Начало исполняемой части скрипта.

    -- Логирование в консоль psql о начале выполнения миграции.
    RAISE NOTICE 'Starting migration of employees localizations from ID to nickname...';
    RAISE NOTICE 'Lookup strategy: Find RU localization -> Find employees by RU name -> Delete conflicts -> Update.';

    -- Основной цикл, который будет итерироваться по каждому уникальному ID старого сотрудника.
FOR old_employee_id IN
        -- Запрос для получения списка ID для обработки.
SELECT old_id FROM (
                       -- Вложенный запрос для получения уникальных ID.
                       SELECT DISTINCT substring(raw_name from 'employee_([0-9]+)_') AS old_id
                       FROM localizations
                       -- Фильтр по секции, чтобы работать только с локализациями сотрудников.
                       WHERE section = 'employees'
                           -- Фильтр с использованием регулярного выражения, чтобы выбрать только `raw_name`
                           -- со старым числовым форматом ID.
                         AND raw_name ~ '^employee_[0-9]+_(first_name|last_name|site_description)$'
                   ) AS unique_ids
-- Сортировка ID как чисел (1, 2, 10), а не как текста (1, 10, 2).
-- Для этого текстовое значение ID приводится к типу INTEGER.
ORDER BY unique_ids.old_id::INT
    LOOP
        -- Начало тела цикла для одного сотрудника.

        -- Логирование ID, который обрабатывается в текущей итерации.
        RAISE NOTICE '--- Processing old employee_id: % ---', old_employee_id;

-- Извлечение имени сотрудника из его русской локализации.
SELECT content INTO first_name_ru
FROM localizations
-- Условия поиска точно соответствуют записи с русским именем для текущего ID.
WHERE section = 'employees' AND raw_name = 'employee_' || old_employee_id || '_first_name' AND locale_code = 'ru';

-- Извлечение фамилии сотрудника из его русской локализации.
SELECT content INTO last_name_ru
FROM localizations
-- Аналогичные условия поиска для фамилии.
WHERE section = 'employees' AND raw_name = 'employee_' || old_employee_id || '_last_name' AND locale_code = 'ru';

-- Проверка, были ли найдены русские имя и фамилия.
IF first_name_ru IS NULL OR last_name_ru IS NULL THEN
            -- Если хотя бы одно из полей не найдено, надежно идентифицировать сотрудника невозможно.
            RAISE WARNING 'Could not find RU first_name or last_name for employee_%', old_employee_id;
            -- Прерывание текущей итерации и переход к следующему ID в цикле.
CONTINUE;
END IF;

        -- Логирование найденных русских имени и фамилии.
        RAISE NOTICE 'Found RU names: % %', first_name_ru, last_name_ru;

        -- Поиск сотрудника в таблице `employees` по полному совпадению имени и фамилии.
SELECT nickname INTO employee_nickname
FROM employees
WHERE first_name = first_name_ru AND last_name = last_name_ru;

-- Проверка, был ли найден сотрудник или есть ли у него никнейм.
IF employee_nickname IS NULL THEN
            -- Если сотрудник не найден, обновить его локализации невозможно.
            RAISE WARNING 'Employee not found or missing nickname for: % % (old_id: %)',
                first_name_ru, last_name_ru, old_employee_id;
            -- Прерывание текущей итерации и переход к следующему ID.
CONTINUE;
END IF;

        -- Логирование найденного никнейма.
        RAISE NOTICE 'Found nickname: %', employee_nickname;

        -- Блок для предотвращения ошибки нарушения уникальности ключа.
        -- Выполняется, только если никнейм отличается от старого ID.
        IF employee_nickname <> old_employee_id THEN
            -- Логирование шага по удалению конфликтующих записей.
            RAISE NOTICE 'Checking for and deleting conflicting entries for employee_%...', employee_nickname;
            -- Использование Common Table Expression (CTE) для удаления и подсчета строк в одном запросе.
WITH deleted AS (
-- Удаление всех локализаций, которые УЖЕ используют целевой никнейм.
DELETE FROM localizations
WHERE section = 'employees'
-- Условие `IN` позволяет удалить все три типа локализаций за один проход.
  AND raw_name IN (
    'employee_' || employee_nickname || '_first_name',
    'employee_' || employee_nickname || '_last_name',
    'employee_' || employee_nickname || '_site_description'
    )
-- `RETURNING *` возвращает удаленные строки, чтобы их можно было посчитать.
    RETURNING *
    )
-- Подсчет количества строк, возвращенных CTE `deleted`.
SELECT count(*) INTO deleted_rows FROM deleted;
-- Логирование результата операции удаления.
RAISE NOTICE 'Deleted % conflicting rows.', deleted_rows;
END IF;

        -- Обновление всех локализаций для текущего сотрудника.
        -- Этот блок выполняется после удаления конфликтов, поэтому он безопасен.

        -- Обновление `raw_name` для локализации имени.
UPDATE localizations
SET raw_name = 'employee_' || employee_nickname || '_first_name',
    updated_at = NOW()
WHERE section = 'employees' AND raw_name = 'employee_' || old_employee_id || '_first_name';

-- Обновление `raw_name` для локализации фамилии.
UPDATE localizations
SET raw_name = 'employee_' || employee_nickname || '_last_name',
    updated_at = NOW()
WHERE section = 'employees' AND raw_name = 'employee_' || old_employee_id || '_last_name';

-- Обновление `raw_name` для локализации описания.
UPDATE localizations
SET raw_name = 'employee_' || employee_nickname || '_site_description',
    updated_at = NOW()
WHERE section = 'employees' AND raw_name = 'employee_' || old_employee_id || '_site_description';

-- Логирование успешного завершения обновления для текущего сотрудника.
RAISE NOTICE 'Updated all locales for employee_% -> employee_% (name: % %)',
            old_employee_id, employee_nickname, first_name_ru, last_name_ru;
END LOOP;
    -- Завершение основного цикла.

    -- Логирование сообщения об успешном завершении всего скрипта.
    RAISE NOTICE 'Migration completed successfully';

EXCEPTION
    -- Блок обработки ошибок.
    -- `WHEN OTHERS` перехватывает любую ошибку, возникшую в блоке `BEGIN`.
    WHEN OTHERS THEN
        -- Логирование системной переменной `SQLERRM`, содержащей текст ошибки.
        RAISE NOTICE 'Migration error: %', SQLERRM;
END $$;