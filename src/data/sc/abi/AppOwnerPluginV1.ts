export const AppOwnerPluginV1Abi = [
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "code",
        "type": "uint32"
      }
    ],
    "name": "AppOwnerPluginError",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "MulticallUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableDelegateUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "version",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes[]",
        "name": "certs",
        "type": "bytes[]"
      },
      {
        "indexed": false,
        "internalType": "bytes[]",
        "name": "proofs",
        "type": "bytes[]"
      }
    ],
    "name": "AppOwnerChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_version",
        "type": "uint256"
      }
    ],
    "name": "dataBlockNumber",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "delegateOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_version",
        "type": "uint256"
      }
    ],
    "name": "domain",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "domain",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "drain",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getState",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "domain",
            "type": "string"
          },
          {
            "internalType": "bytes32[]",
            "name": "fingerprints",
            "type": "bytes32[]"
          },
          {
            "internalType": "uint256",
            "name": "blockNumber",
            "type": "uint256"
          }
        ],
        "internalType": "struct AppOwnerPluginV1Version",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_version",
        "type": "uint256"
      }
    ],
    "name": "getState",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "domain",
            "type": "string"
          },
          {
            "internalType": "bytes32[]",
            "name": "fingerprints",
            "type": "bytes32[]"
          },
          {
            "internalType": "uint256",
            "name": "blockNumber",
            "type": "uint256"
          }
        ],
        "internalType": "struct AppOwnerPluginV1Version",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "multicall",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ownerVersion",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_domain",
        "type": "string"
      },
      {
        "internalType": "bytes32[]",
        "name": "_fingerprints",
        "type": "bytes32[]"
      },
      {
        "internalType": "bytes[]",
        "name": "_certs",
        "type": "bytes[]"
      },
      {
        "internalType": "bytes[]",
        "name": "_proofs",
        "type": "bytes[]"
      }
    ],
    "name": "setAppOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_domain",
        "type": "string"
      },
      {
        "internalType": "bytes32[]",
        "name": "_fingerprints",
        "type": "bytes32[]"
      },
      {
        "internalType": "bytes[]",
        "name": "_certs",
        "type": "bytes[]"
      },
      {
        "internalType": "bytes[]",
        "name": "_proofs",
        "type": "bytes[]"
      }
    ],
    "name": "setAppOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]