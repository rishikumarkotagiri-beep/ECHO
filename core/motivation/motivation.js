export class MotivationSystem {
  constructor() {
    this.drives = {
      curiosity: 0.82,
      safety: 0.55,
      mastery: 0.45,
      social: 0.40,
      novelty: 0.70
    };
    this.activeGoal = null;
  }

  generateGoals(perceptions, memories, questions) {
    const goals = [];

    if (perceptions.some(p => p.type === "unknown"))
      goals.push({text:"Investigate something I do not understand.", score:this.drives.curiosity});
    if (questions.length)
      goals.push({text:`Find an answer to: ${questions[0]}`, score:this.drives.curiosity * 0.95});
    if (memories.length)
      goals.push({text:"Connect something new to what I already know.", score:this.drives.mastery});
    goals.push({text:"Explore a new part of the village.", score:this.drives.novelty});

    goals.sort((a,b) => b.score-a.score);
    this.activeGoal = goals[0] ?? {text:"Observe the world.", score:0.1};
    return goals;
  }
}
