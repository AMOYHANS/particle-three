varying vec3 vColor;
void main()
{
    // 圆盘
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5, strength);
    // strength = 1.0 - strength;

    // gl_PointCoord是每个粒子的uv坐标渐变贴图
    // gl_FragColor = vec4(gl_PointCoord, 0.0, 1.0);

    // 分散形状的圆盘
    float strength = 2.0 * distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 5.0);
    vec3 col = mix(vec3(0.2), vColor, strength);
    gl_FragColor = vec4(col, 1.0);
}