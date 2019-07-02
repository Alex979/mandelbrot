precision highp float;

varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;
uniform float time;
uniform float iterations;
uniform float zoom;
uniform vec2 offset;

const int MAX_ITERATIONS = 10000;

float mandelbrot(vec2 position, float limit) {
  float n = 0.0;
  vec2 z = vec2(0.0, 0.0);
  for(int i = 0; i < MAX_ITERATIONS; i++) {
    if((z.x * z.x) + (z.y * z.y) > 4.0 || n >= limit) {
      return n;
    }
    z = vec2(((z.x * z.x) - (z.y * z.y)) + position.x, (2.0 * z.x * z.y) + position.y);
    n += 1.0;
  }
  return 1.0;
}

void main() {
  vec2 screenPos = vTextureCoord * inputSize.xy + outputFrame.xy;
  float numIterations = mandelbrot(((((screenPos.xy / outputFrame.ww) - ((outputFrame.zw / outputFrame.ww) / 2.0)) * 4.0) / zoom) + offset, iterations);
  gl_FragColor = vec4(numIterations / iterations, numIterations / iterations, numIterations / iterations, 1.0);
}