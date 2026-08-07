import { readFile } from 'node:fs/promises';
import process from 'node:process';

const FIREBASE_SERVICE_FILE = new URL('../src/services/firebase/clientApp.js', import.meta.url);

function extractConfig(source) {
  const blockMatch = source.match(/export\s+const\s+firebaseConfig\s*=\s*\{([\s\S]*?)\};/);
  if (!blockMatch) {
    throw new Error('Unable to find firebaseConfig export.');
  }

  const body = blockMatch[1];
  const config = {};
  const lineRegex = /(apiKey|projectId)\s*:\s*['"]([^'"]+)['"]/g;

  let match;
  while ((match = lineRegex.exec(body)) !== null) {
    config[match[1]] = match[2];
  }

  return config;
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

async function getJson(url, headers = {}) {
  const response = await fetch(url, { headers });

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

async function main() {
  const source = await readFile(FIREBASE_SERVICE_FILE, 'utf8');
  const config = extractConfig(source);

  if (!config.apiKey || !config.projectId) {
    throw new Error('Missing apiKey or projectId in firebase config.');
  }

  console.log('=== Firestore Connectivity Check ===');
  console.log(`projectId: ${config.projectId}`);

  const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.apiKey}`;
  const signUp = await postJson(signUpUrl, { returnSecureToken: true });

  console.log(`auth status: ${signUp.response.status}`);
  if (!signUp.response.ok) {
    console.log(`auth error: ${readErrorMessage(signUp.json)}`);
    process.exit(2);
  }

  const idToken = signUp.json?.idToken;
  if (!idToken) {
    console.log('auth error: missing idToken after sign-up.');
    process.exit(3);
  }

  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/artifacts?pageSize=1`;
  const firestore = await getJson(firestoreUrl, {
    authorization: `Bearer ${idToken}`
  });

  console.log(`firestore status: ${firestore.response.status}`);

  if (!firestore.response.ok) {
    console.log(`firestore error: ${readErrorMessage(firestore.json)}`);
    process.exit(4);
  }

  const count = Array.isArray(firestore.json?.documents) ? firestore.json.documents.length : 0;
  console.log(`firestore read ok: documents fetched=${count}`);
}

main().catch((error) => {
  console.error('Firestore connectivity check failed:');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
