const PHI = (1 + Math.sqrt(5)) / 2;

const container = document.querySelectorAll(".container");
const sizeHeading = document.getElementById("sizeHeading");

const canvas2d = document.querySelector(".canvas2d");
const ctx = canvas2d.getContext("2d");

let goldenPadding = {};
let goldenRatio = {};

function getGoldenRatio() {
  goldenRatio = {
    width: container[0].clientWidth / PHI,
    height: container[0].clientHeight / PHI,
  };
}

function getGoldenPadding() {
  goldenPadding = {
    top: goldenRatio.height / PHI ** 4,
    right: goldenRatio.width / PHI ** 4,
    bottom: goldenRatio.height / PHI ** 3 - goldenRatio.height / PHI ** 4,
    left: goldenRatio.width / PHI ** 3 - goldenRatio.width / PHI ** 4,
  };
}

function changeSizeHeading() {
  sizeHeading.innerText = `${container[0].clientWidth} X ${container[0].clientHeight}`;
}

function initCanvas2d() {
  canvas2d.width = container[0].clientWidth;
  canvas2d.height = container[0].clientHeight;

  draw2d();
}

function draw2d() {
  const pointsX = [goldenRatio.height];
  const pointsY = [
    goldenRatio.width,
    // goldenRatio.width + (canvas2d.width - goldenRatio.width) / PHI ** 3,
  ];

  function drawXLines() {
    for (let i = 0; i < pointsX.length; i++) {
      ctx.moveTo(0, pointsX[i]);
      ctx.lineTo(canvas2d.width, pointsX[i]);
    }
    ctx.stroke();
  }

  function drawYLines() {
    for (let i = 0; i < pointsY.length; i++) {
      ctx.moveTo(pointsY[i], 0);
      ctx.lineTo(pointsY[i], canvas2d.height);
    }
    ctx.stroke();
  }

  // TODO: position the lines behind the CTA
  function drawXLines() {
    ctx.moveTo(goldenRatio.width, 0);
    ctx.lineTo(goldenRatio.width, canvas2d.height);
    ctx.moveTo(goldenRatio.width, goldenRatio.height);
    ctx.lineTo(canvas2d.width, goldenRatio.height);
    ctx.stroke();
  }

  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.5;

  //   drawXLines();
  //   drawYLines();
  drawXLines();
}

function onWindowResize() {
  getGoldenRatio();
  getGoldenPadding();
  changeSizeHeading();
  initCanvas2d();
}

window.addEventListener("resize", onWindowResize);
onWindowResize();
