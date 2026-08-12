export class Metacognition {
  constructor() {
    this.lastDecision = null;
    this.reflections = [];
  }

  inspect(decision, outcome) {
    const reflection = {
      time: Date.now(),
      decision,
      outcome,
      confidence: outcome.success ? 0.8 : 0.35,
      question: outcome.success
        ? "What else can I learn from this?"
        : "Why did my prediction fail?"
    };
    this.lastDecision = reflection;
    this.reflections.unshift(reflection);
    this.reflections = this.reflections.slice(0, 30);
    return reflection;
  }
}
