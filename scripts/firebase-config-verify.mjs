import { readFile } from 'node:fs/promises';
import process from 'node:process';

const APP_FILE = new URL('../src/App.jsx', import.meta.url);
const FIREBASE_SERVICE_FILE = new URL('../src/services/firebase/clientApp.js', import.meta.url);
const AI_SERVICE_FILE = new URL('../src/services/ai/aiClient.js', import.meta.url);

function extractConfig(source) {
  const blockMatch = source.match(/export\s+const\s+firebaseConfig\s*=\s*\{([\s\S]*?)\};/);
  if (!blockMatch) {
    throw new Error('Unable to find firebaseConfig export.');
  }

  const body = blockMatch[1];
  const config = {};
  const lineRegex = /(apiKey|authDomain|projectId|storageBucket|messagingSenderId|appId|measurementId)\s*:\s*['"]([^'"]+)['"]/g;

  let match;
  while ((match = lineRegex.exec(body)) !== null) {
    config[match[1]] = match[2];
  }

  return config;
}

function printResult(label, ok, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}${detail ? ` -> ${detail}` : ''}`);
}

async function main() {
  const [appSource, firebaseSource, aiSource] = await Promise.all([
    readFile(APP_FILE, 'utf8'),
    readFile(FIREBASE_SERVICE_FILE, 'utf8'),
    readFile(AI_SERVICE_FILE, 'utf8')
  ]);

  const firebaseConfig = extractConfig(firebaseSource);

  console.log('=== Firebase Config Verification ===');

  printResult('firebaseConfig exported in service', true);

  const hasHardcodedConfigInApp = /const\s+firebaseConfig\s*=\s*\{/.test(appSource);
  printResult('App.jsx no longer hardcodes firebaseConfig', !hasHardcodedConfigInApp);

  const importsClientService = /from\s+['"]\.\/services\/firebase\/clientApp['"]/.test(appSource);
  printResult('App.jsx imports Firebase client service', importsClientService);

  const hasExpectedProject = firebaseConfig.projectId === 'el-mouloukia-bc-39f12';
  printResult('projectId expected value', hasExpectedProject, firebaseConfig.projectId || '<missing>');

  const hasExpectedAuthDomain = firebaseConfig.authDomain === 'el-mouloukia-bc-39f12.firebaseapp.com';
  printResult('authDomain expected value', hasExpectedAuthDomain, firebaseConfig.authDomain || '<missing>');

  const hasApiKey = Boolean(firebaseConfig.apiKey);
  printResult('apiKey present', hasApiKey, hasApiKey ? `${firebaseConfig.apiKey.slice(0, 8)}...` : '<missing>');

  const hasGeminiEnvReference = /VITE_GEMINI_API_KEY/.test(aiSource);
  printResult('Gemini key sourced from env', hasGeminiEnvReference);

  const failures = [
    hasHardcodedConfigInApp,
    !importsClientService,
    !hasExpectedProject,
    !hasExpectedAuthDomain,
    !hasApiKey,
    !hasGeminiEnvReference
  ].filter(Boolean).length;

  if (failures > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Configuration verification failed:');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(2);
});
