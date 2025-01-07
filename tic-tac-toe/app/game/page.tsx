'use client';

import React, { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Typy dla gry
type Player = 'X' | 'O';
type Cell = Player | null;

const SIZE = 3; // Rozmiar planszy

const GamePage: React.FC = () => {
  // Stan gry
  const [board, setBoard] = useState<Cell[][]>(
    Array(SIZE).fill(null).map(() => Array(SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [moves, setMoves] = useState({ X: 0, O: 0 });
  const [freeCells, setFreeCells] = useState(SIZE * SIZE);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Konfiguracja wyglądu
  const [cellColor, setCellColor] = useState<string>('#ffffff'); 
  const [xColor, setXColor] = useState<string>('#ef4444'); 
  const [oColor, setOColor] = useState<string>('#3b82f6'); 
  const [borderColor, setBorderColor] = useState<string>('#1e293b'); 
  const [cellSize, setCellSize] = useState<number>(64); 
  const [fontSize, setFontSize] = useState<number>(24); 

  const router = useRouter();

  // Sprawdzanie logowania
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleClick = (row: number, col: number) => {
    if (board[row][col] || winner) return;

    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    const newMoves = { ...moves };
    newMoves[currentPlayer]++;
    setMoves(newMoves);

    setFreeCells(freeCells - 1);

    if (checkWinner(newBoard, currentPlayer)) {
      setWinner(`Wygrywa ${currentPlayer}!`);
    } else if (freeCells - 1 === 0) {
      setWinner('Remis!');
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const checkWinner = (board: Cell[][], player: Player): boolean => {
    const lines = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];
    return lines.some((line) =>
      line.every(([r, c]) => board[r][c] === player)
    );
  };

  // Reset gry
  const resetGame = () => {
    setBoard(Array(SIZE).fill(null).map(() => Array(SIZE).fill(null)));
    setCurrentPlayer('X');
    setWinner(null);
    setMoves({ X: 0, O: 0 });
    setFreeCells(SIZE * SIZE);
  };

  // Zapis gry
  const saveGame = async () => {
    if (!userEmail) return alert('Musisz być zalogowany!');
    const flattenedBoard = board.flat();
    await setDoc(doc(db, 'games', userEmail), {
      board: flattenedBoard,
      currentPlayer,
      winner,
    });
    alert('Gra zapisana!');
  };

  // Wczytanie gry
  const loadGame = async () => {
    const docSnap = await getDoc(doc(db, 'games', userEmail!));
    if (docSnap.exists()) {
      const data = docSnap.data();
      const restoredBoard: Cell[][] = [];
      for (let i = 0; i < SIZE; i++) {
        restoredBoard.push(data.board.slice(i * SIZE, (i + 1) * SIZE));
      }
      setBoard(restoredBoard);
      setCurrentPlayer(data.currentPlayer);
      setWinner(data.winner);
    } else {
      alert('Brak zapisanej gry!');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      {/* Informacje o użytkowniku */}
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        {userEmail && (
          <p className="text-white">Zalogowano jako: <span className="font-bold">{userEmail}</span></p>
        )}
        <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded">Wyloguj</button>
      </div>

      {/* Stan gry */}
      <h1 className="text-4xl font-bold mb-6 text-white">Tic Tac Toe</h1>
      <p className="text-lg text-white mb-4">Ruchy X: {moves.X} | Ruchy O: {moves.O}</p>
      <p className="text-lg text-white mb-4">Wolne pola: {freeCells}</p>
      {winner && <p className="text-2xl font-bold text-green-500 mb-4">{winner}</p>}

      {/* Plansza gry */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleClick(rowIndex, colIndex)}
              className="flex items-center justify-center border cursor-pointer"
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: cellColor,
                color: cell === 'X' ? xColor : oColor,
                fontSize: `${fontSize}px`,
                borderColor: borderColor,
              }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <div className="flex space-x-4 mt-4">
        <input type="color" value={cellColor} onChange={(e) => setCellColor(e.target.value)} />
        <input type="color" value={xColor} onChange={(e) => setXColor(e.target.value)} />
        <input type="color" value={oColor} onChange={(e) => setOColor(e.target.value)} />
      </div>
      <div className="flex space-x-4 mt-4">
        <button onClick={saveGame} className="bg-blue-500 text-white py-2 px-4 rounded">Zapisz</button>
        <button onClick={loadGame} className="bg-green-500 text-white py-2 px-4 rounded">Wczytaj</button>
        <button onClick={resetGame} className="bg-yellow-500 text-white py-2 px-4 rounded">Reset</button>
      </div>
    </main>
  );
};

export default GamePage;
