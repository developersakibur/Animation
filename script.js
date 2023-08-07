const rippleSettings = {
  maxSize: 20,
  minSize: 0,
  speed: 1,
  number: 1,
  time: 1000, 
  blur: 0,
  zIndex: 2,
  color: [0, 255, 255],
};

function Coords(x, y) {
  this.x = x || null;
  this.y = y || null;
}

const Ripple = function Ripple(x, y, circleSize, ctx) {
  this.position = new Coords(x, y);
  this.circleSize = circleSize;
  this.maxSize = rippleSettings.maxSize;
  this.opacity = 1;
  this.ctx = ctx;
  this.color = `rgba(${Math.floor(rippleSettings.color[0])},
    ${Math.floor(rippleSettings.color[1])},
    ${Math.floor(rippleSettings.color[2])},
    ${this.opacity})`;
  this.speed = rippleSettings.speed;
  this.opacityStep = this.speed / (this.maxSize - circleSize) / 2;
};

Ripple.prototype = {
  update: function update() {
      this.circleSize = this.circleSize + this.speed;
      this.opacity = this.opacity - this.opacityStep;
      this.color = `rgba(${Math.floor(rippleSettings.color[0])},
      ${Math.floor(rippleSettings.color[1])},
      ${Math.floor(rippleSettings.color[2])},
      ${this.opacity})`;
  },
  draw: function draw() {
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.color;
      this.ctx.arc(
          this.position.x,
          this.position.y,
          this.circleSize,
          0,
          2 * Math.PI
      );
      this.ctx.stroke();
  },
  setStatus: function setStatus(status) {
      this.status = status;
  },
};


  const body = document.body;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const ripples = [];
  const rippleStartStatus = "start";
  const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = rippleSettings.zIndex;
  canvas.style.filter = `blur(${rippleSettings.blur}px)`;

  body.appendChild(canvas);





let animationFrame;

const canvasMouseOver = (e) => {
  const x = e.clientX;
  const y = e.clientY;
  const number = rippleSettings.number;
  const minSize = rippleSettings.minSize;
  const time = rippleSettings.time;

  for (let i = 0; i < number; i++) {
      setTimeout(() => {
          ripples.unshift(new Ripple(x, y, minSize, ctx));
      }, i * time);
  }
};

const animation = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const length = ripples.length;
  for (let i = length - 1; i >= 0; i -= 1) {
      const r = ripples[i];

      r.update();
      r.draw();

      if (r.opacity <= 0) {
          ripples.splice(i, 1);
      }
  }
  animationFrame = window.requestAnimationFrame(animation);
};

animation();

document.addEventListener("mousemove", canvasMouseOver);
