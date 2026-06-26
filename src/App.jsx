import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Welcome from './pages/Welcome.jsx'
import Konvensional from './pages/Konvensional.jsx'
import Zkp from './pages/Zkp.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Navbar from './components/Navbar.jsx'
import ParticleBackground from './components/ParticleBackground.jsx'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen overflow-hidden">
          <ParticleBackground />
          <div className="relative z-10">
            <Navbar />
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/konvensional" element={<Konvensional />} />
              <Route path="/zkp" element={<Zkp />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
