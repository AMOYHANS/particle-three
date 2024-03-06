varying vec3 vColor;
uniform float uTime;
void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleDiff = (1.0 / distanceToCenter) * uTime ;
    angle += angleDiff;
    modelPosition.xz = vec2(cos(angle), sin(angle)) * distanceToCenter;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    vColor = color;
    gl_Position = projectedPosition;
    // 距离衰减
    gl_PointSize = (10.0 / -viewPosition.z);
}