// src/components/Game.tsx
import React, { useState } from 'react';
import Board from './Board';

const Game: React.FC = () => {
  const [squares, setSquares] = useState<(string | null)[]>(Array(64).fill(null));
  const [isNextBlack, setIsNextBlack] = useState(true);

  const handleClick = (i: number) => {
    if (!isValidMove(i)) return;
    const squaresCopy = squares.slice();
    squaresCopy[i] = isNextBlack ? 'B' : 'W';
    flipStones(i, squaresCopy);
    setSquares(squaresCopy);
    setIsNextBlack(!isNextBlack);
  };
  
  const isValidMove = (i: number): boolean => {
    // 有効な動きかどうかを判断するロジックを追加
    return !squares[i];     // 既に石が置かれている場合は無視
  };

  const flipStones = (i: number, squares: (string | null)[]): void => {
    // 石を反転させるロジックを追加
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
