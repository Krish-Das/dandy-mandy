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
    this.imgIdx = 0;

    this.pixelSize = 100; // ?: control -> total distortion pixel | number | no range

    this.introSpeed = 90; // ?: control -> % | range(0 - 100)
    this.introStregnth = 10; // ?: control -> throw stregnth of intro animation | % | range(0 - 100)

    this.radiusClamp = 100; // ?: control -> % | range(1 - 100)
    this.effectRadius = 8; // ?: control -> blobsize | % | range(1 - 100)
    this.mousePower = 20; // ?: control -> throw stregnth of the mouse | number | no range

    this.maxRadiusClamp = 3; // TODO: Make it dependent on this.pixelSize

    this.hero_img_texture = [];
  }
  init() {
    this.time = 0;
    this.perspective = 1;

    this.uMouse = new THREE.Vector2();
    this.uMouseSpeed = new THREE.Vector2();
    this.prevMouse = new THREE.Vector2();

    this.pixelSize = Math.floor(this.pixelSize);
    this.imgRes = this.pixelSize ** 2;

    // Normalizing and ranging
    this.introStregnth = Math.floor(255 * (this.introStregnth / 100)); // ?: range -> (0, 255)
    this.effectRadius = (this.pixelSize * this.effectRadius) / 100;
    this.introSpeed = this.introSpeed / 100;
    this.radiusClamp = (1 / (this.radiusClamp / 100)) * this.maxRadiusClamp;

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
    window.addEventListener("mousemove", this.onMouseMove.bind(this)); // TODO: change position
    this.orbitControls();
    this.render();
  }

  onMouseMove(e) {
    e.preventDefault;
    this.uMouse.x = e.clientX / this.viewport.width;
    this.uMouse.y = 1.0 - e.clientY / this.viewport.height;
    this.material.uniforms.uMouse.value = this.uMouse;

    // calculating the mouse speed
    this.uMouseSpeed.x = this.uMouse.x - this.prevMouse.x;
    this.uMouseSpeed.y = this.uMouse.y - this.prevMouse.y;

    this.prevMouse.x = this.uMouse.x;
    this.prevMouse.y = this.uMouse.y;
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
    this.initDataTexture();

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
        uDataTexture: { type: "t", value: this.dataTexture },
        uMouse: { type: "vector2", value: this.uMouse },
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

  initDataTexture() {
    // TODO: Fix the lines below
    // segments
    // this.imgWidth = this.hero_images[this.imgIdx].width / this.pixelClamp;
    // this.imgHeight = this.hero_images[this.imgIdx].height / this.pixelClamp;

    const data = new Float32Array(4 * this.imgRes);

    for (let i = 0; i < this.imgRes; i++) {
      const r = Math.random() * this.introStregnth;

      const stride = i * 4;

      data[stride] = r; // Horizontal animation
      data[stride + 1] = r; // Vertical Animation
    }

    // used the buffer to create a DataTexture
    this.dataTexture = new THREE.DataTexture(
      data,
      this.pixelSize,
      this.pixelSize,
      THREE.RGBFormat,
      THREE.FloatType
    );
    this.dataTexture.needsUpdate = true;

    this.dataTexture.magFilter = this.dataTexture.minFilter =
      THREE.NearestFilter;
  }

  updateDataTexture() {
    let data = this.dataTexture.image.data;
    let maxdist = (this.pixelSize / this.effectRadius) ** this.radiusClamp;
    let gridMouse = {
      x: this.pixelSize * this.uMouse.x,
      y: this.pixelSize * this.uMouse.y,
    };

    // intro animation:
    for (let i = 0; i < data.length; i += 3) {
      data[i] *= this.introSpeed;
      data[i + 1] *= this.introSpeed;
    }

    for (let i = 0; i < this.pixelSize; i++) {
      for (let j = 0; j < this.pixelSize; j++) {
        let distance = (gridMouse.x - i) ** 2 + (gridMouse.y - j) ** 2;

        if (distance < maxdist) {
          let index = (i + this.pixelSize * j) * 3;
          let power = (Math.sqrt(distance) / maxdist) * this.mousePower;

          data[index] += this.uMouseSpeed.x * power;
          data[index + 1] += this.uMouseSpeed.y * power;
        }
      }
    }

    this.uMouseSpeed.x *= 0.9;
    this.uMouseSpeed.y *= 0.9;

    this.dataTexture.needsUpdate = true;
  }

  orbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // this.controls.enablePan = false;
    this.controls.enableRotate = false;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    this.controls.touches = {
      ONE: THREE.MOUSE.PAN,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
  }

  render() {
    this.controls.update();
    this.updateDataTexture();

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
