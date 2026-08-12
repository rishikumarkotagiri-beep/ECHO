export class MetacognitionEngine {
  constructor() {
    this.reflections = [];
  }

  evaluateState(cycle, activeGoal, surpriseScore, memoryCount) {
    let reflection = "";
    if (surpriseScore > 0.6) {
      reflection = `Uncertainty is high (${surpriseScore.toFixed(2)}). Re-evaluating world expectations.`;
    } else if (memoryCount > 5) {
      reflection = `Synthesizing past observations. Pursuing internal objective: '${activeGoal}'.`;
    } else {
      reflection = `Initializing baseline perceptions and mapping surroundings.`;
    }

    this.reflections.push({ cycle, reflection });
    return reflection;
  }
}
