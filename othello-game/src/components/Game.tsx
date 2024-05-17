// src/components/Game.tsx
import React, { useState } from 'react';
import Board from './Board';

import "./Game.css";

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

    const directions = [
        -1, 1, -8, 8, -9, 9, -7, 7 // 左、右、上、下、左上、右下、右上、左下
    ];

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
        const opponentPlayer  = isNextBlack ? 'W' : 'B';

        for (let direction of directions) {
            let x = i % 8;
            let y = Math.floor(i / 8);
            let hasOpponentBetween = false;
            
            while (true) {
                // 現在の位置を更新
                x += direction % 8;
                y += Math.floor(direction / 8);
                
                // ボードの範囲外に出た場合はループを終了
                if (x < 0 || x >= 8 || y < 0 || y >= 8) break;
                
                // 次のインデックスを計算
                const nextIndex = y * 8 + x;
            
                // 次の位置に相手の石がある場合
                if (squares[nextIndex] === opponentPlayer) {
                    hasOpponentBetween = true;
                }
                // 次の位置に現在のプレイヤーの石がある場合
                else if (squares[nextIndex] === currentPlayer) {
                    // 相手の石が間にあった場合は有効な動きとする
                    if (hasOpponentBetween) {
                        return true;
                    }
                    break;
                }
                // 空のマスがある場合や範囲外の場合はループを終了
                else {
                    break;
                }
            }
        }

        return false;
    };

    const flipStones = (i: number, squares: (string | null)[]): void => {
        const currentPlayer = isNextBlack ? 'B' : 'W';
        const opponentPlayer = isNextBlack ? 'W' : 'B';

        for (let direction of directions) {
            let x = i % 8;
            let y = Math.floor(i / 8);
            const stonesToFlip: number[] = [];

            while (true) {
                // 現在の位置を更新
                x += direction % 8;
                y += Math.floor(direction / 8);

                // ボードの範囲外に出た場合はループを終了
                if (x < 0 || x >= 8 || y < 0 || y >= 8) break;

                // 次のインデックスを計算
                const nextIndex = y * 8 + x;

                // 次の位置に相手の石がある場合、反転候補リストに追加
                if (squares[nextIndex] === opponentPlayer) {
                    stonesToFlip.push(nextIndex);
                }
                // 次の位置に現在のプレイヤーの石がある場合
                else if (squares[nextIndex] === currentPlayer) {
                    // 間に相手の石がある場合、反転を実行
                    for (const flipIndex of stonesToFlip) {
                        squares[flipIndex] = currentPlayer;
                    }
                    break;
                }
                // 空のマスがある場合や範囲外の場合はループを終了
                else {
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
