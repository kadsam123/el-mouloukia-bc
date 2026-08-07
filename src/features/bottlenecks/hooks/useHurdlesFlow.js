import { useEffect, useState } from 'react';
import {
  createHurdle,
  removeHurdle,
  subscribeHurdles,
  updateHurdle
} from '../../../services/repositories/bottlenecksRepository';
import { validateBottleneckPayload } from '../../../domain/bottlenecks/bottleneck.validators';

export function useHurdlesFlow({
  user,
  ensureAuthUser,
  setErrorMessage,
  isAdminAuthenticated,
  setView,
  setEditObject,
  SYSTEM_VERSION,
  allowedSectors,
  t
}) {
  const [hurdles, setHurdles] = useState([]);

  useEffect(() => {
    const unsubscribeHurdles = subscribeHurdles(setHurdles);
    return () => unsubscribeHurdles();
  }, [user]);

  const handleHurdleSubmit = async (event, editObject) => {
    event.preventDefault();
    setErrorMessage('');

    const activeUser = await ensureAuthUser();
    if (!activeUser?.uid) {
      setErrorMessage(t.errAuthFailedRefresh);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const rawPayload = {
      title: (formData.get('title') || '').toString().trim(),
      description: (formData.get('description') || '').toString().trim(),
      sector: (formData.get('sector') || '').toString().trim(),
      frictionCost: (formData.get('frictionCost') || '').toString().trim(),
      instance: (formData.get('instance') || '').toString().trim()
    };

    const validation = validateBottleneckPayload(rawPayload, { allowedSectors });
    if (!validation.isValid) {
      setErrorMessage(t.errInvalidHurdlePayload);
      return;
    }

    try {
      if (editObject && editObject.type === 'hurdle') {
        await updateHurdle(editObject.id, {
          ...validation.payload,
          schemaVersion: SYSTEM_VERSION
        });
      } else {
        await createHurdle({
          ...validation.payload,
          schemaVersion: SYSTEM_VERSION
        });
      }

      setView(isAdminAuthenticated ? 'admin' : 'directory');
      setEditObject(null);
    } catch (err) {
      setErrorMessage(err?.message || t.errActionFailed);
    }
  };

  const removeHurdleById = async (hurdleId) => {
    try {
      await removeHurdle(hurdleId);
    } catch {
      setErrorMessage(t.errRemovalFailed);
    }
  };

  return {
    hurdles,
    handleHurdleSubmit,
    removeHurdleById
  };
}
