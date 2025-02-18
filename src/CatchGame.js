import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #87CEFA, #FFD700);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: Arial, sans-serif;
  flex-direction: column;
  text-align: center;
`;

const Basket = styled.div`
  position: absolute;
  bottom: 10px;
  left: ${props => props.position}px;
  width: 80px;
  height: 50px;
  background: brown;
  border-radius: 10px;
`;

const FallingObject = styled.div`
  position: absolute;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  font-size: 24px;
  background: ${props => (props.type === 'bad' ? 'black' : props.type === 'bonus' ? 'gold' : 'red')};
`;

const Score = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 24px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 8px;
`;

const Timer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 8px;
`;

const Message = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #fff;
`;

export default function JaydenCatchGame() {
  const [basketPosition, setBasketPosition] = useState(200);
  const [fallingObjects, setFallingObjects] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [message, setMessage] = useState("Let's go Jayden! Catch them all! 🍎");

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && basketPosition > 0) {
        setBasketPosition(prev => prev - 20);
      } else if (e.key === 'ArrowRight' && basketPosition < window.innerWidth - 100) {
        setBasketPosition(prev => prev + 20);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [basketPosition]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerInterval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const objectInterval = setInterval(() => {
      const randomType = Math.random() < 0.1 ? 'bonus' : Math.random() < 0.2 ? 'bad' : 'normal';
      setFallingObjects(prev => [...prev, { x: Math.random() * (window.innerWidth - 40), y: 0, type: randomType }]);
    }, 800);
    return () => clearInterval(objectInterval);
  }, [timeLeft]);

  useEffect(() => {
    const fallingInterval = setInterval(() => {
      setFallingObjects(prev => prev.map(obj => ({ ...obj, y: obj.y + 10 })).filter(obj => obj.y < window.innerHeight));
    }, 100);
    return () => clearInterval(fallingInterval);
  }, []);

  useEffect(() => {
    setFallingObjects(prev =>
      prev.filter(obj => {
        if (obj.y > window.innerHeight - 70 && obj.x > basketPosition && obj.x < basketPosition + 80) {
          if (obj.type === 'bad') {
            setScore(prevScore => Math.max(0, prevScore - 1));
            setMessage("Oops! Avoid those bad objects! ⚠️");
          } else if (obj.type === 'bonus') {
            setScore(prevScore => prevScore + 3);
            setMessage("Awesome! Bonus points! 🌟");
          } else {
            setScore(prevScore => prevScore + 1);
            if (score % 5 === 0) {
              setMessage("Great job Jayden! Keep going! 🎉");
            }
          }
          return false;
        }
        return true;
      })
    );
  }, [basketPosition, fallingObjects]);

  return (
    <GameContainer>
      <Message>{message}</Message>
      <Score>🍎 Score: {score}</Score>
      <Timer>⏳ Time: {timeLeft}s</Timer>
      {fallingObjects.map((obj, index) => (
        <FallingObject key={index} x={obj.x} y={obj.y} type={obj.type}>
          {obj.type === 'bad' ? '⚠️' : obj.type === 'bonus' ? '🌟' : '🍎'}
        </FallingObject>
      ))}
      <Basket position={basketPosition} />
    </GameContainer>
  );
}
