export class MemorySystem {
  constructor() {
    this.episodicMemory = []; // Chronological record of experiences
    this.concepts = new Map(); // Synthesized knowledge: item/action -> sentiment/utility
  }

  // Store raw sensory-action-outcome frame
  recordEpisode(episode) {
    // episode: { day, time, perception, action, outcome, emotionalResponse }
    this.episodicMemory.push(episode);
    this.updateConcepts(episode);
  }

  // Extract preferences organically from past experiences
  updateConcepts(episode) {
    const key = episode.perception.id;
    const current = this.concepts.get(key) || { encounters: 0, affinity: 0.5, valenceHistory: [] };
    
    current.encounters += 1;
    current.valenceHistory.push(episode.emotionalResponse.valence);
    
    // Average emotional impact to build dynamic affinity
    const avgValence = current.valenceHistory.reduce((a, b) => a + b, 0) / current.valenceHistory.length;
    current.affinity = avgValence;

    this.concepts.set(key, current);
  }

  recallRelevant(context) {
    return this.episodicMemory.filter(e => e.perception.id === context.id).slice(-3);
  }
}
