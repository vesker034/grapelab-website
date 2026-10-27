"""Правки грамматики и содержания в существующем DOCX без пересборки стилей."""

import sys
from copy import deepcopy
from pathlib import Path

from docx import Document
from docx.oxml.ns import qn
from docx.text.paragraph import Paragraph

DOC_PATH = (
    Path(__file__).resolve().parent.parent
    / "docs"
    / "GrapeLab-OAuth-SSO-issledovanie.docx"
)

REPLACEMENTS: list[tuple[str, str]] = [
    (
        "1. P.S. Был изучен вопрос, было рассмотренно большое колличество вариантов, если лень все это читать, то можете просто пролистать до последней главы, там есть выводы(оптимальное решение задачи).",
        "Примечание. Был изучен вопрос единой авторизации, рассмотрены основные варианты OAuth 2.0 / OIDC. Краткие выводы и рекомендуемое решение — в разделе 13.",
    ),
    (
        "2. Термины: OAuth 2.0 и OpenID Connect",
        "1. Термины: OAuth 2.0 и OpenID Connect",
    ),
    ("3. Все основные варианты OAuth 2.0 / OIDC", "2. Все основные варианты OAuth 2.0 / OIDC"),
    ("3.1. Authorization Code Flow", "2.1. Authorization Code Flow"),
    ("3.2. Authorization Code + PKCE", "2.2. Authorization Code + PKCE"),
    ("3.3. Implicit Flow", "2.3. Implicit Flow"),
    ("3.4. Hybrid Flow", "2.4. Hybrid Flow"),
    ("3.5. Client Credentials Flow", "2.5. Client Credentials Flow"),
    ("3.6. Device Authorization Flow", "2.6. Device Authorization Flow"),
    ("3.7. Resource Owner Password Credentials", "2.7. Resource Owner Password Credentials"),
    ("3.8. Response mode", "2.8. Response mode"),
    ("3.9. Типы клиентов", "2.9. Типы клиентов"),
    ("3.10. Сводная таблица", "2.10. Сводная таблица"),
    ("4. Отладка OAuth", "3. Отладка OAuth"),
    ("5. Варианты собственного OAuth/OIDC провайдера", "4. Варианты собственного OAuth/OIDC провайдера"),
    ("5.1. Библиотеки на стороне клиента", "4.1. Библиотеки на стороне клиента"),
    ("6. Текущее состояние GrapeLab", "5. Текущее состояние GrapeLab"),
    ("6.1. Новая версия", "5.1. Новая версия"),
    ("6.2. Старая prod-версия", "5.2. Старая prod-версия"),
    ("7. Целевая архитектура", "6. Целевая архитектура"),
    ("8. Чеклист подключения", "7. Чеклист подключения"),
    ("8.1. В IdP", "7.1. В IdP"),
    ("8.2. На сайте", "7.2. На сайте"),
    ("9. Оптимальный вариант", "8. Оптимальный вариант"),
    ("10. Безопасность", "9. Безопасность"),
    ("11. Миграция со старого prod", "10. Миграция со старого prod"),
    ("12. Оценка трудозатрат", "11. Оценка трудозатрат"),
    ("14. Выводы", "13. Выводы"),
    (
        "Пользователь → IdP → redirect с code → сервер обменивает code на токены по backend-каналу.",
        "Пользователь → IdP → redirect с code → сервер обменивает code на токены по защищённому серверному каналу.",
    ),
    (
        "Роли: groups в Authentik (staff, student, user) → синхронизация при login.",
        "Роли: groups в Authentik (staff, student, user) → синхронизация при входе.",
    ),
    (
        "Implicit / Password flows — небезопасны и deprecated.",
        "Implicit / Password flows — небезопасны и устарели.",
    ),
    (
        "Upsert пользователя в локальной БД по sub.",
        "Создание или обновление пользователя в локальной БД по sub.",
    ),
    (
        "IdP: Authentik в Docker на поддомене auth.grapelab.ru — баланс простоты, OIDC, MFA и SSO.",
        "IdP: Authentik в Docker на серверах GrapeLab (поддомен auth.grapelab.ru) — полный контроль над данными, OIDC, MFA и SSO.",
    ),
    ("огромная экосystem", "огромная экосистема"),
    (
        "state — CSRF protection в authorization request.",
        "state — защита от CSRF в authorization request.",
    ),
    (
        "Параллельный период: старый и новый вход (feature flag).",
        "Параллельный период: старый и новый вход (флаг переключения).",
    ),
]

