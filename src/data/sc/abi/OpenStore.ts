export const OpenStoreAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "uint64",
            "name": "version",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "minValidatorVersion",
            "type": "uint64"
          },
          {
            "internalType": "bool",
            "name": "isRequestsSuspended",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isQueueSuspended",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "oracle",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "requestHandler",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "maxParallelProposals",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "maxReqPerBlock",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxInactiveBlocks",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "validationRequestAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseProposalAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseVoteAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "overdueProposalFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "inactiveFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minStakeAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "basicAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "proposalBlockWindow",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "voteBlockWindow",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minFinalizationWindow",
            "type": "uint256"
          }
        ],
        "internalType": "struct OpenStoreConfig",
        "name": "_config",
        "type": "tuple"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      }
    ],
    "name": "AddressEmptyCode",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "FailedCall",
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
        "internalType": "uint16",
        "name": "code",
        "type": "uint16"
      }
    ],
    "name": "OpenStoreError",
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
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "trackId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "versionCode",
        "type": "uint256"
      }
    ],
    "name": "AddedToTrack",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "blockId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "objectId",
        "type": "bytes"
      }
    ],
    "name": "BlockFinalized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "blockId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "validator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fromRequestId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "toRequestId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isDiscussion",
        "type": "bool"
      }
    ],
    "name": "BlockProposed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "ConfigChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reqType",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "NewRequest",
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "blockId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "validator",
        "type": "address"
      }
    ],
    "name": "QueueChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isSuspended",
        "type": "bool"
      }
    ],
    "name": "QueueStatusChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isSuspended",
        "type": "bool"
      }
    ],
    "name": "RequestsStatusChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "validator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      }
    ],
    "name": "ValidatorForceUnregistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "blockId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "validator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      }
    ],
    "name": "ValidatorVoted",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [],
    "name": "STATUS_ERROR",
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
    "name": "STATUS_RESERVED",
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
    "name": "STATUS_SUCCESS",
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
    "name": "STATUS_UNAVAILABLE",
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
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "trackId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "versionCode",
        "type": "uint256"
      }
    ],
    "name": "addBuildToTrack",
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
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "trackId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "versionCode",
        "type": "uint256"
      }
    ],
    "name": "addBuildToTrack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_plugin",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "bytes4[]",
        "name": "_selectors",
        "type": "bytes4[]"
      }
    ],
    "name": "addPlugin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "reqType",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "addValidationRequest",
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
        "name": "reqType",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "addValidationRequest",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockId",
        "type": "uint256"
      }
    ],
    "name": "assignBlockId",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "validator",
        "type": "address"
      }
    ],
    "name": "balance",
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
        "name": "blockId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "validator",
        "type": "address"
      }
    ],
    "name": "blockStateFor",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "validator",
        "type": "address"
      }
    ],
    "name": "blocksValidated",
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
        "internalType": "address",
        "name": "validatorAddr",
        "type": "address"
      }
    ],
    "name": "canAssignValidator",
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
    "inputs": [],
    "name": "config",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint64",
            "name": "version",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "minValidatorVersion",
            "type": "uint64"
          },
          {
            "internalType": "bool",
            "name": "isRequestsSuspended",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isQueueSuspended",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "oracle",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "requestHandler",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "maxParallelProposals",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "maxReqPerBlock",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxInactiveBlocks",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "validationRequestAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseProposalAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseVoteAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "overdueProposalFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "inactiveFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minStakeAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "basicAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "proposalBlockWindow",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "voteBlockWindow",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minFinalizationWindow",
            "type": "uint256"
          }
        ],
        "internalType": "struct OpenStoreConfig",
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
        "internalType": "address",
        "name": "validator",
        "type": "address"
      }
    ],
    "name": "emergencyBlockIdFor",
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
        "name": "blockId",
        "type": "uint256"
      }
    ],
    "name": "finalizeBlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBasicAmount",
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
        "name": "blockId",
        "type": "uint256"
      }
    ],
    "name": "getBlockProposers",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockId",
        "type": "uint256"
      }
    ],
    "name": "getBlockRef",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fromRequestId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "toRequestId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "result",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "objectId",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "objectHash",
            "type": "bytes32"
          },
          {
            "internalType": "uint16",
            "name": "protocolId",
            "type": "uint16"
          },
          {
            "internalType": "uint8",
            "name": "blockMask",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "createdBy",
            "type": "address"
          }
        ],
        "internalType": "struct BlockRef",
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
        "internalType": "address",
        "name": "asset",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "channel",
        "type": "uint256"
      }
    ],
    "name": "getLastAppVersion",
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
        "internalType": "address",
        "name": "validator",
        "type": "address"
      }
    ],
    "name": "getLastState",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
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
    "name": "getMinStakeAmount",
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
        "internalType": "address",
        "name": "asset",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "buildId",
        "type": "uint256"
      }
    ],
    "name": "getOwnershipVersion",
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
        "name": "requestId",
        "type": "uint256"
      }
    ],
    "name": "getRequest",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getValidationRequestAmount",
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
        "internalType": "address",
        "name": "_plugin",
        "type": "address"
      }
    ],
    "name": "hasPlugin",
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
        "internalType": "address",
        "name": "asset",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "versionCode",
        "type": "uint256"
      }
    ],
    "name": "isBuildVerified",
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
        "internalType": "uint256",
        "name": "blockId",
        "type": "uint256"
      }
    ],
    "name": "isFinalazible",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
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
        "internalType": "address",
        "name": "validator",
        "type": "address"
      }
    ],
    "name": "isValidatorRegistered",
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
    "inputs": [],
    "name": "leastRequestIdToFinalize",
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
    "name": "minValidatorVersion",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "validator",
        "type": "address"
      }
    ],
    "name": "nextBlockIdFor",
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
    "name": "nextBlockIdToFinalize",
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
    "name": "nextBlockIdToPropose",
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
    "name": "nextBlockIdToValidated",
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
    "name": "nextRequestIdToPropose",
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
    "name": "nextRequestIdToValidate",
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
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "plugins",
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
        "internalType": "uint256",
        "name": "block_id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "validator",
        "type": "address"
      }
    ],
    "name": "proposalBlockInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      },
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      },
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      },
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
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fromRequestId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "toRequestId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "result",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "objectId",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "objectHash",
            "type": "bytes32"
          },
          {
            "internalType": "uint16",
            "name": "protocolId",
            "type": "uint16"
          },
          {
            "internalType": "uint8",
            "name": "blockMask",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "createdBy",
            "type": "address"
          }
        ],
        "internalType": "struct BlockRef",
        "name": "blockRef",
        "type": "tuple"
      }
    ],
    "name": "proposeBlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "validatorVersion",
        "type": "uint64"
      }
    ],
    "name": "registerValidator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_plugin",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "bytes4[]",
        "name": "_selectors",
        "type": "bytes4[]"
      }
    ],
    "name": "removePlugin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "blockData",
        "type": "bytes"
      }
    ],
    "name": "saveBlockData",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "name": "selectors",
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
        "internalType": "address",
        "name": "asset",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isVisible",
        "type": "bool"
      }
    ],
    "name": "setAssetVisibility",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "isSuspended",
        "type": "bool"
      }
    ],
    "name": "setIsQueueSuspended",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "isSuspended",
        "type": "bool"
      }
    ],
    "name": "setIsRequestsSuspended",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "newVersion",
        "type": "uint64"
      }
    ],
    "name": "setMinValidatorVersion",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "name": "setValidationRequestAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "newVersion",
        "type": "uint64"
      }
    ],
    "name": "setVersion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "topUp",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalBalance",
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
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
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
        "internalType": "struct TrustedCalldata",
        "name": "call",
        "type": "tuple"
      }
    ],
    "name": "trustedCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockId",
        "type": "uint256"
      }
    ],
    "name": "unassignBlockId",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "validatorAddr",
        "type": "address"
      }
    ],
    "name": "unregisterInactiveValidator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unregisterValidator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint64",
            "name": "version",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "minValidatorVersion",
            "type": "uint64"
          },
          {
            "internalType": "bool",
            "name": "isRequestsSuspended",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isQueueSuspended",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "oracle",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "requestHandler",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "maxParallelProposals",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "maxReqPerBlock",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxInactiveBlocks",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "validationRequestAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseProposalAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseVoteAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "overdueProposalFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "inactiveFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minStakeAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "basicAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "proposalBlockWindow",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "voteBlockWindow",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minFinalizationWindow",
            "type": "uint256"
          }
        ],
        "internalType": "struct OpenStoreConfig",
        "name": "_config",
        "type": "tuple"
      }
    ],
    "name": "updateConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "validatorAddr",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "validatorAssignStatus",
    "outputs": [
      {
        "internalType": "enum OpenStore.ValidatorAssignStatus",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "validator",
        "type": "address"
      }
    ],
    "name": "validatorTotalBalance",
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
    "name": "version",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "validator",
        "type": "address"
      },
      {
        "internalType": "uint128",
        "name": "unavailabilityMask",
        "type": "uint128"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]