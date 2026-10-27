import { FeatureKey, FeatureRule } from './featureTypes';
import { isNewYear } from './conditions';

export const featureRegistry: Record<FeatureKey, FeatureRule> = {
  snowfall: ({ now }) => isNewYear(now),
  newYearLogo: ({ now }) => isNewYear(now),
};

export function isFeatureEnabled(key: FeatureKey): boolean {
  const rule = featureRegistry[key];
  if (!rule) return false;

  return rule({ now: new Date() });
}