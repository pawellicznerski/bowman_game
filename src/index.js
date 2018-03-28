import './style.css';

class Bow{
  constructor(){
    this.top= window.innerHeight-150;
    this.left=window.innerWidth/2-60;
  }
}

class Arrow{
  constructor(top){
    this.top=top;
    this.canShoot=false;
  }
}

class Game{
  constructor(scoreText){
    this.scoreText=scoreText;
  }
}

class ShootingTarget{
  constructor(left){
    this.direction=1;
    this.left=left
  }
}

class Button{
  constructor(){
    this.top= window.innerHeight/2-25;
    this.left=window.innerWidth/2-100;
  }
}

const aroowLeftPos = 0;

const gameObj = new Game(0);
const shootingTargetObj = new ShootingTarget(1);
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
  scoreTextDOM.innerHTML='Score: '+gameObj.scoreText;
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
  arrowDOM.setAttribute("style",`top:${arrowObj.top}px;left:49px`)
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
  addEventListenerToDoc(true);

}

function initiateMovingTarget(){
  const id = setInterval(movingTarget,10)

  function movingTarget(){
    const target = document.getElementsByClassName('shooting-target');
    target[0].setAttribute("style",`top:0px;left:${shootingTargetObj.left}px`);
    if(shootingTargetObj.left>=window.innerWidth-120||shootingTargetObj.left<=0){
      shootingTargetObj.direction=shootingTargetObj.direction*(-1);
    }
    shootingTargetObj.left=shootingTargetObj.left+shootingTargetObj.direction;
  }
}

function addEventListenerToDoc(val){
  if(val){
    arrowObj.canShoot=true;
    setTimeout(function(){
      ['click','keypress'].forEach( evt =>
      document.body.addEventListener(evt, moveArrow)
      );
    }, 10);
  }else{
    ['click','keypress'].forEach( evt =>
    document.body.removeEventListener(evt, moveArrow)
    );  }
}

function moveArrow(e){
  const arrowDOM = document.getElementsByClassName('arrow');
console.log(arrowDOM);
  console.log(e);
  if(!arrowObj.canShoot) return null;
  if(e.type==="click"||e.charCode===32||e.charCode===102){
    const id = setInterval(movingArrowFn,4);
    const arrowDOM = document.getElementsByClassName('arrow');
    arrowObj.canShoot=false;

    function movingArrowFn(){
      if(arrowDOM[0].offsetParent.offsetTop+arrowObj.top==55){
        if(window.innerWidth/2-110 < shootingTargetObj.left && shootingTargetObj.left < window.innerWidth/2+10){
          clearInterval(id);
          // console.log(arrowDOM);
          updateData(arrowDOM);
        }
      }
      arrowDOM[0].setAttribute("style",`top:${arrowObj.top}px;left:49px`)
      arrowObj.top=arrowObj.top-1;
    }
  }else{
    return null;
  }

}

function updateData(arrowDOM){
  // console.log('arrowDOM',arrowDOM);
  // console.log('shootingTargetObj.left',shootingTargetObj.left);
  const bowerLeft =arrowDOM[0].offsetParent.offsetLeft+49;
  // console.log('bowerLeft',bowerLeft);
  const placeOnShootingTarget = shootingTargetObj.left-bowerLeft;
  // console.log('placeOnShootingTarget',placeOnShootingTarget);
  const ringWidth = 120/9;
  // console.log("ringWidth",ringWidth);
  const lowestPoint = 104-bowerLeft;
  // console.log("lowestPoint",lowestPoint);


  if(placeOnShootingTarget<lowestPoint+ringWidth){
    gameObj.scoreText= gameObj.scoreText+1;
    console.log("1111111111");
  } else if (placeOnShootingTarget<lowestPoint+2*ringWidth) {
    gameObj.scoreText= gameObj.scoreText+3;
    console.log("2222222222222");
  } else if (placeOnShootingTarget<lowestPoint+3*ringWidth) {
    gameObj.scoreText= gameObj.scoreText+6;
    console.log("333333333333");
  } else if (placeOnShootingTarget<lowestPoint+4*ringWidth) {
    gameObj.scoreText= gameObj.scoreText+8;
    console.log("444444444444");
  } else if (placeOnShootingTarget<lowestPoint+5*ringWidth) {
    gameObj.scoreText= gameObj.scoreText+10;
    console.log("5555555555555");
  } else if (placeOnShootingTarget<lowestPoint+4*ringWidth) {
    gameObj.scoreText= gameObj.scoreText+8;
    console.log("44444444444444");
  } else if (placeOnShootingTarget<lowestPoint+3*ringWidth) {
    gameObj.scoreText= gameObj.scoreText+6;
    console.log("33333333333333");
  } else if (placeOnShootingTarget<lowestPoint+2*ringWidth) {
    gameObj.scoreText= gameObj.scoreText+3;
    console.log("2222222222222");
  } else {
    gameObj.scoreText= gameObj.scoreText+1;
    console.log("111111111111");
  }
  console.log("game",gameObj.scoreText);

  // const gameContainerDOM = document.getElementsByClassName('container');

  const scoreTextDOM = document.getElementsByClassName('scoreText');
  scoreTextDOM.innerHTML='Score: '+gameObj.scoreText;
  // gameContainerDOM.appendChild(scoreTextDOM);


}



document.body.appendChild(component());
