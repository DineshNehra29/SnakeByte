import { useEffect, useState } from "react";
import './App.css';

function App() {

  let row = 24;
  let column = 24;
  let initialposition = [{ y: row / 2, x: column / 2 }];
  const [snake, setSnake] = useState(initialposition);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState("STOP");
  const [fruit, setFruit] = useState({ x: 3, y: 3 });
  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);
  const [message, setMessage] = useState("WELCOME!")

  const handleStart = () => {
    setStart(true);
  }

  const gameboard = () => {

    let Allcells = [];

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        let classes = "cell";


        if (i === snake[0].x && j === snake[0].y) {
          classes = "snakehead";
        }
        else if (snake.some((ele) => i === ele.x && j === ele.y)) {
          classes = "snake";
        }

        if (i === fruit.x && j === fruit.y) {
          classes = "fruit";
        }

       

        let cell = <div key={`${i}-${j}`} className={classes}></div>;
        Allcells.push(cell);
      }
    }
    return Allcells;
  }

  const renderFruit = () => {
    let randomX, randomY;
    do {
      randomX = Math.floor(Math.random() * column);
      randomY = Math.floor(Math.random() * row);
    } while (snake.some((ele) => ele.x === randomX && ele.y === randomY));
  
    setFruit({
      x: randomX,
      y: randomY,
    });
  };
  

  const newdirection = (e) => {
    if (start) {
      let key = e.code;

      

      switch (key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case "Space":
          {setDirection("STOP");
            setPause(true);}
          break;
        default:
          setDirection("STOP");
          break;
      }
    }
  }

  const updatesnake = () => {
    let newSnake = [...snake];
    if (direction !== "STOP" && !pause) {
      if (direction === "UP") {
        newSnake.unshift({ x: newSnake[0].x - 1, y: newSnake[0].y });
      }
      if (direction === "DOWN") {
        newSnake.unshift({ x: newSnake[0].x + 1, y: newSnake[0].y });
      }
      if (direction === "LEFT") {
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y - 1 });
      }
      if (direction === "RIGHT") {
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y + 1 });
      }


      if (newSnake[0].x === fruit.x && newSnake[0].y === fruit.y) {
        setScore((sco) => sco + 1);
        console.log(score);
        renderFruit();
      } else {
        newSnake.pop();
      }
    }



    /*if (
      snake[0].x < 0 ||
      snake[0].x >= row ||
      snake[0].y < 0 ||
      snake[0].y >= column
    ) {
      console.log("Game over: Snake hit the boundary!");
      gameOver();
      return;
    }*/

      if(newSnake[0].x < 0){newSnake[0].x = column-1}
      if(newSnake[0].y < 0){newSnake[0].y = row-1}
      if(newSnake[0].x >= column){newSnake[0].x = 0}
      if(newSnake[0].y >= row){newSnake[0].y = 0}


    const isBit = snake
      .slice(1)
      .some((ele) => ele.x === snake[0].x && ele.y === snake[0].y);
    if (isBit) {
      console.log("Game over: Snake bit itself!");
      gameOver();
      return;
    }

    setSnake(newSnake);
  }

  const gameOver = () => {
    setSnake(initialposition);
    setScore(0);
    setStart(false);
    setDirection("STOP");
    setMessage("GAMEOVER!")
  }

  const handleNew = () => {
    gameOver();
    setPause(false);
    setMessage("START NEW GAME!")
  }

  const handleResume = () => {
    setPause(false);
  }



  useEffect(() => {
    let moveSnake = setInterval(updatesnake, 150);
    return () => clearInterval(moveSnake);
  });

  useEffect(() => {
    document.addEventListener("keydown", newdirection);

    return () => document.removeEventListener("keydown", newdirection);
  });

  return (
    <div className="App">
      {start  ? (!pause ? (<div className='board'>{gameboard()}</div>) : (<div className="pause">
        <h2>Current Score : {score}</h2>
        <div className="buttons">
        <button className="resume " onClick={handleResume}>Resume</button>
      <button className="startnew" onClick={handleNew}>New Game</button></div></div>))
       :(<div className="start"><h1>{message}</h1><div><button className="startbutton" onClick={handleStart}>Start Game</button></div></div>)
      }

     
    </div>
  );
}

export default App;
