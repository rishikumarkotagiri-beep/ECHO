export function selectAttention(perceptions, internal) {
  return [...perceptions]
    .map(p => ({
      ...p,
      attentionScore:
        (p.novelty ?? 0.2) * 0.55 +
        (p.interest ?? 0.5) * 0.25 +
        internal.curiosity * 0.20
    }))
    .sort((a,b) => b.attentionScore-a.attentionScore)
    .slice(0, 3);
}
