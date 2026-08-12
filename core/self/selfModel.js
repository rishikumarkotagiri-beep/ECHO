export class SelfModel {
  constructor() {
    this.identity = "ECHO";
    this.internalState = {
      energy: 0.5,
      curiosity: 1.0,
      hunger: 0.3,
      stress: 0.2,
      confidence: 0.7,
      focus: 0.8
    };
    this.emotionalTendencies = {
      curiosity: 0.82,
      excitement: 0.61,
      contentment: 0.52,
      fear: 0.24
    };
  }

  updateState(deltaState) {
    Object.keys(deltaState).forEach(key => {
      if (this.internalState.hasOwnProperty(key)) {
        this.internalState[key] = Math.max(0, Math.min(1, this.internalState[key] + deltaState[key]));
      }
    });
  }
}
