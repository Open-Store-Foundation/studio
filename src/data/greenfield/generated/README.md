# Generated Proto Files

This directory contains pure TypeScript files generated from Protocol Buffer definitions using ts-proto.

## Usage

```typescript
import { 
  ResourceType, 
  VisibilityType, 
  ActionType, 
  UInt64Value,
  MsgUpdateBucketInfo,
  Policy,
  Greenfield 
} from './generated';

// Direct enum usage
const resourceType = ResourceType.RESOURCE_TYPE_BUCKET;
const visibility = VisibilityType.VISIBILITY_TYPE_PUBLIC_READ;

// Create messages with plain objects
const uint64Value: UInt64Value = { value: 1000 };

const policy: Policy = {
  id: "policy-123",
  resourceType: ResourceType.RESOURCE_TYPE_OBJECT,
  resourceId: "resource-456",
  principal: {
    type: PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
    value: "0x..."
  },
  statements: [
    {
      effect: Effect.EFFECT_ALLOW,
      actions: [ActionType.ACTION_GET_OBJECT],
      resources: ["resource-path"]
    }
  ]
};

// Or use namespaced access
const resourceEnum = Greenfield.Resource.ResourceType.RESOURCE_TYPE_BUCKET;
```

## Files

- `greenfield/` - Generated TypeScript files for greenfield protocol messages
- `google/` - Generated TypeScript files for Google protobuf types (Timestamp, etc.)
- `index.ts` - Convenience exports for easier importing
- `README.md` - This documentation

## Regenerating

To regenerate these files when proto definitions change:

```bash
npm run generate-proto
```

The source proto files are located in the `/protos` directory.