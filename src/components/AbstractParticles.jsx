import { useEffect, useRef } from 'react'

class Particle {
  constructor(x, y, canvasWidth, canvasHeight) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 2
    this.vy = (Math.random() - 0.5) * 2
    this.size = Math.random() * 3 + 1
    this.color = this.randomColor()
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.life = 1
    this.decay = Math.random() * 0.005 + 0.002
  }

  randomColor() {
    const colors = [
      { r: 255, g: 100, b: 100 },
      { r: 100, g: 150, b: 255 },
      { r: 150, g: 255, b: 150 },
      { r: 255, g: 200, b: 100 },
      { r: 200, g: 100, b: 255 },
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    // Wrap around edges
    if (this.x < 0) this.x = this.canvasWidth
    if (this.x > this.canvasWidth) this.x = 0
    if (this.y < 0) this.y = this.canvasHeight
    if (this.y > this.canvasHeight) this.y = 0

    // Decay and regenerate
    this.life -= this.decay
    if (this.life <= 0) {
      this.life = 1
      this.color = this.randomColor()
    }
  }

  draw(ctx) {
    ctx.globalAlpha = this.life * 0.8
    ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`
    ctx.fillRect(this.x, this.y, this.size, this.size)
  }
}

function AbstractParticles() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      ctx.scale(dpr, dpr)

      // Initialize particles on resize
      particlesRef.current = []
      const particleCount = Math.min(Math.floor((rect.width * rect.height) / 5000), 200)
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(
          new Particle(
            Math.random() * rect.width,
            Math.random() * rect.height,
            rect.width,
            rect.height
          )
        )
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      
      // Motion blur effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, rect.width, rect.height)

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update()
        particle.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  )
}

export default AbstractParticles
