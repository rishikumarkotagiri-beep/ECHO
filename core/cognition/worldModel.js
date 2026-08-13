class EchoWorldModel{
constructor(){
this.entities=new Map();
this.relations=[];
}
upsert(entity){
const old=this.entities.get(entity.id);
const next={
...(old||{}),
...entity,
lastObserved:Date.now(),
observations:(old?.observations||0)+1
};
this.entities.set(entity.id,next);
return next;
}
observe(entity){
const current=this.upsert(entity);
if(entity.properties){
for(const [key,value] of Object.entries(entity.properties)){
current[key]=value;
}
}
return current;
}
addRelation(from,type,to,confidence=.5){
this.relations.push({
from,
type,
to,
confidence,
time:Date.now()
});
if(this.relations.length>1000)this.relations.shift();
}
get(id){
return this.entities.get(id);
}
all(){
return [...this.entities.values()];
}
unknownness(id){
const e=this.entities.get(id);
if(!e)return 1;
const observations=e.observations||0;
const confidence=e.confidence??.3;
return Math.max(
.05,
1-Math.min(1,observations/12)*.5-confidence*.5
);
}
}
