export class EnvironmentLearner {
  constructor() {
    this.knowledge = {};
    this.episodes = [];
  }

  observe(observation) {
    const key = observation.id;

    if (!this.knowledge[key]) {
      this.knowledge[key] = {
        id: key,
        observations: 0,
        properties: {},
        hypotheses: {},
        confidence: 0
      };
    }

    const object = this.knowledge[key];

    object.observations++;

    for (const [property, value] of Object.entries(observation.properties || {})) {
      object.properties[property] = value;
    }

    this.episodes.push({
      time: Date.now(),
      observation
    });

    if (this.episodes.length > 500) {
      this.episodes.shift();
    }

    return object;
  }

  learn(id, hypothesis, predictionCorrect) {
    const object = this.knowledge[id];

    if (!object) return;

    if (!object.hypotheses[hypothesis]) {
      object.hypotheses[hypothesis] = {
        confidence: 0.5,
        tests: 0
      };
    }

    const h = object.hypotheses[hypothesis];

    h.tests++;

    if (predictionCorrect) {
      h.confidence += 0.08;
    } else {
      h.confidence -= 0.12;
    }

    h.confidence = Math.max(0, Math.min(1, h.confidence));
  }

  getKnowledge(id) {
    return this.knowledge[id] || null;
  }
}
