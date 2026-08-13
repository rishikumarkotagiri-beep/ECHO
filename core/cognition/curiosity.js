class EchoCuriosity{
score(
entity,
{
novelty=.5,
uncertainty=.5,
proximity=.5,
social=0,
informationGain=.5
}={}
){
const base=
.32*novelty+
.30*uncertainty+
.18*informationGain+
.12*social+
.08*proximity;
return Math.max(
0,
Math.min(1,base)
);
}
choose(candidates){
if(!candidates.length)return null;
return[...candidates]
.sort(
(a,b)=>
(b.curiosityScore||0)-
(a.curiosityScore||0)
)[0];
}
}
