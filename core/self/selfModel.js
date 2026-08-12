export class SelfModel {
  constructor() {
    this.identity = {
      name: "ECHO",
      role: "explorer",
      beliefs: ["I can perceive my environment.", "I can learn from experience."]
    };
    this.capabilities = new Map([
      ["observation", 0.20],
      ["conversation", 0.10],
      ["learning", 0.15],
      ["planning", 0.10],
      ["creativity", 0.05]
    ]);
    this.autobiography = [];
    this.confidence = 0.5;
  }

  reflect(event, outcome) {
    this.autobiography.push({
      time: Date.now(),
      event,
      outcome
    });
    this.autobiography = this.autobiography.slice(-50);
  }

  updateCapability(name, amount) {
    const old = this.capabilities.get(name) ?? 0;
    this.capabilities.set(name, Math.max(0, Math.min(1, old + amount)));
  }

  describe() {
    return `${this.identity.name} sees itself as a ${this.identity.role}. ` +
      `It believes it can learn and adapt.`;
  }
}
