export class GoalManager {
  constructor() {
    this.currentGoal = "Explore the village and discover objects";
    this.subGoals = ["Locate points of interest", "Observe surrounding entities"];
  }

  determineGoal(surpriseScore, topInterests) {
    if (topInterests && topInterests.length > 0) {
      this.currentGoal = `Investigate primary interest: ${topInterests[0].concept}`;
      this.subGoals = [`Analyze ${topInterests[0].concept}`, "Record operational feedback"];
    } else if (surpriseScore > 0.5) {
      this.currentGoal = "Analyze unexpected environment signals";
      this.subGoals = ["Scan nearby items", "Reduce uncertainty"];
    }
    return { activeGoal: this.currentGoal, subGoals: this.subGoals };
  }
}
