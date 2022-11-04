export const fragmentShader = `
uniform float uTime;
uniform float progress;
uniform vec4 resolution;
uniform sampler2D uTexture;
uniform sampler2D uDataTexture;
uniform vec2 scale;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793;

void main() {

  vec2 newUv = (vUv - vec2(0.5))/scale + vec2(0.5);
  vec4 imgTexture = texture2D(uTexture, newUv);
  vec4 offset = texture2D(uDataTexture, vUv);
  
  // gl_FragColor = vec4(vUv, 0.0, 1.0);
  // gl_FragColor = offset;
  gl_FragColor = vec4(texture2D(uTexture, (newUv - 0.08 * offset.rg))); // pixel density // TODO: control
}
`;
