export function reason(goal, attention, memories) {
  const target = attention[0];
  if (!target) return {
    thought: "I need more information before deciding.",
    action: "observe"
  };

  const related = memories.find(m =>
    m.event.toLowerCase().includes(target.name.toLowerCase())
  );

  if (related) {
    return {
      thought: `I remember something about ${target.name}. I should use that knowledge.`,
      action: target.interactable ? "interact" : "observe"
    };
  }

  return {
    thought: `I do not know enough about ${target.name}. I should investigate.`,
    action: target.interactable ? "interact" : "observe"
  };
}
