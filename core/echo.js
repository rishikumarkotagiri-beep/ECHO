import { MemorySystem } from "./memory/memory.js";
import { SelfModel } from "./self/selfModel.js";
import { MotivationSystem } from "./motivation/motivation.js";
import { perceive } from "./cognition/perception.js";
import { selectAttention } from "./cognition/attention.js";
import { reason } from "./cognition/reasoning.js";
import { Metacognition } from "./cognition/metacognition.js";
import { LearningEngine } from "./learning/learning.js";

export class Echo {
  constructor(world) {
    this.world = world;
    this.memory = new MemorySystem();
    this.self = new SelfModel();
    this.motivation = new MotivationSystem();
    this.metacognition = new Metacognition();
    this.learning = new LearningEngine();

    this.internal = {
      energy: 0.78, curiosity: 0.82, confidence: 0.50,
      stress: 0.20, socialNeed: 0.40
    };

    this.cycle = 0;
    this.questions = [
      "Who am I?",
      "Why am I here?",
      "What can I become?"
    ];
    this.thoughts = ["I am beginning to explore this world."];
    this.lastAction = "observe";
  }

  step() {
    this.cycle++;

    const perceptions = perceive(this.world);
    const attention = selectAttention(perceptions, this.internal);

    // Retrieval is driven by what ECHO is currently attending to.
    const memories = this.memory.recall(attention[0]?.name ?? "");

    const goals = this.motivation.generateGoals(
      perceptions, memories, this.questions
    );

    const decision = reason(
      goals[0] ?? {text:"Observe", score:0.1},
      attention,
      memories
    );

    const target = attention[0];
    const prediction = this.learning.predict(decision.action, target?.name ?? "world");

    const outcome = this.world.act(
      decision.action,
      target?.name ?? "world"
    );

    this.learning.learn(prediction, outcome);

    const reflection = this.metacognition.inspect(decision, outcome);
    this.self.reflect(decision.thought, outcome.result);

    this.memory.remember(
      `${outcome.result} — ${decision.thought}`,
      outcome.success ? 0.7 : 0.5
    );

    if (target && !target.seenBefore)
      target.seenBefore = true;

    if (outcome.learned)
      this.memory.learn(outcome.learned.key, outcome.learned.value, 0.75);

    this.internal.energy = Math.max(0.1, this.internal.energy - 0.003);
    this.internal.curiosity = Math.max(
      0.1, Math.min(1, this.internal.curiosity + (reflection.question.includes("learn") ? 0.004 : -0.001))
    );

    if (outcome.success)
      this.self.updateCapability("learning", 0.006);

    this.lastAction = decision.action;
    this.thoughts.unshift(decision.thought);
    this.thoughts.unshift(reflection.question);
    this.thoughts = this.thoughts.slice(0, 8);

    if (this.cycle % 9 === 0) {
      this.questions.unshift(
        outcome.learned
          ? `What else can I discover about ${outcome.learned.key}?`
          : "Why did I choose that action?"
      );
      this.questions = [...new Set(this.questions)].slice(0, 6);
    }

    return {
      perceptions, attention, goals, decision, outcome, reflection,
      internal: this.internal, cycle: this.cycle
    };
  }
}
