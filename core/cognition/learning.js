class EchoLearning{
constructor(){
this.hypotheses=new Map();
this.predictions=[];
this.totalError=0;
}
key(entityId,label){
return`${entityId}|${label}`;
}
hypothesize(entityId,label,prior=.5){
const key=this.key(entityId,label);
if(!this.hypotheses.has(key)){
this.hypotheses.set(key,{
entityId,
label,
confidence:prior,
tests:0,
correct:0,
incorrect:0
});
}
return this.hypotheses.get(key);
}
test(entityId,label,observed,expected){
const h=this.hypothesize(entityId,label);
const correct=observed===expected;
h.tests++;
if(correct){
h.correct++;
h.confidence+=.10*(1-h.confidence);
}else{
h.incorrect++;
h.confidence-=.14*h.confidence;
}
h.confidence=Math.max(
.01,
Math.min(.99,h.confidence)
);
const error=correct?0:1;
this.totalError+=error;
this.predictions.unshift({
entityId,
label,
expected,
observed,
correct,
error,
time:Date.now()
});
if(this.predictions.length>300){
this.predictions.length=300;
}
return{
correct,
confidence:h.confidence,
error
};
}
confidence(entityId,label){
return this.hypothesize(entityId,label).confidence;
}
topHypotheses(entityId){
return[...this.hypotheses.values()]
.filter(h=>h.entityId===entityId)
.sort((a,b)=>b.confidence-a.confidence);
}
}
