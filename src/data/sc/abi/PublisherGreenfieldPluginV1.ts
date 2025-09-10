export const PublisherGreenfieldPluginV1Abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_gfExecutorAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_gfPermissionHubAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_gfTokenHubAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_gfBucketHubAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "createPolicyData",
        "type": "bytes"
      }
    ],
    "name": "changePolicy",
    "outputs": [],
    "stateMutability": "payable",
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
        "internalType": "bytes",
        "name": "createPolicyData",
        "type": "bytes"
      }
    ],
    "name": "changePolicy",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "spAddress",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "primarySpApprovalExpiredHeight",
        "type": "uint64"
      },
      {
        "internalType": "uint32",
        "name": "globalVirtualGroupFamilyId",
        "type": "uint32"
      },
      {
        "internalType": "bytes",
        "name": "primarySpSignature",
        "type": "bytes"
      },
      {
        "internalType": "uint32",
        "name": "chargedReadQuota",
        "type": "uint32"
      },
      {
        "internalType": "bytes",
        "name": "extraData",
        "type": "bytes"
      }
    ],
    "name": "createSpace",
    "outputs": [],
    "stateMutability": "payable",
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
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "spAddress",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "primarySpApprovalExpiredHeight",
        "type": "uint64"
      },
      {
        "internalType": "uint32",
        "name": "globalVirtualGroupFamilyId",
        "type": "uint32"
      },
      {
        "internalType": "bytes",
        "name": "primarySpSignature",
        "type": "bytes"
      },
      {
        "internalType": "uint32",
        "name": "chargedReadQuota",
        "type": "uint32"
      },
      {
        "internalType": "bytes",
        "name": "extraData",
        "type": "bytes"
      }
    ],
    "name": "createSpace",
    "outputs": [],
    "stateMutability": "payable",
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
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint8[]",
        "name": "types",
        "type": "uint8[]"
      },
      {
        "internalType": "bytes[]",
        "name": "data",
        "type": "bytes[]"
      }
    ],
    "name": "executeMsg",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8[]",
        "name": "types",
        "type": "uint8[]"
      },
      {
        "internalType": "bytes[]",
        "name": "data",
        "type": "bytes[]"
      }
    ],
    "name": "executeMsg",
    "outputs": [],
    "stateMutability": "payable",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "topUp",
    "outputs": [],
    "stateMutability": "payable",
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
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "topUp",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]