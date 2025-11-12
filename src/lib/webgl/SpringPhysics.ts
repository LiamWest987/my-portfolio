/**
 * SpringPhysics - Node Physics Simulation
 *
 * Implements mass-spring-damper system with Verlet integration
 * for magnetic snap-back behavior with subtle overshoot.
 */

// Physics utilities no longer needed since mouse interaction is disabled
// import { noise2D, easeOutCubic } from './utils';

export interface Node {
  // Current position
  x: number
  y: number

  // Rest position (where spring pulls toward)
  restX: number
  restY: number

  // Velocity for physics
  vx: number
  vy: number

  // Visual properties
  scale: number
  glow: number
}

export interface MouseState {
  x: number
  y: number
  vx: number
  vy: number
  isActive: boolean
}

export class SpringPhysics {
  private nodes: Node[] = []
  private mouse: MouseState = { x: 0, y: 0, vx: 0, vy: 0, isActive: false }
  private time: number = 0

  // Breathing animation constants
  private readonly breathFrequency = 0.3 // Hz - slower wave
  private readonly breathAmplitude = 3 // pixels - subtle

  constructor(
    private gridSpacing: number,
    private canvasWidth: number,
    private canvasHeight: number
  ) {
    this.initializeNodes()
  }

  /**
   * Initialize grid of nodes with rest positions
   */
  private initializeNodes(): void {
    this.nodes = []
    const cols = Math.ceil(this.canvasWidth / this.gridSpacing) + 1
    const rows = Math.ceil(this.canvasHeight / this.gridSpacing) + 1

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * this.gridSpacing
        const y = row * this.gridSpacing

        this.nodes.push({
          x,
          y,
          restX: x,
          restY: y,
          vx: 0,
          vy: 0,
          scale: 1,
          glow: 0,
        })
      }
    }
  }

  /**
   * Update mouse position and velocity
   */
  updateMouse(clientX: number, clientY: number, deltaTime: number): void {
    if (!this.mouse.isActive) {
      this.mouse.x = clientX
      this.mouse.y = clientY
      this.mouse.isActive = true
      return
    }

    // Calculate velocity (smoothed)
    const dx = clientX - this.mouse.x
    const dy = clientY - this.mouse.y
    const vx = dx / deltaTime
    const vy = dy / deltaTime

    // Exponential moving average for smooth velocity
    const alpha = 0.3
    this.mouse.vx = alpha * vx + (1 - alpha) * this.mouse.vx
    this.mouse.vy = alpha * vy + (1 - alpha) * this.mouse.vy

    this.mouse.x = clientX
    this.mouse.y = clientY
  }

  /**
   * Deactivate mouse (when leaving canvas)
   */
  deactivateMouse(): void {
    this.mouse.isActive = false
  }

  /**
   * Update physics simulation - SIMPLIFIED (no mouse interaction)
   */
  update(deltaTime: number): void {
    this.time += deltaTime

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i]!

      // Breathing animation offset only
      const breathOffset = this.calculateBreathingOffset(node.restX, node.restY, this.time)

      // Set position directly (no physics)
      node.x = node.restX + breathOffset.x
      node.y = node.restY + breathOffset.y

      // Reset visual effects (no interaction)
      node.scale = 1
      node.glow = 0
    }
  }

  /**
   * Calculate breathing animation offset - organic overlapping waves and circles
   */
  private calculateBreathingOffset(x: number, y: number, time: number): { x: number; y: number } {
    const centerX = this.canvasWidth / 2
    const centerY = this.canvasHeight / 2

    // Circular ripple from center
    const distFromCenter = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY))
    const ripplePhase = distFromCenter * 0.005 - time * this.breathFrequency * Math.PI * 2
    const ripple = Math.sin(ripplePhase) * this.breathAmplitude

    // Diagonal wave
    const diagonalPhase = x * 0.002 + y * 0.002 + time * this.breathFrequency * Math.PI * 2
    const diagonal = Math.sin(diagonalPhase) * this.breathAmplitude * 0.6

    // Horizontal wave (slower)
    const horizontalPhase = x * 0.003 + time * this.breathFrequency * Math.PI * 1.3
    const horizontal = Math.sin(horizontalPhase) * this.breathAmplitude * 0.4

    // Vertical wave (different speed)
    const verticalPhase = y * 0.003 + time * this.breathFrequency * Math.PI * 1.7
    const vertical = Math.cos(verticalPhase) * this.breathAmplitude * 0.4

    // Combine all wave patterns
    return {
      x: ripple * 0.4 + diagonal * 0.3 + horizontal * 0.3,
      y: ripple * 0.4 + diagonal * 0.3 + vertical * 0.3,
    }
  }

  /**
   * Get all nodes for rendering
   */
  getNodes(): readonly Node[] {
    return this.nodes
  }

  /**
   * Get mouse state for shader uniforms
   */
  getMouseState(): Readonly<MouseState> {
    return this.mouse
  }

  /**
   * Get current animation time
   */
  getTime(): number {
    return this.time
  }

  /**
   * Resize grid when canvas dimensions change
   */
  resize(canvasWidth: number, canvasHeight: number): void {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.initializeNodes()
  }

  /**
   * Get grid dimensions
   */
  getGridDimensions(): { cols: number; rows: number } {
    const cols = Math.ceil(this.canvasWidth / this.gridSpacing) + 1
    const rows = Math.ceil(this.canvasHeight / this.gridSpacing) + 1
    return { cols, rows }
  }
}
