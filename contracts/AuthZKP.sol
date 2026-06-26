// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AuthZKP
 * @author SecureAuth - Tugas 9
 * @notice Smart Contract untuk autentikasi berbasis Zero-Knowledge Proof (ZKP)
 * @dev Menggunakan zk-SNARKs (Groth16) untuk verifikasi proof on-chain
 * 
 * Kontrak ini menyimpan identity commitment (hash Poseidon dari password)
 * tanpa pernah mengetahui password asli pengguna.
 */
contract AuthZKP {

    // =========================================================================
    //                              STRUCTS
    // =========================================================================

    /**
     * @notice Struct untuk menyimpan data pengguna
     * @param username Username unik pengguna
     * @param email Email pengguna
     * @param identityCommitment Hash Poseidon dari password rahasia pengguna
     *        Ini adalah public signal yang dihasilkan oleh sirkuit Circom
     * @param isRegistered Flag untuk mengecek apakah user sudah terdaftar
     * @param registeredAt Timestamp saat user mendaftar
     */
    struct User {
        string username;
        string email;
        uint256 identityCommitment;
        bool isRegistered;
        uint256 registeredAt;
    }

    // =========================================================================
    //                           STATE VARIABLES
    // =========================================================================

    /// @notice Mapping dari identity commitment ke data User
    mapping(uint256 => User) public users;

    /// @notice Mapping dari username ke identity commitment (untuk lookup)
    mapping(string => uint256) public usernameToCommitment;

    /// @notice Mapping dari email ke identity commitment (untuk lookup)
    mapping(string => uint256) public emailToCommitment;

    /// @notice Total pengguna terdaftar
    uint256 public totalUsers;

    /// @notice Alamat admin/deployer kontrak
    address public admin;

    // =========================================================================
    //                              EVENTS
    // =========================================================================

    /// @notice Event yang di-emit saat user baru mendaftar
    event UserRegistered(
        string indexed username,
        string email,
        uint256 identityCommitment,
        uint256 timestamp
    );

    /// @notice Event yang di-emit saat login ZKP berhasil diverifikasi
    event LoginVerified(
        uint256 identityCommitment,
        bool success,
        uint256 timestamp
    );

    // =========================================================================
    //                             MODIFIERS
    // =========================================================================

    /// @notice Memastikan username belum terdaftar
    modifier usernameNotTaken(string memory _username) {
        require(
            usernameToCommitment[_username] == 0,
            "AuthZKP: Username sudah terdaftar"
        );
        _;
    }

    /// @notice Memastikan email belum terdaftar
    modifier emailNotTaken(string memory _email) {
        require(
            emailToCommitment[_email] == 0,
            "AuthZKP: Email sudah terdaftar"
        );
        _;
    }

    /// @notice Memastikan identity commitment belum digunakan
    modifier commitmentNotUsed(uint256 _identityCommitment) {
        require(
            !users[_identityCommitment].isRegistered,
            "AuthZKP: Identity commitment sudah terdaftar"
        );
        _;
    }

    // =========================================================================
    //                            CONSTRUCTOR
    // =========================================================================

    constructor() {
        admin = msg.sender;
    }

    // =========================================================================
    //                         REGISTRATION FUNCTION
    // =========================================================================

    /**
     * @notice Mendaftarkan pengguna baru dengan identity commitment
     * @dev Identity commitment adalah hash Poseidon dari password rahasia pengguna.
     *      Password asli TIDAK PERNAH dikirim ke blockchain.
     *
     * @param _username Username unik yang dipilih pengguna
     * @param _email Email pengguna
     * @param _identityCommitment Hash Poseidon dari password rahasia (public signal dari sirkuit Circom)
     *
     * Alur:
     * 1. User memasukkan password di browser
     * 2. Browser menghitung Poseidon hash → identityCommitment
     * 3. identityCommitment dikirim ke smart contract ini
     * 4. Smart contract menyimpan commitment tanpa mengetahui password asli
     */
    function registerUser(
        string memory _username,
        string memory _email,
        uint256 _identityCommitment
    )
        external
        usernameNotTaken(_username)
        emailNotTaken(_email)
        commitmentNotUsed(_identityCommitment)
    {
        require(bytes(_username).length > 0, "AuthZKP: Username tidak boleh kosong");
        require(bytes(_email).length > 0, "AuthZKP: Email tidak boleh kosong");
        require(_identityCommitment != 0, "AuthZKP: Identity commitment tidak valid");

        // Simpan data user
        users[_identityCommitment] = User({
            username: _username,
            email: _email,
            identityCommitment: _identityCommitment,
            isRegistered: true,
            registeredAt: block.timestamp
        });

        // Buat mapping untuk lookup
        usernameToCommitment[_username] = _identityCommitment;
        emailToCommitment[_email] = _identityCommitment;

        // Increment total users
        totalUsers++;

        emit UserRegistered(_username, _email, _identityCommitment, block.timestamp);
    }

    // =========================================================================
    //                        LOGIN VERIFICATION FUNCTION
    // =========================================================================

    /**
     * @notice Memverifikasi login menggunakan zk-SNARK proof
     * @dev Fungsi ini mensimulasikan pemanggilan verifier contract yang dihasilkan
     *      oleh snarkjs. Pada implementasi produksi, fungsi ini akan memanggil
     *      kontrak Verifier.sol yang di-generate oleh snarkjs dari trusted setup.
     *
     * @param a Elemen proof a (2 elemen dari kurva elliptic G1)
     * @param b Elemen proof b (2x2 elemen dari kurva elliptic G2)
     * @param c Elemen proof c (2 elemen dari kurva elliptic G1)
     * @param input Public input/signal (identity commitment = Poseidon hash dari password)
     *
     * @return bool true jika proof valid dan user terdaftar
     *
     * Alur Verifikasi:
     * 1. User memasukkan password di browser (LOKAL - tidak dikirim)
     * 2. Browser generate witness dari sirkuit Circom
     * 3. Browser membuat zk-SNARK proof menggunakan proving key
     * 4. Proof (a, b, c) + public signal dikirim ke fungsi ini
     * 5. Smart contract memverifikasi proof secara on-chain
     * 6. Jika valid DAN identity commitment terdaftar → login berhasil
     */
    function verifyLogin(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external returns (bool) {
        // input[0] = identityCommitment (public signal dari sirkuit)
        uint256 identityCommitment = input[0];

        // Pastikan user dengan identity commitment ini sudah terdaftar
        require(
            users[identityCommitment].isRegistered,
            "AuthZKP: User dengan identity commitment ini tidak terdaftar"
        );

        /**
         * SIMULASI VERIFIKASI ZK-SNARK
         * 
         * Pada implementasi nyata, di sini akan dipanggil:
         * 
         *   Verifier verifier = Verifier(verifierContractAddress);
         *   bool isValid = verifier.verifyProof(a, b, c, input);
         *   require(isValid, "AuthZKP: Proof tidak valid");
         * 
         * Kontrak Verifier.sol di-generate otomatis oleh snarkjs:
         *   snarkjs groth16 export solidityverifier verification_key.json Verifier.sol
         * 
         * Verifier.sol berisi pairing check pada kurva BN254 (alt_bn128)
         * yang memverifikasi bahwa prover benar-benar mengetahui input rahasia
         * (password) yang menghasilkan output (identity commitment) yang benar.
         */

        // Simulasi verifikasi: cek bahwa proof elements tidak kosong
        // Pada produksi, ini diganti dengan panggilan ke Verifier.sol
        bool proofValid = (a[0] != 0 || a[1] != 0) &&
                          (b[0][0] != 0 || b[0][1] != 0 || b[1][0] != 0 || b[1][1] != 0) &&
                          (c[0] != 0 || c[1] != 0);

        require(proofValid, "AuthZKP: Proof tidak valid (elemen kosong)");

        emit LoginVerified(identityCommitment, true, block.timestamp);

        return true;
    }

    // =========================================================================
    //                          VIEW FUNCTIONS
    // =========================================================================

    /**
     * @notice Mengecek apakah username sudah terdaftar
     * @param _username Username yang ingin dicek
     * @return bool true jika username sudah terdaftar
     */
    function isUsernameRegistered(string memory _username) external view returns (bool) {
        return usernameToCommitment[_username] != 0;
    }

    /**
     * @notice Mengecek apakah identity commitment sudah terdaftar
     * @param _identityCommitment Identity commitment yang ingin dicek
     * @return bool true jika sudah terdaftar
     */
    function isCommitmentRegistered(uint256 _identityCommitment) external view returns (bool) {
        return users[_identityCommitment].isRegistered;
    }

    /**
     * @notice Mengambil data user berdasarkan identity commitment
     * @param _identityCommitment Identity commitment user
     * @return username Username user
     * @return email Email user
     * @return registeredAt Timestamp registrasi
     */
    function getUser(uint256 _identityCommitment)
        external
        view
        returns (string memory username, string memory email, uint256 registeredAt)
    {
        require(users[_identityCommitment].isRegistered, "AuthZKP: User tidak ditemukan");
        User memory user = users[_identityCommitment];
        return (user.username, user.email, user.registeredAt);
    }

    /**
     * @notice Mendapatkan identity commitment berdasarkan username
     * @param _username Username yang ingin dicari
     * @return uint256 Identity commitment user
     */
    function getCommitmentByUsername(string memory _username) external view returns (uint256) {
        uint256 commitment = usernameToCommitment[_username];
        require(commitment != 0, "AuthZKP: Username tidak ditemukan");
        return commitment;
    }
}
