// RefTables JSON Schema

export type ContactValueType =
  | 'phone'
  | 'url'
  | 'email'
  | 'address'
  | 'other'
  | 'mapcoords'
  | 'timeinterval'
  | 'stringpair'
  | 'number';

export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONArray = JSONValue[];
export type JSONObject = { [key: string]: JSONValue };

export type JSONSchema = {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema;
  required?: string[];
  additionalProperties?: boolean;
  minItems?: number;
  maxItems?: number;
  enum?: readonly JSONPrimitive[];
  uniqueItems?: boolean;
};

export type JSONTemplate = JSONObject | JSONArray;
export type FieldConfig<
  TSchema extends JSONSchema = JSONSchema,
  TTemplate extends JSONTemplate = JSONTemplate,
> = {
  schema: TSchema;
  template: TTemplate;
};

type ContactsTemplate = {
  phone: string;
  vk: string;
  telegram: string;
  max: string;
  whatsapp: string;
  email: string;
  address: string;
  location: [number, number];
  workdays: [string, string];
  workhours: [string, string];
  dayoff?: string;
  breakhours?: [string, string];
};

type StatsEntry<T extends string> = {
  key: T;
  value: number;
};

type StatsTemplate = {
  experienceFromYear: number;
  clientCountries: number;
  specialization: Array<StatsEntry<'Backend' | 'Frontend' | 'DevOps' | 'UI/UX'>>;
  technologies: Array<StatsEntry<'JavaScript/TypeScript' | 'Python' | 'Golang' | 'C++'>>;
};

type TechstackTemplate = Array<{
  alt: string;
  image_url: string;
}>;

type CasesTemplate = Array<{
  title: string;
  category: string;
  description: string;
  image_url: string;
}>;

type LocalizedTextTemplate = {
  en: string;
  ru: string;
  ar: string;
};

type AspectsListTemplate = Array<{
  title: LocalizedTextTemplate;
  description: LocalizedTextTemplate;
}>;

export type DefinedSchemaName =
  | 'contacts'
  | 'stats'
  | 'techstack'
  | 'cases'
  | 'aspectsList'
  | 'galleryImages'
  | 'projectTechStack';

export type FieldConfigName =
  | 'aspectsList'
  | 'galleryImages'
  | 'projectTechStack'
  | 'contacts'
  | 'stats'
  | 'techstack'
  | 'cases';

const contactKeys: Record<string, ContactValueType> = {
  phone: 'phone',
  vk: 'url',
  telegram: 'url',
  max: 'url',
  whatsapp: 'url',
  email: 'email',
  address: 'address',
  location: 'mapcoords',
  workdays: 'stringpair',
  'dayoff?': 'other',
  workhours: 'timeinterval',
  'breakhours?': 'timeinterval',
};

function valueSchema(type: ContactValueType): JSONSchema {
  switch (type) {
    case 'phone':
    case 'email':
    case 'url':
    case 'address':
    case 'other':
      return { type: 'string' };
    case 'mapcoords':
      return {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      };
    case 'timeinterval':
    case 'stringpair':
      return {
        type: 'array',
        items: { type: 'string' },
        minItems: 2,
        maxItems: 2,
      };
    case 'number':
      return { type: 'number' };
  }
}

export const contacts: JSONSchema = {
  type: 'object',
  properties: Object.fromEntries(
    Object.entries(contactKeys).map(([key, type]) => [
      key.replaceAll('?', ''),
      valueSchema(type),
    ])
  ),
  required: Object.keys(contactKeys).filter((key) => !key.endsWith('?')),
  additionalProperties: false,
};

const statsKeys: Record<string, string[] | null> = {
  experienceFromYear: null,
  clientCountries: null,
  specialization: ['Backend', 'Frontend', 'DevOps', 'UI/UX'],
  technologies: ['JavaScript/TypeScript', 'Python', 'Golang', 'C++'],
};

export const stats: JSONSchema = {
  type: 'object',
  properties: Object.fromEntries(
    Object.entries(statsKeys).map(([key, nestedKeys]) => {
      if (Array.isArray(nestedKeys)) {
        return [
          key,
          {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                key: { type: 'string', enum: nestedKeys },
                value: { type: 'number' },
              },
              required: ['key', 'value'],
              additionalProperties: false,
            },
            uniqueItems: true,
          },
        ];
      } else {
        return [key, { type: 'number' }];
      }
    })
  ),
  additionalProperties: false,
};

export const techstack: JSONSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      alt: { type: 'string' },
      image_url: { type: 'string' },
    },
    required: ['alt', 'image_url'],
    additionalProperties: false,
  },
};

export const cases: JSONSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      category: { type: 'string' },
      description: { type: 'string' },
      image_url: { type: 'string' },
    },
    required: ['title', 'image_url'],
    additionalProperties: false,
  },
};

export const aspectsList: JSONSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      title: {
        type: 'object',
        properties: {
          en: { type: 'string' },
          ru: { type: 'string' },
          ar: { type: 'string' },
        },
        required: ['ru'],
        additionalProperties: false,
      },
      description: {
        type: 'object',
        properties: {
          en: { type: 'string' },
          ru: { type: 'string' },
          ar: { type: 'string' },
        },
        required: ['ru'],
        additionalProperties: false,
      },
    },
    required: ['title', 'description'],
    additionalProperties: false,
  },
};

export const definedSchemas: Record<DefinedSchemaName, JSONSchema> = {
  contacts,
  stats,
  techstack,
  cases,
  aspectsList,
  galleryImages: techstack,
  projectTechStack: techstack,
};

// ─── Шаблоны дефолтных значений ───────────────────────────────────────────────

const templates: {
  contacts: ContactsTemplate;
  stats: StatsTemplate;
  techstack: TechstackTemplate;
  cases: CasesTemplate;
  aspectsList: AspectsListTemplate;
} = {
  contacts: {
    phone: '',
    vk: '',
    telegram: '',
    max: '',
    whatsapp: '',
    email: '',
    address: '',
    location: [0, 0],
    workdays: ['Пн', 'Пт'],
    workhours: ['09:00', '18:00'],
  },
  stats: {
    experienceFromYear: 2015,
    clientCountries: 0,
    specialization: [
      { key: 'Backend', value: 0 },
      { key: 'Frontend', value: 0 },
      { key: 'DevOps', value: 0 },
      { key: 'UI/UX', value: 0 },
    ],
    technologies: [
      { key: 'JavaScript/TypeScript', value: 0 },
      { key: 'Python', value: 0 },
      { key: 'Golang', value: 0 },
      { key: 'C++', value: 0 },
    ],
  },
  techstack: [{ alt: '', image_url: '' }],
  cases: [{ title: '', category: '', description: '', image_url: '' }],
  aspectsList: [{ title: { en: '', ru: '', ar: '' }, description: { en: '', ru: '', ar: '' } }],
};

// ─── Маппинг имя поля/справочника -> { schema, template } ────────────────────
// Используется в JsonbEditor и RefTableContentEditor для автоопределения конфига.

export const fieldConfigs: Record<FieldConfigName, FieldConfig> = {
  // Поля модели Project
  aspectsList:      { schema: aspectsList,        template: templates.aspectsList },
  galleryImages:    { schema: techstack,           template: templates.techstack },
  projectTechStack: { schema: techstack,           template: templates.techstack },
  // Имена справочников RefTable (значение поля name записи)
  contacts:         { schema: contacts,            template: templates.contacts },
  stats:            { schema: stats,               template: templates.stats },
  techstack:        { schema: techstack,           template: templates.techstack },
  cases:            { schema: cases,               template: templates.cases },
};
