// src/components/Game.tsx
import React, { useState } from 'react';
import Board from './Board';

const Game: React.FC = () => {
  const [squares, setSquares] = useState<(string | null)[]>(Array(64).fill(null));
  const [isNextBlack, setIsNextBlack] = useState(true);

  const handleClick = (i: number) => {
    const squaresCopy = squares.slice();
    if (squaresCopy[i]) return; // 既に石が置かれている場合は無視
    squaresCopy[i] = isNextBlack ? 'B' : 'W';
    setSquares(squaresCopy);
    setIsNextBlack(!isNextBlack);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onClick={handleClick} />
      </div>
    </div>
  );
};

export default Game;
