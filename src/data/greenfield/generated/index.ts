// Convenient namespace imports
import * as Resource from './greenfield/resource';
import * as Common from './greenfield/common';
import * as Storage from './greenfield/storage';
import * as Permission from './greenfield/permission';
import * as GoogleTimestamp from './google/protobuf/timestamp';

export const Greenfield = {
  Resource,
  Common,
  Storage,
  Permission,
  Timestamp: GoogleTimestamp
};

// Type aliases for easier access
export type ResourceType = Resource.ResourceType;
export type VisibilityType = Storage.VisibilityType;
export type ActionType = Permission.ActionType;
export type PrincipalType = Permission.PrincipalType;
export type Effect = Permission.Effect;

export type UInt64Value = Common.UInt64Value;
export type MsgUpdateBucketInfo = Storage.MsgUpdateBucketInfo;
export type Policy = Permission.Policy;
export type Principal = Permission.Principal;
export type Statement = Permission.Statement;
export type Timestamp = GoogleTimestamp.Timestamp;