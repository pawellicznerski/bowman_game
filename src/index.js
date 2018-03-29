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
const arrowInBoardLeftPos = 0;

const gameObj = new Game(0);
const shootingTargetObj = new ShootingTarget(window.innerWidth/2-100);
console.log(window.innerWidth/2-60);
const bowObj = new Bow();
const arrowObj = new Arrow(aroowLeftPos);
const arrowInBoardObj = new Arrow(arrowInBoardLeftPos);
arrowInBoardObj.left=0;
const buttonObj = new Button();

function component() {
  //main div
  const gameContainerDOM = document.createElement('div');
  gameContainerDOM.classList.add('container');
  // main button
  const buttonDOM = document.createElement('button');
  buttonDOM.classList.add('main_button');
  buttonDOM.innerHTML='PLAY A NEW GAME';
  buttonDOM.setAttribute("style",`top:${buttonObj.top}px;left:${buttonObj.left}px`);
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
  arrowDOM.classList.add('arrow','arrow-basic');
  arrowDOM.setAttribute("style",`top:${arrowObj.top}px;left:49px`)
  bowDOM.appendChild(arrowDOM);
  //arrow in board
  const arrowInBoardDOM = document.createElement('div');
  arrowInBoardDOM.classList.add('arrow','arrow-in-board');
  arrowInBoardDOM.setAttribute("style",`opacity:0;top:55px;left:${arrowInBoardObj.left}px`)
  shootingTargetDOM.appendChild(arrowInBoardDOM);

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
    shootingTargetObj.left=shootingTargetObj.left;
    // shootingTargetObj.left=shootingTargetObj.left+shootingTargetObj.direction;
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
  let opacityArrowBasic=1;
  const arrowDOM = document.getElementsByClassName('arrow-basic');
console.log(arrowDOM);
  console.log(e);
  if(!arrowObj.canShoot) return null;
  if(e.type==="click"||e.charCode===32||e.charCode===102){
    const id = setInterval(movingArrowFn,4);
    arrowObj.canShoot=false;

    function movingArrowFn(){
      if(arrowDOM[0].offsetParent.offsetTop+arrowObj.top==55){
        if(window.innerWidth/2-120 < shootingTargetObj.left && shootingTargetObj.left < window.innerWidth/2){
          opacityArrowBasic=0;
          clearInterval(id);
          updateData();
        }
      }
      arrowDOM[0].setAttribute("style",`opacity:${opacityArrowBasic};top:${arrowObj.top}px;left:49px`)
      arrowObj.top=arrowObj.top-1;
    }
  }else{
    return null;
  }

}

function updateData(){
  const arrowDOM = document.getElementsByClassName('arrow-basic');
  const arrowLeftPos =arrowDOM[0].offsetParent.offsetLeft+49;
  const arrowInBoardDOM = document.getElementsByClassName('arrow-in-board');
  const placeOnShootingTarget = (-1)*(shootingTargetObj.left-arrowLeftPos);
  arrowInBoardObj.left=placeOnShootingTarget;


  const arr = [97.5,81.5,70.5,57.5,41.5,28.5,17,1,-10];
  let minusPointOnBoard=0;
  let breakLoop = false;
  arr.forEach((item,i)=>{
    if(breakLoop) return;
    if(placeOnShootingTarget>=item){
      breakLoop=true;
      i>4?minusPointOnBoard=i-4:null;
      gameObj.scoreText= gameObj.scoreText+2+(2*i)-(4*minusPointOnBoard);
      // console.log(i);
      // console.log('gameObj.scoreText',gameObj.scoreText);
    }
  })

  const scoreTextDOM = document.getElementsByClassName('scoreText');
  scoreTextDOM[0].innerHTML='Score: '+gameObj.scoreText;
  // gameContainerDOM.appendChild(scoreTextDOM);
  arrowInBoardDOM[0].setAttribute("style",`opacity:1;top:55px;left:${arrowInBoardObj.left}px`)


}



document.body.appendChild(component());
