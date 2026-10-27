"""Генерация документа по исследованию OAuth/OIDC для GrapeLab."""

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt
from pathlib import Path

OUTPUT = Path(__file__).resolve().parent.parent / "docs" / "GrapeLab-OAuth-SSO-issledovanie.docx"


def add_heading(doc: Document, text: str, level: int = 1) -> None:
    doc.add_heading(text, level=level)


def add_para(doc: Document, text: str, bold: bool = False) -> None:
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.bold = bold
    run.font.size = Pt(11)


def add_bullets(doc: Document, items: list[str]) -> None:
    for item in items:
        doc.add_paragraph(item, style="List Bullet")


def add_numbered(doc: Document, items: list[str]) -> None:
    for item in items:
        doc.add_paragraph(item, style="List Number")


def add_table(doc: Document, headers: list[str], rows: list[list[str]]) -> None:
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Table Grid"
    hdr = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = h
        for p in hdr[i].paragraphs:
            for run in p.runs:
                run.bold = True
    for ri, row in enumerate(rows):
        cells = table.rows[ri + 1].cells
        for ci, val in enumerate(row):
            cells[ci].text = val
    doc.add_paragraph()


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = Document()

    title = doc.add_heading("Единая авторизация GrapeLab", 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    sub = doc.add_paragraph("OAuth 2.0 / OpenID Connect — исследование и рекомендации")
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for run in sub.runs:
        run.font.size = Pt(12)

    meta = doc.add_paragraph()
    meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    meta.add_run("Статус: исследование\n").font.size = Pt(10)
    meta.add_run("Дата: июнь 2026\n").font.size = Pt(10)
    meta.add_run("Автор: Толочек А.").font.size = Pt(10)
    doc.add_paragraph()

    # 1
    add_heading(doc, "1. Контекст задачи", 1)
    add_para(
        doc,
        "Необходимо изучить возможность единой системы авторизации для экосистемы "
        "GrapeLab: grapelab.ru, edu и будущих проектов. Цель — один аккаунт для "
        "всех сервисов, аналогично «Войти через Google», но на собственной инфраструктуре.",
    )
    add_para(doc, "Уточнения от тимлида:", bold=True)
    add_bullets(
        doc,
        [
            "На текущем этапе — исследование и документ, без внедрения.",
            "Новая версия сайта (v2) в prod пока не развёрнута.",
            "В предыдущей prod-версии grapelab.ru личный кабинет сохранился.",
            "Нужна универсальная схема подключения авторизации к любому новому сайту.",
        ],
    )

    # 2
    add_heading(doc, "2. Термины: OAuth 2.0 и OpenID Connect", 1)
    add_para(
        doc,
        "OAuth 2.0 — протокол делегирования доступа. Позволяет приложению получить "
        "ограниченный доступ к ресурсам пользователя без передачи пароля сайту.",
    )
    add_para(
        doc,
        "OpenID Connect (OIDC) — надстройка над OAuth 2.0 для аутентификации (кто пользователь). "
        "Добавляет id_token и стандартный endpoint userinfo. Для SSO GrapeLab нужен именно OIDC, "
        "а не «голый» OAuth.",
    )
    add_table(
        doc,
        ["Понятие", "Описание"],
        [
            ["Authorization Server (IdP)", "Сервер auth.grapelab.ru — выдаёт code и токены"],
            ["Resource Server", "API, защищённое access token (если нужно)"],
            ["Client", "Любой сайт GrapeLab (grapelab.ru, edu, …)"],
            ["Resource Owner", "Пользователь"],
            ["Redirect URI", "URL, куда IdP возвращает браузер после входа"],
            ["Scope", "Запрашиваемые права: openid, profile, email, roles"],
            ["Client ID", "Публичный идентификатор приложения"],
            ["Client Secret", "Секрет confidential-клиента (только на сервере)"],
        ],
    )

    # 3 OAuth flows
    add_heading(doc, "3. Все основные варианты OAuth 2.0 / OIDC", 1)
    add_para(
        doc,
        "Ниже перечислены grant types и response types, которые поддерживают современные "
        "IdP. Для GrapeLab важно выбрать один стандартный поток для всех веб-проектов.",
    )

    add_heading(doc, "3.1. Authorization Code Flow (response_type=code)", 2)
    add_para(
        doc,
        "Пользователь → IdP → redirect с code → сервер обменивает code на токены по backend-каналу. "
        "Самый безопасный вариант для серверных приложений (Next.js SSR, PHP, Django, Laravel).",
    )
    add_bullets(
        doc,
        [
            "Плюсы: client_secret не попадает в браузер; refresh token на сервере.",
            "Минусы: нужен backend для обмена code → token.",
            "Применимость для GrapeLab: основной поток для grapelab.ru, edu, админки.",
        ],
    )

    add_heading(doc, "3.2. Authorization Code + PKCE", 2)
    add_para(
        doc,
        "Расширение Authorization Code. Клиент генерирует code_verifier и code_challenge (SHA-256). "
        "Обязательно для SPA и мобильных приложений; рекомендуется и для server-side.",
    )
    add_bullets(
        doc,
        [
            "Плюсы: защита от перехвата authorization code.",
            "Минусы: чуть сложнее настройка.",
            "Применимость: если edu или ЛК — чистый SPA без backend.",
        ],
    )

    add_heading(doc, "3.3. Implicit Flow (response_type=token) — устарел", 2)
    add_para(
        doc,
        "Токен возвращается напрямую в URL (fragment). OAuth 2.1 и OIDC Core не рекомендуют. "
        "Использовать не следует.",
    )

    add_heading(doc, "3.4. Hybrid Flow (code + id_token)", 2)
    add_para(
        doc,
        "Комбинация code и id_token в одном ответе. Нужен редко — когда id_token нужен "
        "клиенту сразу, а access token — только на сервере.",
    )

    add_heading(doc, "3.5. Client Credentials Flow", 2)
    add_para(
        doc,
        "Сервис-сервис: приложение получает token от своего имени, без пользователя. "
        "Не подходит для входа пользователя в ЛК, но полезен для внутренних API между сервисами GrapeLab.",
    )

    add_heading(doc, "3.6. Device Authorization Flow", 2)
    add_para(
        doc,
        "Для устройств без браузера (TV, CLI). Для текущих задач GrapeLab не актуален.",
    )

    add_heading(doc, "3.7. Resource Owner Password Credentials — устарел", 2)
    add_para(
        doc,
        "Приложение напрямую принимает логин/пароль и отправляет на IdP. Запрещён OAuth 2.1 "
        "для сторонних клиентов. Не использовать.",
    )

    add_heading(doc, "3.8. Response mode", 2)
    add_table(
        doc,
        ["Режим", "Как возвращаются параметры", "Когда использовать"],
        [
            ["query", "В query string (?code=…)", "Стандарт для Authorization Code"],
            ["fragment", "После # в URL", "Legacy implicit; не использовать"],
            ["form_post", "POST-форма в body", "Когда параметры не должны быть в URL (редко)"],
        ],
    )

    add_heading(doc, "3.9. Типы клиентов", 2)
    add_table(
        doc,
        ["Тип", "Secret", "Пример", "PKCE"],
        [
            ["Confidential", "Да, хранится на сервере", "Next.js SSR, Django, Laravel", "Рекомендуется"],
            ["Public", "Нет", "SPA, мобильное приложение", "Обязательно"],
        ],
    )

    add_heading(doc, "3.10. Сводная таблица: что выбрать для GrapeLab", 2)
    add_table(
        doc,
        ["Сценарий", "Рекомендуемый поток", "Комментарий"],
        [
            ["grapelab.ru (Next.js SSR + ЛК)", "Authorization Code + PKCE", "NextAuth OIDC provider"],
            ["edu (если server-side)", "Authorization Code + PKCE", "Стандарт"],
            ["edu (если чистый SPA)", "Authorization Code + PKCE", "Public client, без secret в браузере"],
            ["Админка сайта", "Authorization Code + PKCE", "Отдельный client_id, роль staff"],
            ["Сервис-сервис (cron, sync)", "Client Credentials", "Отдельные machine clients"],
            ["Implicit / Password", "—", "Не использовать"],
        ],
    )

    # 4 OAuth Debugger
    add_heading(doc, "4. Отладка OAuth: OAuth 2.0 Debugger", 1)
    add_para(
        doc,
        "Для проверки настроек IdP до подключения реальных сайтов используется "
        "онлайн-инструмент OAuth 2.0 Debugger: https://oauthdebugger.com",
    )
    add_para(doc, "Инструмент позволяет:", bold=True)
    add_bullets(
        doc,
        [
            "Задать Authorize URI, Redirect URI, Client ID, Scope, State.",
            "Выбрать response_type: code или token.",
            "Включить PKCE (SHA-256 или plain) с code_verifier / code_challenge.",
            "Указать Token URI для обмена code на access token.",
            "Выбрать response_mode: query, form_post, fragment.",
            "Отправить тестовый запрос и просмотреть redirect и параметры ответа.",
        ],
    )
    add_para(doc, "Рекомендуемый порядок проверки на staging:", bold=True)
    add_numbered(
        doc,
        [
            "Развернуть IdP на auth.staging.grapelab.ru (или dev).",
            "Создать тестовый OAuth client с redirect URI https://oauthdebugger.com/debug.",
            "В OAuth Debugger указать endpoints IdP (.well-known/openid-configuration).",
            "Проверить flow с response_type=code и PKCE SHA-256.",
            "Убедиться, что code обменивается на access_token и id_token через Token URI.",
            "Проверить claims в id_token: sub, email, name, roles.",
            "После успешного теста — зарегистрировать реальный redirect URI приложения.",
        ],
    )
    add_para(
        doc,
        "Параметр state рекомендуется использовать как anti-CSRF token. "
        "Nonce — для защиты id_token от replay-атак в OIDC.",
    )

    # 5 IdP options expanded
    add_heading(doc, "5. Варианты собственного OAuth/OIDC провайдера", 1)
    add_table(
        doc,
        ["Решение", "Лицензия", "Плюсы", "Минусы", "Docker", "OIDC"],
        [
            [
                "Authentik",
                "MIT",
                "Современный UI, проще Keycloak, flows, MFA, LDAP",
                "Меньше enterprise-кейсов",
                "Да",
                "Полный",
            ],
            [
                "Keycloak",
                "Apache 2.0",
                "SSO, роли, federation, огромная экосystem",
                "Тяжёлый (Java), сложнее админка",
                "Да",
                "Полный",
            ],
            [
                "Zitadel",
                "Apache 2.0 / BSL",
                "Cloud-native, multi-tenant, gRPC API",
                "Меньше опыта в команде",
                "Да",
                "Полный",
            ],
            [
                "ORY Hydra + Kratos",
                "Apache 2.0",
                "Hydra — OAuth server, Kratos — users; гибко",
                "Два сервиса, больше DevOps",
                "Да",
                "Hydra + Kratos",
            ],
            [
                "FusionAuth",
                "Commercial / free tier",
                "Удобная админка, хорошая документация",
                "Лицензия для prod",
                "Да",
                "Полный",
            ],
            [
                "Свой OAuth с нуля",
                "—",
                "Полный контроль",
                "Риски безопасности, месяцы работы",
                "—",
                "Нужно реализовывать",
            ],
        ],
    )

    add_heading(doc, "5.1. Библиотеки на стороне клиента (сайты)", 2)
    add_table(
        doc,
        ["Стек", "Библиотека", "Поддержка OIDC"],
        [
            ["Next.js / React", "NextAuth.js (Auth.js)", "Да, встроенный OIDC provider"],
            ["Node.js Express", "passport-openidconnect, openid-client", "Да"],
            ["Python Django", "mozilla-django-oidc", "Да"],
            ["PHP Laravel", "Laravel Socialite + OIDC driver", "Да"],
            ["Java Spring", "Spring Security OAuth2 Client", "Да"],
            ["Go", "coreos/go-oidc", "Да"],
        ],
    )

    # 6 Current state
    add_heading(doc, "6. Текущее состояние GrapeLab", 1)
    add_heading(doc, "6.1. Новая версия (grapelab-website, v2)", 2)
    add_bullets(
        doc,
        [
            "Публичного ЛК и регистрации нет.",
            "Auth только для админки: NextAuth + Credentials (email/пароль), isStaff.",
            "JWT-сессия 8 часов.",
        ],
    )
    add_heading(doc, "6.2. Старая prod-версия", 2)
    add_bullets(
        doc,
        [
            "Личный кабинет есть — требуется аудит реализации.",
            "Пользователей нужно мигрировать в центральный IdP.",
        ],
    )

    # 7 Architecture
    add_heading(doc, "7. Целевая архитектура", 1)
    add_para(
        doc,
        "Центральный IdP на auth.grapelab.ru. Все проекты — OIDC clients. "
        "Единая регистрация и вход на IdP; сайты хранят только привязку sub → локальный профиль.",
    )
    add_para(doc, "Схема:", bold=True)
    add_para(
        doc,
        "  auth.grapelab.ru (IdP: Authentik)\n"
        "       │\n"
        "       ├── grapelab.ru      — client_id: grapelab-web\n"
        "       ├── edu.grapelab.ru  — client_id: grapelab-edu\n"
        "       └── admin / др.      — client_id: grapelab-admin (роль staff)",
    )

    # 8 Connect checklist
    add_heading(doc, "8. Чеклист подключения любого нового сайта", 1)
    add_heading(doc, "8.1. В IdP", 2)
    add_numbered(
        doc,
        [
            "Создать Application / Client (confidential или public).",
            "Redirect URIs: https://site/api/auth/callback/oidc (точное совпадение).",
            "Scopes: openid profile email (+ custom: roles).",
            "Включить Authorization Code flow, PKCE (S256).",
            "Назначить группы/роли пользователям.",
        ],
    )
    add_heading(doc, "8.2. На сайте", 2)
    add_numbered(
        doc,
        [
            "Подключить OIDC-библиотеку под стек.",
            "Issuer URL: https://auth.grapelab.ru/application/o/<slug>/.well-known/openid-configuration",
            "Callback: обмен code → tokens, валидация id_token (issuer, aud, exp, nonce).",
            "Upsert пользователя в локальной БД по sub.",
            "Middleware для защиты /cabinet, /profile и API.",
        ],
    )

    # 9 Optimal recommendation
    add_heading(doc, "9. Оптимальный вариант (рекомендация автора)", 1)
    add_para(
        doc,
        "После анализа всех перечисленных вариантов считаю оптимальным для GrapeLab следующее решение:",
        bold=True,
    )
    add_numbered(
        doc,
        [
            "IdP: Authentik в Docker на поддомене auth.grapelab.ru — баланс простоты, OIDC, MFA и SSO.",
            "Протокол: OpenID Connect поверх Authorization Code Flow с PKCE (SHA-256).",
            "Response mode: query (стандарт).",
            "Клиенты: confidential для Next.js SSR; отдельный client_id на каждый сервис.",
            "Регистрация: только на IdP, сайты не хранят пароли.",
            "Роли: groups в Authentik (staff, student, user) → синхронизация при login.",
            "Отладка: OAuth Debugger (oauthdebugger.com) на staging до prod.",
            "Админка v2: миграция с Credentials на OIDC вторым этапом (роль staff в IdP).",
        ],
    )
    add_para(doc, "Почему не другие варианты:", bold=True)
    add_bullets(
        doc,
        [
            "Keycloak — избыточен на старте; имеет смысл, если понадобится SAML или сложная federation.",
            "Zitadel / ORY — больше DevOps-накладных расходов без явной выгоды на текущем масштабе.",
            "Implicit / Password flows — небезопасны и deprecated.",
            "Свой OAuth-сервер — неоправданный риск и сроки.",
        ],
    )

    # 10 Security
    add_heading(doc, "10. Безопасность", 1)
    add_bullets(
        doc,
        [
            "HTTPS на всех доменах; HSTS.",
            "PKCE S256 для всех clients.",
            "Короткий access token (5–15 мин), refresh token только на server-side.",
            "Валидация id_token: iss, aud, exp, nonce.",
            "state — CSRF protection в authorization request.",
            "Отдельные client_id: web, edu, admin.",
            "Audit log входов в Authentik.",
            "Rate limiting на /authorize и /token.",
        ],
    )

    # 11 Migration
    add_heading(doc, "11. Миграция со старого prod", 1)
    add_numbered(
        doc,
        [
            "Аудит старого ЛК: схема users, хеши паролей (bcrypt/argon2).",
            "Импорт пользователей в Authentik (CSV или API).",
            "Принудительный сброс пароля или перенос хешей (если алгоритм совместим).",
            "Параллельный период: старый и новый вход (feature flag).",
            "Отключение legacy-auth после стабилизации.",
        ],
    )

    # 12 Estimate
    add_heading(doc, "12. Оценка трудозатрат", 1)
    add_table(
        doc,
        ["Этап", "Срок"],
        [
            ["Authentik на staging + тест в OAuth Debugger", "2–3 дня"],
            ["Документация для команды (client checklist)", "1–2 дня"],
            ["Подключение первого client (edu или ЛК staging)", "1–2 недели"],
            ["Миграция пользователей старого prod", "1–2 недели после аудита"],
            ["Prod + мониторинг", "3–5 дней"],
        ],
    )

    # 13 Open questions
    add_heading(doc, "13. Открытые вопросы к команде", 1)
    add_numbered(
        doc,
        [
            "Структура старого ЛК в prod (БД, sessions)?",
            "Стек edu и текущая auth?",
            "Один аккаунт для staff и students или разные realm?",
            "Нужен ли social login (Google/VK) через Authentik?",
            "Хостинг IdP: тот же сервер или отдельный VPS?",
        ],
    )

    # 14 Conclusion
    add_heading(doc, "14. Выводы", 1)
    add_bullets(
        doc,
        [
            "Для экосистемы GrapeLab нужен центральный OIDC IdP, а не отдельный login на каждом сайте.",
            "Оптимально: Authentik + Authorization Code + PKCE + NextAuth OIDC на клиентах.",
            "Все OAuth flows рассмотрены; Implicit и Password — исключены.",
            "Проверка конфигурации — через oauthdebugger.com до подключения prod-клиентов.",
            "Следующий шаг: staging IdP + PoC с одним client + аудит старого ЛК.",
        ],
    )

    add_para(doc, "")
    add_para(
        doc,
        "Документ подготовлен в рамках исследовательской задачи. "
        "Внедрение — после согласования с командой.",
    )

    doc.save(OUTPUT)
    print(f"Created: {OUTPUT}")


if __name__ == "__main__":
    main()
