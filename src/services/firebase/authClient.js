import { signInAnonymously } from 'firebase/auth';

export const LOCAL_DEV_UID = 'dev_test_user_constantine';

export function isLocalhost() {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

export function getLocalFallbackUser() {
  return {
    uid: LOCAL_DEV_UID,
    isAnonymous: true,
    displayName: 'Constantine Local Operator'
  };
}

export async function signInAnonymouslyWithFallback(auth, messages = {}) {
  try {
    await signInAnonymously(auth);
    return {
      user: auth.currentUser,
      error: ''
    };
  } catch (err) {
    if (isLocalhost()) {
      return {
        user: getLocalFallbackUser(),
        error: ''
      };
    }

    return {
      user: null,
      error: err?.message || messages.errCloudAuthFailed || 'Cloud authentication failed.'
    };
  }
}

export async function ensureAuthenticatedUser(auth, currentUser, messages = {}) {
  let activeUser = currentUser?.uid ? currentUser : auth.currentUser;

  if (!activeUser?.uid) {
    const result = await signInAnonymouslyWithFallback(auth, messages);
    activeUser = result.user;

    if (!activeUser?.uid && result.error) {
      throw new Error(result.error);
    }
  }

  return activeUser;
}
