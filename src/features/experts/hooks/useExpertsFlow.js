import { useEffect, useMemo, useState } from 'react';
import { enrichExpertProfile } from '../../../services/orchestration/expertEnrichmentService';
import {
  createExpert,
  removeExpert,
  subscribeExperts,
  updateExpert
} from '../../../services/repositories/expertsRepository';
import { validateExpertPayload } from '../../../domain/experts/expert.validators';
import { getMyProfile } from '../experts.selectors';

export function useExpertsFlow({
  user,
  ensureAuthUser,
  setErrorMessage,
  isAdminAuthenticated,
  setView,
  setEditObject,
  t,
  MARKET_CONFIG,
  SYSTEM_VERSION,
  allowedSectors
}) {
  const [experts, setExperts] = useState([]);
  const [formStatus, setFormStatus] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);

  useEffect(() => {
    const unsubscribeExperts = subscribeExperts(setExperts);
    return () => unsubscribeExperts();
  }, [user]);

  const myProfile = useMemo(() => getMyProfile(experts, user), [experts, user]);

  const analyzeExpert = async (expert) => {
    if (!expert || analyzingId) return;
    setAnalyzingId(expert.id);
    try {
      await enrichExpertProfile({
        brand: t.brand,
        marketName: MARKET_CONFIG.name,
        marketFocus: MARKET_CONFIG.focus,
        expert
      });
    } catch {
      setErrorMessage(t.errIntelligenceBridgeOffline);
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleRegister = async (event, editObject) => {
    event.preventDefault();
    setFormStatus('submitting');
    setErrorMessage('');

    const activeUser = await ensureAuthUser();
    if (!activeUser?.uid) {
      setFormStatus('error');
      setErrorMessage(t.errAuthFailedRefresh);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const rawPayload = {
      name: (formData.get('name') || '').toString().trim(),
      title: (formData.get('title') || '').toString().trim(),
      sector: (formData.get('sector') || '').toString().trim(),
      phone: (formData.get('phone') || '').toString().trim(),
      bio: (formData.get('bio') || '').toString().trim(),
      bottleneck: (formData.get('bottleneck') || '').toString().trim(),
      gainCreator: (formData.get('gainCreator') || '').toString().trim()
    };

    const validation = validateExpertPayload(rawPayload, { allowedSectors });
    if (!validation.isValid) {
      setFormStatus('error');
      setErrorMessage(t.errInvalidExpertPayload);
      return;
    }

    try {
      const data = {
        ...validation.payload,
        status: 'active',
        userId: activeUser.uid,
        schemaVersion: SYSTEM_VERSION,
        marketOrigin: MARKET_CONFIG.name
      };

      if (editObject && editObject.type === 'expert') {
        await updateExpert(editObject.id, data);
      } else {
        await createExpert(data);
      }

      setFormStatus('success');
      setTimeout(() => {
        setView(isAdminAuthenticated ? 'admin' : 'directory');
        setEditObject(null);
        setFormStatus(null);
      }, 1500);
    } catch (err) {
      setFormStatus('error');
      setErrorMessage(err?.message || t.errRegistrationFailed);
    }
  };

  const removeExpertById = async (expertId) => {
    try {
      await removeExpert(expertId);
    } catch {
      setErrorMessage(t.errRemovalFailed);
    }
  };

  return {
    experts,
    myProfile,
    formStatus,
    analyzingId,
    analyzeExpert,
    handleRegister,
    removeExpertById
  };
}