INSERT_AFTER_ARCHITECTURE = (
    "Развёртывание выполняется на инфраструктуре GrapeLab (собственные серверы), "
    "без внешних SaaS-провайдеров авторизации. Authentik поднимается в Docker на "
    "выделенном сервере или в существующем кластере команды; доступ только по HTTPS "
    "с доменов *.grapelab.ru."
)

INSERT_AFTER_SECURITY = (
    "Секреты client_secret и ключи шифрования хранятся только на серверах GrapeLab "
    "(переменные окружения или внутренний secrets manager)."
)

INSERT_IN_CONCLUSION = (
    "Развёртывание — self-hosted на серверах GrapeLab; внешние IdP "
    "(Auth0, Firebase Auth и аналоги) не рассматриваются."
)


def replace_in_text(text: str) -> str:
    result = text
    for old, new in REPLACEMENTS:
        if old in result:
            result = result.replace(old, new)
    return result


def set_paragraph_text(para: Paragraph, new_text: str) -> None:
    if para.text == new_text:
        return
    if para.runs:
        para.runs[0].text = new_text
        for run in para.runs[1:]:
            run.text = ""
    else:
        para.add_run(new_text)


def insert_paragraph_after(paragraph: Paragraph, text: str) -> Paragraph:
    new_p = deepcopy(paragraph._p)
    paragraph._p.addnext(new_p)
    new_para = Paragraph(new_p, paragraph._parent)
    set_paragraph_text(new_para, text)
    return new_para


def process_document(doc: Document) -> int:
    changes = 0

    for para in doc.paragraphs:
        new_text = replace_in_text(para.text)
        if new_text != para.text:
            set_paragraph_text(para, new_text)
            changes += 1

    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for para in cell.paragraphs:
                    new_text = replace_in_text(para.text)
                    if new_text != para.text:
                        set_paragraph_text(para, new_text)
                        changes += 1

    paras = list(doc.paragraphs)

    for para in paras:
        if para.text.startswith("6. Целевая архитектура"):
            for j in range(paras.index(para) + 1, min(paras.index(para) + 8, len(paras))):
                if "client_id: grapelab-admin" in paras[j].text:
                    next_idx = j + 1
                    if next_idx >= len(paras) or INSERT_AFTER_ARCHITECTURE not in paras[next_idx].text:
                        insert_paragraph_after(paras[j], INSERT_AFTER_ARCHITECTURE)
                        changes += 1
                    break
            break

    paras = list(doc.paragraphs)

    for para in paras:
        if para.text.startswith("9. Безопасность"):
            start = paras.index(para)
            for j in range(start + 1, len(paras)):
                if paras[j].text.startswith("10. Миграция"):
                    prev = paras[j - 1]
                    if INSERT_AFTER_SECURITY not in prev.text:
                        insert_paragraph_after(prev, INSERT_AFTER_SECURITY)
                        changes += 1
                    break
            break

    paras = list(doc.paragraphs)

    for para in paras:
        if para.text.startswith("13. Выводы"):
            last = paras[-1]
            if INSERT_IN_CONCLUSION not in last.text:
                insert_paragraph_after(last, INSERT_IN_CONCLUSION)
                changes += 1
            break

    return changes


def main() -> None:
    if not DOC_PATH.exists():
        print(f"File not found: {DOC_PATH}", file=sys.stderr)
        sys.exit(1)

    doc = Document(DOC_PATH)
    changes = process_document(doc)
    doc.save(DOC_PATH)
    print(f"Updated: {DOC_PATH}")
    print(f"Changes applied: {changes}")


if __name__ == "__main__":
    main()
