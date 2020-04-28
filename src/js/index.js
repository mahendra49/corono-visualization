import utils from "./utils";
//const colors = ["#e25a53", "#fdb35d", "#fbf5e8", "#a4d9d6"];
//ALL DATA

const NUMBER_OF_PEOPLE = 1000;
const INFECTED_PEOPLE = 10;
const INFECTED_COLOR = "#e25a53";
const NORMAL_COLOR = "#5FAD41";
const QUARATINR_COLOR = "#996515";
const DEAD_COLOR = "#000000";
const LOCKDOWN_COUNT = 700;
const CURRENT_ACTION = `LOCKDOWN(${LOCKDOWN_COUNT /
  10}%) - MEDICATION AVAILABLE - ASSUME DEATHS`;

const MAX_DISTANCE = -5; //social distance 3
const CANVAS_HEIGHT = 570;
const CANVAS_WIDTH = 500;

//hospotal data
const is_hospital = true;
const hos_height = 100;
const hos_width = 100;
const RANDOMLY_INFECT_COUNT = 5;
const REDUCE_HEALTH_BY_FACTOR_MAX_LIMIT = 10;
const INCR_HEALTH_BY_FACTOR_MAX_LIMIT = 7;
const DEATH_AT_LIMIT_BELOW = 50; //health below 20 dies
const SAFE_ABOVE_LIMIT = 400; //max is 600 ie..ttl in circles
//const hos_color = "#de7119";
//animation events
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

let days = 0;
let total_frames = 0;
let frame_to_days = 60; //every 60 days as a day

// all classes
class Circle {
  constructor(x, y, r, color, dx, dy) {
    this.x = x;
    this.y = y;
    this.r = r || 15;
    this.color = color;
    this.dx = dx || velocity.dx;
    this.dy = dy || velocity.dy;
    this.ttl = frame_to_days * 10; //time to recover lets say 10 days so frame_to_days*10
  }

  draw() {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    if (this.color == INFECTED_COLOR) {
      this.ttl =
        this.ttl -
        (utils.getRandomInt(2, REDUCE_HEALTH_BY_FACTOR_MAX_LIMIT) * 100) /
          this.ttl;
      if (this.ttl <= DEATH_AT_LIMIT_BELOW) this.color = DEAD_COLOR;
    }

    if (this.color == INFECTED_COLOR) {
      this.ttl =
        this.ttl +
        (utils.getRandomInt(1, INCR_HEALTH_BY_FACTOR_MAX_LIMIT) * 100) /
          this.ttl;
    }
    if (this.color == INFECTED_COLOR && this.ttl >= SAFE_ABOVE_LIMIT)
      this.color = NORMAL_COLOR;
    this.checkForWindow();
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }

  setColor(color) {
    this.color = color;
  }

  checkForWindow() {
    if (
      (is_hospital && checkIfNearHospital(this)) ||
      this.x + this.r > canvas.width ||
      this.x - this.r < 0
    )
      this.dx = -this.dx;
    if (
      (is_hospital && checkIfNearHospital(this)) ||
      (this.x >= canvas.width - hos_width &&
        this.y + this.r > canvas.height - hos_height) ||
      this.y + this.r > canvas.height ||
      this.y - this.r < 0
    )
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
    const distance = utils.distance(i, circle) - circle.r - i.r;
    //if came into contact mark color as red and reduce some health
    if (distance < MAX_DISTANCE && circle.color === INFECTED_COLOR) {
      i.color = INFECTED_COLOR;
      i.ttl = utils.getRandomInt(350, 500);
    }
  }
}

/* 
  100 GREEN people and 1 RED PEOPLE
*/
function init() {
  circles = [];
  for (let i = 0; i < NUMBER_OF_PEOPLE; i++) {
    const r = utils.getRandomArbitrary(2, 4);
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const color = NORMAL_COLOR;
    const dx = (Math.random() - 0.5) * 5;
    const dy = (Math.random() - 0.5) * 5;
    const circle = new Circle(x, y, r, color, dx, dy);
    if (is_hospital && checkIfNearHospital(circle)) {
      i--;
      continue;
    }
    circles.push(circle);
  }
  fill_infected(INFECTED_PEOPLE);
  lockdown(LOCKDOWN_COUNT);
}

function draw_line_chart() {
  Chart.defaults.scale.gridLines.display = false;
  line_chart = new Chart(line_chart_c, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: `INFECTED - ${CURRENT_ACTION}`,
          data: [],
          borderColor: INFECTED_COLOR,

          borderWidth: 2
        },
        {
          label: `DEATHS`,
          data: [],
          borderColor: DEAD_COLOR,

          borderWidth: 3
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
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)"
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
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)"
          }
        }
      ]
    }
  });
}

function fill_infected(count) {
  for (let i = 0; i < count; i++) {
    circles[i].color = INFECTED_COLOR;
    //give time to live randomly between 350 and 400
    circles[i].ttl = utils.getRandomInt(350, 400);
  }
}

//all hospital related functions
function hospital(params) {
  c.rect(
    CANVAS_WIDTH - hos_width,
    CANVAS_HEIGHT - hos_height,
    hos_width,
    hos_height
  );
  c.strokeStyle = "black";
  c.stroke();
}

function checkIfNearHospital(tmp_circle) {
  if (
    tmp_circle.y >= canvas.height - hos_height &&
    tmp_circle.x + tmp_circle.r > canvas.width - hos_width
  )
    return true;

  if (
    tmp_circle.x >= canvas.width - hos_width &&
    tmp_circle.y + tmp_circle.r > canvas.height - hos_height
  ) {
    return true;
  }

  return false;
}

//infect randoly no direct contact
function randomlyInfect(count) {
  for (let i = 0; i < count; i++) {
    const randome_number = utils.getRandomInt(0, circles.length - 1);
    circles[i].color = INFECTED_COLOR;
    circles[i].ttl = utils.getRandomInt(350, 450);
  }
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (is_hospital) hospital();
  let total_infected = 0;
  total_frames++;
  circles.forEach((circle, index) => {
    if (circle.color === INFECTED_COLOR) total_infected++;
    if (circle.color === DEAD_COLOR) circles.splice(index, 1);
    collide(circle);
  });
  circles.forEach(circle => {
    circle.update();
  });
  randomlyInfect(RANDOMLY_INFECT_COUNT);
  //every frame_to_days we count as a day
  if (total_frames % frame_to_days === 0) {
    days++;
    line_chart.data.datasets[0].data.push(total_infected);
    line_chart.data.labels.push(`day ${days}`);
    const dead_count = NUMBER_OF_PEOPLE - circles.length;
    line_chart.data.datasets[1].data.push(dead_count);
    line_chart.data.datasets[1].label = `DEATH - ${dead_count}`;
    line_chart.data.datasets[0].label = `INFECTED - ${total_infected}`;
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
