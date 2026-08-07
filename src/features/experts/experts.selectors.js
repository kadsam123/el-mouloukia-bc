import { sectorsMatch } from '../../shared/utils/sectorKeys';

export function getMyProfile(experts, user) {
  return (experts || []).find((expert) => expert.userId === user?.uid) || null;
}

export function getFilteredExperts({ experts, filter, search, activeHurdle, getTopMatches }) {
  const normalizedSearch = (search || '').toLowerCase();

  return (experts || []).filter((expert) => {
    const matchCategory = filter === 'all' || sectorsMatch(expert.sector, filter);
    const matchSearch =
      (expert.name || '').toLowerCase().includes(normalizedSearch) ||
      (expert.title || '').toLowerCase().includes(normalizedSearch) ||
      (expert.bottleneck || '').toLowerCase().includes(normalizedSearch);

    const matchHurdle = activeHurdle
      ? sectorsMatch(expert.sector, activeHurdle.sector) || getTopMatches(activeHurdle).some((match) => match.id === expert.id)
      : true;

    return matchCategory && matchSearch && matchHurdle;
  });
}
