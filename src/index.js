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
    this.canArrowBasicDisappear=false;
  }
}

class Game{
  constructor(scoreText){
    this.scoreText=scoreText;
    this.noOfArrows=2;
    this.stopGame=false;
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

const aroowTopPos = 0;
const arrowInBoardLeftPos = 0;
const shootingTargetObjLeft = window.innerWidth/2-60;

const gameObj = new Game(0);
const shootingTargetObj = new ShootingTarget(shootingTargetObjLeft);
// console.log(window.innerWidth/2-60);
const bowObj = new Bow();
const arrowObj = new Arrow(aroowTopPos);
const arrowInBoardObj = new Arrow();
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
  scoreTextDOM.innerHTML='Score: '+gameObj.scoreText+' Arrows: '+gameObj.noOfArrows;
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
  //if the gameOverText exist remove it
  const gameOverText =document.getElementsByClassName('gameOverText');
  if(gameOverText.length>0){
    const gameOverTextParent = gameOverText[0].parentNode;
    gameOverTextParent.removeChild(gameOverText[0]);
  };

  backInitSettings()
  initiateMovingTarget();
  addEventListenerToDoc(true);
}

function backInitSettings(){
  gameObj.scoreText=0;
  gameObj.stopGame=false;
  gameObj.noOfArrows=2;
  const scoreTextDOM = document.getElementsByClassName('scoreText');
  scoreTextDOM[0].innerHTML='Score: '+gameObj.scoreText+' Arrows: '+gameObj.noOfArrows;
  setInitialArrows();
}

function gameOver(){
  gameObj.stopGame=true;
  showGameOverInfo()

}

function showGameOverInfo(){
  //creating game over info and adding it to the main el
  const element = document.getElementsByClassName('container');
  const gameOverText = document.createElement('p');
  // gameOverText.setAttribute("style",`top:${window.innerHeight/2-120}px;left:${window.innerWidth/2-100}px`);
  gameOverText.classList.add('gameOverText');
  gameOverText.innerText=`Game over. Your score is ${gameObj.scoreText}`;
  element[0].appendChild(gameOverText);

  const buttonDOM = document.createElement('button');
  buttonDOM.classList.add('main_button');
  buttonDOM.innerHTML='PLAY A NEW GAME';
  buttonDOM.setAttribute("style",`top:${buttonObj.top}px;left:${buttonObj.left}px`);
  buttonDOM.addEventListener('click',startPlaying);
  element[0].appendChild(buttonDOM);
  // gameObj.stopGame=false;
}

function setInitialArrows(){
  const target = document.getElementsByClassName('shooting-target');
  target[0].childNodes[0].setAttribute("style",`opacity:0;top:55px;left:${arrowInBoardObj.left}px`);
  arrowObj.top=aroowTopPos;
  const arrowDOM = document.getElementsByClassName('arrow-basic');
  arrowDOM[0].setAttribute("style",`opacity:1;top:${arrowObj.top}px;left:49px`);
  addEventListenerToDoc(true);
}

function initiateMovingTarget(){
  const id = setInterval(movingTarget,10)

  function movingTarget(){
    gameObj.stopGame==true?clearInterval(id):null;
    const target = document.getElementsByClassName('shooting-target');
    target[0].setAttribute("style",`top:0px;left:${shootingTargetObj.left}px`);
    const marginForBoardLeft = window.innerWidth<550?0: window.innerWidth/2-240;
    const marginForBoardRight = window.innerWidth<550?window.innerWidth-120:window.innerWidth/2+120;
    if(shootingTargetObj.left>=marginForBoardRight||shootingTargetObj.left<=marginForBoardLeft){
      shootingTargetObj.direction=shootingTargetObj.direction*(-1);
      if(arrowObj.canArrowBasicDisappear){
        setInitialArrows()
      }
    }
    shootingTargetObj.left=shootingTargetObj.left+shootingTargetObj.direction;
  }
}

function addEventListenerToDoc(val){
  if(val){
    // arrowObj.canArrowBasicDisappear=true;
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
  addEventListenerToDoc(false);
  let opacityArrowBasic=1;
  const arrowDOM = document.getElementsByClassName('arrow-basic');
  arrowObj.canArrowBasicDisappear=false;
  // if(!arrowObj.canArrowBasicDisappear) return null;
  if(e.type==="click"||e.charCode===32||e.charCode===102){
    gameObj.noOfArrows=gameObj.noOfArrows-1;
    const id = setInterval(movingArrowFn,4);
    function movingArrowFn(){
      if(arrowDOM[0].offsetParent.offsetTop+arrowObj.top==55){
        if(window.innerWidth/2-120 < shootingTargetObj.left && shootingTargetObj.left < window.innerWidth/2){
          opacityArrowBasic=0;
          clearInterval(id);
          arrowObj.canArrowBasicDisappear=true;
          updateData(arrowDOM);
          gameObj.noOfArrows==0?gameOver():null;

        }
      }else if(arrowDOM[0].offsetParent.offsetTop+arrowObj.top<-70){
        gameObj.noOfArrows==0?gameOver():null;
        clearInterval(id);
        arrowObj.canArrowBasicDisappear=true;
      }

      arrowDOM[0].setAttribute("style",`opacity:${opacityArrowBasic};top:${arrowObj.top}px;left:49px`)
      arrowObj.top=arrowObj.top-1;
      const scoreTextDOM = document.getElementsByClassName('scoreText');
      scoreTextDOM[0].innerHTML='Score: '+gameObj.scoreText+' Arrows: '+gameObj.noOfArrows;
    }
  }else{
    return null;
  }

}

function updateData(arrowDOM){
  const arrowLeftPos =arrowDOM[0].offsetParent.offsetLeft+49;
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
      console.log("points:",2+(2*i)-(4*minusPointOnBoard));
    }
  })

  const scoreTextDOM = document.getElementsByClassName('scoreText');
  scoreTextDOM[0].innerHTML='Score: '+gameObj.scoreText+' Arrows: '+gameObj.noOfArrows;
  const arrowInBoardDOM = document.getElementsByClassName('arrow-in-board');
  arrowInBoardDOM[0].setAttribute("style",`opacity:1;top:55px;left:${arrowInBoardObj.left}px`)
}



document.body.appendChild(component());
