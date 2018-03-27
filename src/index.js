import './style.css';

class Bow{
  constructor(){

  }
}

class Game{
  constructor(scoreText){
    this.scoreText=scoreText;
  }
}

class ShootingTarget{
  constructor(){

  }
}

const game = new Game(0);
const shootingTarget = new ShootingTarget();
const bow = new Bow();

function component() {
  //main div
  const gameContainer = document.createElement('div');
  gameContainer.classList.add('container');
  // main button
  const button = document.createElement('button');
  button.classList.add('main_button');
  button.innerHTML='PLAY A NEW GAME';
  button.addEventListener('click',startPlaying);
  gameContainer.appendChild(button);
  //score table
  const scoreText = document.createElement('div');
  scoreText.classList.add('scoreText');
  scoreText.innerHTML='Score: '+0;
  gameContainer.appendChild(scoreText);
  //shooting target
  const shootingTarget = document.createElement('div');
  shootingTarget.classList.add('shooting-target');
  shootingTarget.setAttribute("style",`top:0px;left:${window.innerWidth/2-60}px`)
  gameContainer.appendChild(shootingTarget);
  //bow
  const bow = document.createElement('div');
  bow.classList.add('bow');
  gameContainer.appendChild(bow);
  //arrow
  const arrow = document.createElement('div');
  arrow.classList.add('arrow');
  gameContainer.appendChild(arrow);

  return gameContainer;
}


function startPlaying(){
  //removing button
  const child = document.getElementsByClassName('main_button');
  const parent = child[0].parentNode;
  parent.removeChild(child[0]);
  //setting score to 0
  game.scoreText=0;

  //if the gameOverText exist remove it
  const gameOverText =document.getElementsByClassName('gameOverText');
  if(gameOverText.length>0){
    const gameOverTextParent = gameOverText[0].parentNode;
    gameOverTextParent.removeChild(gameOverText[0]);
  };

  const id = setInterval(movingTarget,10)

}

function movingTarget(){
  const shootingTarget = document.getElementsByClassName('shooting-target');
  shootingTarget.setAttribute("style",`left:${currentPosition}px`)
}


document.body.appendChild(component());
