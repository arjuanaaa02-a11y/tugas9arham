import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CONTRACT_ADDRESS } from '../config/contract'

export default function Dashboard() {
  const { account, isAuthenticated, authMethod, txSignature, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect ke home jika tidak login
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Simple Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard Pengguna</h1>
          <p className="text-white/50 text-sm">
            Selamat datang kembali. Anda masuk melalui metode <strong className="text-white/80">{authMethod === 'zkp' ? 'ZKP Blockchain' : 'Konvensional'}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sidebar / Profile Card */}
          <div className="glass-card p-6 lg:col-span-1 flex flex-col h-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-cyber-500 p-[2px] shrink-0">
                <div className="w-full h-full rounded-full bg-surface-900 flex items-center justify-center text-2xl">
                  🧑‍💻
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Siswa Web3</h2>
                <p className="text-xs text-white/50">siswa@blockchain.edu</p>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-medium">Status Autentikasi</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Aktif ({authMethod?.toUpperCase()})
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/[0.05]">
              <button
                onClick={logout}
                className="w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.05] rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Keluar Sesi
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            
            <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              
              {/* Wallet Info Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <span className="text-lg">🦊</span> Koneksi MetaMask
                  </h3>
                  {account ? (
                    <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-md">Connected</span>
                  ) : (
                    <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-md">Not Connected</span>
                  )}
                </div>
                
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <p className="text-brand-300 font-mono text-sm break-all">{account || 'Belum ada dompet yang terhubung.'}</p>
                  </div>
                  {account && (
                    <button 
                      onClick={() => navigator.clipboard.writeText(account)}
                      className="shrink-0 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      Copy
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between mb-5 mt-6">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <span className="text-lg">⛓️</span> Smart Contract
                  </h3>
                  <span className="px-2.5 py-1 bg-cyber-500/10 text-cyber-400 text-xs font-medium rounded-md">AuthZKP</span>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-cyber-300 font-mono text-sm break-all">{CONTRACT_ADDRESS}</p>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(CONTRACT_ADDRESS)}
                    className="shrink-0 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    Copy
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.05] w-full" />

              {/* Activity Log Section */}
              <div className="p-6">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-6">
                  <span className="text-lg">📜</span> Aktivitas Terbaru
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                      🔑
                    </div>
                    <div>
                      <p className="text-white/90 text-sm font-medium">Berhasil Login via {authMethod?.toUpperCase()}</p>
                      <p className="text-white/40 text-xs mt-1">Baru saja</p>
                    </div>
                  </div>

                  {authMethod === 'zkp' && (
                    <div className="flex items-start gap-3 pt-4 border-t border-white/[0.05]">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                        🦊
                      </div>
                      <div>
                        <p className="text-white/90 text-sm font-medium">MetaMask Signature Terverifikasi</p>
                        <p className="text-white/40 text-xs mt-1 mb-2">Transaksi dikonfirmasi melalui tanda tangan digital MetaMask.</p>
                        {txSignature && (
                          <div className="bg-white/[0.02] px-2.5 py-1.5 rounded text-xs font-mono text-orange-400/80 inline-block border border-white/[0.05] break-all max-w-full">
                            Sig: {txSignature.substring(0, 26)}...{txSignature.substring(txSignature.length - 10)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {authMethod === 'zkp' && (
                    <div className="flex items-start gap-3 pt-4 border-t border-white/[0.05]">
                      <div className="w-8 h-8 rounded-lg bg-cyber-500/20 text-cyber-400 flex items-center justify-center shrink-0">
                        ⛓️
                      </div>
                      <div>
                        <p className="text-white/90 text-sm font-medium">ZKP Proof Terverifikasi</p>
                        <p className="text-white/40 text-xs mt-1 mb-2">Smart Contract memverifikasi tanpa password asli.</p>
                        <div className="bg-white/[0.02] px-2.5 py-1.5 rounded text-xs font-mono text-cyber-400/80 inline-block border border-white/[0.05]">
                          Tx: 0x8a9b7c...def123 (Simulasi)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
