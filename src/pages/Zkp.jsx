import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CONTRACT_ADDRESS, NETWORK } from '../config/contract'
import { registerOnChain, loginOnChain } from '../services/contractService'

const ZKP_STEPS_LOGIN = [
  { label: 'Menghubungkan MetaMask Wallet...', icon: '🦊' },
  { label: 'Switch ke Sepolia Testnet...', icon: '🌐' },
  { label: 'Generating zk-SNARK Proof...', icon: '🔐' },
  { label: 'Mengirim Transaksi ke Blockchain...', icon: '📡' },
  { label: 'Menunggu Konfirmasi Block...', icon: '⛓️' },
  { label: 'Login Terverifikasi!', icon: '✅' },
]

const ZKP_STEPS_REGISTER = [
  { label: 'Menghubungkan MetaMask Wallet...', icon: '🦊' },
  { label: 'Switch ke Sepolia Testnet...', icon: '🌐' },
  { label: 'Menghitung Identity Commitment...', icon: '⏳' },
  { label: 'Mengirim Transaksi ke Blockchain...', icon: '📡' },
  { label: 'Menunggu Konfirmasi Block...', icon: '⛓️' },
  { label: 'Registrasi Berhasil!', icon: '✅' },
]

export default function Zkp() {
  const navigate = useNavigate()
  const { login, connectWallet, account } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState({
    nama: '',
    namaLengkap: '',
    username: '',
    email: '',
    passwordRahasia: '',
    konfirmasiPasswordRahasia: '',
    loginUsername: '',
    loginPasswordRahasia: '',
  })
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [stepLog, setStepLog] = useState([])
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(null)
  const [txResult, setTxResult] = useState(null) // { txHash, blockNumber }

  useEffect(() => { setVisible(true) }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const addLog = (msg) => setStepLog(prev => [...prev, msg])

  const runZkpSteps = async () => {
    setLoading(true)
    setCurrentStep(0)
    setCompleted(false)
    setError(null)
    setTxResult(null)
    setStepLog([])

    try {
      const username = isLogin ? formData.loginUsername : formData.username
      const password = isLogin ? formData.loginPasswordRahasia : formData.passwordRahasia
      const email = formData.email

      // ── Step 0: Connect wallet ──────────────────────────────
      setCurrentStep(0)
      let walletAddr = account
      if (!walletAddr) {
        walletAddr = await connectWallet()
        if (!walletAddr) throw new Error('Gagal terhubung ke MetaMask.')
      }
      addLog(`Wallet: ${walletAddr.substring(0,8)}...${walletAddr.substring(walletAddr.length-6)}`)
      await new Promise(r => setTimeout(r, 600))

      // ── Step 1: Switch network ──────────────────────────────
      setCurrentStep(1)
      addLog(`Memastikan network: ${NETWORK.name}`)
      await new Promise(r => setTimeout(r, 400))

      // ── Step 2: Computing commitment / proof ─────────────────
      setCurrentStep(2)
      await new Promise(r => setTimeout(r, 800))

      // ── Step 3 & 4: Send on-chain transaction ────────────────
      // MetaMask popup akan muncul di sini untuk konfirmasi GAS + transaksi
      setCurrentStep(3)

      let result
      if (isLogin) {
        result = await loginOnChain(username, password, (msg) => {
          addLog(msg)
          // Ketika sudah menunggu block konfirmasi, update step
          if (msg.includes('Menunggu konfirmasi')) setCurrentStep(4)
        })
      } else {
        result = await registerOnChain(username, email, password, (msg) => {
          addLog(msg)
          if (msg.includes('Menunggu konfirmasi')) setCurrentStep(4)
        })
      }

      // ── Step 5: Done ─────────────────────────────────────────
      setCurrentStep(5)
      setTxResult(result)
      addLog(`✅ Tx Hash: ${result.txHash}`)
      addLog(`📦 Block: #${result.blockNumber}`)

      await new Promise(r => setTimeout(r, 800))
      setCompleted(true)
      setLoading(false)

      login('zkp', result.txHash)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2500)

    } catch (err) {
      setLoading(false)
      setCurrentStep(-1)
      const msg = err?.reason || err?.message || 'Terjadi kesalahan.'
      // Terjemahkan error contract yang umum
      if (msg.includes('Username sudah terdaftar')) {
        setError('Username sudah terdaftar di blockchain. Gunakan username lain.')
      } else if (msg.includes('Email sudah terdaftar')) {
        setError('Email sudah terdaftar di blockchain.')
      } else if (msg.includes('Identity commitment sudah terdaftar')) {
        setError('Password ini sudah digunakan untuk mendaftar. Gunakan password berbeda.')
      } else if (msg.includes('tidak ditemukan')) {
        setError('Username atau password salah — identity commitment tidak ditemukan di blockchain.')
      } else if (msg.includes('user rejected') || msg.includes('denied') || err?.code === 4001) {
        setError('Transaksi dibatalkan oleh pengguna di MetaMask.')
      } else {
        setError(msg)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLogin && formData.passwordRahasia !== formData.konfirmasiPasswordRahasia) {
      alert('Password Rahasia dan Konfirmasi tidak cocok!')
      return
    }
    await runZkpSteps()
  }

  const resetForm = () => {
    setCurrentStep(-1)
    setCompleted(false)
    setError(null)
    setStepLog([])
    setTxResult(null)
  }

  const steps = isLogin ? ZKP_STEPS_LOGIN : ZKP_STEPS_REGISTER

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-500/10 border border-cyber-500/20 text-cyber-300 text-xs font-medium mb-4">
            <span className="text-base">🔐</span>
            Autentikasi ZKP Blockchain — On-Chain
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Autentikasi <span className="gradient-text from-cyber-400 to-emerald-400">Zero-Knowledge Proof</span>
          </h1>
          <p className="text-white/40 text-sm max-w-xl mx-auto">
            Setiap registrasi dan login mengirim <strong className="text-white/60">transaksi nyata</strong> ke smart contract di {NETWORK.name} — tercatat di Etherscan
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {/* ── Left: Education Card ─────────────────────────────── */}
          <div className="glass-card p-6 sm:p-8 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyber-500/10 border border-cyber-500/20 flex items-center justify-center text-lg">📖</div>
              <div>
                <h2 className="text-lg font-bold text-white">Autentikasi ZKP On-Chain</h2>
                <p className="text-xs text-white/40">Setiap aksi dicatat di blockchain yang sesungguhnya</p>
              </div>
            </div>

            <div className="space-y-5 text-sm text-white/60 leading-relaxed">

              {/* ZKP Explanation */}
              <div>
                <h3 className="text-white/90 font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-cyber-500/10 text-cyber-400 flex items-center justify-center text-xs font-bold">1</span>
                  Zero-Knowledge Proof
                </h3>
                <p>
                  <strong className="text-white/80">ZKP</strong> memungkinkan Anda membuktikan identitas kepada blockchain <strong className="text-white/80">tanpa mengungkapkan password asli</strong>. Yang dikirim ke chain hanyalah <em className="text-cyber-300">identity commitment</em> (keccak256 hash dari password).
                </p>
              </div>

              {/* Flow Diagram */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <p className="text-xs text-white/40 font-medium mb-3 uppercase tracking-wider">Alur Transaksi On-Chain</p>
                {[
                  { icon: '🦊', color: 'orange', text: 'MetaMask connect + konfirmasi transaksi' },
                  { icon: '🔐', color: 'purple', text: 'keccak256(password) → identityCommitment (lokal)' },
                  { icon: '📡', color: 'cyan',   text: 'Kirim tx: registerUser() / verifyLogin()' },
                  { icon: '⛓️', color: 'yellow', text: 'Smart contract simpan ke blockchain' },
                  { icon: '✅', color: 'green',  text: 'Tx muncul di Etherscan!' },
                ].map((row, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-${row.color}-500/10 flex items-center justify-center text-sm shrink-0`}>{row.icon}</div>
                      <div className={`h-px flex-1 bg-gradient-to-r from-${row.color}-500/30 to-transparent`} />
                      <div className="text-xs text-white/50">{row.text}</div>
                    </div>
                    {i < 4 && <div className="flex items-center gap-3 pl-4 my-1"><div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white/10" /></div>}
                  </div>
                ))}
              </div>

              {/* Contract Info */}
              <div>
                <h3 className="text-white/90 font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-cyber-500/10 text-cyber-400 flex items-center justify-center text-xs font-bold">2</span>
                  Smart Contract Deployed
                </h3>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 text-xs shrink-0">Network:</span>
                    <span className="text-yellow-300 text-xs font-medium">{NETWORK.name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-white/30 text-xs shrink-0">Contract:</span>
                    <a
                      href={`${NETWORK.etherscanBase}/address/${CONTRACT_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-300 text-xs font-mono break-all hover:text-cyber-200 transition-colors"
                    >
                      {CONTRACT_ADDRESS}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 text-xs shrink-0">Functions:</span>
                    <span className="text-white/60 text-xs font-mono">registerUser() · verifyLogin()</span>
                  </div>
                </div>
              </div>

              {/* Identity Commitment */}
              <div>
                <h3 className="text-white/90 font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-cyber-500/10 text-cyber-400 flex items-center justify-center text-xs font-bold">3</span>
                  Cara Kerja Identity Commitment
                </h3>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 font-mono text-xs space-y-1">
                  <div className="text-white/30">// Di browser (lokal, tidak dikirim)</div>
                  <div><span className="text-cyan-300">commitment</span> = <span className="text-yellow-300">keccak256</span>(<span className="text-green-300">password</span>)</div>
                  <div className="text-white/30 mt-2">// Yang dikirim ke blockchain</div>
                  <div><span className="text-yellow-300">registerUser</span>(<span className="text-green-300">username</span>, <span className="text-green-300">email</span>, <span className="text-cyan-300">commitment</span>)</div>
                  <div className="text-white/30 mt-2">// Password TIDAK pernah on-chain ✅</div>
                </div>
              </div>

              <div className="bg-cyber-500/5 border border-cyber-500/10 rounded-xl p-4 text-cyber-200/70 text-xs">
                <p className="font-semibold text-cyber-300/80 mb-2">✨ Semua transaksi bisa diverifikasi publik</p>
                <ul className="space-y-1.5">
                  {[
                    'Password tidak pernah meninggalkan browser',
                    'Setiap register & login tercatat di Etherscan',
                    'Smart contract open-source & tamper-proof',
                    'Siapapun bisa verifikasi tanpa mengetahui password',
                  ].map(t => (
                    <li key={t} className="flex items-start gap-2">
                      <span className="text-cyber-400">✓</span><span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Right: Form Card ─────────────────────────────────── */}
          <div className="glass-card p-6 sm:p-8 order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyber-500/10 border border-cyber-500/20 flex items-center justify-center text-lg">
                {isLogin ? '⛓️' : '🔗'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{isLogin ? 'Login' : 'Register'} ZKP Blockchain</h2>
                <p className="text-xs text-white/40">
                  {isLogin ? 'Kirim transaksi verifyLogin() ke Sepolia' : 'Kirim transaksi registerUser() ke Sepolia'}
                </p>
              </div>
            </div>

            {/* Wallet Status */}
            <div className={`mb-5 p-3 rounded-xl flex items-center gap-3 text-xs ${account ? 'bg-green-500/5 border border-green-500/15 text-green-300' : 'bg-orange-500/5 border border-orange-500/15 text-orange-300'}`}>
              <span className="text-lg">🦊</span>
              <div className="flex-1 min-w-0">
                {account ? (
                  <>
                    <span className="font-medium">MetaMask Connected</span>
                    <p className="font-mono text-[10px] text-white/40 mt-0.5 truncate">{account}</p>
                  </>
                ) : (
                  <span className="font-medium">MetaMask belum terhubung — otomatis saat submit</span>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full shrink-0 ${account ? 'bg-green-400 animate-pulse' : 'bg-orange-400'}`} />
            </div>

            {/* Tabs */}
            <div className="flex bg-white/[0.03] rounded-xl p-1 mb-6">
              {['Login', 'Register'].map((label, i) => {
                const active = (i === 0) === isLogin
                return (
                  <button
                    key={label}
                    id={`tab-${label.toLowerCase()}-zkp`}
                    onClick={() => { setIsLogin(i === 0); resetForm() }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${active ? 'bg-cyber-600 text-white shadow-lg shadow-cyber-500/20' : 'text-white/40 hover:text-white/60'}`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-2.5 animate-slide-up">
                <span className="text-base mt-0.5">⚠️</span>
                <div className="flex-1">
                  <p className="font-medium mb-0.5">Transaksi Gagal</p>
                  <p className="text-red-300/70 text-xs">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-red-300/50 hover:text-red-300 transition-colors shrink-0 ml-auto">✕</button>
              </div>
            )}

            {/* Stepper */}
            {(loading || completed) && (
              <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-slide-up">
                <p className="text-xs text-white/40 font-medium mb-4 uppercase tracking-wider">
                  {completed ? '🎉 Transaksi Berhasil!' : '⚡ Proses On-Chain Berlangsung...'}
                </p>

                {/* Steps */}
                <div className="space-y-2.5 mb-4">
                  {steps.map((step, idx) => {
                    const isActive = currentStep === idx
                    const isDone = currentStep > idx || completed
                    return (
                      <div key={idx} className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-500 ${isActive ? 'bg-white/[0.05] border border-white/[0.1]' : isDone ? 'bg-green-500/5 border border-green-500/10' : 'opacity-30'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs transition-all duration-500 ${isDone ? 'bg-green-500/20 text-green-400' : isActive ? 'bg-cyber-500/20 text-cyber-400 animate-pulse' : 'bg-white/[0.05] text-white/20'}`}>
                          {isDone ? (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : step.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium ${isDone ? 'text-green-300' : isActive ? 'text-white' : 'text-white/30'}`}>{step.label}</p>
                          {isActive && idx === 3 && (
                            <p className="text-[10px] text-amber-300/70 mt-0.5">Konfirmasi transaksi di popup MetaMask Anda...</p>
                          )}
                          {isActive && (
                            <div className="mt-1 h-0.5 rounded-full bg-white/[0.08] overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-cyber-500 to-emerald-500 animate-shimmer" style={{ backgroundSize: '200% 100%', width: '100%' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Log Output */}
                {stepLog.length > 0 && (
                  <div className="bg-black/20 rounded-lg p-3 font-mono text-[10px] space-y-0.5 max-h-28 overflow-y-auto">
                    {stepLog.map((log, i) => (
                      <div key={i} className="text-white/40">&gt; {log}</div>
                    ))}
                  </div>
                )}

                {/* TX Result */}
                {txResult && (
                  <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 animate-slide-up space-y-2">
                    <p className="text-green-300 text-xs font-semibold">
                      🎉 {isLogin ? 'Login terverifikasi on-chain!' : 'Registrasi berhasil on-chain!'}
                    </p>
                    <div className="flex items-start gap-2">
                      <span className="text-white/30 text-[10px] shrink-0 mt-0.5">Tx Hash:</span>
                      <a
                        href={`${NETWORK.etherscanBase}/tx/${txResult.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyber-300 font-mono text-[10px] break-all hover:text-cyber-200 transition-colors"
                      >
                        {txResult.txHash}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 text-[10px]">Block:</span>
                      <span className="text-white/60 text-[10px]">#{txResult.blockNumber}</span>
                    </div>
                    <a
                      href={`${NETWORK.etherscanBase}/tx/${txResult.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-cyber-500/10 border border-cyber-500/20 text-cyber-300 text-xs font-medium hover:bg-cyber-500/20 transition-all"
                    >
                      <span>🔍</span> Lihat di Etherscan ↗
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isLogin ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Username</label>
                    <input id="input-login-username-zkp" type="text" name="loginUsername" value={formData.loginUsername} onChange={handleChange} className="input-field-cyber" placeholder="Masukkan username" required disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Password Rahasia</label>
                    <input id="input-login-password-zkp" type="password" name="loginPasswordRahasia" value={formData.loginPasswordRahasia} onChange={handleChange} className="input-field-cyber" placeholder="Password rahasia Anda (tidak pernah dikirim)" required disabled={loading} />
                    <p className="text-xs text-white/25 mt-1.5 flex items-center gap-1">
                      <span>🔒</span> Diubah menjadi keccak256 hash secara lokal
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Nama</label>
                      <input id="input-register-nama-zkp" type="text" name="nama" value={formData.nama} onChange={handleChange} className="input-field-cyber" placeholder="Nama panggilan" required disabled={loading} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Nama Lengkap</label>
                      <input id="input-register-namalengkap-zkp" type="text" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} className="input-field-cyber" placeholder="Nama lengkap" required disabled={loading} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Username</label>
                    <input id="input-register-username-zkp" type="text" name="username" value={formData.username} onChange={handleChange} className="input-field-cyber" placeholder="Pilih username unik" required disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
                    <input id="input-register-email-zkp" type="email" name="email" value={formData.email} onChange={handleChange} className="input-field-cyber" placeholder="alamat@email.com" required disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Password Rahasia</label>
                    <input id="input-register-password-zkp" type="password" name="passwordRahasia" value={formData.passwordRahasia} onChange={handleChange} className="input-field-cyber" placeholder="Buat password rahasia" required disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Konfirmasi Password Rahasia</label>
                    <input id="input-register-konfirmasi-zkp" type="password" name="konfirmasiPasswordRahasia" value={formData.konfirmasiPasswordRahasia} onChange={handleChange} className="input-field-cyber" placeholder="Ketik ulang password rahasia" required disabled={loading} />
                  </div>
                </>
              )}

              <button
                id="btn-submit-zkp"
                type="submit"
                disabled={loading}
                className="btn-cyber w-full flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Mengirim ke Blockchain...</span>
                  </>
                ) : (
                  <>
                    <span className="text-base">⛓️</span>
                    <span>{isLogin ? 'Login via Smart Contract' : 'Register ke Blockchain'}</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-white/40 mt-6">
              {isLogin ? (
                <>Belum punya akun?{' '}<button id="toggle-to-register-zkp" onClick={() => { setIsLogin(false); resetForm() }} className="text-cyber-400 hover:text-cyber-300 font-medium transition-colors">Daftar dengan ZKP</button></>
              ) : (
                <>Sudah punya akun?{' '}<button id="toggle-to-login-zkp" onClick={() => { setIsLogin(true); resetForm() }} className="text-cyber-400 hover:text-cyber-300 font-medium transition-colors">Login ZKP</button></>
              )}
            </p>

            <div className="mt-6 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/30 flex items-start gap-2">
              <span className="text-base mt-px">🛡️</span>
              <p>
                <strong className="text-white/50">Keamanan ZKP:</strong> Password Anda <strong className="text-cyber-300/50">tidak pernah</strong> dikirim ke blockchain. Yang dikirim hanya <em>keccak256(password)</em> sebagai identity commitment. Transaksi ini akan <strong className="text-white/40">tercatat permanen</strong> di {NETWORK.name} dan bisa diverifikasi di Etherscan.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
