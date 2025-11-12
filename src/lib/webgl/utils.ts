/**
 * WebGL Utility Functions
 *
 * Provides helper functions for shader compilation, program linking,
 * and common WebGL operations.
 */

/**
 * Compiles a WebGL shader from source code
 */
export function compileShader(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) {
    console.error('Failed to create shader')
    return null
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

/**
 * Links vertex and fragment shaders into a WebGL program
 */
export function createProgram(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) {
    console.error('Failed to create program')
    return null
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

/**
 * Creates a WebGL program from vertex and fragment shader source strings
 */
export function createProgramFromSources(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

  if (!vertexShader || !fragmentShader) {
    return null
  }

  const program = createProgram(gl, vertexShader, fragmentShader)

  // Clean up shaders after linking
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  return program
}

/**
 * Creates and initializes a WebGL buffer
 */
export function createBuffer(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  data: Float32Array | Uint16Array,
  target: number = WebGLRenderingContext.ARRAY_BUFFER,
  usage: number = WebGLRenderingContext.STATIC_DRAW
): WebGLBuffer | null {
  const buffer = gl.createBuffer()
  if (!buffer) {
    console.error('Failed to create buffer')
    return null
  }

  gl.bindBuffer(target, buffer)
  gl.bufferData(target, data, usage)
  gl.bindBuffer(target, null)

  return buffer
}

/**
 * Resizes canvas to match display size with device pixel ratio
 */
export function resizeCanvas(canvas: HTMLCanvasElement): boolean {
  const dpr = window.devicePixelRatio || 1
  const displayWidth = Math.floor(canvas.clientWidth * dpr)
  const displayHeight = Math.floor(canvas.clientHeight * dpr)

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth
    canvas.height = displayHeight
    return true
  }

  return false
}

/**
 * Creates a framebuffer with color and depth attachments
 */
export function createFramebuffer(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  width: number,
  height: number
): { framebuffer: WebGLFramebuffer; texture: WebGLTexture } | null {
  const framebuffer = gl.createFramebuffer()
  const texture = gl.createTexture()

  if (!framebuffer || !texture) {
    console.error('Failed to create framebuffer or texture')
    return null
  }

  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.error('Framebuffer is incomplete:', status)
    return null
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  return { framebuffer, texture }
}

/**
 * Generates Perlin-like noise value for breathing animation
 */
export function noise2D(x: number, y: number): number {
  // Simple pseudo-random noise function
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return n - Math.floor(n)
}

/**
 * Smoothstep interpolation
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/**
 * Cubic ease-out function for force falloff
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}
