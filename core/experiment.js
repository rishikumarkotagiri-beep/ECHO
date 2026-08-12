import { EchoA, EchoB } from '../core/experiment.js';

const agentA = new EchoA('ECHO-A-01');
const agentB = new EchoB('ECHO-B-01');

function runExperimentCycle() {
  const mockWorldPerceptions = [
    { id: 'Piano', type: 'object' },
    { id: 'Telescope', type: 'tool' },
    { id: 'Ancient Book', type: 'item' },
    { id: 'Stranger', type: 'npc' }
  ];

  const stateA = agentA.step(mockWorldPerceptions);
  const stateB = agentB.step(mockWorldPerceptions);

  console.group(`--- SIMULATION DAY ${stateB.day} ---`);
  console.log("ECHO-A (Control):", stateA.activeGoal, "| Action:", stateA.action.target);
  console.log("ECHO-B (Subject):", stateB.activeGoal, "| Reflections:", stateB.reflection);
  console.log("ECHO-B Top Interests:", stateB.selfModel.topInterests);
  console.groupEnd();
}

// Fast-forward simulation cycles
setInterval(runExperimentCycle, 1000);
