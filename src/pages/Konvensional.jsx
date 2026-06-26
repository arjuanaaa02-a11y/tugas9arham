import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Konvensional() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState({
    nama: '',
    namaLengkap: '',
    username: '',
    email: '',
    password: '',
    konfirmasiPassword: '',
    loginIdentifier: '',
    loginPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    if (!isLogin && formData.password !== formData.konfirmasiPassword) {
      alert('Password dan Konfirmasi Password tidak cocok!')
      setLoading(false)
      return
    }

    // Simulasi API call
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSuccess(true)

    // Arahkan ke dashboard
    login('konvensional')
    setTimeout(() => {
      setSuccess(false)
      navigate('/dashboard')
    }, 1500)
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium mb-4">
            <span className="text-base">🏛️</span>
            Autentikasi Konvensional
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Sistem Autentikasi <span className="gradient-text from-brand-400 to-purple-400">Konvensional</span>
          </h1>
          <p className="text-white/40 text-sm max-w-xl mx-auto">
            Simulasi login & register menggunakan arsitektur database terpusat tradisional
          </p>
        </div>

        {/* Two Column Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {/* Left Card - Education */}
          <div className="glass-card p-6 sm:p-8 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-lg">
                📖
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Arsitektur Database Terpusat</h2>
                <p className="text-xs text-white/40">Memahami cara kerja & kelemahannya</p>
              </div>
            </div>

            <div className="space-y-5 text-sm text-white/60 leading-relaxed">
              {/* Section 1 */}
              <div>
                <h3 className="text-white/90 font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-brand-500/10 text-brand-400 flex items-center justify-center text-xs font-bold">1</span>
                  Bagaimana Cara Kerjanya?
                </h3>
                <p>
                  Dalam autentikasi konvensional, saat pengguna mendaftar, password mereka di-hash menggunakan algoritma
                  seperti <code className="text-brand-300 bg-brand-500/10 px-1.5 py-0.5 rounded text-xs font-mono">bcrypt</code> atau{' '}
                  <code className="text-brand-300 bg-brand-500/10 px-1.5 py-0.5 rounded text-xs font-mono">Argon2</code>, 
                  ditambahkan <strong className="text-white/80">salt</strong> unik, lalu disimpan di database terpusat (MySQL, PostgreSQL, MongoDB, dll).
                </p>
              </div>

              {/* Diagram */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <p className="text-xs text-white/40 font-medium mb-3 uppercase tracking-wider">Alur Autentikasi Konvensional</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-sm shrink-0">👤</div>
                    <div className="h-px flex-1 bg-gradient-to-r from-brand-500/30 to-transparent" />
                    <div className="text-xs text-white/50">User mengirim password</div>
                  </div>
                  <div className="flex items-center gap-3 pl-4">
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-brand-500/40" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-sm shrink-0">🌐</div>
                    <div className="h-px flex-1 bg-gradient-to-r from-yellow-500/30 to-transparent" />
                    <div className="text-xs text-white/50">Server menerima & hash password</div>
                  </div>
                  <div className="flex items-center gap-3 pl-4">
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-yellow-500/40" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-sm shrink-0">🗄️</div>
                    <div className="h-px flex-1 bg-gradient-to-r from-red-500/30 to-transparent" />
                    <div className="text-xs text-white/50">Hash disimpan di database terpusat</div>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-white/90 font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-red-500/10 text-red-400 flex items-center justify-center text-xs font-bold">2</span>
                  Kelemahan Utama
                </h3>
                <ul className="space-y-2.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">⚠️</span>
                    <div>
                      <strong className="text-white/80">Single Point of Failure:</strong>{' '}
                      Jika server diretas, seluruh data pengguna (termasuk hash password) bisa bocor.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">⚠️</span>
                    <div>
                      <strong className="text-white/80">Password Transit:</strong>{' '}
                      Password asli dikirim ke server sebelum di-hash. Jika koneksi tidak aman (tanpa HTTPS), bisa disadap.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">⚠️</span>
                    <div>
                      <strong className="text-white/80">Brute Force Attack:</strong>{' '}
                      Hash yang bocor bisa diserang dengan rainbow tables atau dictionary attack, terutama jika salt lemah.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">⚠️</span>
                    <div>
                      <strong className="text-white/80">Insider Threat:</strong>{' '}
                      Administrator database memiliki akses ke data sensitif pengguna.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-white/90 font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-brand-500/10 text-brand-400 flex items-center justify-center text-xs font-bold">3</span>
                  Hashing & Salt
                </h3>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 font-mono text-xs">
                  <div className="text-white/30 mb-1">// Proses Register</div>
                  <div><span className="text-brand-400">const</span> <span className="text-cyan-300">salt</span> = <span className="text-yellow-300">generateRandomSalt</span>();</div>
                  <div><span className="text-brand-400">const</span> <span className="text-cyan-300">hash</span> = <span className="text-yellow-300">bcrypt</span>(<span className="text-green-300">password</span>, <span className="text-cyan-300">salt</span>);</div>
                  <div><span className="text-yellow-300">db.save</span>({'{'} <span className="text-cyan-300">username</span>, <span className="text-cyan-300">hash</span>, <span className="text-cyan-300">salt</span> {'}'});</div>
                  <div className="text-white/30 mt-3 mb-1">// Proses Login</div>
                  <div><span className="text-brand-400">const</span> <span className="text-cyan-300">user</span> = <span className="text-yellow-300">db.find</span>(<span className="text-green-300">username</span>);</div>
                  <div><span className="text-brand-400">const</span> <span className="text-cyan-300">valid</span> = <span className="text-yellow-300">bcrypt.compare</span>(<span className="text-green-300">password</span>, <span className="text-cyan-300">user.hash</span>);</div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4 text-yellow-200/70 text-xs">
                <p className="font-semibold text-yellow-300/80 mb-1">💡 Kesimpulan</p>
                <p>
                  Meskipun hashing + salt memberikan lapisan keamanan, pendekatan ini tetap bergantung pada keamanan server. 
                  Sistem ini rentan terhadap serangan jika server atau database dikompromikan.
                </p>
              </div>
            </div>
          </div>

          {/* Right Card - Form */}
          <div className="glass-card p-6 sm:p-8 order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-lg">
                {isLogin ? '🔑' : '📝'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{isLogin ? 'Login' : 'Register'} Konvensional</h2>
                <p className="text-xs text-white/40">
                  {isLogin ? 'Masuk ke akun yang sudah terdaftar' : 'Buat akun baru di database terpusat'}
                </p>
              </div>
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-white/[0.03] rounded-xl p-1 mb-6">
              <button
                onClick={() => { setIsLogin(true); setSuccess(false) }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isLogin ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-white/40 hover:text-white/60'
                }`}
                id="tab-login-conv"
              >
                Login
              </button>
              <button
                onClick={() => { setIsLogin(false); setSuccess(false) }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  !isLogin ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-white/40 hover:text-white/60'
                }`}
                id="tab-register-conv"
              >
                Register
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 text-sm flex items-center gap-2 animate-slide-up">
                <span>✅</span>
                {isLogin ? 'Login berhasil! Selamat datang kembali.' : 'Registrasi berhasil! Akun Anda telah dibuat.'}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isLogin ? (
                /* Login Form */
                <>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Username atau Email</label>
                    <input
                      type="text"
                      name="loginIdentifier"
                      value={formData.loginIdentifier}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Masukkan username atau email"
                      required
                      id="input-login-identifier"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
                    <input
                      type="password"
                      name="loginPassword"
                      value={formData.loginPassword}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Masukkan password"
                      required
                      id="input-login-password"
                    />
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
                        className="input-field"
                        placeholder="Nama panggilan"
                        required
                        id="input-register-nama"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Nama Lengkap</label>
                      <input
                        type="text"
                        name="namaLengkap"
                        value={formData.namaLengkap}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Nama lengkap"
                        required
                        id="input-register-namalengkap"
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
                      className="input-field"
                      placeholder="Pilih username unik"
                      required
                      id="input-register-username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="alamat@email.com"
                      required
                      id="input-register-email"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Buat password kuat"
                      required
                      id="input-register-password"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Konfirmasi Password</label>
                    <input
                      type="password"
                      name="konfirmasiPassword"
                      value={formData.konfirmasiPassword}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Ketik ulang password"
                      required
                      id="input-register-konfirmasi"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                id="btn-submit-conv"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>{isLogin ? 'Login' : 'Daftar'}</span>
                )}
              </button>
            </form>

            {/* Toggle Link */}
            <p className="text-center text-sm text-white/40 mt-6">
              {isLogin ? (
                <>
                  Belum punya akun?{' '}
                  <button
                    onClick={() => { setIsLogin(false); setSuccess(false) }}
                    className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
                    id="toggle-to-register-conv"
                  >
                    Daftar di sini
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{' '}
                  <button
                    onClick={() => { setIsLogin(true); setSuccess(false) }}
                    className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
                    id="toggle-to-login-conv"
                  >
                    Login di sini
                  </button>
                </>
              )}
            </p>

            {/* Security Note */}
            <div className="mt-6 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/30 flex items-start gap-2">
              <span className="text-base mt-px">🔒</span>
              <p>
                <strong className="text-white/50">Catatan Keamanan:</strong> Pada implementasi nyata, password di-hash 
                dengan bcrypt/Argon2 + salt sebelum disimpan. Password plaintext tidak pernah disimpan langsung di database.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
