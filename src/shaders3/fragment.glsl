varying vec2 vUv;
varying float vElevation;
uniform vec3 uHighColor;
uniform vec3 uLowColor;

void main() {
    vec3 color = mix(uLowColor, uHighColor, vElevation * 5.0);
    gl_FragColor = vec4(color,1.0);
}

