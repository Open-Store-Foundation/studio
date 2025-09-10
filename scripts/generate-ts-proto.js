#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoDir = path.join(__dirname, '../protos');
const outputDir = path.join(__dirname, '../src/data/greenfield/generated');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const protoFiles = [
  'greenfield/resource.proto',
  'greenfield/common.proto', 
  'greenfield/storage.proto',
  'google/protobuf/timestamp.proto',
  'greenfield/permission.proto'
];

try {
  console.log('Generating TypeScript files from proto files using ts-proto...');
  
  const fullProtoPaths = protoFiles.map(file => path.join(protoDir, file)).join(' ');
  
  // Use protoc with ts-proto plugin
  execSync(`npx protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=${outputDir} --proto_path=${protoDir} ${fullProtoPaths}`, {
    stdio: 'inherit'
  });
  
  console.log('Proto generation completed successfully!');
  console.log('Generated TypeScript files in:', outputDir);
  
} catch (error) {
  console.error('Error generating proto files:', error.message);
  console.log('Falling back to protobufjs method...');
  
  // Fallback to protobufjs method
  try {
    const jsOutputPath = path.join(outputDir, 'protos.js');
    const tsOutputPath = path.join(outputDir, 'protos.d.ts');
    
    execSync(`yarn pbjs --target static-module --wrap es6 --out ${jsOutputPath} --path ${protoDir} ${fullProtoPaths}`, {
      stdio: 'inherit'
    });
    
    execSync(`yarn pbts --out ${tsOutputPath} ${jsOutputPath}`, {
      stdio: 'inherit'
    });
    
    console.log('Fallback generation completed successfully!');
    console.log('Generated files:');
    console.log('- JS:', jsOutputPath);
    console.log('- TS:', tsOutputPath);
    
  } catch (fallbackError) {
    console.error('Fallback also failed:', fallbackError.message);
    process.exit(1);
  }
}