import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js";

import { vertexShader } from "./shaders/vertexShader.glsl.js";
import { fragmentShader } from "./shaders/fragmentShader.glsl.js";

const canvas = document.querySelector(".hero_img_canvas");

let hero_img_texture =
  "https://images.unsplash.com/photo-1667138325583-a30e62c66e29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80";

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
    this.perspective = 1;
    this.uMouse = new THREE.Vector2(0, 0);

    this.uTexture = new THREE.TextureLoader().load(hero_img_texture);
  }

  init() {
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
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene = new THREE.Scene();

    // setting fov:
    let fov =
      (50 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
      Math.PI;

    this.camera = new THREE.OrthographicCamera(
      -this.perspective / 2,
      this.perspective / 2,
      this.perspective / 2,
      -this.perspective / 2,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, this.perspective);
    this.scene.add(this.camera);

    window.addEventListener("resize", this.onWindowResize.bind(this));

    this.createPlaneMesh();
    this.OrbitControls();
    this.render();
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      e.preventDefault;
      this.uMouse.x = e.clientX / this.viewport.width;
      this.uMouse.y = 1.0 - e.clientY / this.viewport.height;
    });
  }

  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    // this.camera.fov =
    //   (50 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
    //   Math.PI;

    this.renderer.setSize(
      container[0].clientWidth,
      container[0].clientHeight,
      false
    );
    this.renderer.setPixelRatio = devicePixelRatio;
    this.camera.updateProjectionMatrix();
  }

  createPlaneMesh() {
    const segments = 10;

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, segments, segments);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        progress: { type: "f", value: 0 },
        uTime: { type: "f", value: 0 },
        uTexture: { type: "t", value: this.uTexture },
      },
      side: THREE.DoubleSide,
      // wireframe: true,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  OrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
  }

  render() {
    this.controls.update();

    this.time += 0.01;
    this.material.uniforms.uTime.value = this.time;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

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
}

new WebGL().init();
