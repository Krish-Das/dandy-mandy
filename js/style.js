const padding_top = document.querySelectorAll(".padding_top");
const padding_right = document.querySelectorAll(".padding_right");
const padding_bottom = document.querySelectorAll(".padding_bottom");
const padding_left = document.querySelectorAll(".padding_left");

const nav_logo = document.querySelector(".nav_logo");

function setGridSize() {
  const golden_grid_row = document.querySelectorAll(".golden_grid_row");
  const golden_grid_column = document.querySelectorAll(".golden_grid_column");

  golden_grid_row.forEach((element) => {
    element.style.display = "grid";
    element.style.gridTemplateRows = `${PHI}fr 1fr`;
  });

  golden_grid_column.forEach((element) => {
    element.style.display = "grid";
    element.style.gridTemplateColumns = `${PHI}fr 1fr`;
  });
}

function setCustomPadding() {
  padding_top.forEach((element) => {
    element.style.paddingTop = `${goldenPadding.top}px`;
  });

  padding_right.forEach((element) => {
    element.style.paddingRight = `${goldenPadding.right}px`;
  });

  padding_bottom.forEach((element) => {
    element.style.paddingBottom = `${goldenPadding.bottom}px`;
  });

  padding_left.forEach((element) => {
    element.style.paddingLeft = `${goldenPadding.left}px`;
  });
}

function resizeNavLogo() {
  nav_logo.style.top = `${container[0].clientHeight - goldenPadding.bottom}px`;
  nav_logo.style.left = `${goldenPadding.left}px`;
  nav_logo.style.width = `${
    goldenRatio.width + goldenPadding.right * PHI - goldenPadding.left
  }px`;
}

function positionHomeCtaBtn() {
  const hero_cta_btn = document.querySelector(".hero_cta_btn");
  hero_cta_btn.style.top = `${goldenRatio.height}px`;
  hero_cta_btn.style.left = `${
    goldenRatio.width +
    (container[0].clientWidth - goldenRatio.width) / PHI ** 3
  }px`;
}

function resizeStyle() {
  setCustomPadding();
  resizeNavLogo();
  positionHomeCtaBtn();
}

window.addEventListener("resize", resizeStyle);
resizeStyle();
setGridSize();