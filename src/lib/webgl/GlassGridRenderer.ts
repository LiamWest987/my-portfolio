/**
 * GlassGridRenderer - WebGL Rendering Engine
 *
 * Orchestrates multi-pass rendering of blueprint grid with glass overlay.
 * Implements instanced rendering for performance and render-to-texture
 * for glass distortion effects.
 */

import { SpringPhysics, type Node } from './SpringPhysics'
import { createProgramFromSources, createBuffer, createFramebuffer, resizeCanvas } from './utils'

// Vertex Shader for Grid
const gridVertexShader = `
precision mediump float;

attribute vec2 a_position;
attribute vec2 a_nodeOffset;
attribute float a_scale;
attribute float a_glow;

uniform vec2 u_resolution;
uniform mat4 u_projection;

varying float v_scale;
varying float v_glow;
varying vec2 v_position;

void main() {
  vec2 position = a_position + a_nodeOffset;
  vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_PointSize = 6.0 * a_scale;
  v_scale = a_scale;
  v_glow = a_glow;
  v_position = position;
}
`

// Fragment Shader for Grid
const gridFragmentShader = `
precision mediump float;

varying float v_scale;
varying float v_glow;
varying vec2 v_position;

uniform vec3 u_nodeColor;
uniform vec3 u_glowColor;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  float alpha = smoothstep(0.5, 0.3, dist);

  vec3 color = u_nodeColor;

  if (v_glow > 0.01) {
    color = mix(u_nodeColor, u_glowColor, v_glow);
    float pulse = sin(u_time * 3.0) * 0.1 + 0.9;
    alpha += v_glow * 0.5 * pulse;
  }

  float scaleIntensity = (v_scale - 1.0) * 0.3 + 1.0;
  color *= scaleIntensity;

  // Glass glint effect - animated light position
  vec2 glintPos = vec2(
    u_resolution.x * 0.5 + sin(u_time * 0.3) * u_resolution.x * 0.4,
    u_resolution.y * 0.4 + cos(u_time * 0.25) * u_resolution.y * 0.3
  );

  float distToGlint = length(v_position - glintPos);
  float glintRadius = u_resolution.x * 0.25; // 25% of screen width
  float glint = smoothstep(glintRadius, glintRadius * 0.3, distToGlint);

  // Add subtle white highlight for glass effect
  color += vec3(1.0, 1.0, 1.0) * glint * 0.4;

  gl_FragColor = vec4(color, alpha);
}
`

// Fragment Shader for Liquid Glass - Proper Glass with Rim Lighting
const glassFragmentShader = `
precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_gridTexture;
uniform vec2 u_resolution;
uniform float u_time;

// Smooth noise for glass surface
float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = noise(i);
  float b = noise(i + vec2(1.0, 0.0));
  float c = noise(i + vec2(0.0, 1.0));
  float d = noise(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Blur for frosted glass effect - Optimized to 5x5 kernel
vec4 blur(sampler2D tex, vec2 uv, float radius) {
  vec4 color = vec4(0.0);
  float total = 0.0;

  // 5x5 kernel (reduced from 7x7 for better performance)
  for(float x = -2.0; x <= 2.0; x += 1.0) {
    for(float y = -2.0; y <= 2.0; y += 1.0) {
      vec2 offset = vec2(x, y) * radius / u_resolution;
      color += texture2D(tex, clamp(uv + offset, 0.0, 1.0));
      total += 1.0;
    }
  }

  return color / total;
}

void main() {
  vec2 uv = v_texCoord;

  // STEP 1: Generate glass height/thickness map
  float timeScale = u_time * 0.1;
  float scale = 3.5;

  // Multi-octave noise for organic glass shapes
  float height = smoothNoise(uv * scale + timeScale) * 0.5
               + smoothNoise(uv * scale * 2.2 - timeScale * 0.6) * 0.3
               + smoothNoise(uv * scale * 0.7 + timeScale * 0.4) * 0.2;

  // STEP 2: Calculate surface normals from height
  float eps = 0.01;
  float hL = smoothNoise((uv - vec2(eps, 0.0)) * scale + timeScale) * 0.5
           + smoothNoise((uv - vec2(eps, 0.0)) * scale * 2.2 - timeScale * 0.6) * 0.3;
  float hR = smoothNoise((uv + vec2(eps, 0.0)) * scale + timeScale) * 0.5
           + smoothNoise((uv + vec2(eps, 0.0)) * scale * 2.2 - timeScale * 0.6) * 0.3;
  float hD = smoothNoise((uv - vec2(0.0, eps)) * scale + timeScale) * 0.5
           + smoothNoise((uv - vec2(0.0, eps)) * scale * 2.2 - timeScale * 0.6) * 0.3;
  float hU = smoothNoise((uv + vec2(0.0, eps)) * scale + timeScale) * 0.5
           + smoothNoise((uv + vec2(0.0, eps)) * scale * 2.2 - timeScale * 0.6) * 0.3;

  // Surface normal (amplified for visible distortion)
  vec3 normal = normalize(vec3((hL - hR) * 3.0, (hD - hU) * 3.0, 1.0));

  // STEP 3: Distortion based on surface normal (lensing)
  vec2 distortion = normal.xy * 0.04;

  // STEP 4: Variable blur based on glass thickness (reduced for performance)
  float thickness = height;
  float blurRadius = mix(0.8, 2.0, thickness); // Reduced from (1.0, 3.5) for better performance

  // STEP 5: Sample background with blur + distortion + chromatic aberration
  float aberration = 0.002; // Reduced from 0.004
  vec2 uvR = clamp(uv + distortion + vec2(aberration, 0.0), 0.0, 1.0);
  vec2 uvG = clamp(uv + distortion, 0.0, 1.0);
  vec2 uvB = clamp(uv + distortion - vec2(aberration, 0.0), 0.0, 1.0);

  vec4 colorR = blur(u_gridTexture, uvR, blurRadius);
  vec4 colorG = blur(u_gridTexture, uvG, blurRadius);
  vec4 colorB = blur(u_gridTexture, uvB, blurRadius);

  vec3 blurredColor = vec3(colorR.r, colorG.g, colorB.b);

  // STEP 6: Just use the blurred, distorted background (no tint)
  vec3 finalColor = blurredColor;

  gl_FragColor = vec4(finalColor, colorG.a);
}
`

