import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  min-height: -webkit-fill-available;
  background: linear-gradient(
    45deg, 
    #E6E6FA, /* Lavender */
    #FFC0CB, /* Pink */
    #E6E6FA  /* Lavender */
  );
  background-size: 200% 200%;
  animation: gradient 10s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  overflow: hidden;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  flex-direction: column;
  text-align: center;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  &::before {
    content: "✨";
    position: absolute;
    animation: sparkle 2s infinite;
    font-size: 20px;
    opacity: 0.7;
  }
`;

const Basket = styled.div`
  position: fixed;
  bottom: env(safe-area-inset-bottom, 20px);
  left: ${props => props.position}px;
  width: 80px;
  height: 50px;
  background: #FF69B4; /* Hot Pink */
  border-radius: 20px;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  z-index: 1000;
  border: 3px solid #FFF;
  box-shadow: 0 0 10px rgba(255,105,180,0.5);
  
  &::before {
    content: "🎀";
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  @media (max-width: 768px) {
    width: 60px;
    height: 40px;
    background: #FF69B4;
    border: 3px solid #FFF;
    box-shadow: 0 0 10px rgba(255,105,180,0.5);
  }
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
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 18px;
  }
`;

const Score = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 24px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 25px;
  box-shadow: 0 0 10px rgba(255,105,180,0.3);
  border: 2px solid #FF69B4;
  color: #FF69B4;
`;

const Timer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 25px;
  box-shadow: 0 0 10px rgba(255,105,180,0.3);
  border: 2px solid #FF69B4;
  color: #FF69B4;
`;

const Message = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #FF69B4;
  text-shadow: 2px 2px 4px rgba(255,255,255,0.5);
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 25px;
  box-shadow: 0 0 10px rgba(255,105,180,0.3);
`;

export default function AadiraCatchGame() {
  const [basketPosition, setBasketPosition] = useState(200);
  const [fallingObjects, setFallingObjects] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [message, setMessage] = useState("Let's go Aadira! Catch the strawberries! 🍓");
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && basketPosition > 0) {
        setBasketPosition(prev => prev - 20);
      } else if (e.key === 'ArrowRight' && basketPosition < window.innerWidth - 100) {
        setBasketPosition(prev => prev + 20);
      }
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      setTouchStartX(touch.clientX);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (touchStartX !== null) {
        const touch = e.touches[0];
        const diff = touch.clientX - touchStartX;
        
        let newPosition = basketPosition + diff;
        const maxWidth = window.innerWidth - (window.innerWidth <= 768 ? 60 : 80);
        newPosition = Math.max(0, Math.min(maxWidth, newPosition));
        
        setBasketPosition(newPosition);
        setTouchStartX(touch.clientX);
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      setTouchStartX(null);
    };

    const basket = document.querySelector('.basket');
    if (basket) {
      basket.addEventListener('touchstart', handleTouchStart, { passive: false });
      basket.addEventListener('touchmove', handleTouchMove, { passive: false });
      basket.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      if (basket) {
        basket.removeEventListener('touchstart', handleTouchStart);
        basket.removeEventListener('touchmove', handleTouchMove);
        basket.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [basketPosition, touchStartX]);

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
        const basketWidth = window.innerWidth <= 768 ? 60 : 80;
        const collisionY = window.innerHeight - (window.innerWidth <= 768 ? 60 : 70);
        
        if (obj.y > collisionY && 
            obj.x > basketPosition - 20 &&
            obj.x < basketPosition + basketWidth + 20) {
          if (obj.type === 'bad') {
            setScore(prevScore => Math.max(0, prevScore - 1));
            setMessage("Oops! Avoid the storm clouds! ⚠️");
          } else if (obj.type === 'bonus') {
            setScore(prevScore => prevScore + 3);
            setMessage("Amazing Aadira! Bonus points! ✨");
          } else {
            setScore(prevScore => prevScore + 1);
            if (score % 5 === 0) {
              setMessage("Wonderful job Aadira! Keep sparkling! 🌟");
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
      <Score>🍓 Score: {score}</Score>
      <Timer>⏳ Time: {timeLeft}s</Timer>
      {fallingObjects.map((obj, index) => (
        <FallingObject key={index} x={obj.x} y={obj.y} type={obj.type}>
          {obj.type === 'bad' ? '🌩️' : obj.type === 'bonus' ? '🌟' : '🍓'}
        </FallingObject>
      ))}
      <Basket className="basket" position={basketPosition} />
    </GameContainer>
  );
}
