// ウクレレコード検証スクリプト: G-C-E-A チューニング
const openStrings = [7, 0, 4, 9]; // G=7, C=0, E=4, A=9
const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const INTERVALS = {
  '':    [0, 4, 7],
  'm':   [0, 3, 7],
  '7':   [0, 4, 7, 10],
  'maj7':[0, 4, 7, 11],
  'm7':  [0, 3, 7, 10],
  'sus2':[0, 2, 7],
  'sus4':[0, 5, 7],
};
const ROOT_TO_IDX = {
  'C':0,'C#/Db':1,'D':2,'D#/Eb':3,'E':4,
  'F':5,'F#/Gb':6,'G':7,'G#/Ab':8,'A':9,'A#/Bb':10,'B':11
};

const chords = {
  'C':     { '':   [0,0,0,3], 'm':  [0,3,3,3], '7':  [0,0,0,1], 'maj7':[0,0,0,2], 'm7': [0,0,0,0], 'sus2':[0,2,3,0], 'sus4':[0,0,1,3] },
  'C#/Db': { '':   [1,1,1,4], 'm':  [1,4,4,4], '7':  [1,1,1,2], 'maj7':[1,1,1,3], 'm7': [1,1,1,1], 'sus2':[1,3,4,1], 'sus4':[1,1,2,4] },
  'D':     { '':   [2,2,2,0], 'm':  [2,2,1,0], '7':  [2,2,0,2], 'maj7':[2,2,2,1], 'm7': [2,2,1,3], 'sus2':[2,2,0,0], 'sus4':[0,2,3,0] },
  'D#/Eb': { '':   [3,3,3,1], 'm':  [3,3,2,1], '7':  [3,3,1,3], 'maj7':[3,3,3,2], 'm7': [1,1,1,1], 'sus2':[3,3,1,1], 'sus4':[1,3,4,1] },
  'E':     { '':   [4,4,0,2], 'm':  [0,4,3,2], '7':  [1,2,0,2], 'maj7':[1,4,1,2], 'm7': [0,2,0,0], 'sus2':[2,4,4,2], 'sus4':[2,4,4,4] },
  'F':     { '':   [2,0,1,0], 'm':  [1,3,3,1], '7':  [2,3,1,3], 'maj7':[2,0,1,3], 'm7': [1,3,1,1], 'sus2':[3,0,1,1], 'sus4':[3,0,3,0] },
  'F#/Gb': { '':   [3,1,2,1], 'm':  [2,4,4,2], '7':  [3,4,2,4], 'maj7':[3,1,2,4], 'm7': [2,4,2,2], 'sus2':[4,1,2,2], 'sus4':[4,1,4,1] },
  'G':     { '':   [0,2,3,2], 'm':  [3,5,3,3], '7':  [0,2,3,1], 'maj7':[0,2,3,0], 'm7': [3,5,3,5], 'sus2':[0,2,3,0], 'sus4':[0,2,3,3] },
  'G#/Ab': { '':   [1,3,4,3], 'm':  [4,6,4,4], '7':  [1,3,4,2], 'maj7':[1,3,4,1], 'm7': [4,3,3,3], 'sus2':[1,3,4,1], 'sus4':[1,3,4,4] },
  'A':     { '':   [2,1,0,0], 'm':  [2,0,0,0], '7':  [0,1,0,0], 'maj7':[1,1,0,0], 'm7': [0,0,0,0], 'sus2':[2,4,5,0], 'sus4':[2,2,0,0] },
  'A#/Bb': { '':   [3,2,1,1], 'm':  [3,1,1,1], '7':  [1,2,1,1], 'maj7':[2,2,1,1], 'm7': [1,1,1,1], 'sus2':[3,5,0,1], 'sus4':[3,3,1,1] },
  'B':     { '':   [4,3,2,2], 'm':  [4,2,2,2], '7':  [2,3,2,2], 'maj7':[3,3,2,2], 'm7': [2,2,2,2], 'sus2':[4,1,2,2], 'sus4':[4,4,2,2] },
};

let errors = [], ok = [];

for (const [root, types] of Object.entries(chords)) {
  const ri = ROOT_TO_IDX[root];
  for (const [type, frets] of Object.entries(types)) {
    const expected = new Set(INTERVALS[type].map(i => (ri + i) % 12));
    const actual   = new Set(frets.map((f, s) => (openStrings[s] + f) % 12));
    const missing  = [...expected].filter(n => !actual.has(n));
    const extra    = [...actual].filter(n => !expected.has(n));
    const label    = root + (type || '(maj)');
    if (missing.length || extra.length) {
      errors.push({ label, frets, exp: [...expected].map(n => NOTES[n]).join(','), act: [...actual].map(n => NOTES[n]).join(','), missing: missing.map(n => NOTES[n]), extra: extra.map(n => NOTES[n]) });
    } else {
      ok.push(label);
    }
  }
}

console.log(`OK: ${ok.length} コード`);
console.log(`NG: ${errors.length} コード\n`);
for (const e of errors) {
  console.log(`[${e.label}]  フレット: [${e.frets}]`);
  console.log(`  期待: ${e.exp}   実際: ${e.act}`);
  if (e.missing.length) console.log(`  不足音: ${e.missing.join(', ')}`);
  if (e.extra.length)   console.log(`  余分音: ${e.extra.join(', ')}`);
  console.log('');
}