export interface RendererConfig {
  gridSpacing?: number
  nodeColor?: [number, number, number]
  glowColor?: [number, number, number]
  backgroundColor?: [number, number, number, number]
}

export class GlassGridRenderer {
  private gl: WebGLRenderingContext | null = null
  private physics: SpringPhysics | null = null

  // Shader programs
  private gridProgram: WebGLProgram | null = null
  private glassProgram: WebGLProgram | null = null

  // Buffers
  private positionBuffer: WebGLBuffer | null = null
  private offsetBuffer: WebGLBuffer | null = null
  private scaleBuffer: WebGLBuffer | null = null
  private glowBuffer: WebGLBuffer | null = null

  // Framebuffer for render-to-texture
  private framebuffer: WebGLFramebuffer | null = null
  private gridTexture: WebGLTexture | null = null

  // Full-screen quad for glass pass
  private quadBuffer: WebGLBuffer | null = null
  private quadTexCoordBuffer: WebGLBuffer | null = null

  // Configuration
  private gridSpacing: number = 30
  private nodeColor: [number, number, number] = [0.5, 0.7, 1.0] // Brighter blueprint blue
  private glowColor: [number, number, number] = [0.7, 0.95, 1.0] // Bright cyan
  private backgroundColor: [number, number, number, number] = [0.04, 0.05, 0.08, 1.0] // Dark blue default

  // Performance tracking
  private lastTime: number = 0
  private frameCount: number = 0
  private fps: number = 60

  constructor(
    private canvas: HTMLCanvasElement,
    config: RendererConfig = {}
  ) {
    this.gridSpacing = config.gridSpacing || this.gridSpacing
    this.nodeColor = config.nodeColor || this.nodeColor
    this.glowColor = config.glowColor || this.glowColor
    this.backgroundColor = config.backgroundColor || this.backgroundColor

    this.initialize()
  }

