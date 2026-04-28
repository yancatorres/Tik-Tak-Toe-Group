const WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let state = {
  board: Array(9).fill(null),
  current: 'X',
  scores: { X: 0, O: 0, draw: 0 },
  over: false,
  names: { X: 'Player X', O: 'Player O' }
};

const $ = id => document.getElementById(id);

function buildBoard() {
  const board = $('board');
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.i = i;
    cell.addEventListener('click', () => onCellClick(i));
    board.appendChild(cell);
  }
}

function renderBoard(winCells = []) {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, i) => {
    const val = state.board[i];
    cell.className = 'cell' + (val ? ' taken ' + val.toLowerCase() + '-cell' : '');
    if (winCells.includes(i)) cell.classList.add('win-cell');
    if (val === 'X') {
      cell.innerHTML = `<svg viewBox="0 0 60 60"><line class="x-mark" x1="12" y1="12" x2="48" y2="48"/><line class="x-mark" x1="48" y1="12" x2="12" y2="48"/></svg>`;
    } else if (val === 'O') {
      cell.innerHTML = `<svg viewBox="0 0 60 60"><circle class="o-mark" cx="30" cy="30" r="18"/></svg>`;
    } else {
      cell.innerHTML = '';
    }
  });
}

function updateStatus(winCells = null) {
  const bar = $('statusBar');
  const cur = state.current;

  if (winCells) {
    const winner = state.board[winCells[0]];
    bar.className = 'status-bar win';
    bar.textContent = `${state.names[winner]} won! 🏆`;
  } else if (state.over) {
    bar.className = 'status-bar draw';
    bar.textContent = 'It\'s a draw! Good game.';
  } else {
    bar.className = 'status-bar turn-' + cur.toLowerCase();
    bar.textContent = `It's your turn ${state.names[cur]} (${cur})`;
  }

  $('cardX').classList.toggle('active-player', !state.over && cur === 'X');
  $('cardO').classList.toggle('active-player', !state.over && cur === 'O');
}

function updateScores() {
  $('scoreX').textContent = state.scores.X;
  $('scoreO').textContent = state.scores.O;
  $('scoreDraw').textContent = state.scores.draw;
}

function checkWin() {
  for (const combo of WINS) {
    const [a, b, c] = combo;
    if (state.board[a] && state.board[a] === state.board[b] && state.board[a] === state.board[c]) {
      return combo;
    }
  }
  return null;
}

function onCellClick(i) {
  if (state.over || state.board[i]) return;
  state.board[i] = state.current;

  const win = checkWin();
  if (win) {
    state.scores[state.current]++;
    state.over = true;
    renderBoard(win);
    updateStatus(win);
    updateScores();
  } else if (state.board.every(Boolean)) {
    state.scores.draw++;
    state.over = true;
    renderBoard();
    updateStatus();
    updateScores();
  } else {
    state.current = state.current === 'X' ? 'O' : 'X';
    renderBoard();
    updateStatus();
  }
}

function resetGame() {
  state.board = Array(9).fill(null);
  state.current = 'X';
  state.over = false;
  renderBoard();
  updateStatus();
}

$('startBtn').addEventListener('click', () => {
  const p1 = $('p1name').value.trim() || 'Player X';
  const p2 = $('p2name').value.trim() || 'Player O';
  state.names = { X: p1, O: p2 };
  state.scores = { X: 0, O: 0, draw: 0 };

  $('nameX').textContent = p1;
  $('nameO').textContent = p2;

  $('setupScreen').style.display = 'none';
  $('gameScreen').classList.add('active');

  buildBoard();
  resetGame();
  updateScores();
});

$('p1name').addEventListener('keydown', e => { if (e.key === 'Enter') $('p2name').focus(); });
$('p2name').addEventListener('keydown', e => { if (e.key === 'Enter') $('startBtn').click(); });

$('resetBtn').addEventListener('click', resetGame);

$('menuBtn').addEventListener('click', () => {
  $('gameScreen').classList.remove('active');
  $('setupScreen').style.display = 'flex';
  state.scores = { X: 0, O: 0, draw: 0 };
});