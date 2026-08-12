import { MemorySystem } from './memory/memory.js';
import { MetacognitionEngine } from './cognition/metacognition.js';
import { PredictionEngine } from './learning/prediction.js';
import { GoalManager } from './motivation/goals.js';
import { SelfModel } from './self/selfModel.js';

export class EchoBrainV3 {
  constructor() {
    this.cycle = 0;
    this.memory = new MemorySystem();
    this.metacognition = new MetacognitionEngine();
    this.prediction = new PredictionEngine();
    this.goals = new GoalManager();
    this.selfModel = new SelfModel();
  }

  step(perceptions = []) {
    this.cycle += 1;

    // 1. Prediction & Surprise
    const surpriseScore = this.prediction ? this.prediction.computeSurprise(perceptions) : 0.2;
    if (this.selfModel && this.selfModel.updateDrives) {
      this.selfModel.updateDrives(surpriseScore);
    }

    // 2. Goal Formation
    const topInterests = [];
    const goalData = this.goals 
      ? this.goals.determineGoal(surpriseScore, topInterests) 
      : { activeGoal: "Exploring surroundings", subGoals: ["Observe objects"] };

    // 3. Focus & Memory
    const focusItem = perceptions.length > 0 ? perceptions[0] : { id: 'Village' };
    if (this.memory && this.memory.recordEpisode) {
      this.memory.recordEpisode({
        day: 1,
        perception: focusItem,
        action: { type: 'observe', target: focusItem.id },
        emotionalResponse: { valence: Math.random() }
      });
    }

    // 4. Metacognition Reflection
    const reflection = this.metacognition 
      ? this.metacognition.evaluateState(
          this.cycle,
          goalData.activeGoal,
          surpriseScore,
          this.memory ? this.memory.episodicMemory.length : 0
        )
      : `Cycle ${this.cycle}: Processing environment...`;

    return {
      cycle: this.cycle,
      surpriseScore: surpriseScore,
      activeGoal: goalData.activeGoal,
      subGoals: goalData.subGoals,
      latestReflection: reflection,
      action: { type: 'Observe', target: focusItem.id },
      memoryCount: this.memory ? this.memory.episodicMemory.length : 0,
      drives: this.selfModel ? this.selfModel.drives : { curiosity: 0.9, energy: 0.8 }
    };
  }
}
