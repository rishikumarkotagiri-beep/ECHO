export class MetacognitionModule {
  constructor() {
    this.reflectionLogs = [];
  }

  /**
   * Formulates a self-reflective entry explaining decision logic.
   */
  reflectOnAction(cycle, internalState, goal, chosenAction, surpriseScore) {
    const logEntry = {
      cycle,
      timestamp: Date.now(),
      summary: `At cycle ${cycle}, I pursued '${goal}' because surprise score was ${surpriseScore.toFixed(2)} and curiosity was ${(internalState.curiosity * 100).toFixed(0)}%.`,
      reasoningTrace: {
        primaryDriver: surpriseScore > 0.5 ? 'High Environmental Surprise' : 'Internal Drive',
        actionSelected: chosenAction.type,
        target: chosenAction.target
      }
    };

    if (this.reflectionLogs.length >= 20) {
      this.reflectionLogs.shift();
    }
    this.reflectionLogs.push(logEntry);

    return logEntry.summary;
  }

  getLatestReflection() {
    return this.reflectionLogs[this.reflectionLogs.length - 1] || null;
  }
}
