// src/components/Board.tsx
import React from 'react';
import Square from './Square';

interface BoardProps {
  squares: (string | null)[];
  onClick: (i: number) => void;
}

const Board: React.FC<BoardProps> = ({ squares, onClick }) => {
  const renderSquare = (i: number) => {
    return <Square value={squares[i]} onClick={() => onClick(i)} />;
  };

  const boardSize = 8;
  const board = [];
  
  for (let row = 0; row < boardSize; row++) {
    const rowSquares = [];
    for (let col = 0; col < boardSize; col++) {
      rowSquares.push(renderSquare(row * boardSize + col));
    }
    board.push(<div className="board-row" key={row}>{rowSquares}</div>);
  }

  return (
    <div>
      {board}
    </div>
  );
};

export default Board;
