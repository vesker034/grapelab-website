import { createElement } from "react";
import { NextAdminOptions } from "@premieroctet/next-admin";
import Ajv from "ajv";
import bcrypt from "bcrypt";
import { contacts, stats, aspectsList, techstack, cases, type JSONSchema } from "@/schemas";
import { HookError } from "@premieroctet/next-admin";
import { prisma } from "@/lib/prisma";
import BlogLocalizedFieldInput from "@/components/admin/BlogLocalizedFieldInput";
import { BLOG_LOCALIZATION_SECTIONS, resolveBlogPostRawName } from "@/lib/blogLocalization";
import { fallbackLocale, type SupportedLocaleLang } from "@/config";
const schemaMap: Record<string, JSONSchema> = {
  contacts,
  stats,
  techstack,
  cases,
};
// Валидатор для JSON-полей по схеме из schemas.ts
const ajv = new Ajv({ allErrors: true });

function validateJsonBySchema(value: unknown, schema: JSONSchema, label: string): string | true {
  if (value === null || value === undefined || String(value).trim() === "") {
    return true;
  }

  let parsed: unknown;
  try {
    parsed = typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return `Поле «${label}» содержит невалидный JSON`;
  }

  const validate = ajv.compile(schema);
  if (!validate(parsed) && validate.errors) {
    const messages = validate.errors
      .map((e) => `${e.instancePath || "(корень)"}: ${e.message}`)
      .join("; ");
    return `Поле «${label}» не соответствует схеме — ${messages}`;
  }

  return true;
}

type Validator = (value: unknown) => string | true;
type RawNameResponse = { rawName?: unknown };
type EmployeeSaveResponse = {
  createdId?: unknown;
  data?: { id?: unknown; nickname?: unknown };
};
type RefTableBeforeDbPayload = { name?: string; content?: unknown } & Record<string, unknown>;
type BlogLocalizationPayload = Partial<Record<SupportedLocaleLang, string>>;
type BlogLocalizationFieldsPayload = Record<keyof typeof BLOG_LOCALIZATION_SECTIONS, BlogLocalizationPayload>;

const pendingEmployeeProjectIds = new WeakMap<object, number[]>();
const BLOG_LOCALIZATION_FIELD_NAMES: Record<keyof typeof BLOG_LOCALIZATION_SECTIONS, string> = {
  title: "blogLocalization_title",
  excerpt: "blogLocalization_excerpt",
  content: "blogLocalization_content",
};

const BLOG_LOCALIZATION_REQUEST_KEY = "__blogLocalizationPayload";

function parseProjectIds(value: unknown): number[] {
  if (typeof value !== "string" || value.trim() === "") return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return Array.from(
      new Set(
        parsed
          .map((projectId) => Number(projectId))
          .filter((projectId) => Number.isInteger(projectId) && projectId > 0),
      ),
    );
  } catch {
    return [];
  }
}

function createEmptyBlogLocalizationPayload(): BlogLocalizationFieldsPayload {
  return {
    title: {},
    excerpt: {},
    content: {},
  };
}

function parseBlogLocalizationPayload(value: unknown): BlogLocalizationPayload {
  if (typeof value !== "string" || value.trim() === "") {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([localeCode, content]) =>
          ["ru", "en", "ar"].includes(localeCode) && typeof content === "string",
      ),
    ) as BlogLocalizationPayload;
  } catch {
    return {};
  }
}

async function ensureBlogPostRawName(postId: number): Promise<string> {
  return resolveBlogPostRawName(postId);
}

