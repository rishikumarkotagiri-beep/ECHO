class EchoCognition{
constructor(){
this.memory=new EchoMemory();
this.world=new EchoWorldModel();
this.learning=new EchoLearning();
this.curiosity=new EchoCuriosity();
this.lastThought="I am observing my environment.";
this.lastQuestion="What can I learn from what I see?";
this.lastLearning="I have not learned anything yet.";
this.focus=null;
this.lastDecision=null;
}
observe(observations,context={}){
const candidates=[];
for(const o of observations||[]){
const id=o.id||`${o.type}:${o.name}`;
const previous=this.world.get(id);
const wasKnown=!!previous;
const before=previous?.confidence??0;
const entity=this.world.observe({
id,
name:o.name||id,
type:o.type||"unknown",
x:o.x,
z:o.z,
activity:o.activity||"unknown",
properties:o.properties||{},
confidence:o.confidence??
(wasKnown?
Math.max(.25,before):
.12)
});
if(o.x!=null&&o.z!=null){
this.memory.rememberLocation(
id,
o.x,
o.z,
.6
);
}
this.memory.rememberEpisode({
kind:"observation",
entity:id,
name:o.name,
type:o.type,
activity:o.activity,
location:{
x:o.x,
z:o.z
}
});
const novelty=
wasKnown?
Math.max(
.05,
1-(entity.observations/12)
):
.95;
const uncertainty=
1-(entity.confidence??.2);
const proximity=
1-Math.min(
1,
(o.distance??20)/20
);
const social=
o.type==="person"?.7:0;
const score=this.curiosity.score(
entity,
{
novelty,
uncertainty,
proximity,
social,
informationGain:uncertainty
}
);
candidates.push({
...o,
id,
curiosityScore:score,
novelty,
uncertainty
});
}
this.focus=this.curiosity.choose(candidates);
if(this.focus){
this.reasonAboutFocus(
this.focus,
context
);
}
return candidates;
}
reasonAboutFocus(focus,context={}){
const name=focus.name||"this place";
const type=focus.type||"unknown";
if(!focus.novelty||focus.novelty<.25){
this.lastThought=
`I recognize ${name}. I am comparing what I see now with what I remember.`;
this.lastQuestion=
`Has anything changed at ${name}?`;
}else if(type==="person"){
this.lastThought=
`I notice ${name} is ${focus.activity||"moving"}. I don't know their routine yet.`;
this.lastQuestion=
`What can I learn by observing ${name}?`;
}else{
this.lastThought=
`I keep noticing ${name}. I don't fully understand what this place is used for.`;
this.lastQuestion=
`What happens here, and when?`;
}
this.lastDecision={
target:name,
action:"observe",
time:Date.now()
};
}
learn(
entityId,
hypothesis,
expected,
observed
){
const result=
this.learning.test(
entityId,
hypothesis,
observed,
expected
);
const confidence=result.confidence;
this.memory.rememberFact(
entityId,
hypothesis,
observed,
confidence,
"prediction"
);
this.lastLearning=
`I predicted "${expected}" for ${entityId}. I observed "${observed}". Confidence: ${Math.round(confidence*100)}%.`;
return result;
}
buildState(){
return{
thought:this.lastThought,
question:this.lastQuestion,
learning:this.lastLearning,
focus:this.focus,
worldEntities:this.world.all().length,
memories:this.memory.episodes.length,
knownFacts:this.memory.facts.size,
predictionError:this.learning.totalError
};
}
}
