import {useTranslations as useIntlTranslations} from 'next-intl';

export function useTranslations(namespace?: string) {
  const t = useIntlTranslations(namespace);

  const cleanKey = (k: string) => k.split('.').splice(0, 1).join('.')!;

  const safeT = (key: string, values?: Record<string, string | Date | number>) => {
    try {
      const res = t(key, values);

      if (res === key || res === `${namespace ? namespace + '.' : ''}${key}`) {
        return cleanKey(key);
      }
      return res;
    } catch {
      return cleanKey(key);
    }
  };

  safeT.raw = (key: string) => {
    try {
      const res = t.raw(key);

      if (res === key || res === `${namespace ? namespace + '.' : ''}${key}`) {
        return cleanKey(key);
      }
      return res;
    } catch {
      return cleanKey(key);
    }
  };

  safeT.has = (key: string) => t.has(key);

  return safeT;
}