async function persistBlogLocalizations(
  rawName: string,
  fieldsPayload: BlogLocalizationFieldsPayload,
) {
  const operations: Promise<unknown>[] = [];

  for (const [fieldKey, section] of Object.entries(BLOG_LOCALIZATION_SECTIONS) as Array<
    [keyof typeof BLOG_LOCALIZATION_SECTIONS, (typeof BLOG_LOCALIZATION_SECTIONS)[keyof typeof BLOG_LOCALIZATION_SECTIONS]]
  >) {
    const translations = fieldsPayload[fieldKey];

    for (const [localeCode, content] of Object.entries(translations)) {
      const trimmedContent = String(content).trim();

      if (!trimmedContent) {
        operations.push(
          prisma.localization.deleteMany({
            where: {
              rawName,
              section,
              localeCode,
            },
          }),
        );
        continue;
      }

      operations.push(
        prisma.localization.upsert({
          where: {
            section_rawName_localeCode: {
              section,
              rawName,
              localeCode,
            },
          },
          update: {
            content: trimmedContent,
          },
          create: {
            rawName,
            section,
            localeCode,
            content: trimmedContent,
          },
        }),
      );
    }
  }

  await Promise.all(operations);
}

const required = (label: string): Validator => (value) => {
  if (value === null || value === undefined || String(value).trim() === "")
    return `Поле «${label}» обязательно для заполнения`;
  return true;
};

const minLength = (label: string, min: number): Validator => (value) => {
  if (value && String(value).trim().length < min)
    return `Поле «${label}» должно содержать минимум ${min} символа(-ов)`;
  return true;
};

const maxLength = (label: string, max: number): Validator => (value) => {
  if (value && String(value).trim().length > max)
    return `Поле «${label}» не должно превышать ${max} символов`;
  return true;
};

const rangeInt = (label: string, min: number, max: number): Validator => (value) => {
  const n = Number(value);
  if (isNaN(n) || !Number.isInteger(n) || n < min || n > max)
    return `Поле «${label}» должно быть целым числом от ${min} до ${max}`;
  return true;
};

const positiveInt = (label: string): Validator => (value) => {
  const n = Number(value);
  if (isNaN(n) || !Number.isInteger(n) || n < 1)
    return `Поле «${label}» должно быть целым положительным числом`;
  return true;
};

const nonNegativeInt = (label: string): Validator => (value) => {
  const n = Number(value);
  if (isNaN(n) || !Number.isInteger(n) || n < 0)
    return `Поле «${label}» должно быть целым числом ≥ 0`;
  return true;
};

const emailFormat = (label: string): Validator => (value) => {
  if (!value || String(value).trim() === "") return true;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(String(value).trim()))
    return `Поле «${label}» должно быть корректным email-адресом`;
  return true;
};

const urlFormat = (label: string): Validator => (value) => {
  if (!value || String(value).trim() === "") return true;
  try {
    new URL(String(value).trim());
  } catch {
    return `Поле «${label}» должно быть корректным URL (например: https://example.com)`;
  }
  return true;
};

const slugFormat = (label: string): Validator => (value) => {
  if (!value || String(value).trim() === "")
    return `Поле «${label}» обязательно для заполнения`;
  if (!/^[a-z0-9_]+$/.test(String(value).trim()))
    return `Поле «${label}» может содержать только строчные латинские буквы, цифры и «_»`;
  return true;
};

const compose = (...validators: Validator[]): Validator => (value) => {
  for (const fn of validators) {
    const result = fn(value);
    if (result !== true) return result;
  }
  return true;
};

async function saveLocalizations(rawName: string, modelName: string) {
  console.log(`[localizations] afterDb for ${modelName}, rawName=${rawName}`);
}

