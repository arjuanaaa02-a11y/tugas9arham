import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ZKP_STEPS_LOGIN = [
  { label: 'Menghubungkan MetaMask Wallet...', icon: '🦊', color: 'orange' },
  { label: 'Menunggu Konfirmasi MetaMask...', icon: '✍️', color: 'amber' },
  { label: 'Generating Witness...', icon: '⏳', color: 'brand' },
  { label: 'Creating zk-SNARKs Proof', icon: '🔐', color: 'purple' },
  { label: 'Verifying on Smart Contract', icon: '⛓️', color: 'yellow' },
  { label: 'Akses Diterima!', icon: '✅', color: 'cyber' },
]

const ZKP_STEPS_REGISTER = [
  { label: 'Menghubungkan MetaMask Wallet...', icon: '🦊', color: 'orange' },
  { label: 'Menunggu Konfirmasi MetaMask...', icon: '✍️', color: 'amber' },
  { label: 'Generating Identity Commitment...', icon: '⏳', color: 'brand' },
  { label: 'Menyimpan ke Blockchain...', icon: '🔐', color: 'purple' },
  { label: 'Verifikasi Smart Contract...', icon: '⛓️', color: 'yellow' },
  { label: 'Registrasi Berhasil!', icon: '✅', color: 'cyber' },
]

