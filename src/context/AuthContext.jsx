import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMethod, setAuthMethod] = useState(null); // 'konvensional' | 'zkp'

  // Cek jika wallet sudah terkoneksi sebelumnya
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Error mengecek koneksi MetaMask:', error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask tidak terdeteksi! Silakan install ekstensi MetaMask.');
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Error saat koneksi ke MetaMask:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsAuthenticated(false);
    setAuthMethod(null);
  };

  const login = (method) => {
    setIsAuthenticated(true);
    setAuthMethod(method);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthMethod(null);
  };

  return (
    <AuthContext.Provider value={{
      account,
      isAuthenticated,
      authMethod,
      connectWallet,
      disconnectWallet,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
