export function getAuthBadge({ isAuthReady, user, lang }) {
  if (!isAuthReady) {
    return {
      text: lang === 'ar' ? 'جارٍ التحقق' : 'Checking Auth',
      style: 'bg-stone-100 text-stone-600 border-stone-200'
    };
  }

  if (user) {
    return {
      text: lang === 'ar' ? 'جلسة مؤمنة' : 'Secure Session',
      style: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }

  return {
    text: lang === 'ar' ? 'وضع الاستعادة' : 'Recovery Mode',
    style: 'bg-amber-50 text-amber-700 border-amber-200'
  };
}
