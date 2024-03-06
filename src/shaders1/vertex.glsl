uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uTime;
// 或者model和view合二为一的modelView（二者相乘）
// uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute float aDiff;

varying vec3 vNormal;
varying float vDiff;
varying vec2 vUv;
varying float vElevation;

void main(){
    vDiff = aDiff;
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modelPosition.x + uTime) * 1.5 + sin(modelPosition.y * 0.5 + uTime) * 0.5;
    vElevation = elevation;
    modelPosition.z += elevation;
    gl_Position = projectionMatrix * viewMatrix* modelPosition;
}