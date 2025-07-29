#!/usr/bin/env node

/**
 * Build script for Universal MCP Docs Server
 * Compiles TypeScript and prepares for distribution
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const packagePath = join(process.cwd(), 'package.json');
const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));

console.log(`🔨 Building ${pkg.name} v${pkg.version}...`);

try {
  // Clean dist directory
  console.log('🧹 Cleaning dist directory...');
  try {
    execSync('rm -rf dist', { stdio: 'inherit' });
  } catch (err) {
    // Directory might not exist, that's fine
  }

  // Create dist directory
  mkdirSync('dist', { recursive: true });

  // Compile TypeScript
  console.log('📦 Compiling TypeScript...');
  execSync('npx tsc', { stdio: 'inherit' });

  // Copy package.json to dist
  console.log('📋 Copying package.json...');
  const distPkg = {
    ...pkg,
    devDependencies: undefined, // Remove dev dependencies from dist
    scripts: {
      start: 'node server.js'
    }
  };
  
  writeFileSync(
    join('dist', 'package.json'),
    JSON.stringify(distPkg, null, 2)
  );

  // Copy docs directory if it exists
  if (existsSync('docs')) {
    console.log('📚 Copying docs directory...');
    execSync('cp -r docs dist/', { stdio: 'inherit' });
  }

  // Copy README and other files
  const filesToCopy = ['README.md', 'TEMPLATE.md', '.env.example'];
  filesToCopy.forEach(file => {
    if (existsSync(file)) {
      console.log(`📄 Copying ${file}...`);
      copyFileSync(file, join('dist', file));
    }
  });

  // Make the server executable
  console.log('🚀 Making server executable...');
  execSync('chmod +x dist/server.js', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
  console.log('📦 Distribution ready in ./dist/');
  
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
