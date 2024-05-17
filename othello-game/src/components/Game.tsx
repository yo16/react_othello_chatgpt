import React, { useState, useEffect } from 'react';
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
    const [passCount, setPassCount] = useState(0); // パスの回数を追跡

    const addValuesByDirection = [
        { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 }, 
        { row: 0, col: -1 },                  { row: 0, col: 1 }, 
        { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
    ];

    useEffect(() => {
        if (passCount === 2) {
            const { blackCount, whiteCount } = countStones();
            const wins = (blackCount < whiteCount) ? "白の勝ち！" : (blackCount > whiteCount) ? "黒の勝ち！" : "同点！";
            alert(`ゲーム終了: 両プレイヤーとも置ける場所がありません。\n黒:${blackCount}、白:${whiteCount}\n${wins}`);
        } else if (!hasValidMove(isNextBlack ? 'B' : 'W')) {
            alert(`${isNextBlack ? 'B' : 'W'}が置ける場所がありません。スキップします。`);
            setPassCount(passCount + 1);
            setIsNextBlack(!isNextBlack);
        } else {
            setPassCount(0);
        }
    }, [isNextBlack, squares]);

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

        for (let addValue of addValuesByDirection) {
            let x = col;
            let y = row;
            let hasOpponentBetween = false;

            while (true) {
                x += addValue.col;
                y += addValue.row;

                // 行をまたぐ移動を防ぐチェック
                if (x < 0 || x >= 8 || y < 0 || y >= 8) break;

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

    const hasValidMove = (player: string): boolean => {
        for (let i = 0; i < squares.length; i++) {
            if (isValidMoveForPlayer(i, player)) {
                return true;
            }
        }
        return false;
    };

    const isValidMoveForPlayer = (i: number, player: string): boolean => {
        if (squares[i]) return false; // 既に石が置かれている場合は無効

        const opponentPlayer = player === 'B' ? 'W' : 'B';

        const row = Math.floor(i / 8);
        const col = i % 8;

        for (let addValue of addValuesByDirection) {
            let x = col;
            let y = row;
            let hasOpponentBetween = false;

            while (true) {
                x += addValue.col;
                y += addValue.row;

                // 行をまたぐ移動を防ぐチェック
                if (x < 0 || x >= 8 || y < 0 || y >= 8) break;

                const nextIndex = y * 8 + x;

                // 次の位置に相手の石がある場合
                if (squares[nextIndex] === opponentPlayer) {
                    hasOpponentBetween = true;
                } else if (squares[nextIndex] === player) {
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

        for (let addValue of addValuesByDirection) {
            let x = col;
            let y = row;
            const stonesToFlip: number[] = [];

            while (true) {
                x += addValue.col;
                y += addValue.row;

                // 行をまたぐ移動を防ぐチェック
                if (x < 0 || x >= 8 || y < 0 || y >= 8) break;

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
        setPassCount(0); // パスの回数をリセット
    };

    // 石を数える関数
    const countStones = () => {
        let blackCount = 0;
        let whiteCount = 0;
    
        for (const square of squares) {
            if (square === 'B') {
                blackCount++;
            } else if (square === 'W') {
                whiteCount++;
            }
        }
    
        return { blackCount, whiteCount };
    };

    return (
        <div className="game">
            <div className="game-info">
                <h2>次の手番: {isNextBlack ? '黒 (B)' : '白 (W)'}</h2>
            </div>
            <div className="game-board">
                <Board squares={squares} onClick={handleClick} />
            </div>
            <button className="reset-button" onClick={resetGame}>リセット</button>
        </div>
    );
};

export default Game;
