export const PluginMulticallAbi = [
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
        "internalType": "struct PluginCalldata[]",
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