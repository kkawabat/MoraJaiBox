export function generateBoard() {
  return Array(9).fill().map(() => Array(9).fill(''));
}

export function renderBoard(board) {
  const container = document.getElementById('game-board');
  container.innerHTML = '';
  // Render logic here
}