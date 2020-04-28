/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");

//const colors = ["#e25a53", "#fdb35d", "#fbf5e8", "#a4d9d6"];
//ALL DATA

const NUMBER_OF_PEOPLE = 1000;
const INFECTED_PEOPLE = 1;
const INFECTED_COLOR = "#e25a53";
const NORMAL_COLOR = "#5FAD41";
const QUARATINR_COLOR = "#996515";
const LOCKDOWN_COUNT = 700;
const CURRENT_ACTION = "LOCKDOWN(70%)/SOCIAL DISTANCING/MASKS";

const MAX_DISTANCE = -5; //social distance 3
const CANVAS_HEIGHT = 570;
const CANVAS_WIDTH = 500;

let animation_id;
let isPaused = true;

const canvas = document.querySelector("#my-canvas");
let c = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let line_chart;
const _line_chart_canvas = document.querySelector("#line-chart");
let line_chart_c = _line_chart_canvas.getContext("2d");

const mouse = {
  x: undefined,
  y: undefined
};

let circles = [];
//let line_chart_data = [{ x: 1, y: 1 }]; // x : days, y:infected
let total_infected = 0;
let days = 0;
let total_frames = 0; //every 2 secs ie. 120 frames counts as a day
let frame_to_days = 60;

// all classes
class Circle {
  constructor(x, y, r, color, dx, dy) {
    this.x = x;
    this.y = y;
    this.r = r || 15;
    this.color = color;
    this.dx = dx || velocity.dx;
    this.dy = dy || velocity.dy;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.checkForWindow();
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }

  setColor(color) {
    this.color = color;
  }

  checkForWindow() {
    if (this.x + this.r > canvas.width || this.x - this.r < 0)
      this.dx = -this.dx;
    if (this.y + this.r > canvas.height || this.y - this.r < 0)
      this.dy = -this.dy;
  }
}

//simulate lockdown
function lockdown(count) {
  for (let i = 0; i < count; i++) {
    circles[i].dx = 0;
    circles[i].dy = 0;
  }
}

function collide(circle) {
  for (let i of circles) {
    if (i == circle) continue;
    const distance = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].distance(i, circle) - circle.r - i.r;
    if (distance < MAX_DISTANCE && circle.color === INFECTED_COLOR) {
      i.color = INFECTED_COLOR;
    }
  }
}

/* 
  100 GREEN people and 1 RED PEOPLE
*/
function init() {
  circles = [];
  for (let i = 0; i < NUMBER_OF_PEOPLE; i++) {
    const r = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].getRandomArbitrary(2, 4);
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const color = NORMAL_COLOR;
    const dx = (Math.random() - 0.5) * 2;
    const dy = (Math.random() - 0.5) * 2;
    circles.push(new Circle(x, y, r, color, dx, dy));
  }
  fill_infected(INFECTED_PEOPLE);
  lockdown(LOCKDOWN_COUNT);
}

function draw_line_chart() {
  line_chart = new Chart(line_chart_c, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: `INFECTED - ${CURRENT_ACTION}`,
          data: [],
          backgroundColor: INFECTED_COLOR,
          borderColor: "rgb(0,0,0)",
          borderWidth: 1
        }
      ]
    },
    scales: {
      xAxes: [
        {
          // aqui controlas la cantidad de elementos en el eje horizontal con autoSkip
          ticks: {
            autoSkip: true,
            maxTicksLimit: 20
          }
        }
      ],
      yAxes: [
        {
          // aqui controlas la cantidad de elementos en el eje horizontal con autoSkip
          ticks: {
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0
          }
        }
      ]
    }
  });
}

function fill_infected(count) {
  for (let i = 0; i < count; i++) {
    circles[i].color = INFECTED_COLOR;
  }
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  total_infected = 0;
  total_frames++;
  circles.forEach(circle => {
    if (circle.color === INFECTED_COLOR) total_infected++;
    collide(circle);
  });
  circles.forEach(circle => {
    circle.update();
  });

  //every frame_to_days we count as a day
  if (total_frames % frame_to_days === 0) {
    days++;
    line_chart.data.datasets[0].data.push(total_infected);
    line_chart.data.labels.push(`day ${days}`);
    line_chart.update();
  }
  animation_id = requestAnimationFrame(animate);
}

//all controls
function allEvents(params) {
  document
    .querySelector("#start-button")
    .addEventListener("click", function(params) {
      if (isPaused) {
        animate();
        isPaused = !isPaused;
      }
    });

  document
    .querySelector("#stop-button")
    .addEventListener("click", function(params) {
      if (!isPaused) {
        cancelAnimationFrame(animation_id);
        isPaused = !isPaused;
      }
    });
}

init();
draw_line_chart();
allEvents();


/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/*! exports provided: getRandomArbitrary, getRandomInt, distance, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRandomArbitrary", function() { return getRandomArbitrary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRandomInt", function() { return getRandomInt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "distance", function() { return distance; });
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distance(object1, object2) {
  const xd = object1.x - object2.x;
  const yd = object1.y - object2.y;
  const dis = Math.sqrt(xd * xd + yd * yd);
  return dis;
}

/* harmony default export */ __webpack_exports__["default"] = ({ getRandomArbitrary, getRandomInt, distance });


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map