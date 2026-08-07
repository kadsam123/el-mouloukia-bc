import { useState } from 'react';

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

export function useAdminSession({ adminPassword, adminPasswordAliases = [], setErrorMessage, t }) {
  const [adminKey, setAdminKey] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const validAliases = Array.isArray(adminPasswordAliases)
    ? adminPasswordAliases.map((item) => String(item || '').trim()).filter(Boolean)
    : [];

  const handleAdminLogin = () => {
    if (!adminPassword && validAliases.length === 0) {
      setErrorMessage(t.errAdminPasswordMissing);
      return;
    }

    if (validAliases.includes(adminKey)) {
      setIsAdminAuthenticated(true);
      setErrorMessage('');
      return;
    }

    if (!adminPassword) {
      setErrorMessage(t.errInvalidAdminKey);
      return;
    }

    if (!isStrongPassword(adminPassword)) {
      setErrorMessage('Admin password policy violation: use at least 12 chars with upper, lower, number, and symbol.');
      return;
    }

    if (adminKey === adminPassword) {
      setIsAdminAuthenticated(true);
      setErrorMessage('');
      return;
    }

    setErrorMessage(t.errInvalidAdminKey);
  };

  return {
    adminKey,
    setAdminKey,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    handleAdminLogin
  };
}
