import { EchoBrainV3 } from '../core/echo.js';

// 1. Initialize the V3 Brain
const echoBrain = new EchoBrainV3();

// 2. Simulated Perception Feed from Three.js scene
function getSurroundingPerceptions() {
  return [
    { id: 'Old Man', type: 'npc', distance: 3.0, description: 'Sitting on a bench' },
    { id: 'Wooden House', type: 'building', distance: 12.0, state: 'closed' },
    { id: 'Tree', type: 'nature', distance: 5.0 },
    { id: 'Water Well', type: 'object', distance: 8.0 }
  ];
}

// 3. Main Simulation Loop Step
function runCognitiveCycle() {
  const currentPerceptions = getSurroundingPerceptions();

  // Run the brain cycle
  const output = echoBrain.step(currentPerceptions);

  // Update HUD - Cycle & Goals
  document.querySelector('.cycle-counter').innerText = `CYCLE: ${output.cycle}`;
  document.querySelector('.current-goal').innerText = output.activeGoal;
  
  const subGoalsContainer = document.querySelector('.sub-goals');
  if (subGoalsContainer && output.subGoals) {
    subGoalsContainer.innerHTML = output.subGoals.map(sg => `<li>${sg}</li>`).join('');
  }

  // Update HUD - Thought Stream & Reflection
  const thoughtStream = document.querySelector('.thought-stream');
  if (thoughtStream && output.latestReflection) {
    const newEntry = document.createElement('p');
    newEntry.innerText = output.latestReflection;
    thoughtStream.prepend(newEntry);
  }

  // Action Dispatch
  console.log(`Action Executed: ${output.action.type} -> ${output.action.target}`);
}

// Run loop at fixed interval (e.g., every 1000ms)
setInterval(runCognitiveCycle, 1000);
