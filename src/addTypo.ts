const typoTypes = [
  /** Switching two adjacent letters */
  'TRANSPOSITION',
  /** Removing a letter */
  'OMISSION',
  /** Copying an adjacent letter */
  'DOUBLING',
  /** Replacing a letter */
  'SUBSTITUTION',
  /** Swapping letter case */
  'CAPITALIZATION',
] as const;

export const addTypo = (s: string): string => {
  const typoType = typoTypes[Math.floor(Math.random() * typoTypes.length)]!;

  const randomIndex = Math.floor(Math.random() * s.length);
  switch (typoType) {
    case 'TRANSPOSITION': {
      if (s.length < 2) {
        return s;
      }
      if (randomIndex === s.length - 1) {
        return s.slice(0, -2) + s[s.length - 1] + s[s.length - 2];
      }
      return s.slice(0, randomIndex) + s[randomIndex + 1] + s[randomIndex] + s.slice(randomIndex + 2);
    }
    case 'OMISSION': {
      return s.slice(0, randomIndex) + s.slice(randomIndex + 1);
    }
    case 'DOUBLING': {
      return s.slice(0, randomIndex) + s[randomIndex] + s.slice(randomIndex);
    }
    case 'SUBSTITUTION': {
      return s.slice(0, randomIndex) + getSubstitution(s[randomIndex]!) + s.slice(randomIndex + 1);
    }
    case 'CAPITALIZATION': {
      const letter = s[randomIndex]!;
      const flippedCapitalization = letter === letter.toUpperCase() ? letter.toLowerCase() : letter.toUpperCase();
      return s.slice(0, randomIndex) + flippedCapitalization + s.slice(randomIndex + 1);
    }
    default: {
      throw new Error(`Unknown ${typoType satisfies never}`);
    }
  }
};

const commonLetterSubstitutions: Record<string, string> = {
  q: '12wa',
  w: '3eqr',
  e: '4wrd',
  r: '5tef',
  t: '6ygr',
  y: '7uhj',
  u: '8ijk',
  i: '9olm',
  o: '0pk',
  p: 'lo[',
  '[': 'p;',
  ']': ';\'',
  '\\': '\'',
  a: 'qzs',
  s: 'wedxz',
  d: 'rfcxs',
  f: 'rvgtc',
  g: 'tfbv',
  h: 'ygbn',
  j: 'uikmn',
  k: 'iolm,',
  l: 'op;,.',
  ';': 'lk/',
  '\'': ']\\',
  z: 'asx',
  x: 'zsdc',
  c: 'xdfv',
  v: 'cfgb',
  b: 'vghn',
  n: 'hjm,',
  m: 'jkn,',
  ',': 'km?',
  1: '2q!',
  2: '3wq@',
  3: '4er#',
  4: '5t$',
  5: '6y%',
  6: '7ui^',
  7: '8yo&',
  8: '9i(*',
  9: '0o)',
  0: 'p-_',
  '-': '0=+',
  '=': '-',
};

const getSubstitution = (letter: string): string => {
  if (letter.length !== 1) {
    throw new Error(`Expected single letter input, but got input of length ${letter.length}`);
  }

  const lookup = commonLetterSubstitutions[letter];
  if (lookup) {
    return lookup[Math.floor(Math.random() * lookup.length)]!;
  }

  const allKeys = Object.keys(commonLetterSubstitutions);
  return allKeys[Math.floor(Math.random() * allKeys.length)]!;
};
