export class LearningEngine {
  constructor() {
    this.predictions = [];
    this.errors = [];
  }

  predict(action, target) {
    const prediction = {
      action,
      target,
      expected: action === "interact" ? "new information" : "new observation",
      time: Date.now()
    };
    this.predictions.push(prediction);
    return prediction;
  }

  learn(prediction, outcome) {
    const error = {
      prediction,
      actual: outcome.result,
      surprise: prediction.expected === outcome.result ? 0.1 : 0.8
    };
    this.errors.unshift(error);
    this.errors = this.errors.slice(0, 50);
    return error;
  }
}
