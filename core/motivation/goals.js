export class GoalEngine {
  constructor() {
    this.activeGoal = null;
    this.subGoals = [];
  }

  /**
   * Evaluates internal states and cognitive surprise to spawn autonomous goals.
   */
  evaluateGoals(internalState, surpriseScore, observations) {
    // Priority 1: High surprise triggers investigation goals
    if (surpriseScore > 0.6) {
      const unexpectedEntity = observations.find(o => o.isUnexpected || o.state === 'locked');
      const targetName = unexpectedEntity ? unexpectedEntity.id : 'unknown anomaly';
      
      this.activeGoal = `Investigate anomaly: ${targetName}`;
      this.subGoals = [
        `Approach ${targetName}`,
        `Inspect state of ${targetName}`,
        `Seek context from nearby entities`
      ];
      return { activeGoal: this.activeGoal, subGoals: this.subGoals };
    }

    // Priority 2: Energy/Internal state management
    if (internalState.energy < 0.25) {
      this.activeGoal = "Rest and restore internal energy";
      this.subGoals = ["Locate safe zone", "Reduce cognitive load"];
      return { activeGoal: this.activeGoal, subGoals: this.subGoals };
    }

    // Priority 3: Default curiosity-driven exploration
    if (internalState.curiosity > 0.5) {
      this.activeGoal = "Explore unfamiliar regions of Greenhaven Village";
      this.subGoals = ["Discover new landmarks", "Observe village routines"];
      return { activeGoal: this.activeGoal, subGoals: this.subGoals };
    }

    this.activeGoal = "Observe environment";
    this.subGoals = ["Maintain passive spatial awareness"];
    return { activeGoal: this.activeGoal, subGoals: this.subGoals };
  }
}
