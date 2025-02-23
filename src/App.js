import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState(null); // 'human' or 'computer'
  const [playerMark, setPlayerMark] = useState('X'); // Player's chosen mark when playing against computer
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [gameStatus, setGameStatus] = useState('');
  const [winner, setWinner] = useState(null);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
      [0, 4, 8], [2, 4, 6] // Diagonal
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner || !gameMode) return;

    const newBoard = [...board];
    const currentPlayer = isXNext ? 'X' : 'O';

    if (gameMode === 'computer' && currentPlayer !== playerMark) return;

    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const computerMove = () => {
    if (winner || board.every(cell => cell)) return;

    const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(cell => cell !== null);
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    
    const newBoard = [...board];
    newBoard[randomMove] = playerMark === 'X' ? 'O' : 'X';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  useEffect(() => {
    const currentWinner = calculateWinner(board);
    if (currentWinner) {
      setWinner(currentWinner);
      setScores(prev => ({
        ...prev,
        [currentWinner]: prev[currentWinner] + 1
      }));
      setGameStatus(`Winner: ${currentWinner}`);
    } else if (board.every(cell => cell)) {
      setGameStatus("It's a Draw!");
    } else {
      setGameStatus(`${isXNext ? 'X' : 'O'}'s Turn`);
    }
  }, [board, isXNext]);

  useEffect(() => {
    if (gameMode === 'computer' && !winner && !board.every(cell => cell)) {
      if ((playerMark === 'X' && !isXNext) || (playerMark === 'O' && isXNext)) {
        const timer = setTimeout(computerMove, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [board, isXNext, gameMode, playerMark, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setGameStatus('');
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
  };

  const startGame = (mode) => {
    setGameMode(mode);
    resetGame();
  };

  const selectMark = (mark) => {
    setPlayerMark(mark);
    resetGame();
  };

  return (
    <div className="game-container">
      {!gameMode ? (
        <div className="mode-selection">
          <h1 className="game-title">Tic Tac Toe</h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mode-btn"
            onClick={() => startGame('human')}
          >
            Play with Human
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mode-btn"
            onClick={() => startGame('computer')}
          >
            Play with Computer
          </motion.button>
        </div>
      ) : gameMode === 'computer' && !playerMark ? (
        <div className="mark-selection">
          <h2>Choose your mark</h2>
          <div className="mark-buttons">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mark-btn x-mark"
              onClick={() => selectMark('X')}
            >
              X
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mark-btn o-mark"
              onClick={() => selectMark('O')}
            >
              O
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="game-board">
          <h2 className="game-status">{gameStatus}</h2>
          <div className="score-board">
            <div className="score x-score">X: {scores.X}</div>
            <div className="score o-score">O: {scores.O}</div>
          </div>
          <div className="board">
            {board.map((cell, index) => (
              <motion.div
                key={index}
                className={`cell ${cell}`}
                whileHover={{ scale: cell ? 1 : 1.1 }}
                whileTap={{ scale: cell ? 1 : 0.9 }}
                onClick={() => handleClick(index)}
              >
                {cell && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {cell}
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
          <div className="buttons">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="reset-btn"
              onClick={resetGame}
            >
              Reset Game
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="reset-btn"
              onClick={resetScores}
            >
              Reset Scores
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mode-btn"
              onClick={() => {
                setGameMode(null);
                setPlayerMark(null);
                resetScores();
                resetGame();
              }}
            >
              Change Mode
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;