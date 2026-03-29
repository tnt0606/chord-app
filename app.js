const chordData = {
  C: { frets:[0,0,0,3], position:0, text:'C' },
  G: { frets:[0,2,3,2], position:0, text:'G' },
  Am: { frets:[2,0,0,0], position:0, text:'Am' },
  F: { frets:[2,0,1,0], position:0, text:'F' },
  Dm: { frets:[2,2,1,0], position:0, text:'Dm' },
  Em: { frets:[0,4,3,2], position:0, text:'Em' },
  D7: { frets:[2,2,0,2], position:0, text:'D7' }
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

  // 4 strings / 4 frets視覚化
  for (let fret = 0; fret < 4; fret++) {
    const row = document.createElement('div');
    row.className = 'fret-row';
    row.style.height = '24px';
    for (let string = 0; string < 4; string++) {
      const cell = document.createElement('div');
      cell.className = `grid-cell string-${string}`;
      const isFinger = chord.frets[string] === fret + 1;
      if (isFinger) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.style.left = `${(string * 25) + 12.5}%`;
        dot.style.top = `${fret * 25 + 12.5}%`;
        row.appendChild(dot);
      }
      row.appendChild(cell);
    }
    diagram.appendChild(row);
  }

  const info = document.createElement('div');
  info.className = 'open-closed';
  const details = chord.frets.map((f, i) => `${['G','C','E','A'][i]}:${f===0?'O':f==='x'?'✕':f}`).join(' ');
  info.textContent = details;

  card.appendChild(diagram);
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