  /**
   * Initialize WebGL context and resources
   */
  private initialize(): boolean {
    // Get WebGL context
    this.gl =
      (this.canvas.getContext('webgl') as WebGLRenderingContext) ||
      (this.canvas.getContext('experimental-webgl') as WebGLRenderingContext)

    if (!this.gl) {
      console.error('WebGL not supported')
      return false
    }

    const gl = this.gl

    // Initialize physics (canvas should already be sized by component)
    this.physics = new SpringPhysics(this.gridSpacing, this.canvas.width, this.canvas.height)

    // Compile shaders
    this.gridProgram = createProgramFromSources(gl, gridVertexShader, gridFragmentShader)

    // Glass shader needs a simple pass-through vertex shader
    const glassVertexShader = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `

    this.glassProgram = createProgramFromSources(gl, glassVertexShader, glassFragmentShader)

    if (!this.gridProgram || !this.glassProgram) {
      console.error('Failed to create shader programs')
      return false
    }

    // Initialize buffers
    this.initializeBuffers()

    // Create framebuffer for render-to-texture
    const fb = createFramebuffer(gl, this.canvas.width, this.canvas.height)
    if (fb) {
      this.framebuffer = fb.framebuffer
      this.gridTexture = fb.texture
    }

    // WebGL state
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    return true
  }

  /**
   * Initialize all WebGL buffers
   */
  private initializeBuffers(): void {
    if (!this.gl || !this.physics) return
    const gl = this.gl

    const nodes = this.physics.getNodes()

    // Position buffer (base grid positions)
    const positions = new Float32Array(nodes.length * 2)
    nodes.forEach((node, i) => {
      positions[i * 2] = node.restX
      positions[i * 2 + 1] = node.restY
    })
    this.positionBuffer = createBuffer(gl, positions)

    // Offset buffer (updated each frame from physics)
    const offsets = new Float32Array(nodes.length * 2)
    this.offsetBuffer = createBuffer(gl, offsets, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW)

    // Scale buffer (updated each frame)
    const scales = new Float32Array(nodes.length)
    this.scaleBuffer = createBuffer(gl, scales, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW)

    // Glow buffer (updated each frame)
    const glows = new Float32Array(nodes.length)
    this.glowBuffer = createBuffer(gl, glows, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW)

    // Full-screen quad for glass pass
    const quadPositions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    this.quadBuffer = createBuffer(gl, quadPositions)

    const quadTexCoords = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1])
    this.quadTexCoordBuffer = createBuffer(gl, quadTexCoords)
  }

  /**
   * Update physics simulation
   */
  update(deltaTime: number): void {
    if (!this.physics) return
    this.physics.update(deltaTime)
  }

  /**
   * Update mouse position
   */
  updateMouse(clientX: number, clientY: number, deltaTime: number): void {
    if (!this.physics) return

    // Client coordinates are in screen pixels (0 to window width)
    // Canvas is sized as screenWidth * DPR
    // Nodes are positioned from 0 to canvasWidth
    // So we need to convert: clientX * DPR = canvas X coordinate
    const dpr = window.devicePixelRatio || 1
    const x = clientX * dpr
    const y = clientY * dpr

    this.physics.updateMouse(x, y, deltaTime)
  }

  /**
   * Deactivate mouse
   */
  deactivateMouse(): void {
    if (!this.physics) return
    this.physics.deactivateMouse()
  }

  /**
   * Render frame
   */
  render(time: number): void {
    if (!this.gl || !this.physics || !this.gridProgram || !this.glassProgram) {
      console.warn('Render skipped:', {
        gl: !!this.gl,
        physics: !!this.physics,
        gridProgram: !!this.gridProgram,
        glassProgram: !!this.glassProgram,
      })
      return
    }

    const nodes = this.physics.getNodes()
    const mouseState = this.physics.getMouseState()

    // Update dynamic buffers
    this.updateBuffers(nodes)

    // PASS 1: Render grid to texture
    this.renderGridPass(time, nodes)

    // PASS 2: Render glass overlay with refraction
    this.renderGlassPass(time, mouseState)

    // Performance tracking
    this.updateFPS(time)
  }

  /**
   * Pass 1: Render grid to framebuffer
   */
  private renderGridPass(time: number, nodes: readonly Node[]): void {
    if (!this.gl || !this.gridProgram) return
    const gl = this.gl

    // Bind framebuffer to render to texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)

    // Clear with configured background color
    gl.clearColor(...this.backgroundColor)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Use grid program
    gl.useProgram(this.gridProgram)

    // Set uniforms
    const uResolution = gl.getUniformLocation(this.gridProgram, 'u_resolution')
    const uNodeColor = gl.getUniformLocation(this.gridProgram, 'u_nodeColor')
    const uGlowColor = gl.getUniformLocation(this.gridProgram, 'u_glowColor')
    const uTime = gl.getUniformLocation(this.gridProgram, 'u_time')

    gl.uniform2f(uResolution, this.canvas.width, this.canvas.height)
    gl.uniform3fv(uNodeColor, this.nodeColor)
    gl.uniform3fv(uGlowColor, this.glowColor)
    gl.uniform1f(uTime, time)

    // Set attributes
    this.setGridAttributes()

    // Draw points
    gl.drawArrays(gl.POINTS, 0, nodes.length)

    // Unbind framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  /**
   * Pass 2: Render glass overlay with distortion
   */
  private renderGlassPass(
    time: number,
    _mouseState: { x: number; y: number; isActive: boolean }
  ): void {
    if (!this.gl || !this.glassProgram || !this.gridTexture) return
    const gl = this.gl

    // Render to canvas
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)

    // Use glass program
    gl.useProgram(this.glassProgram)

    // Set uniforms
    const uGridTexture = gl.getUniformLocation(this.glassProgram, 'u_gridTexture')
    const uResolution = gl.getUniformLocation(this.glassProgram, 'u_resolution')
    const uTime = gl.getUniformLocation(this.glassProgram, 'u_time')

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.gridTexture)
    gl.uniform1i(uGridTexture, 0)

    gl.uniform2f(uResolution, this.canvas.width, this.canvas.height)
    gl.uniform1f(uTime, time)

    // Set attributes for full-screen quad
    this.setGlassAttributes()

    // Draw quad
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  /**
   * Set grid rendering attributes
   */
  private setGridAttributes(): void {
    if (!this.gl || !this.gridProgram) return
    const gl = this.gl

    const aPosition = gl.getAttribLocation(this.gridProgram, 'a_position')
    const aNodeOffset = gl.getAttribLocation(this.gridProgram, 'a_nodeOffset')
    const aScale = gl.getAttribLocation(this.gridProgram, 'a_scale')
    const aGlow = gl.getAttribLocation(this.gridProgram, 'a_glow')

    // Position
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    // Offset
    gl.bindBuffer(gl.ARRAY_BUFFER, this.offsetBuffer)
    gl.enableVertexAttribArray(aNodeOffset)
    gl.vertexAttribPointer(aNodeOffset, 2, gl.FLOAT, false, 0, 0)

    // Scale
    gl.bindBuffer(gl.ARRAY_BUFFER, this.scaleBuffer)
    gl.enableVertexAttribArray(aScale)
    gl.vertexAttribPointer(aScale, 1, gl.FLOAT, false, 0, 0)

    // Glow
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glowBuffer)
    gl.enableVertexAttribArray(aGlow)
    gl.vertexAttribPointer(aGlow, 1, gl.FLOAT, false, 0, 0)
  }

  /**
   * Set glass rendering attributes
   */
  private setGlassAttributes(): void {
    if (!this.gl || !this.glassProgram) return
    const gl = this.gl

    const aPosition = gl.getAttribLocation(this.glassProgram, 'a_position')
    const aTexCoord = gl.getAttribLocation(this.glassProgram, 'a_texCoord')

    // Position
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    // Texture coordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadTexCoordBuffer)
    gl.enableVertexAttribArray(aTexCoord)
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0)
  }

  /**
   * Update dynamic buffers with current node states
   */
  private updateBuffers(nodes: readonly Node[]): void {
    if (!this.gl) return
    const gl = this.gl

    // Offsets
    const offsets = new Float32Array(nodes.length * 2)
    nodes.forEach((node, i) => {
      offsets[i * 2] = node.x - node.restX
      offsets[i * 2 + 1] = node.y - node.restY
    })
    gl.bindBuffer(gl.ARRAY_BUFFER, this.offsetBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.DYNAMIC_DRAW)

    // Scales
    const scales = new Float32Array(nodes.map(n => n.scale))
    gl.bindBuffer(gl.ARRAY_BUFFER, this.scaleBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, scales, gl.DYNAMIC_DRAW)

    // Glows
    const glows = new Float32Array(nodes.map(n => n.glow))
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glowBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, glows, gl.DYNAMIC_DRAW)
  }

  /**
   * Handle canvas resize
   */
  resize(): void {
    if (!this.gl || !this.physics) return

    const resized = resizeCanvas(this.canvas)
    if (resized) {
      this.physics.resize(this.canvas.width, this.canvas.height)

      // Recreate framebuffer with new size
      const fb = createFramebuffer(this.gl, this.canvas.width, this.canvas.height)
      if (fb) {
        // Clean up old framebuffer
        if (this.framebuffer) this.gl.deleteFramebuffer(this.framebuffer)
        if (this.gridTexture) this.gl.deleteTexture(this.gridTexture)

        this.framebuffer = fb.framebuffer
        this.gridTexture = fb.texture
      }

      // Reinitialize buffers
      this.initializeBuffers()
    }
  }

  /**
   * Track FPS for performance monitoring
   */
  private updateFPS(time: number): void {
    this.frameCount++
    if (time - this.lastTime >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastTime = time
    }
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps
  }

  /**
   * Clean up WebGL resources
   */
  destroy(): void {
    if (!this.gl) return

    // Delete buffers
    if (this.positionBuffer) this.gl.deleteBuffer(this.positionBuffer)
    if (this.offsetBuffer) this.gl.deleteBuffer(this.offsetBuffer)
    if (this.scaleBuffer) this.gl.deleteBuffer(this.scaleBuffer)
    if (this.glowBuffer) this.gl.deleteBuffer(this.glowBuffer)
    if (this.quadBuffer) this.gl.deleteBuffer(this.quadBuffer)
    if (this.quadTexCoordBuffer) this.gl.deleteBuffer(this.quadTexCoordBuffer)

    // Delete programs
    if (this.gridProgram) this.gl.deleteProgram(this.gridProgram)
    if (this.glassProgram) this.gl.deleteProgram(this.glassProgram)

    // Delete framebuffer
    if (this.framebuffer) this.gl.deleteFramebuffer(this.framebuffer)
    if (this.gridTexture) this.gl.deleteTexture(this.gridTexture)

    this.gl = null
    this.physics = null
  }
}
