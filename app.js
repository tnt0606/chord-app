const chordData = {
  C: { frets:[0,0,0,3], position:0, text:'C' },
  G: { frets:[0,2,3,2], position:0, text:'G' },
  Am: { frets:[2,0,0,0], position:0, text:'Am' },
  F: { frets:[2,0,1,0], position:0, text:'F' },
  Dm: { frets:[2,2,1,0], position:0, text:'Dm' },
  Em: { frets:[0,4,3,2], position:0, text:'Em' },
  D7: { frets:[2,2,0,2], position:0, text:'D7' },
  D: { frets:[2,2,2,0], position:0, text:'D' },
  A: { frets:[2,1,0,0], position:0, text:'A' },
  E: { frets:[4,4,0,2], position:0, text:'E' },
  B: { frets:[4,4,4,2], position:0, text:'B' },
  Bm: { frets:[4,2,4,2], position:0, text:'Bm' }
};

const input = document.getElementById('chordInput');
const renderBtn = document.getElementById('renderBtn');
const clearBtn = document.getElementById('clearBtn');
const chordArea = document.getElementById('chordArea');

function makeChordCard(chordName, chord) {
  const card = document.createElement('article');
  card.className = 'chord-card';

  const title = document.createElement('h3');
  title.textContent = chordName;
  card.appendChild(title);

  const diagram = document.createElement('div');
  diagram.className = 'diagram';
  diagram.id = `chord-${chordName}-${Math.random().toString(36).substr(2, 9)}`; // unique id
  card.appendChild(diagram);

  // Chord.jsで描画
  const chordBox = new ChordBox(`#${diagram.id}`, {
    tuning: ['G', 'C', 'E', 'A'], // ウクレレのチューニング
    numFrets: 4,
    numStrings: 4,
    width: 100,
    height: 120
  });
  chordBox.draw({
    chord: chordName,
    position: chord.position,
    fingers: chord.frets
  });

  const info = document.createElement('div');
  info.className = 'open-closed';
  const details = chord.frets.map((f, i) => `${['G','C','E','A'][i]}:${f===0?'O':f==='x'?'✕':f}`).join(' ');
  info.textContent = details;

  card.appendChild(info);
  return card;
}

function renderChords() {
  chordArea.innerHTML = '';
  const raw = input.value.trim();
  if (!raw) {
    chordArea.innerHTML = '<p>コードを入力してください。</p>';
    return;
  }

  const tokens = raw.split(/[ ,]+/).filter(Boolean);
  for (const token of tokens) {
    const chordName = token.trim();
    const chord = chordData[chordName];
    if (!chord) {
      const missing = document.createElement('article');
      missing.className = 'chord-card';
      missing.innerHTML = `<h3>${chordName}</h3><p>未登録コードです。app.js の chordData に追加してください。</p>`;
      chordArea.appendChild(missing);
      continue;
    }
    chordArea.appendChild(makeChordCard(chordName, chord));
  }
}

renderBtn.addEventListener('click', renderChords);
clearBtn.addEventListener('click', () => {
  input.value = '';
  chordArea.innerHTML = '';
});

window.addEventListener('DOMContentLoaded', renderChords);
