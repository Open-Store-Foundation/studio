export const TrustedMulticallAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "EmptyReason",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "msgSender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "calldataSender",
        "type": "address"
      }
    ],
    "name": "MsgSenderNotMatchToCalldata",
    "type": "error"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "manager",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "plugin",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "internalType": "struct TrustedCalldata[]",
        "name": "calls",
        "type": "tuple[]"
      }
    ],
    "name": "multicall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]