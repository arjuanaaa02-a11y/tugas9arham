import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMethod, setAuthMethod] = useState(null); // 'konvensional' | 'zkp'
  const [txSignature, setTxSignature] = useState(null);
  const [txHash, setTxHash] = useState(null); // Hash transaksi on-chain terakhir

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
        return null;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      return accounts[0];
    } catch (error) {
      console.error('Error saat koneksi ke MetaMask:', error);
      return null;
    }
  };

  /**
   * Meminta tanda tangan (signature) dari MetaMask untuk konfirmasi transaksi.
   * Menggunakan personal_sign untuk menandatangani pesan secara lokal.
   * @param {string} message - Pesan yang akan ditandatangani
   * @returns {Promise<{signature: string, address: string} | null>}
   */
  const signMessage = async (message) => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask tidak terdeteksi!');
      }

      let currentAccount = account;
      if (!currentAccount) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        setAccount(currentAccount);
      }

      // Request personal signature dari MetaMask
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, currentAccount],
      });

      setTxSignature(signature);
      return { signature, address: currentAccount };
    } catch (error) {
      console.error('Error saat meminta tanda tangan MetaMask:', error);
      if (error.code === 4001) {
        throw new Error('Pengguna menolak permintaan tanda tangan MetaMask.');
      }
      throw error;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsAuthenticated(false);
    setAuthMethod(null);
    setTxSignature(null);
    setTxHash(null);
  };

  const login = (method, hash = null) => {
    setIsAuthenticated(true);
    setAuthMethod(method);
    if (hash) setTxHash(hash);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthMethod(null);
    setTxSignature(null);
    setTxHash(null);
  };

  return (
    <AuthContext.Provider value={{
      account,
      isAuthenticated,
      authMethod,
      txSignature,
      txHash,
      setTxHash,
      connectWallet,
      disconnectWallet,
      signMessage,
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
