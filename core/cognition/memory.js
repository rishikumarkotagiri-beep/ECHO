class EchoMemory{
constructor(limit=600){
this.limit=limit;
this.episodes=[];
this.facts=new Map();
this.locations=new Map();
}
rememberEpisode(data){
const episode={id:`e_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,time:Date.now(),...data};
this.episodes.unshift(episode);
if(this.episodes.length>this.limit)this.episodes.length=this.limit;
return episode;
}
rememberFact(subject,predicate,value,confidence=.5,source="experience"){
const key=`${subject}|${predicate}`;
const old=this.facts.get(key);
const fact={
subject,
predicate,
value,
confidence:Math.max(0,Math.min(1,confidence)),
source,
lastSeen:Date.now(),
observations:(old?.observations||0)+1
};
this.facts.set(key,fact);
return fact;
}
rememberLocation(id,x,z,confidence=.5){
this.locations.set(id,{id,x,z,confidence,lastSeen:Date.now()});
}
recallSubject(subject,limit=8){
return [...this.facts.values()]
.filter(f=>f.subject===subject)
.sort((a,b)=>b.confidence-a.confidence)
.slice(0,limit);
}
recent(limit=10){
return this.episodes.slice(0,limit);
}
search(text,limit=8){
const q=String(text).toLowerCase();
return this.episodes
.filter(e=>JSON.stringify(e).toLowerCase().includes(q))
.slice(0,limit);
}
toJSON(){
return{
episodes:this.episodes,
facts:[...this.facts.values()],
locations:[...this.locations.values()]
};
}
}
