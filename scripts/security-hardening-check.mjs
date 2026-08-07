import fs from 'node:fs';
import path from 'node:path';

const workspaceRoot = process.cwd();
const rootEnvPath = path.join(workspaceRoot, '.env');
const srcEnvPath = path.join(workspaceRoot, 'src', '.env');
const gitignorePath = path.join(workspaceRoot, '.gitignore');
const firebaseClientPath = path.join(workspaceRoot, 'src', 'services', 'firebase', 'clientApp.js');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const entries = {};

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    entries[key] = value;
  });

  return entries;
}

function isStrongPassword(value) {
  if (!value || value.length < 12) {
    return false;
  }

  const hasLower = /[a-z]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);

  return hasLower && hasUpper && hasNumber && hasSymbol;
}

function checkGitignore() {
  if (!fs.existsSync(gitignorePath)) {
    return ['Missing .gitignore file.'];
  }

  const content = fs.readFileSync(gitignorePath, 'utf8');
  const required = ['.env', '.env.*', 'src/.env'];
  return required.filter((entry) => !content.includes(entry)).map((entry) => `Missing ${entry} in .gitignore`);
}

function checkFirebaseConfigHardcoding() {
  if (!fs.existsSync(firebaseClientPath)) {
    return ['Missing firebase client config file.'];
  }

  const content = fs.readFileSync(firebaseClientPath, 'utf8');
  const warnings = [];

  if (content.includes('DEFAULT_FIREBASE_CONFIG')) {
    warnings.push('Fallback firebase constants still exist in source. Prefer env-only in production.');
  }

  if (!content.includes('VITE_FIREBASE_API_KEY')) {
    warnings.push('VITE_FIREBASE_* environment mapping not found in firebase client config.');
  }

  return warnings;
}

const failures = [];
const warnings = [];

const rootEnv = parseEnvFile(rootEnvPath);
const srcEnv = parseEnvFile(srcEnvPath);

if (!rootEnv.VITE_ADMIN_PASSWORD) {
  failures.push('VITE_ADMIN_PASSWORD missing in root .env');
} else if (!isStrongPassword(rootEnv.VITE_ADMIN_PASSWORD)) {
  failures.push('VITE_ADMIN_PASSWORD is weak. Use 12+ chars with upper/lower/number/symbol.');
}

if (Object.keys(srcEnv).length > 0) {
  failures.push('src/.env should not contain credentials. Move values to root .env only.');
}

failures.push(...checkGitignore());
warnings.push(...checkFirebaseConfigHardcoding());

if (failures.length) {
  console.error('SECURITY CHECK FAILED');
  failures.forEach((item) => console.error(`- ${item}`));
  warnings.forEach((item) => console.warn(`WARN: ${item}`));
  process.exit(1);
}

console.log('SECURITY CHECK PASSED');
warnings.forEach((item) => console.warn(`WARN: ${item}`));
