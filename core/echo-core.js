
export class EchoCore {
  constructor() {
    this.day=17; this.cycle=5421;
    this.state={energy:78,curiosity:82,hunger:34,social:61,stress:24,confidence:65,focus:73};
    this.goal="Explore the village and learn about the people.";
    this.questions=["Who am I?","Why am I here?","What can I become?","How does this world work?","What do people need?"];
    this.memory=[
      "Saw: Old Man","Heard: Birds","Learned: Woodcutter is Kael",
      "Observed: People working","Feeling: Curious","Saw: Red Flower",
      "Learned: This place is called Greenhaven"
    ];
    this.thoughts=[
      "I see an old man.","He looks like he knows something.",
      "I should talk to him.","He might teach me something useful.",
      "Talking to him could help me understand this world better."
    ];
    this.skills={Observation:3,Conversation:2,Learning:3,Memory:3,Logic:2,Creativity:1};
    this.lastAction="Moving towards Old Man";
  }
  tick(){
    this.cycle++;
    this.state.energy=Math.max(0,this.state.energy-.08);
    this.state.focus=Math.max(30,Math.min(100,this.state.focus+(Math.random()-.48)*2));
    this.state.curiosity=Math.max(0,Math.min(100,this.state.curiosity+(Math.random()-.35)*1.7));
    this.state.confidence=Math.max(0,Math.min(100,this.state.confidence+(Math.random()-.48)*1.2));
    if(this.cycle%7===0){
      const actions=[
        ["I noticed a new sound near the market.","Investigate the market"],
        ["The old man keeps looking at me.","Talk to the old man"],
        ["I wonder why people gather here.","Observe the village"],
        ["I want to understand how this machine works.","Study the machine"]
      ];
      const a=actions[Math.floor(Math.random()*actions.length)];
      this.thoughts.push(a[0]); this.thoughts.push("I should learn more before deciding.");
      this.memory.unshift(a[0].replace("I ","Learned: "));
      this.memory=this.memory.slice(0,8);
      this.lastAction=a[1];
      this.questions.unshift("What will I discover next?");
      this.questions=this.questions.slice(0,5);
    }
  }
}
