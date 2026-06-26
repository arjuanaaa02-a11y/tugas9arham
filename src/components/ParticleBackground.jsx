import { useState, useEffect } from 'react'

export default function ParticleBackground() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const generated = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.05,
    }))
    setParticles(generated)
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-600/[0.07] blur-[120px] animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyber-500/[0.05] blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full bg-purple-600/[0.04] blur-[100px] animate-float" style={{ animationDelay: '6s' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      
      {/* Floating Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-brand-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
