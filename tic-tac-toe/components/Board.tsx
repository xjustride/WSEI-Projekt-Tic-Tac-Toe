'use client';

import React, { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebaseConfig'; // Firebase
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Player, Cell, GameState } from '@/types/game';

const SIZE = 3; // Rozmiar planszy

const Board: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>(
    Array(SIZE).fill(null).map(() => Array(SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string>('test-game'); // ID gry
  const [bgColor, setBgColor] = useState<string>('#1f2937');
  const [xColor, setXColor] = useState<string>('#ef4444');
  const [oColor, setOColor] = useState<string>('#3b82f6');

  // Zapis gry do Firestore
  const saveGame = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Musisz być zalogowany!');
      return;
    }

    // Spłaszczamy planszę do jednowymiarowej tablicy
    const flattenedBoard = board.flat();

    const gameData: GameState = {
        board: flattenedBoard, // Zapisujemy jako 1-wymiarowa tablica
        currentPlayer,
        winner,
        createdBy: user.uid,
      };
    
      await setDoc(doc(db, 'games', gameId), gameData); // Zapis danych
      alert('Gra została zapisana!');
    };

  // Odczyt gry z Firestore
  const loadGame = async () => {
    const docRef = doc(db, 'games', gameId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const data = docSnap.data() as GameState;
  
      const restoredBoard: Cell[][] = [];
      for (let i = 0; i < SIZE; i++) {
        restoredBoard.push(data.board.slice(i * SIZE, (i + 1) * SIZE));
      }
  
      setBoard(restoredBoard); // Aktualizujemy planszę
      setCurrentPlayer(data.currentPlayer);
      setWinner(data.winner);
    } else {
      alert('Gra nie istnieje!');
    }
  };

  const resetGame = () => {
    setBoard(Array(SIZE).fill(null).map(() => Array(SIZE).fill(null)));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const handleClick = (row: number, col: number) => {
    if (board[row][col] || winner) return;

    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(`Wygrywa ${currentPlayer}!`);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const checkWinner = (board: Cell[][], row: number, col: number, player: Player) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      count += countInDirection(board, row, col, dx, dy, player);
      count += countInDirection(board, row, col, -dx, -dy, player);

      if (count >= 3) return true;
    }
    return false;
  };

  const countInDirection = (board: Cell[][], row: number, col: number, dx: number, dy: number, player: Player) => {
    let count = 0;
    let x = row + dx;
    let y = col + dy;

    while (x >= 0 && x < SIZE && y >= 0 && y < SIZE && board[x][y] === player) {
      count++;
      x += dx;
      y += dy;
    }
    return count;
  };

  return (
    <div className="flex flex-col items-center" style={{ backgroundColor: bgColor }}>
      <h1 className="text-2xl mb-4">Tic Tac Toe</h1>
      <div className="grid grid-cols-3 gap-1">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => handleClick(i, j)}
              className="w-16 h-16 flex items-center justify-center border border-gray-400 text-2xl font-bold"
              style={{ color: cell === 'X' ? xColor : cell === 'O' ? oColor : 'inherit' }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      {winner && <p className="mt-4 text-lg">{winner}</p>}
      <div className="flex space-x-4 mt-4">
        <button onClick={saveGame} className="bg-blue-500 text-white py-2 px-4 rounded">Zapisz grę</button>
        <button onClick={loadGame} className="bg-green-500 text-white py-2 px-4 rounded">Wczytaj grę</button>
        <button onClick={resetGame} className="bg-yellow-500 text-white py-2 px-4 rounded">Resetuj grę</button>
      </div>
      <div className="flex space-x-4 mt-4">
        <div>
          <label>Kolor X:</label>
          <input type="color" value={xColor} onChange={(e) => setXColor(e.target.value)} />
        </div>
        <div>
          <label>Kolor O:</label>
          <input type="color" value={oColor} onChange={(e) => setOColor(e.target.value)} />
        </div>
        <div>
          <label>Kolor tła:</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default Board;
