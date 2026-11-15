import React, { useEffect, useRef } from "react";

// --- GLSL Shaders ---
const VERTEX_SHADER = `#version 300 es
void main(){
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const BAYER_DITHER = `
float bayer(vec2 f){
  const float B[16] = float[16](
     0.0,  8.0,  2.0, 10.0,
    12.0,  4.0, 14.0,  6.0,
     3.0, 11.0,  1.0,  9.0,
    15.0,  7.0, 13.0,  5.0
  );
  int x = int(mod(f.x, 4.0));
  int y = int(mod(f.y, 4.0));
  return B[y * 4 + x] / 16.0;
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2  iResolution;
uniform float uTime;
uniform float uFade;
uniform vec3  uPaper;
uniform vec3  uHue[3];

const int NBAND = 3;
const float WARP = 0.46;
const float REACH[3] = float[3](0.32, 0.27, 0.22);
const vec2 FREQ[3] = vec2[3](vec2(0.42, 1.25), vec2(0.55, 1.62), vec2(0.70, 2.08));
const float FLOW[3] = float[3](0.038, 0.048, 0.060);
const float ROLL[3] = float[3](0.012, 0.016, 0.021);
const float SEED[3] = float[3](0.0, 17.0, 41.0);
const float LO[3] = float[3](0.24, 0.28, 0.32);
const float HI[3] = float[3](0.76, 0.72, 0.68);
const float CREST[3] = float[3](0.68, 0.64, 0.60);
const float BLADE[3] = float[3](0.22, 0.20, 0.18);
const float GLINT[3] = float[3](0.40, 0.34, 0.28);

vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

${BAYER_DITHER}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / iResolution;

  vec2 p = vec2(uv.x * (iResolution.x / max(iResolution.y, 1.0)), uv.y);
  p.y += 0.16 * p.x;

  float wx = snoise(vec3(p.x * 0.85, p.y * 1.30, uTime * 0.031));
  float wy = snoise(vec3(p.x * 1.10 + 4.7, p.y * 1.60, uTime * 0.024 + 9.3));
  vec2 q = p + WARP * vec2(wx, wy);

  float lum = dot(uPaper, vec3(0.2126, 0.7152, 0.0722));
  float gain = mix(0.70, 1.0, smoothstep(0.10, 0.72, lum));

  vec3 col = uPaper;
  for(int i = 0; i < NBAND; i++){
    float n = snoise(vec3(
      q.x * FREQ[i].x + uTime * FLOW[i],
      q.y * FREQ[i].y,
      uTime * ROLL[i] + SEED[i]
    )) * 0.5 + 0.5;

    float body = smoothstep(LO[i], HI[i], n);
    col = mix(col, mix(uPaper, uHue[i], REACH[i] * gain), body * body);

    float spine = smoothstep(CREST[i] - BLADE[i], CREST[i], n)
                * (1.0 - smoothstep(CREST[i], CREST[i] + BLADE[i], n));
    col = mix(col, mix(uPaper, uHue[i], GLINT[i] * gain), spine * 0.50);
  }

  // Soft smooth ambient edge vignette without harsh center donut hole
  float d = length((uv - 0.5) * vec2(1.10, 1.00));
  col = mix(col, uPaper, smoothstep(0.55, 1.10, d) * 0.35);

  col = mix(uPaper, col, clamp(uFade, 0.0, 1.0));
  col += (bayer(frag) - 0.5) / 255.0;

  outColor = vec4(max(col, 0.0), 1.0);
}`;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export interface AmbientWavesProps {
  className?: string;
  style?: React.CSSProperties;
  paperColor?: string; // Hex color (default: #000000 for dark theme)
  waveColors?: readonly [string, string, string] | [string, string, string]; // 3 hex colors
}

// React.memo prevents re-rendering unless actual props change
export const AmbientWavesBackground: React.FC<AmbientWavesProps> = React.memo(({
  className = "",
  style = {},
  paperColor = "#000000",
  waveColors = ["#ea580c", "#2563eb", "#10b981"],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Store colors in refs so the render loop always reads latest values WITHOUT re-compiling shaders or restarting!
  const paperRef = useRef<[number, number, number]>(hexToRgb(paperColor));
  const huesRef = useRef<Float32Array>(new Float32Array(9));

  // Update color refs whenever props change, WITHOUT restarting WebGL
  useEffect(() => {
    paperRef.current = hexToRgb(paperColor);
    const hues = waveColors.map(hexToRgb);
    for (let i = 0; i < 3; i++) {
      huesRef.current[i * 3 + 0] = hues[i][0];
      huesRef.current[i * 3 + 1] = hues[i][1];
      huesRef.current[i * 3 + 2] = hues[i][2];
    }
  }, [paperColor, waveColors[0], waveColors[1], waveColors[2]]);

  // WebGL context and continuous animation loop initializes ONCE on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });

    if (!gl) return;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    const vao = gl.createVertexArray();
    const locRes = gl.getUniformLocation(program, "iResolution");
    const locTime = gl.getUniformLocation(program, "uTime");
    const locFade = gl.getUniformLocation(program, "uFade");
    const locPaper = gl.getUniformLocation(program, "uPaper");
    const locHue = gl.getUniformLocation(program, "uHue");

    let animationId = 0;
    let last = 0;
    let time = 0;
    let fade = 0;
    const FADE_S = 1.6;
    const MAX_STEP_S = 1 / 15;

    // Populate initial hues
    const initialHues = waveColors.map(hexToRgb);
    for (let i = 0; i < 3; i++) {
      huesRef.current[i * 3 + 0] = initialHues[i][0];
      huesRef.current[i * 3 + 1] = initialHues[i][1];
      huesRef.current[i * 3 + 2] = initialHues[i][2];
    }

    function render(now: number) {
      const delta = last === 0 ? 0 : Math.min((now - last) / 1000, MAX_STEP_S);
      last = now;
      time += delta;
      fade = Math.min(1, fade + delta / FADE_S);

      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }

      const paper = paperRef.current;
      const flatHues = huesRef.current;

      gl!.useProgram(program);
      gl!.bindVertexArray(vao);
      gl!.uniform2f(locRes, w, h);
      gl!.uniform1f(locTime, time);
      gl!.uniform1f(locFade, fade);
      gl!.uniform3f(locPaper, paper[0], paper[1], paper[2]);
      gl!.uniform3fv(locHue, flatHues);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);

      animationId = requestAnimationFrame(render);
    }

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteVertexArray(vao);
    };
  }, []); // Run ONCE on mount! NEVER tears down or reloads on parent UI state changes!

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        ...style,
      }}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
});

AmbientWavesBackground.displayName = "AmbientWavesBackground";
