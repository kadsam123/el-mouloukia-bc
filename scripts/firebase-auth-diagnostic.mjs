import { readFile } from 'node:fs/promises';
import process from 'node:process';

const FIREBASE_SERVICE_FILE = new URL('../src/services/firebase/clientApp.js', import.meta.url);
const DOT_ENV_FILE = new URL('../.env', import.meta.url);

function extractConfigBlock(source, constName) {
  const blockMatch = source.match(new RegExp(`const\\s+${constName}\\s*=\\s*\\{([\\s\\S]*?)\\};`));
  if (!blockMatch) {
    return {};
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

async function readDotEnvVars() {
  try {
    const raw = await readFile(DOT_ENV_FILE, 'utf8');
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .reduce((acc, line) => {
        const index = line.indexOf('=');
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim();
        acc[key] = value;
        return acc;
      }, {});
  } catch {
    return {};
  }
}

function getEnvValue(dotEnvVars, key) {
  const processValue = process.env[key];
  if (processValue !== undefined && processValue !== '') {
    return processValue;
  }

  const dotEnvValue = dotEnvVars[key];
  if (dotEnvValue !== undefined && dotEnvValue !== '') {
    return dotEnvValue;
  }

  return undefined;
}

function printSection(title) {
  console.log(`\n=== ${title} ===`);
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });

  let json;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  return { response, json };
}

async function postForm(url, params) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString()
  });

  let json;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  return { response, json };
}

function readErrorMessage(payload) {
  return payload?.error?.message || payload?.error_description || 'Unknown error';
}

function diagnoseFailure(message) {
  const msg = String(message || '').toLowerCase();

  if (msg.includes('identity toolkit api has not been used') || msg.includes('identity-toolkit-api-has-not-been-used')) {
    return 'Identity Toolkit API is disabled, not propagated yet, or you are targeting the wrong Google Cloud project.';
  }

  if (msg.includes('api_key_service_blocked') || msg.includes('permission_denied') || msg.includes('are blocked') || msg.includes('blocked.')) {
    return 'API key restrictions are blocking Firebase Auth services (Identity Toolkit and/or Secure Token).';
  }

  if (msg.includes('api key not valid')) {
    return 'The API key is invalid for this project or app.';
  }

  return 'No exact fingerprint found. Check project selection, API enablement, and API key restrictions.';
}

async function main() {
  const source = await readFile(FIREBASE_SERVICE_FILE, 'utf8');
  const dotEnvVars = await readDotEnvVars();

  const defaultConfig = extractConfigBlock(source, 'DEFAULT_FIREBASE_CONFIG');
  const literalFirebaseConfig = extractConfigBlock(source, 'firebaseConfig');

  const firebaseConfig = {
    apiKey: getEnvValue(dotEnvVars, 'VITE_FIREBASE_API_KEY') || defaultConfig.apiKey || literalFirebaseConfig.apiKey,
    authDomain: getEnvValue(dotEnvVars, 'VITE_FIREBASE_AUTH_DOMAIN') || defaultConfig.authDomain || literalFirebaseConfig.authDomain,
    projectId: getEnvValue(dotEnvVars, 'VITE_FIREBASE_PROJECT_ID') || defaultConfig.projectId || literalFirebaseConfig.projectId,
    storageBucket: getEnvValue(dotEnvVars, 'VITE_FIREBASE_STORAGE_BUCKET') || defaultConfig.storageBucket || literalFirebaseConfig.storageBucket,
    messagingSenderId: getEnvValue(dotEnvVars, 'VITE_FIREBASE_MESSAGING_SENDER_ID') || defaultConfig.messagingSenderId || literalFirebaseConfig.messagingSenderId,
    appId: getEnvValue(dotEnvVars, 'VITE_FIREBASE_APP_ID') || defaultConfig.appId || literalFirebaseConfig.appId,
    measurementId: getEnvValue(dotEnvVars, 'VITE_FIREBASE_MEASUREMENT_ID') || defaultConfig.measurementId || literalFirebaseConfig.measurementId
  };

  printSection('Firebase Config Snapshot');
  console.log(`projectId: ${firebaseConfig.projectId || '<missing>'}`);
  console.log(`authDomain: ${firebaseConfig.authDomain || '<missing>'}`);
  console.log(`apiKey: ${firebaseConfig.apiKey ? `${firebaseConfig.apiKey.slice(0, 8)}...` : '<missing>'}`);

  if (!firebaseConfig.apiKey) {
    console.error('\nMissing apiKey in firebaseConfig.');
    process.exit(1);
  }

  const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`;
  const signUp = await postJson(signUpUrl, { returnSecureToken: true });

  printSection('Identity Toolkit Check');
  console.log(`status: ${signUp.response.status}`);

  if (!signUp.response.ok) {
    const message = readErrorMessage(signUp.json);
    console.log(`error: ${message}`);
    console.log(`diagnosis: ${diagnoseFailure(message)}`);
    process.exit(2);
  }

  const refreshToken = signUp.json?.refreshToken;
  if (!refreshToken) {
    console.log('Anonymous sign-up succeeded, but no refreshToken was returned.');
    process.exit(3);
  }

  console.log('anonymous sign-up: ok');

  const secureTokenUrl = `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`;
  const secureToken = await postForm(secureTokenUrl, {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });

  printSection('Secure Token Check');
  console.log(`status: ${secureToken.response.status}`);

  if (!secureToken.response.ok) {
    const message = readErrorMessage(secureToken.json);
    console.log(`error: ${message}`);
    console.log(`diagnosis: ${diagnoseFailure(message)}`);
    process.exit(4);
  }

  console.log('token exchange: ok');
  console.log('\nAll Firebase Auth backend checks passed.');
}

main().catch((error) => {
  console.error('\nDiagnostic failed with an unexpected error:');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(10);
});
