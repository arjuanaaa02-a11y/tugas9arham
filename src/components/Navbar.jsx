import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { account, connectWallet, isAuthenticated } = useAuth()

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/konvensional', label: 'Konvensional' },
    { path: '/zkp', label: 'ZKP Blockchain' },
  ]
  
  if (isAuthenticated) {
    navLinks.push({ path: '/dashboard', label: 'Dashboard' })
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-surface-950/70 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-cyber-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow duration-300">
                SA
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-500 to-cyber-500 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
            </div>
            <span className="font-bold text-lg text-white hidden sm:block">
              Secure<span className="gradient-text from-brand-400 to-cyber-400">Auth</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${isActive
                      ? 'text-white bg-white/[0.08]'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-brand-500 to-cyber-500 rounded-full" />
                  )}
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex items-center ml-4">
            <button
              onClick={account ? undefined : connectWallet}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                account 
                  ? 'bg-white/[0.05] border border-white/[0.1] text-brand-300 cursor-default'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40'
              }`}
            >
              <span className="text-base leading-none">🦊</span>
              {account ? (
                `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
              ) : (
                'Connect Wallet'
              )}
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.05] transition-all"
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 mb-1
                    ${isActive
                      ? 'text-white bg-white/[0.08]'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              )
            })}
            
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <button
                onClick={account ? undefined : connectWallet}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  account 
                    ? 'bg-white/[0.05] border border-white/[0.1] text-brand-300 cursor-default'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                }`}
              >
                <span className="text-base leading-none">🦊</span>
                {account ? (
                  `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                ) : (
                  'Connect Wallet'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
