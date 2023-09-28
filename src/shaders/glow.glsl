precision mediump float;
varying vec2 fragCoord;
uniform sampler2D uMainSampler;
uniform vec2 resolution;
uniform float time;

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    vec3 color = texture2D(uMainSampler, st).xyz;

    // Glow 효과 적용
    float glowStrength = 0.2;
    vec3 glowColor = vec3(1.0, 1.0, 0.0); // Glow 색상 (노란색)

    vec3 glow = glowColor * smoothstep(0.3, 0.5, length(st - vec2(0.5)));
    color += glow * glowStrength;

    gl_FragColor = vec4(color, 1.0);
}
