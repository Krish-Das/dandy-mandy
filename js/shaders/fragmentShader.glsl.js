export const fragmentShader = `
uniform float uTime;
uniform float progress;
uniform vec4 resolution;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793;

void main() {
  // gl_FragColor = vec4(vUv, 0.0, 1.0);
  gl_FragColor = vec4(texture2D(uTexture, vUv));
}
`;
