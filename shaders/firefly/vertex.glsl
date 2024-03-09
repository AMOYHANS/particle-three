uniform float uTime;
attribute float aRandom;
varying float vRandom;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.xy += sin(modelPosition.x * 10.0 + uTime) * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    gl_PointSize = 30.0 * (1.0 / -viewPosition.z);
    vRandom = aRandom;
}
