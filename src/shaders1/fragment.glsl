precision mediump float;

uniform sampler2D uTexture;
varying float vDiff;
varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    if(textureColor.xyz != vec3(1.0)){

        gl_FragColor = textureColor + vElevation * 0.2 - 0.3;
    }else{
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}