export type FeatureKey = 'snowfall' | 'newYearLogo';

/*
Фичи нужны для появляющихся на сайте временных эффектов или изменений в дизайне,
например, снежинки на Новый Год или изменение логотипа на праздничный.
*/

export interface FeatureContext {
  now: Date;
}

export type FeatureRule = (ctx: FeatureContext) => boolean;
