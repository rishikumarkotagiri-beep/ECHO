import { PredictionEngine } from './learning/prediction.js';
import { GoalEngine } from './motivation/goals.js';
import { MetacognitionModule } from './cognition/metacognition.js';
import { SelfModel } from './self/selfModel.js';

export class EchoBrainV3 {
  constructor() {
    this.cycle = 0;
    this.self = new SelfModel();
    this.predictor = new PredictionEngine();
    this.goalEngine = new GoalEngine();
    this.metacognition = new MetacognitionModule();
  }

  step(rawObservations = []) {
    this.cycle++;

    // 1. Generate expectations
    const predictions = this.predictor.generateExpectations('Greenhaven', rawObservations);

    // 2. Measure prediction error (Surprise)
    const surpriseScore = this.predictor.calculateSurprise(predictions, rawObservations);

    // 3. Dynamically form goals based on surprise and internal states
    const goalData = this.goalEngine.evaluateGoals(this.self.internalState, surpriseScore, rawObservations);

    // 4. Select Action
    const chosenAction = {
      type: surpriseScore > 0.5 ? 'INVESTIGATE' : 'EXPLORE',
      target: rawObservations[0]?.id || 'Village Center'
    };

    // 5. Metacognitive Reflection
    const reflection = this.metacognition.reflectOnAction(
      this.cycle,
      this.self.internalState,
      goalData.activeGoal,
      chosenAction,
      surpriseScore
    );

    return {
      cycle: this.cycle,
      surpriseScore,
      activeGoal: goalData.activeGoal,
      subGoals: goalData.subGoals,
      action: chosenAction,
      latestReflection: reflection
    };
  }
}
