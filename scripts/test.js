#!/usr/bin/env node

/**
 * Test script for Universal MCP Docs Server
 * Validates the server functionality
 */

import { spawn } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const testCases = [
  {
    name: 'List Tools',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    }
  },
  {
    name: 'List Documents',
    request: {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'list_documents',
        arguments: {
          section: 'all'
        }
      }
    }
  },
  {
    name: 'Search Documentation',
    request: {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'search_docs',
        arguments: {
          query: 'getting started',
          maxResults: 5
        }
      }
    }
  }
];

async function runTests() {
  console.log('🧪 Testing Universal MCP Docs Server...');
  
  // Build first
  console.log('🔨 Building server...');
  const { execSync } = await import('child_process');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }

  // Start server process
  const serverProcess = spawn('node', ['dist/server.js'], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  let testsPassed = 0;
  let testsFailed = 0;

  for (const testCase of testCases) {
    console.log(`\n🔍 Running test: ${testCase.name}`);
    
    try {
      const result = await sendRequest(serverProcess, testCase.request);
      console.log(`✅ ${testCase.name} passed`);
      console.log(`📊 Response:`, JSON.stringify(result, null, 2).substring(0, 200) + '...');
      testsPassed++;
    } catch (error) {
      console.error(`❌ ${testCase.name} failed:`, error);
      testsFailed++;
    }
  }

  // Clean up
  serverProcess.kill();

  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  
  if (testsFailed > 0) {
    console.log('🚨 Some tests failed!');
    process.exit(1);
  } else {
    console.log('🎉 All tests passed!');
  }
}

function sendRequest(process, request) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, 5000);

    const handleData = (data) => {
      clearTimeout(timeout);
      try {
        const response = JSON.parse(data.toString());
        resolve(response);
      } catch (error) {
        reject(new Error(`Invalid JSON response: ${data.toString()}`));
      }
    };

    process.stdout.once('data', handleData);
    process.stdin.write(JSON.stringify(request) + '\n');
  });
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
