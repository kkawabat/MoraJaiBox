import { generateBoard, renderBoard } from './board.js';

export function startGame() {
  const board = generateBoard();
  renderBoard(board);
}