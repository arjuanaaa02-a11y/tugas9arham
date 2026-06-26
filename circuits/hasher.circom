/*
 * ============================================================================
 * hasher.circom - Sirkuit ZKP untuk Autentikasi
 * ============================================================================
 * 
 * Sirkuit ini menggunakan Poseidon Hash untuk mengubah password rahasia
 * menjadi identity commitment. Poseidon dipilih karena sangat efisien
 * untuk digunakan di dalam sirkuit ZKP (jumlah constraint yang rendah
 * dibandingkan SHA-256 atau Keccak).
 *
 * Alur:
 * 1. Input PRIVAT (rahasia): password pengguna (sebagai field element)
 * 2. Proses: Hashing menggunakan Poseidon
 * 3. Output PUBLIK: identity commitment (hash dari password)
 *
 * Saat REGISTER:
 * - User menghitung hash secara lokal → identity commitment
 * - Identity commitment disimpan di blockchain
 *
 * Saat LOGIN:
 * - User memasukkan password (tetap lokal, TIDAK dikirim)
 * - Sirkuit membuat proof bahwa user mengetahui password
 *   yang menghasilkan identity commitment tertentu
 * - Proof dikirim ke smart contract untuk diverifikasi
 *
 * ============================================================================
 * INSTALASI & KOMPILASI:
 * ============================================================================
 *
 * 1. Install Circom:
 *    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
 *    git clone https://github.com/iden3/circom.git
 *    cd circom && cargo build --release && cargo install --path circom
 *
 * 2. Install circomlib (berisi template Poseidon):
 *    npm install circomlib
 *
 * 3. Kompilasi sirkuit:
 *    circom hasher.circom --r1cs --wasm --sym --c
 *
 * 4. Trusted Setup (Powers of Tau):
 *    snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
 *    snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First" -v
 *    snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
 *
 * 5. Generate Proving & Verifying Key:
 *    snarkjs groth16 setup hasher.r1cs pot12_final.ptau hasher_0000.zkey
 *    snarkjs zkey contribute hasher_0000.zkey hasher_final.zkey --name="Contributor" -v
 *    snarkjs zkey export verificationkey hasher_final.zkey verification_key.json
 *
 * 6. Generate Solidity Verifier:
 *    snarkjs zkey export solidityverifier hasher_final.zkey Verifier.sol
 *
 * ============================================================================
 */

pragma circom 2.0.0;

// Import template Poseidon dari circomlib
// Poseidon adalah hash function yang ZKP-friendly
// Jauh lebih efisien daripada SHA-256 atau Keccak di dalam sirkuit
include "circomlib/circuits/poseidon.circom";

/**
 * Template: PasswordHasher
 * 
 * Mengambil 1 input privat (password/secret) dan menghasilkan
 * 1 output publik (identityCommitment = Poseidon hash dari secret).
 *
 * Constraint count: ~200-250 constraints (sangat efisien!)
 * Bandingkan dengan SHA-256 yang membutuhkan ~25,000+ constraints.
 */
template PasswordHasher() {
    // ========================================================
    // SIGNAL DECLARATIONS
    // ========================================================

    // Input PRIVAT: password rahasia pengguna
    // Signal ini TIDAK akan terungkap dalam proof
    // Hanya prover yang mengetahui nilai ini
    signal input secret;

    // Output PUBLIK: hash dari password (identity commitment)
    // Signal ini AKAN terlihat oleh verifier (smart contract)
    // dan digunakan untuk mencocokkan dengan data yang tersimpan
    signal output identityCommitment;

    // ========================================================
    // COMPONENTS
    // ========================================================

    // Instansiasi komponen Poseidon dengan 1 input
    // Poseidon(n) menerima n input dan menghasilkan 1 output hash
    component hasher = Poseidon(1);

    // ========================================================
    // CIRCUIT LOGIC
    // ========================================================

    // Masukkan secret sebagai input ke Poseidon hasher
    hasher.inputs[0] <== secret;

    // Output Poseidon hash menjadi identity commitment (publik)
    identityCommitment <== hasher.out;

    /*
     * Penjelasan constraint yang dihasilkan:
     * 
     * Sirkuit ini menciptakan R1CS (Rank-1 Constraint System) yang
     * memastikan bahwa:
     *   identityCommitment == Poseidon(secret)
     * 
     * Saat prover membuat proof:
     * - Prover mengetahui 'secret' (password)
     * - Prover menghitung Poseidon(secret) = identityCommitment
     * - Proof membuktikan bahwa prover mengetahui 'secret' yang valid
     * 
     * Saat verifier (smart contract) memverifikasi:
     * - Verifier hanya melihat identityCommitment (publik)
     * - Verifier memverifikasi proof secara matematis
     * - Verifier TIDAK PERNAH mengetahui nilai 'secret'
     * 
     * Ini adalah inti dari Zero-Knowledge:
     * "Saya bisa membuktikan bahwa saya tahu password yang benar,
     *  tanpa memberi tahu Anda password saya."
     */
}

// Komponen utama dengan public output
// identityCommitment akan menjadi public signal dalam proof
component main = PasswordHasher();
