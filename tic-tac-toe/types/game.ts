export type Player = 'X' | 'O';
export type Cell = Player | null;

export type GameState = {
  board: Cell[]; // Jednowymiarowa tablica
  currentPlayer: Player;
  winner: string | null;
  createdBy: string;
};
