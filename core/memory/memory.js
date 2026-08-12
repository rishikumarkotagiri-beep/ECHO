export class MemorySystem {
  constructor() {
    this.working = [];
    this.episodic = [];
    this.semantic = new Map();
  }

  remember(event, importance = 0.5) {
    const item = {
      id: crypto.randomUUID?.() ?? String(Date.now() + Math.random()),
      time: Date.now(),
      event,
      importance,
      accessCount: 0
    };
    this.working.unshift(item);
    this.episodic.unshift(item);
    this.working = this.working.slice(0, 12);
    this.episodic = this.episodic.slice(0, 100);
    return item;
  }

  learn(key, value, confidence = 0.6) {
    this.semantic.set(key, { value, confidence, updated: Date.now() });
  }

  recall(query = "") {
    const q = query.toLowerCase();
    return this.episodic
      .filter(x => !q || x.event.toLowerCase().includes(q))
      .sort((a,b) => (b.importance + b.accessCount*.02) - (a.importance + a.accessCount*.02))
      .slice(0, 8)
      .map(x => { x.accessCount++; return x; });
  }

  knowledge() {
    return [...this.semantic.entries()].map(([key, data]) => ({key, ...data}));
  }
}
