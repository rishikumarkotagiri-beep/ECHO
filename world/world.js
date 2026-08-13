export class VillageWorld {
constructor(){
this.name="Greenhaven";
this.day=1;
this.hour=8;
this.minute=0;
this.weather="Clear";
this.cycle=0;
this.objects=[];
this.roads=[];
this.buildings=[];
this.parks=[];
this.nature=[];
this.people=[];
this.vehicles=[];
this.events=[];
this.createWorld();
}
createWorld(){
this.roads=[
{x:0,z:-1,width:6,length:60,direction:"x",name:"Main Street"},
{x:0,z:9,width:5,length:60,direction:"x",name:"Park Avenue"},
{x:0,z:-12,width:5,length:60,direction:"x",name:"Market Street"},
{x:-13,z:4,width:5,length:42,direction:"z",name:"Oak Road"},
{x:18,z:5,width:5,length:42,direction:"z",name:"Central Road"}
];
this.buildings=[
{id:"maple-house",name:"Maple House",type:"house",x:-22,z:-17,size:[5,3.5,5],activity:"home"},
{id:"oak-house",name:"Oak House",type:"house",x:-15,z:-17,size:[5,3.8,5],activity:"home"},
{id:"pine-house",name:"Pine House",type:"house",x:-8,z:-17,size:[5,3.3,5],activity:"home"},
{id:"river-house",name:"River House",type:"house",x:-1,z:-17,size:[5,4,5],activity:"home"},
{id:"apartments",name:"Greenhaven Apartments",type:"apartment",x:-21,z:-7,size:[8,8,7],activity:"residential"},
{id:"market",name:"Greenhaven Market",type:"market",x:8,z:-17,size:[7,5,5],activity:"shopping"},
{id:"cafe",name:"Corner Cafe",type:"cafe",x:18,z:-17,size:[6,4,5],activity:"eating"},
{id:"bank",name:"Greenhaven Bank",type:"bank",x:26,z:-17,size:[6,5.5,6],activity:"working"},
{id:"gym",name:"Greenhaven Gym",type:"gym",x:20,z:4,size:[8,5.5,8],activity:"exercise"},
{id:"library",name:"Greenhaven Library",type:"library",x:7,z:9,size:[7,5,6],activity:"reading"},
{id:"clinic",name:"Greenhaven Clinic",type:"clinic",x:-4,z:9,size:[6,5,6],activity:"health"},
{id:"school",name:"Greenhaven School",type:"school",x:-18,z:9,size:[9,5,7],activity:"education"},
{id:"station",name:"Greenhaven Station",type:"station",x:22,z:16,size:[11,5,6],activity:"travel"},
{id:"workshop",name:"Old Workshop",type:"workshop",x:28,z:5,size:[6,4,6],activity:"working"}
];
this.parks=[
{id:"central-park",name:"Central Park",x:0,z:20,width:22,depth:10,activity:"relaxing"},
{id:"riverside",name:"Riverside Walk",x:-24,z:20,width:10,depth:8,activity:"walking"},
{id:"small-park",name:"Maple Garden",x:-9,z:14,width:8,depth:6,activity:"relaxing"}
];
this.nature=[];
const treePositions=[
[-28,-8],[-26,-2],[-27,7],[-25,14],[-21,18],[-16,18],
[-12,18],[-7,18],[-3,18],[4,18],[10,18],[16,18],
[27,18],[29,10],[29,0],[29,-8],[24,-5],[14,-5],
[4,-5],[-7,-5],[-27,-15],[-3,-15],[12,-14],[28,-14],
[-28,23],[27,23],[-20,25],[-10,25],[0,25],[12,25]
];
treePositions.forEach((p,i)=>{
this.nature.push({id:`tree-${i}`,type:"tree",x:p[0],z:p[1]});
});
this.people=[
this.person("Mira","resident",-16,-10,"walking",0.035),
this.person("Arjun","resident",-10,3,"walking",0.045),
this.person("Raman","elder",3,18,"sitting",0.01),
this.person("Student", "student",-15,8,"walking",0.045),
this.person("Shopkeeper","worker",8,-12,"working",0),
this.person("Jogger","runner",-4,20,"running",0.065),
this.person("Anika","resident",15,-10,"walking",0.035),
this.person("Cyclist","cyclist",12,9,"cycling",0.075),
this.person("Tourist","visitor",25,8,"exploring",0.035),
this.person("Musician","artist",15,-9,"playing music",0),
this.person("Dog Walker","resident",5,20,"walking dog",0.03),
this.person("Teacher","worker",-17,10,"working",0),
this.person("Gym Member","resident",20,1,"exercising",0),
this.person("Reader","resident",7,11,"reading",0),
this.person("Engineer","worker",28,5,"working",0)
];
this.vehicles=[
{id:"car1",type:"car",x:-30,z:-1,speed:.07,direction:1},
{id:"car2",type:"car",x:20,z:-1,speed:.055,direction:-1},
{id:"car3",type:"car",x:-10,z:9,speed:.045,direction:1},
{id:"car4",type:"car",x:28,z:-12,speed:.06,direction:-1},
{id:"bus1",type:"bus",x:-25,z:9,speed:.035,direction:1}
];
this.objects=[
{name:"Old Man",type:"person",known:true,interactable:true,interest:.8},
{name:"Greenhaven Gym",type:"place",known:false,interactable:true,interest:.75},
{name:"Central Park",type:"place",known:false,interactable:true,interest:.9},
{name:"Corner Cafe",type:"place",known:false,interactable:true,interest:.7},
{name:"Greenhaven Library",type:"place",known:false,interactable:true,interest:.8},
{name:"Strange Machine",type:"mystery",known:false,interactable:true,interest:1},
{name:"Riverside Walk",type:"place",known:false,interactable:true,interest:.85}
];
this.events=[
"Greenhaven is beginning its day.",
"A few residents are starting their morning routines."
];
}
person(name,type,x,z,activity,speed){
return{
id:name.toLowerCase().replace(/\s/g,"-"),
name,
type,
x,
z,
activity,
speed,
destination:null,
mood:["calm","happy","curious"][Math.floor(Math.random()*3)],
energy:.5+Math.random()*.5,
socialNeed:.3+Math.random()*.7
};
}
getTime(){
return{
day:this.day,
hour:this.hour,
minute:this.minute
};
}
formatTime(){
let h=this.hour%12||12;
let suffix=this.hour>=12?"PM":"AM";
return`Day ${this.day} — ${String(h).padStart(2,"0")}:${String(this.minute).padStart(2,"0")} ${suffix}`;
}
tick(){
this.cycle++;
this.minute+=2;
if(this.minute>=60){
this.minute=0;
this.hour++;
}
if(this.hour>=24){
this.hour=0;
this.day++;
}
this.updatePeople();
this.updateVehicles();
this.randomWorldEvent();
}
updatePeople(){
this.people.forEach(person=>{
if(!person.destination){
const choices=[
...this.parks,
...this.buildings.filter(b=>b.type!=="house")
];
const target=choices[Math.floor(Math.random()*choices.length)];
person.destination={
x:target.x+(Math.random()-.5)*3,
z:target.z+(Math.random()-.5)*3
};
}
if(person.speed<=0)return;
const dx=person.destination.x-person.x;
const dz=person.destination.z-person.z;
const distance=Math.hypot(dx,dz);
if(distance<.4){
person.destination=null;
person.activity=this.chooseActivity(person);
return;
}
person.x+=(dx/distance)*person.speed;
person.z+=(dz/distance)*person.speed;
});
}
chooseActivity(person){
if(person.type==="runner")return"running";
if(person.type==="cyclist")return"cycling";
if(person.type==="student")return"studying";
if(person.type==="worker")return"working";
return["walking","observing","talking","relaxing","shopping"][Math.floor(Math.random()*5)];
}
updateVehicles(){
this.vehicles.forEach(vehicle=>{
vehicle.x+=vehicle.speed*vehicle.direction;
if(vehicle.x>34)vehicle.x=-34;
if(vehicle.x<-34)vehicle.x=34;
});
}
randomWorldEvent(){
if(Math.random()>.025)return;
const events=[
"A group of people gathers outside the cafe.",
"A cyclist crosses Main Street.",
"Someone starts jogging through Central Park.",
"A bus approaches Greenhaven Station.",
"A resident enters the gym.",
"Music can be heard near the market.",
"Several people are walking toward the park.",
"A delivery vehicle stops near the market.",
"A dog runs across the Riverside Walk."
];
this.events.unshift(events[Math.floor(Math.random()*events.length)]);
if(this.events.length>15)this.events.pop();
}
getNearby(x,z,radius=12){
const result=[];
this.buildings.forEach(object=>{
const distance=Math.hypot(x-object.x,z-object.z);
if(distance<=radius)result.push({
name:object.name,
type:object.type,
distance,
activity:object.activity
});
});
this.parks.forEach(object=>{
const distance=Math.hypot(x-object.x,z-object.z);
if(distance<=radius)result.push({
name:object.name,
type:"park",
distance,
activity:object.activity
});
});
this.people.forEach(person=>{
const distance=Math.hypot(x-person.x,z-person.z);
if(distance<=radius)result.push({
name:person.name,
type:"person",
distance,
activity:person.activity,
mood:person.mood
});
});
return result.sort((a,b)=>a.distance-b.distance);
}
act(action,targetName){
const target=this.objects.find(o=>o.name===targetName);
if(!target){
return{
success:false,
result:`ECHO could not find ${targetName}.`,
learned:null
};
}
const lessons={
"Greenhaven Gym":"People come here to exercise and improve their bodies.",
"Central Park":"People use the park to walk, run, relax and meet others.",
"Corner Cafe":"People come here to eat, drink and talk.",
"Greenhaven Library":"People come here to read and study.",
"Riverside Walk":"People walk here when they want a quieter place.",
"Old Man":"People carry personal histories and routines.",
"Strange Machine":"The machine appears to respond to nearby movement."
};
if(action==="interact"||action==="investigate"){
const lesson=lessons[targetName];
target.known=true;
return{
success:true,
result:`ECHO investigated ${targetName}.`,
learned:lesson?{key:targetName,value:lesson}:null
};
}
return{
success:true,
result:`ECHO observed ${targetName}.`,
learned:null
};
}
}
export class CityWorld extends VillageWorld{}