export const options: NextAdminOptions = {
  sidebar: {
    groups: [
      {
        title: "Услуги",
        models: ["Service", "ServiceFeature"],
      },
    ],
  },
  model: {
    Review: {
      toString: (item) => `${item.fullname} (${item.rate}★)`,
      edit: {
        display: [
          'fullname',
          'rate',
          'description',
          'userPosition',
          'datetime',
          'userLocale',
          'addedBy',
          'imagePath',
          'createdAt',
          'updatedAt',
        ],
        fields: {
          fullname: {
            validate: compose(
              required('Имя автора'),
              minLength('Имя автора', 2),
              maxLength('Имя автора', 100),
            ),
          },
          rate: {
            validate: rangeInt('Оценка', 1, 5),
          },
          userLocale: {
            validate: (value) => {
              if (!['ru', 'en'].includes(String(value)))
                return 'Поле «Локаль» должно быть «ru» или «en»';
              return true;
            },
          },
          datetime: {
            validate: required('Дата отзыва'),
          },
          createdAt: { disabled: true },
          updatedAt: { disabled: true },
        },
      },
      list: {
        search: [
          'fullname',
          'rate',
          'description',
          'userPosition',
          'userLocale',
        ],
        display: [
          'fullname',
          'rate',
          'description',
          'userPosition',
          'datetime',
          'userLocale',
          'addedBy',
          'imagePath',
          'createdAt',
          'updatedAt',
        ],
        fields: {
          addedBy: {
            formatter: (value: { fullname?: string; id: number } | null) => {
              if (!value) return '—';
              return value.fullname || `User #${value.id}`;
            },
          },
        },
      },
    },

    Project: {
      toString: (item) => `${item.rawName}`,
      edit: {
        display: [
          'rawName',
          'startDate',
          'isVisible',
          'partner',
          'direction',
          'aspectsList',
          'galleryImages',
          'projectTechStack',
        ],
        fields: {
          rawName: {
            validate: compose(
              slugFormat('Системное имя (rawName)'),
              maxLength('Системное имя (rawName)', 100),
            ),
          },
          // Строгая валидация по схемам — блокирует сохранение при несоответствии
          galleryImages: {
            validate: (value) => validateJsonBySchema(value, techstack, 'Галерея изображений'),
          },
          projectTechStack: {
            validate: (value) => validateJsonBySchema(value, techstack, 'Стек технологий проекта'),
          },
          aspectsList: {
            validate: (value) => validateJsonBySchema(value, aspectsList, 'Аспекты проекта'),
          },
          createdAt: { disabled: true },
          updatedAt: { disabled: true },
        },
      },
      list: {
        search: ['rawName', 'direction.shortName'],
        display: [
          'rawName',
          'imagePath',
          'startDate',
          'isVisible',
          'partner',
          'direction',
          'createdAt',
          'updatedAt',
        ],
        fields: {
          direction: {
            formatter: (
              value: {
                shortName?: string | null;
                rawName?: string | null;
                id: number;
              } | null,
            ) => {
              if (!value) return '—';
              return (
                value.shortName || value.rawName || `Direction #${value.id}`
              );
            },
          },
          partner: {
            formatter: (value: { name?: string | null; id: number } | null) => {
              if (!value) return '—';
              return value.name || `Partner #${value.id}`;
            },
          },
        },
      },
    },

    Partner: {
      toString: (item) => `${item.name ?? 'Partner #' + item.id}`,
      edit: {
        display: [
          'name',
          'imagePath',
          'url',
          'isVisible',
          'createdAt',
          'updatedAt',
        ],
        fields: {
          name: {
            validate: maxLength('Название партнёра', 200),
          },
          url: {
            validate: urlFormat('Сайт партнёра'),
          },
          createdAt: { disabled: true },
          updatedAt: { disabled: true },
        },
      },
      list: {
        search: ['name', 'url'],
        display: [
          'name',
          'imagePath',
          'url',
          'isVisible',
          'createdAt',
          'updatedAt',
        ],
      },
    },

    DevDirection: {
      toString: (item) =>
        item.shortName || item.rawName || `Direction #${item.id}`,
      edit: {
        display: [
          'shortName',
          'rawName',
          'durationDays',
          'imagePath',
          'createdAt',
          'updatedAt',
        ],
        fields: {
          shortName: {
            validate: maxLength('Краткое название', 100),
          },
          rawName: {
            validate: compose(
              slugFormat('Системное имя (rawName)'),
              maxLength('Системное имя (rawName)', 100),
            ),
          },
          durationDays: {
            validate: positiveInt('Длительность (дней)'),
          },
          createdAt: { disabled: true },
          updatedAt: { disabled: true },
        },
        hooks: {
          async afterDb(response) {
            const rawName = (response as RawNameResponse)?.rawName;
            if (typeof rawName === "string" && rawName) {
              await saveLocalizations(rawName, 'DevDirection');
            }
            return response;
          },
        },
      },
      list: {
        search: ['shortName', 'rawName'],
        display: [
          'shortName',
          'rawName',
          'durationDays',
          'imagePath',
          'createdAt',
          'updatedAt',
        ],
      },
    },

    Employee: {
      toString: (item) => `${item.firstName} ${item.lastName}`,
      edit: {
        display: [
          'firstName',
          'lastName',
          'imagePath',
          'tags',
          'birthDate',
          'isVisible',
          'email',
          'role',
          'nickname',
          'projects',
          'createdAt',
          'updatedAt',
        ],
        fields: {
          firstName: {
            disabled: true,
          },
          lastName: {
            disabled: true,
          },
          email: {
            validate: emailFormat('Email'),
          },
          nickname: {
            validate: compose(
              required('Никнейм'),
              (value) => {
                if (String(value).trim().length > 50)
                  return 'Поле «Никнейм» не должно превышать 50 символов';
                return true;
              },
            ),
          },
          tags: {
            validate: maxLength('Теги', 300),
          },
          projects: {
            display: 'list',
            relationshipSearchField: 'project',
            relationOptionFormatter: (project: { rawName?: string | null; id: number }) =>
              project.rawName || `Project #${project.id}`,
            pagination: { perPage: 10 },
          },
          createdAt: { disabled: true },
          updatedAt: { disabled: true },
        },
        hooks: {
          async beforeDb(data, _mode, request) {
            pendingEmployeeProjectIds.set(request as object, parseProjectIds(data.projects));
            const employeeData = { ...data };
            delete employeeData.projects;

            const nickname =
              typeof employeeData.nickname === "string" ? employeeData.nickname.trim() : "";

            if (nickname) {
              const nameLocalizations = await prisma.localization.findMany({
                where: {
                  rawName: nickname,
                  section: {
                    in: ["employees_firstName", "employees_lastName"],
                  },
                  localeCode: fallbackLocale,
                },
                select: {
                  section: true,
                  content: true,
                },
              });

              const localizedFirstName = nameLocalizations.find(
                (item) => item.section === "employees_firstName",
              )?.content?.trim();
              const localizedLastName = nameLocalizations.find(
                (item) => item.section === "employees_lastName",
              )?.content?.trim();

              if (localizedFirstName) {
                employeeData.firstName = localizedFirstName;
              }
              if (localizedLastName) {
                employeeData.lastName = localizedLastName;
              }
            }

            if (!String(employeeData.firstName ?? "").trim()) {
              employeeData.firstName = nickname || "Employee";
            }
            if (!String(employeeData.lastName ?? "").trim()) {
              employeeData.lastName = "-";
            }

            return employeeData;
          },
          async afterDb(response, _mode, request) {
            const employee = response as EmployeeSaveResponse;
            const employeeId = Number(employee?.data?.id ?? employee?.createdId);
            const projectIds = pendingEmployeeProjectIds.get(request as object);
            pendingEmployeeProjectIds.delete(request as object);

            if (Number.isInteger(employeeId) && projectIds) {
              await prisma.projectEmployee.deleteMany({
                where: { employeeId },
              });

              if (projectIds.length > 0) {
                await prisma.projectEmployee.createMany({
                  data: projectIds.map((projectId) => ({ employeeId, projectId })),
                  skipDuplicates: true,
                });
              }
            }

            const nickname = employee?.data?.nickname;
            if (typeof nickname === "string" && nickname) {
              await saveLocalizations(nickname, 'Employee');
            }
            return response;
          },
        },
      },
      list: {
        search: ['firstName', 'lastName', 'email', 'role', 'tags', 'nickname'],
        display: [
          'firstName',
          'lastName',
          'imagePath',
          'tags',
          'isVisible',
          'email',
          'role',
          'createdAt',
          'updatedAt',
        ],
      },
    },

    ProjectEmployee: {
      toString: (item) =>
        `Project ${item.projectId} - Employee ${item.employeeId}`,
      edit: {
        display: ['project', 'employee', 'createdAt', 'updatedAt'],
        fields: {
          project: {
            validate: required('Проект'),
          },
          employee: {
            validate: required('Сотрудник'),
          },
          createdAt: { disabled: true },
          updatedAt: { disabled: true },
        },
      },
      list: {
        defaultSort: { field: 'projectId', direction: 'asc' },
        display: ['project', 'employee', 'createdAt', 'updatedAt'],
        fields: {
          project: {
            formatter: (value: { rawName?: string | null; id: number } | null) => {
              if (!value) return '—';
              return value.rawName || `Project #${value.id}`;
            },
          },
          employee: {
            formatter: (
              value: {
                firstName?: string;
                lastName?: string;
                id: number;
              } | null,
            ) => {
              if (!value) return '—';
              return value.firstName
                ? `${value.firstName} ${value.lastName ?? ''}`.trim()
                : `Employee #${value.id}`;
            },
          },
        },
      },
    },

    BlogPost: {
      toString: (item) => `${item.title || item.rawName || `BlogPost #${item.id}`}`,
      edit: {
        display: [
          'title',
          'excerpt',
          'content',
          'bannerImagePath',
          'publishedAt',
          'isVisible',
          'createdAt',
          'updatedAt',
        ],
        fields: {
          title: {
            input: createElement(BlogLocalizedFieldInput, { fieldKey: "title" }),
            validate: compose(
              required('Заголовок'),
              minLength('Заголовок', 3),
              maxLength('Заголовок', 300),
            ),
          },
          excerpt: {
            input: createElement(BlogLocalizedFieldInput, { fieldKey: "excerpt" }),
            validate: maxLength('Анонс', 500),
          },
          content: {
            input: createElement(BlogLocalizedFieldInput, { fieldKey: "content" }),
            validate: required('Содержимое поста'),
          },
          publishedAt: {
            validate: required('Дата публикации'),
          },
          createdAt: { disabled: true },
          updatedAt: { disabled: true },
        },
        hooks: {
          async beforeDb(data, _mode, request) {
            const payload = createEmptyBlogLocalizationPayload();

            for (const [fieldKey, fieldName] of Object.entries(BLOG_LOCALIZATION_FIELD_NAMES) as Array<
              [keyof typeof BLOG_LOCALIZATION_FIELD_NAMES, string]
            >) {
              payload[fieldKey] = parseBlogLocalizationPayload(data[fieldName]);
            }

            (request as unknown as Record<string, unknown>)[BLOG_LOCALIZATION_REQUEST_KEY] = payload;

            const blogData = { ...data };
            for (const fieldName of Object.values(BLOG_LOCALIZATION_FIELD_NAMES)) {
              delete blogData[fieldName];
            }

            return blogData;
          },
          async afterDb(response, _mode, request) {
            const postId = Number(
              (response as { data?: { id?: unknown }; createdId?: unknown })?.data?.id ??
              (response as { data?: { id?: unknown }; createdId?: unknown })?.createdId,
            );

            const requestRecord = request as unknown as Record<string, unknown>;
            const pendingPayload =
              requestRecord[BLOG_LOCALIZATION_REQUEST_KEY] as BlogLocalizationFieldsPayload | undefined;
            delete requestRecord[BLOG_LOCALIZATION_REQUEST_KEY];

            if (Number.isInteger(postId) && pendingPayload) {
              const rawName = await ensureBlogPostRawName(postId);
              await persistBlogLocalizations(rawName, pendingPayload);
            }
            return response;
          },
        },
      },
      list: {
        search: ['title', 'excerpt'],
        display: [
          'title',
          'excerpt',
          'bannerImagePath',
          'publishedAt',
          'isVisible',
          'createdAt',
          'updatedAt',
        ],
      },
    },

    Service: {
      toString: (item) => `${item.rawName}`,
      edit: {
        display: ['rawName', 'isVisible', 'sortOrder', 'imagePath'],
        fields: {
          rawName: {
            validate: compose(
              slugFormat('Системное имя (rawName)'),
              maxLength('Системное имя (rawName)', 100),
            ),
          },
          sortOrder: {
            validate: nonNegativeInt('Порядок сортировки'),
          },
          createdAt: { disabled: true },
          updatedAt: { disabled: true },
        },
        hooks: {
          async afterDb(response) {
            const rawName = (response as RawNameResponse)?.rawName;
            if (typeof rawName === "string" && rawName) {
              await saveLocalizations(rawName, 'Service');
            }
            return response;
          },
        },
      },
      list: {
        search: ['rawName'],
        display: [
          'rawName',
          'isVisible',
          'sortOrder',
          'imagePath',
          'createdAt',
          'updatedAt',
        ],
      },
    },

    ServiceFeature: {
      title: "Функции услуг",
      icon: "SquaresPlusIcon",
      toString: (item) => `${item.rawName}`,
      edit: {
        display: ['service', 'rawName', 'sortOrder', 'createdAt', 'updatedAt'],
        fields: {
          service: {
            validate: required('Услуга'),
          },
          rawName: {
            validate: compose(
              slugFormat('Системное имя (rawName)'),
              maxLength('Системное имя (rawName)', 100),
            ),
          },
          sortOrder: {
            validate: nonNegativeInt('Порядок сортировки'),
          },
          createdAt: { disabled: true },
          updatedAt: { disabled: true },
        },
        hooks: {
          async afterDb(response) {
            const rawName = (response as RawNameResponse)?.rawName;
            if (typeof rawName === "string" && rawName) {
              await saveLocalizations(rawName, 'ServiceFeature');
            }
            return response;
          },
        },
      },
      list: {
        search: ['rawName'],
        display: ['service', 'rawName', 'sortOrder', 'createdAt', 'updatedAt'],
        fields: {
          service: {
            formatter: (value: { rawName?: string; id: number } | null) => {
              if (!value) return '—';
              return value.rawName || `Service #${value.id}`;
            },
          },
        },
      },
    },

    User: {
      toString: (item) => `${item.fullname} (${item.email})`,
      aliases: {
        pwdhash: "Пароль",
      },
      edit: {
        display: ['fullname', 'email', 'pwdhash', 'isStaff', 'createdAt', 'updatedAt'],
        fields: {
          fullname: {
            validate: compose(
              required('Полное имя'),
              minLength('Полное имя', 2),
              maxLength('Полное имя', 200),
            ),
          },
          email: {
            validate: compose(
              required('Email'),
              emailFormat('Email'),
              maxLength('Email', 255),
            ),
          },
          pwdhash: {
            format: 'password',
            helperText: 'Оставьте пустым при редактировании, чтобы не менять пароль',
            handler: {
              get: () => '',
            },
            validate: (value) => {
              if (value === null || value === undefined || String(value).trim() === '') {
                return true;
              }
              if (String(value).length < 8) {
                return 'Пароль должен быть не короче 8 символов';
              }
              return true;
            },
          },
          createdAt: { disabled: true },
          updatedAt: { disabled: true },
        },
        hooks: {
          async beforeDb(data, mode) {
            const payload = data as { pwdhash?: string | null };
            const password = payload.pwdhash ? String(payload.pwdhash).trim() : '';

            if (mode === 'create' && !password) {
              throw new HookError(400, { error: 'Пароль обязателен при создании пользователя' });
            }

            if (!password) {
              delete payload.pwdhash;
              return data;
            }

            payload.pwdhash = await bcrypt.hash(password, 10);
            return data;
          },
        },
      },
      list: {
        search: ['fullname', 'email'],
        display: ['fullname', 'email', 'isStaff', 'createdAt', 'updatedAt'],
      },
    },

    RefTable: {
      toString: (item) => `${item.name}`,
      edit: {
        display: ["name", "content", "updatedAt"],
        fields: {
          name: {
            validate: compose(
              slugFormat("Имя таблицы (name)"),
              maxLength("Имя таблицы (name)", 100)
            ),
          },
          content: {
            validate: (value: unknown) => {
              if (value === null || value === undefined || String(value).trim() === "")
                return "Поле «Содержимое» обязательно для заполнения";
              try {
                if (typeof value === "string") JSON.parse(value);
              } catch {
                return "Поле «Содержимое» должно быть валидным JSON";
              }
              return true;
            },
          },
          updatedAt: { disabled: true },
        },
        hooks: {
          async beforeDb(data, mode, request) {
            const payload = data as RefTableBeforeDbPayload;
            let name: string | undefined;

            if (typeof payload.name === "string" && payload.name.trim()) {
              name = payload.name.trim();
            } else if (mode === "edit" && request.url) {
              const pathname = new URL(request.url, "http://localhost").pathname;
              const segments = pathname.split("/").filter(Boolean);
              const refTableIdx = segments.indexOf("RefTable");
              if (refTableIdx >= 0 && segments[refTableIdx + 1]) {
                name = decodeURIComponent(segments[refTableIdx + 1]);
              }
            }

            const content = payload.content;

            if (name && content && schemaMap[name]) {
              let parsed: unknown;
              try {
                parsed = typeof content === "string" ? JSON.parse(content) : content;
              } catch {
                throw new HookError(400, { error: "Поле «Содержимое» содержит невалидный JSON" });
              }

              const result = validateJsonBySchema(parsed, schemaMap[name], "Содержимое");
              if (result !== true) {
                throw new HookError(400, { error: result });
              }
            }

            return data;
          },
        },
      },
      list: {
        search: ["name"],
        display: ["name", "updatedAt"],
      },
    },
    Localization: {
      edit: {
        display: ['localeCode', 'section', 'rawName', 'content', 'updatedAt'],
        fields: {
          section: {
            validate: compose(
              slugFormat('Имя таблицы (name)'),
              maxLength('Имя таблицы (name)', 64),
            ),
          },
          rawName: {
            validate: compose(
              slugFormat('Имя таблицы (name)'),
              maxLength('Имя таблицы (name)', 100),
            ),
          },
          updatedAt: { disabled: true },
        },
      },
      list: {
        display: ['localeCode', 'section', 'rawName', 'createdAt', 'updatedAt'],
        search: ['section', 'rawName'],
        filters: [
          {
            name: 'contact',
            active: true,
            value: {
              section: {
                equals: 'ContactSection',
              },
            },
          },
          {
            name: 'team',
            active: false,
            value: {
              section: {
                equals: 'team_filters',
              },
            },
          },
        ],
      },
    },
    AdminAuditLog: {
      toString: (item) => `${item.event} — ${item.email ?? "unknown"} (${item.source})`,
      permissions: [],
      aliases: {
        id: "ID",
        createdAt: "Дата",
        event: "Событие",
        email: "Email",
        source: "Источник",
      },
      list: {
        display: ["id", "createdAt", "event", "email", "source"],
        search: ["event", "email", "source"],
        defaultSort: { field: "createdAt", direction: "desc" },
        filters: [
          {
            name: "login_success",
            active: false,
            value: {
              event: {
                equals: "login_success",
              },
            },
          },
          {
            name: "login_failed",
            active: false,
            value: {
              event: {
                equals: "login_failed",
              },
            },
          },
          {
            name: "login_blocked",
            active: false,
            value: {
              event: {
                equals: "login_blocked",
              },
            },
          },
          {
            name: "admin_create",
            active: false,
            value: {
              event: {
                startsWith: "admin_create:",
              },
            },
          },
          {
            name: "admin_update",
            active: false,
            value: {
              event: {
                startsWith: "admin_update:",
              },
            },
          },
          {
            name: "admin_delete",
            active: false,
            value: {
              event: {
                startsWith: "admin_delete:",
              },
            },
          },
        ],
      },
    },
  },
};