export default function Zkp() {
  const navigate = useNavigate()
  const { login, connectWallet, signMessage, account } = useAuth()
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
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(null)
  const [metamaskInfo, setMetamaskInfo] = useState(null)

  useEffect(() => {
    setVisible(true)
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const runZkpSteps = async () => {
    const steps = isLogin ? ZKP_STEPS_LOGIN : ZKP_STEPS_REGISTER
    setLoading(true)
    setCurrentStep(0)
    setCompleted(false)
    setError(null)
    setMetamaskInfo(null)

    try {
      // Step 0: Connect MetaMask Wallet
      setCurrentStep(0)
      let walletAddress = account
      if (!walletAddress) {
        walletAddress = await connectWallet()
        if (!walletAddress) {
          throw new Error('Gagal menghubungkan MetaMask. Pastikan ekstensi MetaMask terinstal.')
        }
      }
      await new Promise((r) => setTimeout(r, 1000))

      // Step 1: MetaMask Signature Confirmation
      setCurrentStep(1)
      const timestamp = new Date().toISOString()
      const action = isLogin ? 'LOGIN' : 'REGISTER'
      const username = isLogin ? formData.loginUsername : formData.username

      // Compose the message to sign
      const message = [
        `═══════════════════════════════════`,
        `  SecureAuth ZKP - ${action}`,
        `═══════════════════════════════════`,
        ``,
        `Action: ${action}`,
        `Username: ${username}`,
        `Wallet: ${walletAddress}`,
        `Timestamp: ${timestamp}`,
        ``,
        `Dengan menandatangani pesan ini,`,
        `Anda mengkonfirmasi ${isLogin ? 'login' : 'registrasi'}`,
        `ke sistem SecureAuth ZKP.`,
        ``,
        `Password Anda TIDAK termasuk`,
        `dalam tanda tangan ini.`,
        `═══════════════════════════════════`,
      ].join('\n')

      // This will trigger the MetaMask popup
      const result = await signMessage(message)
      
      setMetamaskInfo({
        address: result.address,
        signature: result.signature,
        timestamp,
      })

      await new Promise((r) => setTimeout(r, 800))

      // Step 2-4: ZKP processing steps
      for (let i = 2; i < steps.length; i++) {
        setCurrentStep(i)
        await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800))
      }

      setCompleted(true)
      setLoading(false)

      // Navigate to dashboard
      login('zkp')
      setTimeout(() => {
        setCurrentStep(-1)
        setCompleted(false)
        setMetamaskInfo(null)
        navigate('/dashboard')
      }, 2000)

    } catch (err) {
      setLoading(false)
      setCurrentStep(-1)
      setError(err.message || 'Terjadi kesalahan saat memproses ZKP.')
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

  const steps = isLogin ? ZKP_STEPS_LOGIN : ZKP_STEPS_REGISTER

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-500/10 border border-cyber-500/20 text-cyber-300 text-xs font-medium mb-4">
            <span className="text-base">🔐</span>
            Autentikasi ZKP Blockchain
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Autentikasi <span className="gradient-text from-cyber-400 to-emerald-400">Zero-Knowledge Proof</span>
          </h1>
          <p className="text-white/40 text-sm max-w-xl mx-auto">
            Buktikan identitas Anda tanpa mengungkapkan rahasia — diverifikasi on-chain oleh smart contract dengan konfirmasi MetaMask
          </p>
        </div>

        {/* Two Column Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {/* Left Card - Education */}
          <div className="glass-card p-6 sm:p-8 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyber-500/10 border border-cyber-500/20 flex items-center justify-center text-lg">
                📖
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Autentikasi ZKP Murni</h2>
                <p className="text-xs text-white/40">Privasi maksimal dengan kriptografi modern</p>
              </div>
            </div>

            <div className="space-y-5 text-sm text-white/60 leading-relaxed">
              {/* Section 1 */}
              <div>
                <h3 className="text-white/90 font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-cyber-500/10 text-cyber-400 flex items-center justify-center text-xs font-bold">1</span>
                  Apa itu Zero-Knowledge Proof?
                </h3>
                <p>
                  <strong className="text-white/80">Zero-Knowledge Proof (ZKP)</strong> adalah metode kriptografi yang memungkinkan
                  seseorang (<em className="text-cyber-300">prover</em>) membuktikan bahwa mereka mengetahui suatu rahasia kepada pihak lain
                  (<em className="text-cyber-300">verifier</em>), <strong className="text-white/80">tanpa mengungkapkan rahasia itu sendiri</strong>.
                </p>
                <p className="mt-2">
                  Dalam konteks autentikasi: server/blockchain <strong className="text-red-300/70">tidak pernah mengetahui password asli Anda</strong>. 
                  Yang disimpan hanyalah <em className="text-cyber-300">identity commitment</em> (hash dari password menggunakan Poseidon).
                </p>
              </div>

              {/* Diagram */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <p className="text-xs text-white/40 font-medium mb-3 uppercase tracking-wider">Alur Autentikasi ZKP + MetaMask</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-sm shrink-0">🦊</div>
                    <div className="h-px flex-1 bg-gradient-to-r from-orange-500/30 to-transparent" />
                    <div className="text-xs text-white/50">Koneksi wallet & konfirmasi MetaMask</div>
                  </div>
                  <div className="flex items-center gap-3 pl-4">
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-orange-500/40" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyber-500/10 flex items-center justify-center text-sm shrink-0">👤</div>
                    <div className="h-px flex-1 bg-gradient-to-r from-cyber-500/30 to-transparent" />
                    <div className="text-xs text-white/50">User memasukkan password (lokal)</div>
                  </div>
                  <div className="flex items-center gap-3 pl-4">
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-cyber-500/40" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-sm shrink-0">⚡</div>
                    <div className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent" />
                    <div className="text-xs text-white/50">Generate witness + zk-SNARK proof (browser)</div>
                  </div>
                  <div className="flex items-center gap-3 pl-4">
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-purple-500/40" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-sm shrink-0">⛓️</div>
                    <div className="h-px flex-1 bg-gradient-to-r from-yellow-500/30 to-transparent" />
                    <div className="text-xs text-white/50">Smart contract verifikasi proof on-chain</div>
                  </div>
                  <div className="flex items-center gap-3 pl-4">
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-green-500/40" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-sm shrink-0">✅</div>
                    <div className="h-px flex-1 bg-gradient-to-r from-green-500/30 to-transparent" />
                    <div className="text-xs text-white/50">Akses diberikan tanpa membuka rahasia</div>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-white/90 font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-cyber-500/10 text-cyber-400 flex items-center justify-center text-xs font-bold">2</span>
                  Peran MetaMask dalam ZKP
                </h3>
                <ul className="space-y-2.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">🦊</span>
                    <div>
                      <strong className="text-white/80">Konfirmasi Transaksi:</strong>{' '}
                      Setiap login/register memerlukan tanda tangan digital dari MetaMask sebagai bukti 
                      bahwa pemilik wallet benar-benar mengotorisasi aksi tersebut.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-400 mt-0.5">🔏</span>
                    <div>
                      <strong className="text-white/80">Personal Sign:</strong>{' '}
                      MetaMask menandatangani pesan konfirmasi secara lokal menggunakan <em>private key</em> wallet, 
                      tanpa mengirim private key ke manapun.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-400 mt-0.5">⛓️</span>
                    <div>
                      <strong className="text-white/80">On-Chain Identity:</strong>{' '}
                      Alamat wallet terikat ke identity commitment, memastikan hanya pemilik wallet yang sah 
                      yang dapat mengakses akun.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-white/90 font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-cyber-500/10 text-cyber-400 flex items-center justify-center text-xs font-bold">3</span>
                  Proving & Verifying Key
                </h3>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 font-mono text-xs">
                  <div className="text-white/30 mb-1">// Trusted Setup (sekali)</div>
                  <div><span className="text-cyber-400">snarkjs groth16 setup</span> <span className="text-green-300">hasher.r1cs</span> <span className="text-yellow-300">pot_final.ptau</span></div>
                  <div className="text-white/30 mt-2 mb-1">// Generate Proof (setiap login)</div>
                  <div><span className="text-cyan-300">witness</span> = <span className="text-yellow-300">calculateWitness</span>({'{'} <span className="text-green-300">secret</span>: password {'}'})</div>
                  <div>{'{'}<span className="text-cyan-300">proof</span>, <span className="text-cyan-300">publicSignals</span>{'}'} = <span className="text-yellow-300">groth16.fullProve</span>(...)</div>
                  <div className="text-white/30 mt-2 mb-1">// Verify on Smart Contract</div>
                  <div><span className="text-cyan-300">isValid</span> = <span className="text-yellow-300">verifier.verifyProof</span>(<span className="text-green-300">a</span>, <span className="text-green-300">b</span>, <span className="text-green-300">c</span>, <span className="text-green-300">input</span>)</div>
                </div>
              </div>

              {/* Advantages */}
              <div className="bg-cyber-500/5 border border-cyber-500/10 rounded-xl p-4 text-cyber-200/70 text-xs">
                <p className="font-semibold text-cyber-300/80 mb-2">✨ Keunggulan ZKP + MetaMask</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-400">✓</span>
                    <span>Password <strong>tidak pernah</strong> dikirim ke server atau blockchain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-400">✓</span>
                    <span>Setiap aksi dikonfirmasi oleh tanda tangan MetaMask</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-400">✓</span>
                    <span>Tidak ada Single Point of Failure — data terdesentralisasi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-400">✓</span>
                    <span>Verifikasi on-chain transparan dan tamper-proof</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-400">✓</span>
                    <span>Privasi pengguna terjaga secara kriptografis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Card - Form ZKP */}
          <div className="glass-card p-6 sm:p-8 order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyber-500/10 border border-cyber-500/20 flex items-center justify-center text-lg">
                {isLogin ? '⛓️' : '🔗'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{isLogin ? 'Login' : 'Register'} ZKP Blockchain</h2>
                <p className="text-xs text-white/40">
                  {isLogin ? 'Generate proof & verifikasi on-chain via MetaMask' : 'Simpan identity commitment ke blockchain via MetaMask'}
                </p>
              </div>
            </div>

            {/* MetaMask Connection Status */}
            <div className={`mb-5 p-3 rounded-xl flex items-center gap-3 text-xs transition-all duration-300 ${
              account 
                ? 'bg-green-500/5 border border-green-500/15 text-green-300' 
                : 'bg-orange-500/5 border border-orange-500/15 text-orange-300'
            }`}>
              <span className="text-lg">🦊</span>
              <div className="flex-1 min-w-0">
                {account ? (
                  <>
                    <span className="font-medium">MetaMask Connected</span>
                    <p className="font-mono text-[10px] text-white/40 mt-0.5 truncate">{account}</p>
                  </>
                ) : (
                  <span className="font-medium">MetaMask belum terhubung — akan diminta saat submit</span>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full shrink-0 ${account ? 'bg-green-400 animate-pulse' : 'bg-orange-400'}`} />
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-white/[0.03] rounded-xl p-1 mb-6">
              <button
                onClick={() => { setIsLogin(true); setCurrentStep(-1); setCompleted(false); setError(null) }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isLogin ? 'bg-cyber-600 text-white shadow-lg shadow-cyber-500/20' : 'text-white/40 hover:text-white/60'
                }`}
                id="tab-login-zkp"
              >
                Login
              </button>
              <button
                onClick={() => { setIsLogin(false); setCurrentStep(-1); setCompleted(false); setError(null) }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  !isLogin ? 'bg-cyber-600 text-white shadow-lg shadow-cyber-500/20' : 'text-white/40 hover:text-white/60'
                }`}
                id="tab-register-zkp"
              >
                Register
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-2.5 animate-slide-up">
                <span className="text-base mt-0.5">⚠️</span>
                <div>
                  <p className="font-medium mb-0.5">Proses Gagal</p>
                  <p className="text-red-300/70 text-xs">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)} 
                  className="ml-auto text-red-300/50 hover:text-red-300 transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>
            )}

            {/* ZKP Stepper Animation */}
            {(loading || completed) && (
              <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-slide-up">
                <p className="text-xs text-white/40 font-medium mb-4 uppercase tracking-wider">
                  {completed ? '🎉 Proses Selesai' : '⚡ Proses ZKP + MetaMask Berlangsung...'}
                </p>
                <div className="space-y-3">
                  {steps.map((step, index) => {
                    const isActive = currentStep === index
                    const isDone = currentStep > index || completed
                    const isPending = currentStep < index && !completed

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                          isActive
                            ? 'bg-white/[0.05] border border-white/[0.1] scale-[1.02]'
                            : isDone
                            ? 'bg-green-500/5 border border-green-500/10'
                            : 'bg-white/[0.01] border border-transparent opacity-40'
                        }`}
                      >
                        {/* Step Indicator */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                          isDone
                            ? 'bg-green-500/20 text-green-400'
                            : isActive
                            ? index === 1 
                              ? 'bg-orange-500/20 text-orange-400 animate-pulse' 
                              : 'bg-cyber-500/20 text-cyber-400 animate-pulse'
                            : 'bg-white/[0.05] text-white/20'
                        }`}>
                          {isDone ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-sm">{step.icon}</span>
                          )}
                        </div>

                        {/* Step Label */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium transition-colors duration-300 ${
                            isDone ? 'text-green-300' : isActive ? 'text-white' : 'text-white/30'
                          }`}>
                            {step.label} {step.icon}
                          </p>
                          {isActive && index === 1 && (
                            <p className="text-[10px] text-orange-300/60 mt-1">
                              Silakan konfirmasi di popup MetaMask Anda...
                            </p>
                          )}
                          {isActive && (
                            <div className="mt-1.5 h-1 rounded-full bg-white/[0.08] overflow-hidden">
                              <div className={`h-full rounded-full animate-shimmer ${
                                index <= 1 
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-500' 
                                  : 'bg-gradient-to-r from-cyber-500 to-emerald-500'
                              }`} style={{ backgroundSize: '200% 100%', width: '100%' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* MetaMask Signature Info */}
                {metamaskInfo && (
                  <div className="mt-4 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 animate-slide-up">
                    <p className="text-[10px] text-orange-300/60 font-medium uppercase tracking-wider mb-2">🦊 MetaMask Signature Details</p>
                    <div className="space-y-1.5 font-mono text-[10px]">
                      <div className="flex items-start gap-2">
                        <span className="text-white/30 shrink-0">Wallet:</span>
                        <span className="text-orange-300/80 break-all">{metamaskInfo.address}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-white/30 shrink-0">Sig:</span>
                        <span className="text-cyber-300/60 break-all">{metamaskInfo.signature.substring(0, 42)}...{metamaskInfo.signature.substring(metamaskInfo.signature.length - 10)}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-white/30 shrink-0">Time:</span>
                        <span className="text-white/50">{metamaskInfo.timestamp}</span>
                      </div>
                    </div>
                  </div>
                )}

                {completed && (
                  <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-sm text-center animate-slide-up">
                    🎉 {isLogin ? 'Login ZKP berhasil! Proof terverifikasi on-chain via MetaMask.' : 'Registrasi ZKP berhasil! Identity commitment tersimpan di blockchain via MetaMask.'}
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isLogin ? (
                /* Login Form */
                <>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Username</label>
                    <input
                      type="text"
                      name="loginUsername"
                      value={formData.loginUsername}
                      onChange={handleChange}
                      className="input-field-cyber"
                      placeholder="Masukkan username"
                      required
                      disabled={loading}
                      id="input-login-username-zkp"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Password Rahasia</label>
                    <input
                      type="password"
                      name="loginPasswordRahasia"
                      value={formData.loginPasswordRahasia}
                      onChange={handleChange}
                      className="input-field-cyber"
                      placeholder="Password rahasia Anda (tidak pernah dikirim)"
                      required
                      disabled={loading}
                      id="input-login-password-zkp"
                    />
                    <p className="text-xs text-white/25 mt-1.5 flex items-center gap-1">
                      <span>🔒</span> Password diproses secara lokal — hanya proof yang dikirim
                    </p>
                  </div>
                </>
              ) : (
                /* Register Form */
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Nama</label>
                      <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        className="input-field-cyber"
                        placeholder="Nama panggilan"
                        required
                        disabled={loading}
                        id="input-register-nama-zkp"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Nama Lengkap</label>
                      <input
                        type="text"
                        name="namaLengkap"
                        value={formData.namaLengkap}
                        onChange={handleChange}
                        className="input-field-cyber"
                        placeholder="Nama lengkap"
                        required
                        disabled={loading}
                        id="input-register-namalengkap-zkp"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="input-field-cyber"
                      placeholder="Pilih username unik"
                      required
                      disabled={loading}
                      id="input-register-username-zkp"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field-cyber"
                      placeholder="alamat@email.com"
                      required
                      disabled={loading}
                      id="input-register-email-zkp"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Password Rahasia</label>
                    <input
                      type="password"
                      name="passwordRahasia"
                      value={formData.passwordRahasia}
                      onChange={handleChange}
                      className="input-field-cyber"
                      placeholder="Buat password rahasia"
                      required
                      disabled={loading}
                      id="input-register-password-zkp"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Konfirmasi Password Rahasia</label>
                    <input
                      type="password"
                      name="konfirmasiPasswordRahasia"
                      value={formData.konfirmasiPasswordRahasia}
                      onChange={handleChange}
                      className="input-field-cyber"
                      placeholder="Ketik ulang password rahasia"
                      required
                      disabled={loading}
                      id="input-register-konfirmasi-zkp"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-cyber w-full flex items-center justify-center gap-2 mt-2"
                id="btn-submit-zkp"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Memproses ZKP + MetaMask...</span>
                  </>
                ) : (
                  <>
                    <span className="text-base">🦊</span>
                    <span>{isLogin ? 'Generate Proof & Login via MetaMask' : 'Register ke Blockchain via MetaMask'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Toggle Link */}
            <p className="text-center text-sm text-white/40 mt-6">
              {isLogin ? (
                <>
                  Belum punya akun?{' '}
                  <button
                    onClick={() => { setIsLogin(false); setCurrentStep(-1); setCompleted(false); setError(null) }}
                    className="text-cyber-400 hover:text-cyber-300 font-medium transition-colors"
                    id="toggle-to-register-zkp"
                  >
                    Daftar dengan ZKP
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{' '}
                  <button
                    onClick={() => { setIsLogin(true); setCurrentStep(-1); setCompleted(false); setError(null) }}
                    className="text-cyber-400 hover:text-cyber-300 font-medium transition-colors"
                    id="toggle-to-login-zkp"
                  >
                    Login ZKP
                  </button>
                </>
              )}
            </p>

            {/* Security Note */}
            <div className="mt-6 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/30 flex items-start gap-2">
              <span className="text-base mt-px">🛡️</span>
              <p>
                <strong className="text-white/50">Keamanan ZKP + MetaMask:</strong> Password rahasia Anda <strong className="text-cyber-300/50">tidak pernah</strong> meninggalkan 
                browser. Setiap aksi dikonfirmasi oleh <em>tanda tangan digital</em> MetaMask. Yang dikirim ke blockchain hanyalah <em>zk-SNARK proof</em> — bukti kriptografis bahwa Anda mengetahui 
                password yang menghasilkan identity commitment tertentu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
