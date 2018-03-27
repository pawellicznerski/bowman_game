webpackHotUpdate("main",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! ./style.css */ \"./src/style.css\");\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Bow = function Bow() {\n  _classCallCheck(this, Bow);\n};\n\nvar Game = function Game(scoreText) {\n  _classCallCheck(this, Game);\n\n  this.scoreText = scoreText;\n};\n\nvar ShootingTarget = function ShootingTarget() {\n  _classCallCheck(this, ShootingTarget);\n};\n\nvar game = new Game(0);\nvar shootingTarget = new ShootingTarget();\nvar bow = new Bow();\n\nfunction component() {\n  //main div\n  var gameContainer = document.createElement('div');\n  gameContainer.classList.add('container'); // main button\n\n  var button = document.createElement('button');\n  button.classList.add('main_button');\n  button.innerHTML = 'PLAY A NEW GAME';\n  button.addEventListener('click', startPlaying);\n  gameContainer.appendChild(button); //score table\n\n  var scoreText = document.createElement('div');\n  scoreText.classList.add('scoreText');\n  scoreText.innerHTML = 'Score: ' + 0;\n  gameContainer.appendChild(scoreText); //shooting target\n\n  var shootingTarget = document.createElement('div');\n  shootingTarget.classList.add('shooting-target');\n  shootingTarget.setAttribute(\"style\", \"top:0px;left:\".concat(window.innerWidth / 2 - 60, \"px\"));\n  gameContainer.appendChild(shootingTarget); //bow\n\n  var bow = document.createElement('div');\n  bow.classList.add('bow');\n  gameContainer.appendChild(bow); //arrow\n\n  var arrow = document.createElement('div');\n  arrow.classList.add('arrow');\n  gameContainer.appendChild(arrow);\n  return gameContainer;\n}\n\nfunction startPlaying() {\n  //removing button\n  var child = document.getElementsByClassName('main_button');\n  var parent = child[0].parentNode;\n  parent.removeChild(child[0]); //setting score to 0\n\n  game.scoreText = 0; //if the gameOverText exist remove it\n\n  var gameOverText = document.getElementsByClassName('gameOverText');\n\n  if (gameOverText.length > 0) {\n    var gameOverTextParent = gameOverText[0].parentNode;\n    gameOverTextParent.removeChild(gameOverText[0]);\n  }\n\n  ;\n  var id = setInterval(movingTarget, 10);\n}\n\nfunction movingTarget() {\n  var shootingTarget = document.getElementsByClassName('shooting-target');\n  shootingTarget.setAttribute(\"style\", \"left:\".concat(currentPosition, \"px\"));\n}\n\ndocument.body.appendChild(component());\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

})