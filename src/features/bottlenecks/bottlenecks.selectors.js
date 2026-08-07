export function getMarketHealth(hurdles) {
  const totalFriction = (hurdles || []).reduce((acc, hurdle) => acc + (parseFloat(hurdle?.frictionCost) || 0), 0);
  return { totalFriction };
}

export function getLiveFeed(experts, hurdles) {
  const combined = [
    ...(experts || []).map((expert) => ({
      id: expert.id,
      type: 'NODE',
      label: expert.name || 'Anonymous Node',
      time: expert.createdAt
    })),
    ...(hurdles || []).map((hurdle) => ({
      id: hurdle.id,
      type: 'HURDLE',
      label: hurdle.title || 'Signal detected',
      time: hurdle.createdAt
    }))
  ];

  return combined.sort((a, b) => (b.time?.seconds || 0) - (a.time?.seconds || 0)).slice(0, 5);
}
