export class PredictionEngine {
  constructor() {
    this.priorPerceptions = new Set();
  }

  computeSurprise(perceptions) {
    if (!perceptions || perceptions.length === 0) return 0.1;

    let totalNovelty = 0;
    perceptions.forEach(p => {
      if (!this.priorPerceptions.has(p.id)) {
        totalNovelty += 0.8;
        this.priorPerceptions.add(p.id);
      } else {
        totalNovelty += 0.05;
      }
    });

    return Math.min(1.0, totalNovelty / perceptions.length);
  }
}
