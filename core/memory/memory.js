export class MemorySystem {
  constructor() {
    this.episodicMemory = [];
    this.concepts = new Map();
  }

  recordEpisode(episode) {
    this.episodicMemory.push(episode);
    if (episode.perception && episode.perception.id) {
      this.updateConcepts(episode);
    }
  }

  updateConcepts(episode) {
    const key = episode.perception.id;
    const current = this.concepts.get(key) || { encounters: 0, affinity: 0.5, valenceHistory: [] };
    
    current.encounters += 1;
    if (episode.emotionalResponse && typeof episode.emotionalResponse.valence === 'number') {
      current.valenceHistory.push(episode.emotionalResponse.valence);
      const avgValence = current.valenceHistory.reduce((a, b) => a + b, 0) / current.valenceHistory.length;
      current.affinity = avgValence;
    }

    this.concepts.get(key) || this.concepts.set(key, current);
  }

  recallRelevant(context) {
    if (!context || !context.id) return [];
    return this.episodicMemory.filter(e => e.perception && e.perception.id === context.id).slice(-3);
  }
}
