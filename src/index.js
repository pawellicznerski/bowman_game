import './style.css';

class Bow{
  constructor(){
    this.top= window.innerHeight-150;
    this.left=window.innerWidth/2-60;
  }
}

class Arrow{
  constructor(left){
    this.left=left;
    this.canShoot=false;
  }
}

class Game{
  constructor(scoreText){
    this.scoreText=scoreText;
  }
}

class ShootingTarget{
  constructor(){
    this.direction=1;
  }
}

class Button{
  constructor(){
    this.top= window.innerHeight/2-25;
    this.left=window.innerWidth/2-100;
  }
}

const aroowLeftPos = 85;

const gameObj = new Game(0);
const shootingTargetObj = new ShootingTarget();
const bowObj = new Bow();
const arrowObj = new Arrow(aroowLeftPos);
const buttonObj = new Button();

function component() {
  //main div
  const gameContainerDOM = document.createElement('div');
  gameContainerDOM.classList.add('container');
  // main button
  const buttonDOM = document.createElement('button');
  buttonDOM.classList.add('main_button');
  buttonDOM.innerHTML='PLAY A NEW GAME';
  buttonDOM.setAttribute("style",`top:${buttonObj.top}px;left:${buttonObj.left}px`)
  buttonDOM.addEventListener('click',startPlaying);
  gameContainerDOM.appendChild(buttonDOM);
  //score table
  const scoreTextDOM = document.createElement('div');
  scoreTextDOM.classList.add('scoreText');
  scoreTextDOM.innerHTML='Score: '+0;
  gameContainerDOM.appendChild(scoreTextDOM);
  //shooting target
  const shootingTargetDOM = document.createElement('div');
  shootingTargetDOM.classList.add('shooting-target');
  shootingTargetDOM.setAttribute("style",`top:0px;left:${window.innerWidth/2-60}px`)
  gameContainerDOM.appendChild(shootingTargetDOM);
  //bow
  const bowDOM = document.createElement('div');
  bowDOM.classList.add('bow');
  bowDOM.setAttribute("style",`top:${bowObj.top}px;left:${bowObj.left}px`)
  gameContainerDOM.appendChild(bowDOM);
  //arrow
  const arrowDOM = document.createElement('div');
  arrowDOM.classList.add('arrow');
  arrowDOM.setAttribute("style",`top:14px;left:${arrowObj.left}px`)
  bowDOM.appendChild(arrowDOM);

  return gameContainerDOM;
}

function shoot(){
  let currentArrowPosition =0;
  const id = setInterval(movingArrow,10)
  function movingArrow(){
    currentArrowPosition++
  }
}

function startPlaying(){
  //removing button
  const child = document.getElementsByClassName('main_button');
  const parent = child[0].parentNode;
  parent.removeChild(child[0]);
  //setting score to 0
  gameObj.scoreText=0;

  //if the gameOverText exist remove it
  const gameOverText =document.getElementsByClassName('gameOverText');
  if(gameOverText.length>0){
    const gameOverTextParent = gameOverText[0].parentNode;
    gameOverTextParent.removeChild(gameOverText[0]);
  };
  initiateMovingTarget();
  addEventListenerToDoc();

}

function initiateMovingTarget(){
  let currentPosition=1;
  const id = setInterval(movingTarget,10,currentPosition)

  function movingTarget(){
    const target = document.getElementsByClassName('shooting-target');
    target[0].setAttribute("style",`top:0px;left:${currentPosition}px`);
    if(currentPosition>=window.innerWidth-120||currentPosition<=0){
      shootingTargetObj.direction=shootingTargetObj.direction*(-1);
    }
    currentPosition=currentPosition+shootingTargetObj.direction;
  }
}

function addEventListenerToDoc(){
  arrowObj.canShoot=true;
  setTimeout(function(){
    ['click','keypress'].forEach( evt =>
    document.body.addEventListener(evt, moveArrow)
    );
  }, 10);

}

function moveArrow(e){
  console.log(e);
  if(!arrowObj.canShoot) return null;
  if(e.type==="click"||e.charCode===32||e.charCode===102){
    // let currentArrowPosition = arrowObj.left;
    console.log("dupa");
    const id = setInterval(movingArrowFn,4);
    const arrowDOM = document.getElementsByClassName('arrow');
    arrowObj.canShoot=false;

    function movingArrowFn(){
      if(arrowObj.left==600){
        clearInterval(id);
        // ['click','keypress'].forEach( evt =>
        // document.body.removeEventListener(evt, moveArrow)
        // );
      }
      arrowDOM[0].setAttribute("style",`top:14px;left:${arrowObj.left}px`)
      arrowObj.left=arrowObj.left+1;
      console.log('arrowObj.left',arrowObj.left);
    }
    console.log("dupa");
  }else{
    console.log("prawdziwa dupa");
    return null;
  }

}



document.body.appendChild(component());
