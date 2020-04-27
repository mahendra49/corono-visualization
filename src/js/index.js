import utils from "./utils";
//const colors = ["#e25a53", "#fdb35d", "#fbf5e8", "#a4d9d6"];
//ALL DATA

const INFECTED_COLOR = "#e25a53";
const NORMAL_COLOR = "#5FAD41";
const QUARATINR_COLOR = "#996515";
const MAX_DISTANCE = 0;
const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 400;
const LINE_CHART_WIDTH = 300;
const LINE_CHART_HEIGHT = 300;

const canvas = document.querySelector("#my-canvas");
let c = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const line_chart_canvas = document.querySelector("#line-chart");
let line_chart_c = line_chart_canvas.getContext("2d");
line_chart_canvas.width = LINE_CHART_WIDTH;
line_chart_canvas.height = LINE_CHART_HEIGHT;

const mouse = {
  x: undefined,
  y: undefined
};

const velocity = {
  dx: 2,
  dy: 2
};

let circles = [];
let line_chart_data = [{ x: 1, y: 1 }]; // x : days, y:infected
let total_infected = 0;
let days = 0;
let total_frames = 0; //every 2 secs ie. 120 frames counts as a day
let frame_to_days = 120;

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

function collide(circle) {
  for (let i of circles) {
    if (i == circle) continue;
    const distance = utils.distance(i, circle) - circle.r - i.r;
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
  for (let i = 0; i < 50; i++) {
    const r = utils.getRandomArbitrary(2, 4);
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const color = NORMAL_COLOR;
    const dx = (Math.random() - 0.5) * 2;
    const dy = (Math.random() - 0.5) * 2;
    circles.push(new Circle(x, y, r, color, dx, dy));
  }
  fill_infected(1);
}

function fill_infected(count) {
  for (let i = 0; i < count; i++) {
    circles[i].color = INFECTED_COLOR;
  }
}

function animate() {
  requestAnimationFrame(animate);
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
  if (total_frames % frame_to_days === 0) days++;
}

init();
animate();
