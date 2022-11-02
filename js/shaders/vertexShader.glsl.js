export const vertexShader = `
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
