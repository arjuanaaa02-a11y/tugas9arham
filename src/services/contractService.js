/**
 * contractService.js
 * ===================
 * Semua interaksi on-chain dengan smart contract AuthZKP.
 * Menggunakan ethers.js v6 + MetaMask provider.
 */

import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, NETWORK } from '../config/contract';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mendapatkan ethers Provider dari MetaMask (window.ethereum).
 */
const getProvider = () => {
  if (!window.ethereum) throw new Error('MetaMask tidak terdeteksi!');
  return new ethers.BrowserProvider(window.ethereum);
};

/**
 * Mendapatkan Contract instance dengan signer (untuk write transactions).
 */
const getSignedContract = async () => {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

/**
 * Mendapatkan Contract instance dengan provider (untuk read-only).
 */
const getReadContract = async () => {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

/**
 * Memastikan MetaMask berada di network yang benar (Sepolia).
 * Jika tidak, meminta user untuk switch network.
 */
const ensureCorrectNetwork = async () => {
  const provider = getProvider();
  const network = await provider.getNetwork();
  const currentChainId = '0x' + network.chainId.toString(16);

  if (currentChainId.toLowerCase() !== NETWORK.chainId.toLowerCase()) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK.chainId }],
      });
    } catch (err) {
      // Chain tidak ditemukan di MetaMask, tambahkan dulu
      if (err.code === 4902) {
        throw new Error(
          `Network ${NETWORK.name} tidak ditemukan di MetaMask. Silakan tambahkan secara manual.`
        );
      }
      throw new Error(`Gagal switch ke ${NETWORK.name}: ${err.message}`);
    }
  }
};

/**
 * Menghitung identityCommitment dari password.
 * Menggunakan keccak256 dari UTF-8 bytes password (BigInt).
 * 
 * Di implementasi ZKP nyata, ini diganti dengan Poseidon hash dari sirkuit Circom.
 * Namun untuk tujuan demo on-chain, keccak256 menghasilkan uint256 yang valid.
 */
export const computeIdentityCommitment = (password) => {
  const passwordBytes = ethers.toUtf8Bytes(password);
  const hash = ethers.keccak256(passwordBytes);
  // Kembalikan sebagai BigInt (uint256)
  return BigInt(hash);
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER — memanggil registerUser() on-chain
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mendaftarkan user baru ke smart contract AuthZKP.
 * Password TIDAK dikirim — hanya identityCommitment (hash-nya).
 *
 * @param {string} username
 * @param {string} email
 * @param {string} password  — diproses lokal menjadi identityCommitment
 * @param {function} onStep  — callback(stepName) untuk update UI progress
 * @returns {{ txHash: string, identityCommitment: string, receipt: object }}
 */
export const registerOnChain = async (username, email, password, onStep) => {
  // 1. Pastikan network benar
  onStep?.('Memeriksa network...');
  await ensureCorrectNetwork();

  // 2. Hitung identityCommitment dari password secara lokal
  onStep?.('Menghitung identity commitment...');
  const identityCommitment = computeIdentityCommitment(password);

  // 3. Dapatkan contract instance dengan signer
  const contract = await getSignedContract();

  // 4. Kirim transaksi ke blockchain
  // MetaMask akan muncul meminta konfirmasi GAS + transaksi
  onStep?.('Mengirim transaksi ke blockchain...');
  const tx = await contract.registerUser(username, email, identityCommitment);

  // 5. Tunggu receipt (1 block konfirmasi)
  onStep?.('Menunggu konfirmasi block...');
  const receipt = await tx.wait(1);

  return {
    txHash: receipt.hash,
    identityCommitment: identityCommitment.toString(),
    blockNumber: receipt.blockNumber,
    receipt,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN — memanggil verifyLogin() on-chain
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Memverifikasi login via smart contract AuthZKP.
 * Password TIDAK dikirim — hanya proof dan identityCommitment.
 *
 * Karena belum ada Verifier.sol nyata, kita kirim proof "simulasi" yang
 * memenuhi syarat contract (semua elemen non-zero).
 *
 * @param {string} username
 * @param {string} password
 * @param {function} onStep
 * @returns {{ txHash: string, receipt: object }}
 */
export const loginOnChain = async (username, password, onStep) => {
  // 1. Pastikan network benar
  onStep?.('Memeriksa network...');
  await ensureCorrectNetwork();

  // 2. Hitung identityCommitment dari password lokal
  onStep?.('Menghitung identity commitment...');
  const identityCommitment = computeIdentityCommitment(password);

  // 3. Cek apakah commitment terdaftar di contract (read-only, gratis)
  onStep?.('Memeriksa registrasi di blockchain...');
  const readContract = await getReadContract();
  const isRegistered = await readContract.isCommitmentRegistered(identityCommitment);
  if (!isRegistered) {
    throw new Error(
      'Username atau password salah. Identity commitment tidak ditemukan di blockchain.'
    );
  }

  // 4. Buat simulasi zk-SNARK proof (non-zero elements)
  // Di implementasi nyata, ini di-generate oleh snarkjs.groth16.fullProve()
  onStep?.('Generating zk-SNARK proof...');
  const dummyProof = {
    a: [
      BigInt('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'),
      BigInt('0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321'),
    ],
    b: [
      [
        BigInt('0x1111111111111111111111111111111111111111111111111111111111111111'),
        BigInt('0x2222222222222222222222222222222222222222222222222222222222222222'),
      ],
      [
        BigInt('0x3333333333333333333333333333333333333333333333333333333333333333'),
        BigInt('0x4444444444444444444444444444444444444444444444444444444444444444'),
      ],
    ],
    c: [
      BigInt('0x5555555555555555555555555555555555555555555555555555555555555555'),
      BigInt('0x6666666666666666666666666666666666666666666666666666666666666666'),
    ],
    input: [identityCommitment],
  };

  // 5. Kirim transaksi verifyLogin ke blockchain
  // MetaMask akan muncul meminta konfirmasi
  onStep?.('Mengirim transaksi verifikasi ke blockchain...');
  const contract = await getSignedContract();
  const tx = await contract.verifyLogin(
    dummyProof.a,
    dummyProof.b,
    dummyProof.c,
    dummyProof.input
  );

  // 6. Tunggu receipt
  onStep?.('Menunggu konfirmasi block...');
  const receipt = await tx.wait(1);

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    receipt,
  };
};
