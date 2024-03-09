uniform float uTime;
varying float vRandom;

void main(){
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 1.0 - distanceToCenter;
    float alpha =  0.3 / distanceToCenter - 0.5;
    gl_FragColor = vec4(0.5,vec2(strength + sin(uTime * 1.5 + vRandom * 100.0)), alpha);
}