export class VillageWorld {
  constructor() {
    this.objects = [
      {name:"Old Man", known:true, interactable:true, interest:.8},
      {name:"Wooden House", known:true, interactable:false, interest:.5},
      {name:"Red Flower", known:false, interactable:true, interest:.9},
      {name:"Water Well", known:true, interactable:true, interest:.7},
      {name:"Strange Machine", known:false, interactable:true, interest:1.0}
    ];
  }

  act(action, targetName) {
    const object = this.objects.find(o => o.name === targetName);
    if (!object) return {
      success:true,
      result:"ECHO observed the surrounding world.",
      learned:null
    };

    if (action === "interact") {
      const lessons = {
        "Old Man": ["Old Man", "People in Greenhaven remember stories."],
        "Red Flower": ["Red Flower", "The flower grows near the stream."],
        "Water Well": ["Water Well", "The well is shared by the village."],
        "Strange Machine": ["Strange Machine", "The machine reacts to movement."]
      };
      const lesson = lessons[targetName];
      return {
        success:true,
        result:`ECHO interacted with ${targetName}.`,
        learned: lesson ? {key:lesson[0], value:lesson[1]} : null
      };
    }

    return {
      success:true,
      result:`ECHO observed ${targetName}.`,
      learned:null
    };
  }
}
