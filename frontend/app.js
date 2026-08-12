// Import the v3 brain module from the core folder
import { EchoBrainV3 } from '../core/echo.js';

// 1. Instantiate the ECHO Brain
const brain = new EchoBrainV3();

// Initial console check to confirm initialization
console.log("ECHO Brain V3 Active:", brain.step([]));

// 2. Define surrounding environment observations (Perceptions)
function getSurroundingPerceptions() {
  return [
    { id: 'Old Man', type: 'npc', distance: 3.0, description: 'Sitting on a bench', state: 'static' },
    { id: 'Wooden House', type: 'building', distance: 12.0, description: 'Looks like housing', state: 'closed' },
    { id: 'Tree', type: 'nature', distance: 5.0, description: 'Tall and green', state: 'static' },
    { id: 'Water Well', type: 'object', distance: 8.0, description: 'Clean water source', state: 'static' }
  ];
}

// 3. Main Cognitive Loop Execution
function runCognitiveCycle() {
  const observations = getSurroundingPerceptions();
  
  // Step the brain
  const output = brain.step(observations);

  // Log execution step to Browser Console
  console.log(`[Cycle ${output.cycle}] Goal: "${output.activeGoal}" | Surprise: ${output.surpriseScore}`);

  // --- HUD UI UPDATES ---

  // Update Cycle Count
  const cycleElem = document.getElementById('hud-cycle') || document.querySelector('.cycle-counter');
  if (cycleElem) cycleElem.innerText = `CYCLE: ${output.cycle}`;

  // Update Active Goal & Sub-goals
  const goalElem = document.getElementById('hud-goal') || document.querySelector('.current-goal');
  if (goalElem) goalElem.innerText = output.activeGoal;

  const subGoalElem = document.getElementById('hud-subgoals') || document.querySelector('.sub-goals');
  if (subGoalElem && output.subGoals) {
    subGoalElem.innerHTML = output.subGoals.map(sg => `<li>${sg}</li>`).join('');
  }

  // Update Internal State & Surprise Metrics
  const surpriseVal = document.getElementById('val-surprise');
  if (surpriseVal) surpriseVal.innerText = output.surpriseScore.toFixed(2);

  const surpriseBar = document.getElementById('bar-surprise');
  if (surpriseBar) surpriseBar.style.width = `${Math.min(100, output.surpriseScore * 100)}%`;

  // Update Thought Stream & Metacognitive Reflection
  const thoughtLog = document.getElementById('hud-thoughts') || document.querySelector('.thought-stream');
  if (thoughtLog && output.latestReflection) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerText = `[Cycle ${output.cycle}] ${output.latestReflection}`;
    thoughtLog.prepend(entry);
  }

  const reflectionElem = document.getElementById('hud-reflection');
  if (reflectionElem && output.latestReflection) {
    reflectionElem.innerText = output.latestReflection;
  }

  // Update Current Action
  const actionElem = document.getElementById('hud-action');
  if (actionElem && output.action) {
    actionElem.innerText = `ACTION: ${output.action.type} -> ${output.action.target}`;
  }
}

// 4. Run loop automatically every 1.5 seconds
setInterval(runCognitiveCycle, 1500);
