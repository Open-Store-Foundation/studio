export const AppBuildsPluginV1Abi = [
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "code",
        "type": "uint32"
      }
    ],
    "name": "AppBuildsPluginError",
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
        "indexed": false,
        "internalType": "uint256",
        "name": "versionCode",
        "type": "uint256"
      }
    ],
    "name": "AppBuildAdded",
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
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "bytes",
            "name": "referenceId",
            "type": "bytes"
          },
          {
            "internalType": "uint16",
            "name": "protocolId",
            "type": "uint16"
          },
          {
            "internalType": "string",
            "name": "versionName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "versionCode",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "checksum",
            "type": "bytes32"
          }
        ],
        "internalType": "struct AppBuild",
        "name": "build",
        "type": "tuple"
      }
    ],
    "name": "addBuild",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes",
            "name": "referenceId",
            "type": "bytes"
          },
          {
            "internalType": "uint16",
            "name": "protocolId",
            "type": "uint16"
          },
          {
            "internalType": "string",
            "name": "versionName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "versionCode",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "checksum",
            "type": "bytes32"
          }
        ],
        "internalType": "struct AppBuild",
        "name": "build",
        "type": "tuple"
      }
    ],
    "name": "addBuild",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "versionCode",
        "type": "uint256"
      }
    ],
    "name": "getBuild",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes",
            "name": "referenceId",
            "type": "bytes"
          },
          {
            "internalType": "uint16",
            "name": "protocolId",
            "type": "uint16"
          },
          {
            "internalType": "string",
            "name": "versionName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "versionCode",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "checksum",
            "type": "bytes32"
          }
        ],
        "internalType": "struct AppBuild",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLastVersionCode",
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
        "internalType": "uint256",
        "name": "versionCode",
        "type": "uint256"
      }
    ],
    "name": "hasBuild",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
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
  }
]