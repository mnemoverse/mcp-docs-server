#!/usr/bin/env node

/**
 * Script to create a new MCP docs server from template
 * Usage: npm run template:create project-name
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createTemplate(projectName) {
  if (!projectName) {
    console.error('Usage: npm run template:create <project-name>');
    process.exit(1);
  }

  const templateDir = path.resolve(__dirname, '..');
  const targetDir = path.resolve(process.cwd(), projectName);

  try {
    // Check if target directory already exists
    try {
      await fs.access(targetDir);
      console.error(`Error: Directory ${projectName} already exists`);
      process.exit(1);
    } catch {
      // Directory doesn't exist, which is what we want
    }

    console.log(`Creating new MCP docs server: ${projectName}`);

    // Create target directory
    await fs.mkdir(targetDir, { recursive: true });

    // Files to copy (excluding some template-specific files)
    const filesToCopy = [
      'src/',
      'docs/',
      'scripts/',
      'package.json',
      'tsconfig.json',
      'TEMPLATE.md'
    ];

    // Copy files
    for (const file of filesToCopy) {
      const srcPath = path.join(templateDir, file);
      const destPath = path.join(targetDir, file);

      try {
        const stat = await fs.stat(srcPath);
        if (stat.isDirectory()) {
          await copyDirectory(srcPath, destPath);
        } else {
          await fs.mkdir(path.dirname(destPath), { recursive: true });
          await fs.copyFile(srcPath, destPath);
        }
      } catch (error) {
        console.warn(`Warning: Could not copy ${file}:`, error.message);
      }
    }

    // Update package.json with new project name
    const packageJsonPath = path.join(targetDir, 'package.json');
    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      packageJson.name = `@your-org/${projectName}`;
      packageJson.description = `MCP documentation server for ${projectName}`;
      packageJson.version = '1.0.0';
      // Remove some template-specific scripts
      delete packageJson.scripts['template:create'];
      
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    } catch (error) {
      console.warn('Warning: Could not update package.json:', error.message);
    }

    // Create README.md from TEMPLATE.md
    try {
      const templateContent = await fs.readFile(path.join(targetDir, 'TEMPLATE.md'), 'utf-8');
      await fs.writeFile(path.join(targetDir, 'README.md'), templateContent);
      await fs.unlink(path.join(targetDir, 'TEMPLATE.md'));
    } catch (error) {
      console.warn('Warning: Could not create README.md:', error.message);
    }

    // Create .gitignore
    const gitignoreContent = `node_modules/
dist/
.env
.DS_Store
*.log
coverage/
.nyc_output/
`;
    await fs.writeFile(path.join(targetDir, '.gitignore'), gitignoreContent);

    console.log('\n✅ Template created successfully!');
    console.log('\nNext steps:');
    console.log(`  cd ${projectName}`);
    console.log('  npm install');
    console.log('  npm run build');
    console.log('  node dist/server.js  # Test the server');
    console.log('\nSee README.md for customization instructions.');

  } catch (error) {
    console.error('Error creating template:', error);
    process.exit(1);
  }
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// Get project name from command line arguments
const projectName = process.argv[2];
createTemplate(projectName);
