'use client';

import { isFeatureEnabled } from '@/features/featureRegistry';
import { Snowfall } from '@namnguyenthanhwork/react-snowfall-effect';

const snowImages = [
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTIgMjJNMiAxMkwyMiAxMk03IDE3TDE3IDdNNyA3TDE3IDE3IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyIDFMMTIgNE0xMiAyMEwxMiAyM00yMyAxMkwyMCAxMk00IDEyTDEgMTJNMTkuMDcgNC45M0wxNy42NiA2LjM0TTYuMzQgMTcuNjZMNC45MyAxOS4wN000LjkzIDQuOTNMNi4zNCA2LjM0TTE3LjY2IDE3LjY2TDE5LjA3IDE5LjA3IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K',
];

const colors = [
  '#ffffff',
  '#e6f3ff',
  '#f0ddea',
  '#ccb6d4',
  '#d1d1d1',
  '#dfdfdf',
];

export function SnowfallFeature() {
  if (!isFeatureEnabled('snowfall')) {
    return null;
  }

  return (
    <Snowfall
      colors={colors}
      opacity={{ min: 0.8, max: 1 }}
      images={snowImages}
      followMouse={true}
      snowflakeCount={100}
      fps={60}
      fadeEdges={true}
      gravity={1}
    />
  );
}
