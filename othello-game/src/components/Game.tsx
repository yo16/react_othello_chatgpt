// src/components/Game.tsx
import React, { useState } from 'react';
import Board from './Board';
import './Game.css'; // 必要に応じてCSSファイルをインポート

const Game: React.FC = () => {
    const initialSquares = () => {
        const squares = Array(64).fill(null);
        squares[27] = 'W';
        squares[28] = 'B';
        squares[35] = 'B';
        squares[36] = 'W';
        return squares;
    };

    const [squares, setSquares] = useState<(string | null)[]>(initialSquares());
    const [isNextBlack, setIsNextBlack] = useState(true);

    const directions = [-1, 1, -8, 8, -7, 7, -9, 9];

    const handleClick = (i: number) => {
        if (!isValidMove(i)) return;
        const squaresCopy = squares.slice();
        squaresCopy[i] = isNextBlack ? 'B' : 'W';
        flipStones(i, squaresCopy);
        setSquares(squaresCopy);
        setIsNextBlack(!isNextBlack);
    };

    const isValidMove = (i: number): boolean => {
        if (squares[i]) return false; // 既に石が置かれている場合は無効

        const currentPlayer = isNextBlack ? 'B' : 'W';
        const opponentPlayer = isNextBlack ? 'W' : 'B';

        const row = Math.floor(i / 8);
        const col = i % 8;

        for (let direction of directions) {
            let x = col;
            let y = row;
            let hasOpponentBetween = false;

            while (true) {
                x += direction % 8;
                y += Math.sign(direction) * Math.floor(Math.abs(direction) / 8);

                // 行をまたぐ移動を防ぐチェック
                if (x < 0 || x >= 8 || y < 0 || y >= 8) break;
                if (direction === -1 && Math.floor((i - 1) / 8) !== row) break;
                if (direction === 1 && Math.floor((i + 1) / 8) !== row) break;

                const nextIndex = y * 8 + x;

                // 次の位置に相手の石がある場合
                if (squares[nextIndex] === opponentPlayer) {
                    hasOpponentBetween = true;
                } else if (squares[nextIndex] === currentPlayer) {
                    if (hasOpponentBetween) {
                        return true;
                    }
                    break;
                } else {
                    break;
                }
            }
        }

        return false;
    };

    const flipStones = (i: number, squares: (string | null)[]): void => {
        const currentPlayer = isNextBlack ? 'B' : 'W';
        const opponentPlayer = isNextBlack ? 'W' : 'B';

        const row = Math.floor(i / 8);
        const col = i % 8;

        for (let direction of directions) {
            let x = col;
            let y = row;
            const stonesToFlip: number[] = [];

            while (true) {
                x += direction % 8;
                y += Math.sign(direction) * Math.floor(Math.abs(direction) / 8);

                // 行をまたぐ移動を防ぐチェック
                if (x < 0 || x >= 8 || y < 0 || y >= 8) break;
                if (direction === -1 && Math.floor((i - 1) / 8) !== row) break;
                if (direction === 1 && Math.floor((i + 1) / 8) !== row) break;

                const nextIndex = y * 8 + x;

                // 次の位置に相手の石がある場合、反転候補リストに追加
                if (squares[nextIndex] === opponentPlayer) {
                    stonesToFlip.push(nextIndex);
                } else if (squares[nextIndex] === currentPlayer) {
                    for (const flipIndex of stonesToFlip) {
                        squares[flipIndex] = currentPlayer;
                    }
                    break;
                } else {
                    break;
                }
            }
        }
    };

    const resetGame = () => {
        setSquares(initialSquares());
        setIsNextBlack(true);
    };

    return (
        <div className="game">
            <div className="game-board">
                <Board squares={squares} onClick={handleClick} />
            </div>
            <button className="reset-button" onClick={resetGame}>リセット</button>
        </div>
    );
};

export default Game;
