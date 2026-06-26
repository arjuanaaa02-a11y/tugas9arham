export const CONTRACT_ADDRESS = '0xe58EeEc9729c76D1B5b2d4A27E2117b7146D75EF';

// ABI lengkap dari AuthZKP.sol
export const CONTRACT_ABI = [
  // ============================================================
  // EVENTS
  // ============================================================
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true,  "name": "username",           "type": "string"  },
      { "indexed": false, "name": "email",              "type": "string"  },
      { "indexed": false, "name": "identityCommitment", "type": "uint256" },
      { "indexed": false, "name": "timestamp",          "type": "uint256" }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "name": "identityCommitment", "type": "uint256" },
      { "indexed": false, "name": "success",            "type": "bool"    },
      { "indexed": false, "name": "timestamp",          "type": "uint256" }
    ],
    "name": "LoginVerified",
    "type": "event"
  },

  // ============================================================
  // STATE VARIABLE GETTERS (public)
  // ============================================================
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalUsers",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "", "type": "uint256" }],
    "name": "users",
    "outputs": [
      { "name": "username",           "type": "string"  },
      { "name": "email",              "type": "string"  },
      { "name": "identityCommitment", "type": "uint256" },
      { "name": "isRegistered",       "type": "bool"    },
      { "name": "registeredAt",       "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "", "type": "string" }],
    "name": "usernameToCommitment",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "", "type": "string" }],
    "name": "emailToCommitment",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },

  // ============================================================
  // WRITE FUNCTIONS
  // ============================================================
  {
    "inputs": [
      { "name": "_username",           "type": "string"  },
      { "name": "_email",              "type": "string"  },
      { "name": "_identityCommitment", "type": "uint256" }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "a",     "type": "uint256[2]"    },
      { "name": "b",     "type": "uint256[2][2]" },
      { "name": "c",     "type": "uint256[2]"    },
      { "name": "input", "type": "uint256[1]"    }
    ],
    "name": "verifyLogin",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // ============================================================
  // VIEW FUNCTIONS
  // ============================================================
  {
    "inputs": [{ "name": "_username", "type": "string" }],
    "name": "isUsernameRegistered",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_identityCommitment", "type": "uint256" }],
    "name": "isCommitmentRegistered",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_identityCommitment", "type": "uint256" }],
    "name": "getUser",
    "outputs": [
      { "name": "username",    "type": "string"  },
      { "name": "email",       "type": "string"  },
      { "name": "registeredAt","type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_username", "type": "string" }],
    "name": "getCommitmentByUsername",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// Network config — sesuaikan jika bukan Sepolia
export const NETWORK = {
  chainId: '0xaa36a7',      // 11155111 = Sepolia testnet
  name: 'Sepolia Testnet',
  etherscanBase: 'https://sepolia.etherscan.io',
};
