const SECTOR_ALIASES = {
  agri: 'agri',
  agriculture: 'agri',
  const: 'const',
  construction: 'const',
  manuf: 'manuf',
  manufacturing: 'manuf',
  biz: 'biz',
  business: 'biz',
  it: 'it',
  digital: 'it',
  log: 'log',
  logistic: 'log',
  logistics: 'log'
};

export function normalizeSectorKey(value) {
  const raw = (value || '').toString().trim().toLowerCase();
  return SECTOR_ALIASES[raw] || raw;
}

export function sectorsMatch(a, b) {
  return normalizeSectorKey(a) === normalizeSectorKey(b);
}