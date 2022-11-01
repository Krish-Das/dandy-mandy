import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js";

import { vertexShader } from "./shaders/vertexShader.glsl.js";
import { fragmentShader } from "./shaders/fragmentShader.glsl.js";

const canvas = document.querySelector(".hero_img_canvas");

/**
 *
 * @param {Iniger} angle Angle in degree
 * @returns Angle in Radian
 */
function convertRad(angle) {
  return angle * (Math.PI / 180);
}

class WebGL {
  constructor() {
    this.time = 0;
    this.perspective = 70;
    this.uMouse = new THREE.Vector2(0, 0);

    this.scene = new THREE.Scene();

    this.onMouseMove();
    this.setupCamera();
    this.setupRenderer();
    this.createPlaneMesh();
    this.OrbitControls();
    this.render();
  }

  //
  // ***  ------------- Methods -------------- ***
  //

  /**
   * Gets the viewport dimentions
   * @return viewport Width
   * @return viewport Height
   * @return viewport Aspect Ratio
   */
  get viewport() {
    let width = innerWidth;
    let height = innerHeight;
    let aspectRatio = width / height;
    return { width, height, aspectRatio };
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      e.preventDefault;
      this.uMouse.x = e.clientX / this.viewport.width;
      this.uMouse.y = 1.0 - e.clientY / this.viewport.height;
    });
  }

  setupCamera() {
    // when window resizes
    window.addEventListener("resize", this.onWindowResize.bind(this));

    // setting fov:
    let fov =
      (50 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
      Math.PI;
    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.viewport.aspectRatio,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, this.perspective);
    this.scene.add(this.camera);
  }

  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.fov =
      (50 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
      Math.PI;
    this.renderer.setSize(
      container[0].clientWidth,
      container[0].clientHeight,
      false
    );
    // this.renderer.setSize(innerWidth, innerHeight, false);
    this.renderer.setPixelRatio = devicePixelRatio;
    this.camera.updateProjectionMatrix();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas,
    });

    this.renderer.setSize(
      container[0].clientWidth,
      container[0].clientHeight,
      false
    );
    // this.renderer.setSize(innerWidth, innerHeight, false);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  createPlaneMesh() {
    this.planeGeometry = new THREE.PlaneBufferGeometry(30, 30, 10, 10);
    this.planeMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        progress: { type: "f", value: 0 },
      },
      side: THREE.DoubleSide,
      // wireframe: true,
    });
    this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.scene.add(this.planeMesh);
  }

  OrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
  }

  render() {
    this.controls.update();

    this.time += 0.01;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

new WebGL();
