export class PredictionEngine {
  constructor() {
    this.worldExpectations = new Map();
  }

  /**
   * Predicts environmental state based on spatial and historical context.
   */
  generateExpectations(currentLocation, nearbyEntities) {
    const predictions = [];
    nearbyEntities.forEach(entity => {
      const expectation = this.worldExpectations.get(entity.id) || {
        expectedState: 'static',
        accessibility: 'open',
        confidence: 0.5
      };
      predictions.push({ entityId: entity.id, expectation });
    });
    return predictions;
  }

  /**
   * Calculates "Surprise Score" (Prediction Error) when reality differs from predictions.
   */
  calculateSurprise(predictions, actualObservations) {
    let totalSurprise = 0;

    actualObservations.forEach(obs => {
      const pred = predictions.find(p => p.entityId === obs.id);
      if (!pred) {
        // Novel object encountered: Maximum surprise
        totalSurprise += 1.0;
      } else if (obs.state !== pred.expectation.expectedState) {
        // State mismatch (e.g., house was open, now locked)
        totalSurprise += 0.7 * pred.expectation.confidence;
      } else {
        // Expected outcome: Minimal surprise
        totalSurprise += 0.05;
      }
    });

    return Math.min(1.0, totalSurprise);
  }

  updateExpectation(entityId, actualState) {
    this.worldExpectations.set(entityId, {
      expectedState: actualState,
      accessibility: actualState.includes('locked') ? 'restricted' : 'open',
      confidence: 0.9
    });
  }
}
