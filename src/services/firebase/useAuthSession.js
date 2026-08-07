import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './clientApp';
import { ensureAuthenticatedUser, signInAnonymouslyWithFallback } from './authClient';

export function useAuthSession({ messages = {} } = {}) {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (sessionUser) => {
      if (sessionUser) {
        setUser(sessionUser);
      }
      setIsAuthReady(true);
    });

    if (!auth.currentUser) {
      signInAnonymouslyWithFallback(auth, messages).then((result) => {
        if (result.user) {
          setUser(result.user);
        }
        if (result.error) {
          setAuthError(result.error);
        }
        setIsAuthReady(true);
      });
    } else {
      setIsAuthReady(true);
    }

    return () => unsubscribeAuth();
  }, []);

  const ensureAuthUser = useCallback(async () => {
    try {
      const activeUser = await ensureAuthenticatedUser(auth, user, messages);
      if (activeUser?.uid) {
        setUser(activeUser);
      }
      return activeUser;
    } catch (err) {
      setAuthError(err?.message || messages.errAuthFailedRefresh || 'Authentication failed. Please refresh and try again.');
      return null;
    }
  }, [user, messages]);

  return {
    user,
    isAuthReady,
    authError,
    setAuthError,
    ensureAuthUser
  };
}
