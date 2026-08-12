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

    // 1. Compute Prediction Error
    const surpriseScore = this.prediction.computeSurprise(perceptions);
    this.selfModel.updateDrives(surpriseScore);

    // 2. Synthesize Concepts & Goals
    const concepts = Array.from(this.memory.concepts.entries());
    const topInterests = concepts
      .map(([concept, data]) => ({ concept, affinity: data.affinity }))
      .sort((a, b) => b.affinity - a.affinity);

    const goalData = this.goals.determineGoal(surpriseScore, topInterests);

    // 3. Record Perception in Memory
    const focusItem = perceptions.length > 0 ? perceptions[0] : { id: 'Village' };
    this.memory.recordEpisode({
      day: 1,
      perception: focusItem,
      action: { type: 'observe', target: focusItem.id },
      emotionalResponse: { valence: Math.random() }
    });

    // 4. Generate Metacognitive Reflection
    const reflection = this.metacognition.evaluateState(
      this.cycle,
      goalData.activeGoal,
      surpriseScore,
      this.memory.episodicMemory.length
    );

    return {
      cycle: this.cycle,
      surpriseScore: surpriseScore,
      activeGoal: goalData.activeGoal,
      subGoals: goalData.subGoals,
      latestReflection: reflection,
      action: { type: 'Observe', target: focusItem.id },
      memoryCount: this.memory.episodicMemory.length,
      drives: this.selfModel.drives
    };
  }
}
