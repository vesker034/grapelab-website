export function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeQuery(query: string): string[] {
  return normalizeForSearch(query)
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

function splitIntoWords(text: string): string[] {
  return text.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

function maxEditDistance(token: string): number {
  if (token.length <= 2) {
    return 0;
  }

  if (token.length <= 4) {
    return 1;
  }

  return 2;
}

function levenshtein(a: string, b: string): number {
  if (a === b) {
    return 0;
  }

  if (a.length === 0) {
    return b.length;
  }

  if (b.length === 0) {
    return a.length;
  }

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

  for (let i = 0; i < rows; i += 1) {
    matrix[i][0] = i;
  }

  for (let j = 0; j < cols; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function tokenMatchesInText(token: string, text: string): boolean {
  if (!token) {
    return true;
  }

  if (text.includes(token)) {
    return true;
  }

  const words = splitIntoWords(text);
  const allowedDistance = maxEditDistance(token);

  for (const word of words) {
    if (word.startsWith(token)) {
      return true;
    }

    if (allowedDistance === 0) {
      continue;
    }

    if (levenshtein(token, word) <= allowedDistance) {
      return true;
    }

    const compareLength = Math.min(word.length, token.length);
    if (compareLength >= 3 && levenshtein(token, word.slice(0, compareLength)) <= allowedDistance) {
      return true;
    }
  }

  return false;
}

export function matchesPartialSearch(text: string, query: string): boolean {
  const tokens = tokenizeQuery(query);

  if (tokens.length === 0) {
    return true;
  }

  const normalizedText = normalizeForSearch(text);
  return tokens.every((token) => tokenMatchesInText(token, normalizedText));
}

export function matchesSearchInFields(
  query: string,
  fields: Array<string | undefined | null>
): boolean {
  const searchableText = fields
    .filter((field): field is string => Boolean(field))
    .map(normalizeForSearch)
    .join(" ");

  return matchesPartialSearch(searchableText, query);
}
