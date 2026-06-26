import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Welcome() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12">
      {/* Hero Section */}
      <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Tugas 9 — Blockchain Authentication
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-balance">
          <span className="text-white">Selamat Datang di</span>
          <br />
          <span className="gradient-text from-brand-400 via-purple-400 to-cyber-400 leading-tight">
            SecureAuth
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-6 leading-relaxed text-balance">
          Platform edukasi interaktif untuk memahami perbedaan sistem autentikasi{' '}
          <span className="text-brand-400 font-medium">konvensional</span> berbasis database terpusat
          dengan autentikasi{' '}
          <span className="text-cyber-400 font-medium">Zero-Knowledge Proof (ZKP)</span>{' '}
          pada Blockchain.
        </p>

        {/* Content Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          
          {/* Konvensional Column */}
          <div className="flex flex-col gap-4">
            <div className="glass-card p-6 text-left flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏛️</span>
                <span className="text-base font-semibold text-white/90">Konvensional</span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                Autentikasi tradisional menyimpan password (hash + salt) di server terpusat. 
                Rentan terhadap kebocoran data & single point of failure.
              </p>
            </div>
            
            <button
              onClick={() => navigate('/konvensional')}
              id="btn-konvensional"
              className="group relative w-full overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-500 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <div className="relative flex items-center justify-between px-6 py-5">
                <div className="text-left">
                  <div className="text-white font-bold text-base">Login dengan Konvensional</div>
                  <div className="text-brand-200/70 text-xs mt-0.5">Database Terpusat · Hash & Salt</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors shrink-0 ml-3">
                  <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* ZKP Column */}
          <div className="flex flex-col gap-4">
            <div className="glass-card p-6 text-left flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔐</span>
                <span className="text-base font-semibold text-white/90">Zero-Knowledge Proof</span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                ZKP membuktikan pengetahuan tanpa mengungkapkan rahasia. 
                Password tidak pernah dikirim — hanya bukti kriptografis yang diverifikasi on-chain.
              </p>
            </div>

            <button
              onClick={() => navigate('/zkp')}
              id="btn-zkp"
              className="group relative w-full overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-600 to-emerald-500 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <div className="relative flex items-center justify-between px-6 py-5">
                <div className="text-left">
                  <div className="text-white font-bold text-base">Login dengan ZKP</div>
                  <div className="text-cyber-200/70 text-xs mt-0.5">Blockchain · Zero-Knowledge Proof</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors shrink-0 ml-3">
                  <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-16 flex items-center justify-center gap-3 text-white/20 text-xs">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/20" />
          <span>Powered by Ethereum & SnarkJS</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/20" />
        </div>
      </div>
    </main>
  )
}
