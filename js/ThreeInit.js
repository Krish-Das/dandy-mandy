import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js";

import { vertexShader } from "./shaders/vertexShader.js";
import { fragmentShader } from "./shaders/fragmentShader.js";

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
    this.perspective = 1;
    this.uMouse = new THREE.Vector2(0, 0);

    this.imgIdx = 0;
    this.hero_img_texture = [];
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas,
    });

    this.renderer.setSize(innerWidth, innerHeight, false);
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

    this.getTextures();
    this.createMesh();
    this.updateTexture();
    this.orbitControls();
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
    this.updateTexture();

    this.camera.aspect = this.perspective;

    this.renderer.setSize(innerWidth, innerHeight, false);
    this.renderer.setPixelRatio = devicePixelRatio;
    this.camera.updateProjectionMatrix();
  }

  getTextures() {
    document.querySelectorAll(".hero_img_container img").forEach((element) => {
      let { src, width, height } = element;
      let aspect = width / height;

      this.hero_img_texture.push({ src, width, height, aspect });
    });

    this.uTexture = new THREE.TextureLoader().load(
      this.hero_img_texture[this.imgIdx].src
    );
  }

  createMesh() {
    const segments = 10;

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, segments, segments);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        progress: { type: "f", value: 0 },
        uTime: { type: "f", value: 0 },
        uTexture: { type: "t", value: this.uTexture },
        scale: { type: "v", value: new THREE.Vector2(1, 1) },
      },
      side: THREE.DoubleSide,
      // wireframe: true,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  updateTexture() {
    let parentAspect =
      canvas.parentElement.clientWidth / canvas.parentElement.clientHeight;
    let imgAspect = this.hero_img_texture[this.imgIdx].aspect;
    let shaderScale = this.material.uniforms.scale.value;

    if (imgAspect > parentAspect) {
      shaderScale.set(imgAspect / parentAspect, 1);
    } else {
      shaderScale.set(1, parentAspect / imgAspect);
    }
  }

  orbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enablePan = false;
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
