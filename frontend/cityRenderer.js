import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";

export class CityRenderer {
constructor(container,city){
this.container=container;
this.city=city;
this.clock=new THREE.Clock();
this.peopleMeshes=[];
this.vehicleMeshes=[];
this.treeMeshes=[];
this.cameraDistance=38;
this.cameraYaw=0;
this.cameraPitch=.55;
this.target=new THREE.Vector3(0,0,0);
this.dragging=false;
this.lastMouse={x:0,y:0};
this.echoPosition=new THREE.Vector3(0,.9,4);
this.init();
this.buildCity();
this.createEcho();
this.bindControls();
this.start();
}
material(color,roughness=.8,metalness=0){
return new THREE.MeshStandardMaterial({color,roughness,metalness});
}
box(w,h,d,color,x,y,z,roughness=.8){
const mesh=new THREE.Mesh(
new THREE.BoxGeometry(w,h,d),
this.material(color,roughness)
);
mesh.position.set(x,y,z);
mesh.castShadow=true;
mesh.receiveShadow=true;
this.scene.add(mesh);
return mesh;
}
init(){
this.scene=new THREE.Scene();
this.scene.background=new THREE.Color(0x8fc5df);
this.scene.fog=new THREE.Fog(0x8fc5df,55,105);
this.camera=new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,.1,300);
this.camera.position.set(0,25,35);
this.renderer=new THREE.WebGLRenderer({antialias:true});
this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
this.renderer.setSize(window.innerWidth,window.innerHeight);
this.renderer.shadowMap.enabled=true;
this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
this.renderer.outputEncoding=THREE.sRGBEncoding;
this.container.innerHTML="";
this.container.appendChild(this.renderer.domElement);
this.createLighting();
this.createGround();
window.addEventListener("resize",()=>this.resize());
}
createLighting(){
this.ambient=new THREE.AmbientLight(0xffffff,.58);
this.scene.add(this.ambient);
this.sun=new THREE.DirectionalLight(0xffffff,1.25);
this.sun.position.set(-35,50,25);
this.sun.castShadow=true;
this.sun.shadow.mapSize.width=2048;
this.sun.shadow.mapSize.height=2048;
this.sun.shadow.camera.left=-70;
this.sun.shadow.camera.right=70;
this.sun.shadow.camera.top=70;
this.sun.shadow.camera.bottom=-70;
this.scene.add(this.sun);
}
createGround(){
const ground=new THREE.Mesh(
new THREE.PlaneGeometry(110,110),
this.material(0x568052,1)
);
ground.rotation.x=-Math.PI/2;
ground.receiveShadow=true;
this.scene.add(ground);
const grid=new THREE.GridHelper(100,50,0x315f3b,0x315f3b);
grid.position.y=.012;
grid.material.transparent=true;
grid.material.opacity=.18;
this.scene.add(grid);
}
buildCity(){
this.buildRoads();
this.buildSidewalks();
this.buildBuildings();
this.buildParks();
this.buildNature();
this.buildStreetFurniture();
this.buildVehicles();
this.buildPeople();
}
buildRoads(){
this.city.roads.forEach(road=>{
const geometry=road.direction==="x"
?new THREE.PlaneGeometry(road.length,road.width)
:new THREE.PlaneGeometry(road.width,road.length);
const roadMesh=new THREE.Mesh(
geometry,
this.material(0x292e35,.95)
);
roadMesh.rotation.x=-Math.PI/2;
roadMesh.position.set(road.x,.025,road.z);
roadMesh.receiveShadow=true;
this.scene.add(roadMesh);
this.createRoadMarkings(road);
this.createCrosswalks(road);
});
}
buildSidewalks(){
this.city.roads.forEach(road=>{
const sidewalkMaterial=this.material(0x8b8d86,.95);
if(road.direction==="x"){
for(const side of[-1,1]){
const sidewalk=new THREE.Mesh(
new THREE.PlaneGeometry(road.length,.85),
sidewalkMaterial
);
sidewalk.rotation.x=-Math.PI/2;
sidewalk.position.set(
road.x,
.04,
road.z+side*(road.width/2+.55)
);
this.scene.add(sidewalk);
}
}else{
for(const side of[-1,1]){
const sidewalk=new THREE.Mesh(
new THREE.PlaneGeometry(.85,road.length),
sidewalkMaterial
);
sidewalk.rotation.x=-Math.PI/2;
sidewalk.position.set(
road.x+side*(road.width/2+.55),
.04,
road.z
);
this.scene.add(sidewalk);
}
}
});
}
createRoadMarkings(road){
const white=this.material(0xe7e2c8);
if(road.direction==="x"){
for(let x=road.x-road.length/2+3;x<road.x+road.length/2;x+=5){
const line=new THREE.Mesh(
new THREE.PlaneGeometry(2.2,.09),
white
);
line.rotation.x=-Math.PI/2;
line.position.set(x,.06,road.z);
this.scene.add(line);
}
}else{
for(let z=road.z-road.length/2+3;z<road.z+road.length/2;z+=5){
const line=new THREE.Mesh(
new THREE.PlaneGeometry(.09,2.2),
white
);
line.rotation.x=-Math.PI/2;
line.position.set(road.x,.06,z);
this.scene.add(line);
}
}
}
createCrosswalks(road){
if(road.direction!=="x")return;
for(let x=road.x-15;x<road.x+16;x+=15){
for(let i=-2;i<=2;i++){
const stripe=new THREE.Mesh(
new THREE.PlaneGeometry(.7,road.width),
this.material(0xd9d9d0)
);
stripe.rotation.x=-Math.PI/2;
stripe.position.set(x+i*.9,.065,road.z);
this.scene.add(stripe);
}
}
}
buildBuildings(){
this.city.buildings.forEach(building=>this.createBuilding(building));
}
createBuilding(building){
const [w,h,d]=building.size;
const colors={
house:0xc89061,
apartment:0x8293a5,
market:0xd2aa50,
cafe:0xa9684e,
bank:0x667f91,
gym:0x43887c,
library:0x75658e,
clinic:0xd8d9d4,
school:0xd09b52,
station:0x637b8e,
workshop:0x876f5d
};
const color=colors[building.type]||0x999999;
const body=this.box(w,h,d,color,building.x,h/2,building.z,.72);
this.createBuildingFoundation(building,w,d);
this.createWindows(building,w,h,d);
this.createDoor(building,d);
this.createRoof(building,w,h,d);
this.createSign(building,w,h,d);
this.createDetails(building,w,h,d);
}
createBuildingFoundation(building,w,d){
const base=this.box(
w+.18,
.22,
d+.18,
0x555b58,
building.x,
.11,
building.z,
.95
);
base.castShadow=false;
}
createRoof(building,w,h,d){
let roof;
if(building.type==="apartment"||building.type==="station"){
roof=new THREE.Mesh(
new THREE.BoxGeometry(w+.25,.35,d+.25),
this.material(0x45484b,.9)
);
roof.position.set(building.x,h+.18,building.z);
}else{
roof=new THREE.Mesh(
new THREE.ConeGeometry(Math.max(w,d)*.7,.7,4),
this.material(0x493b35,.9)
);
roof.position.set(building.x,h+.35,building.z);
roof.rotation.y=Math.PI/4;
}
roof.castShadow=true;
this.scene.add(roof);
}
createWindows(building,w,h,d){
const windowMat=new THREE.MeshStandardMaterial({
color:0xa8e3ec,
roughness:.25,
metalness:.05,
emissive:0x173b43,
emissiveIntensity:.25
});
const rows=Math.max(1,Math.floor(h/1.8));
const cols=Math.max(1,Math.floor(w/1.7));
for(let row=0;row<rows;row++){
for(let col=0;col<cols;col++){
const x=building.x-w/2+.9+col*1.65;
const y=1.2+row*1.55;
if(y>h-.45)continue;
const front=new THREE.Mesh(
new THREE.BoxGeometry(.55,.58,.08),
windowMat
);
front.position.set(x,y,building.z-d/2-.05);
this.scene.add(front);
const side=new THREE.Mesh(
new THREE.BoxGeometry(.08,.58,.55),
windowMat
);
side.position.set(building.x+w/2+.05,y,building.z-d/2+.9+col*1.2);
this.scene.add(side);
}
}
}
createDoor(building,d){
const door=this.box(
.85,
1.65,
.12,
0x493126,
building.x,
.825,
building.z-d/2-.09
);
const knob=new THREE.Mesh(
new THREE.SphereGeometry(.055,8,8),
this.material(0xd8c08a,.3,.5)
);
knob.position.set(
building.x+.27,
.82,
building.z-d/2-.17
);
this.scene.add(knob);
}
createSign(building,w,h,d){
const names={
market:"MARKET",
cafe:"CAFE",
bank:"BANK",
gym:"GYM",
library:"LIBRARY",
clinic:"CLINIC",
school:"SCHOOL",
station:"STATION",
workshop:"WORKSHOP"
};
if(!names[building.type])return;
const sign=this.box(
Math.min(w*.72,4.5),
.55,
.12,
0x182127,
building.x,
Math.min(h-.55,3.8),
building.z-d/2-.12
);
sign.material.emissive=new THREE.Color(0x062f2a);
sign.material.emissiveIntensity=.35;
}
createDetails(building,w,h,d){
if(building.type==="gym"){
for(let i=-1;i<=1;i++){
const panel=this.box(
1.1,
1.1,
.08,
0x183d3b,
building.x+i*1.35,
2.1,
building.z-d/2-.1
);
panel.material.emissive=new THREE.Color(0x0a3d37);
}
}
if(building.type==="cafe"){
for(let i=-1;i<=1;i++){
this.box(
.65,
.65,
.08,
0xd9a76b,
building.x+i*1.1,
1.8,
building.z-d/2-.1
);
}
}
if(building.type==="station"){
this.box(
w*.75,
.18,
.2,
0x354b57,
building.x,
h+.45,
building.z
);
}
}
buildParks(){
this.city.parks.forEach(park=>{
const grass=new THREE.Mesh(
new THREE.PlaneGeometry(park.width,park.depth),
this.material(0x43834a,1)
);
grass.rotation.x=-Math.PI/2;
grass.position.set(park.x,.045,park.z);
grass.receiveShadow=true;
this.scene.add(grass);
this.createParkPaths(park);
this.createBenches(park);
this.createParkTrees(park);
this.createParkLamps(park);
});
}
createParkPaths(park){
const pathMat=this.material(0xb5a98c,.95);
const horizontal=new THREE.Mesh(
new THREE.PlaneGeometry(park.width*.86,.8),
pathMat
);
horizontal.rotation.x=-Math.PI/2;
horizontal.position.set(park.x,.065,park.z);
this.scene.add(horizontal);
const vertical=new THREE.Mesh(
new THREE.PlaneGeometry(.8,park.depth*.86),
pathMat
);
vertical.rotation.x=-Math.PI/2;
vertical.position.set(park.x,.067,park.z);
this.scene.add(vertical);
}
createBenches(park){
for(let i=0;i<3;i++){
const x=park.x-park.width*.3+i*park.width*.3;
const seat=this.box(1.8,.16,.45,0x68462f,x,.58,park.z+2);
this.box(.12,.55,.12,0x333333,x-.65,.3,park.z+2);
this.box(.12,.55,.12,0x333333,x+.65,.3,park.z+2);
this.box(1.7,.65,.12,0x68462f,x,.88,park.z+2.12);
}
}
createParkTrees(park){
for(let i=0;i<7;i++){
const x=park.x+(Math.random()-.5)*park.width*.78;
const z=park.z+(Math.random()-.5)*park.depth*.72;
this.createTree(x,z,.9+Math.random()*.3);
}
}
createParkLamps(park){
for(let i=-1;i<=1;i++){
this.createStreetLight(park.x+i*park.width*.3,park.z-2);
}
}
buildNature(){
this.city.nature.forEach(tree=>{
this.createTree(tree.x,tree.z,1);
});
}
createTree(x,z,scale=1){
const group=new THREE.Group();
const trunk=new THREE.Mesh(
new THREE.CylinderGeometry(.22*scale,.32*scale,2*scale,8),
this.material(0x67452e)
);
trunk.position.y=scale;
trunk.castShadow=true;
group.add(trunk);
const lower=new THREE.Mesh(
new THREE.SphereGeometry(1.05*scale,12,10),
this.material(0x28683a)
);
lower.position.y=2.15*scale;
lower.scale.y=.85;
lower.castShadow=true;
group.add(lower);
const upper=new THREE.Mesh(
new THREE.SphereGeometry(.85*scale,12,10),
this.material(0x388047)
);
upper.position.set(.35*scale,2.7*scale,.1*scale);
upper.castShadow=true;
group.add(upper);
group.position.set(x,0,z);
this.scene.add(group);
this.treeMeshes.push(group);
}
buildStreetFurniture(){
this.city.roads.forEach(road=>{
if(road.direction==="x"){
for(let x=road.x-20;x<=road.x+20;x+=10){
this.createStreetLight(x,road.z-road.width/2-1.5);
}
}else{
for(let z=road.z-15;z<=road.z+15;z+=10){
this.createStreetLight(road.x+road.width/2+1.5,z);
}
}
});
}
createStreetLight(x,z){
const pole=this.box(.08,3,.08,0x34383a,x,1.5,z,.5);
const arm=this.box(.55,.06,.06,0x34383a,x+.25,3,z,.5);
const lamp=new THREE.Mesh(
new THREE.SphereGeometry(.15,10,10),
this.material(0xffd98a,.25,1)
);
lamp.position.set(x+.5,2.94,z);
this.scene.add(lamp);
}
createTrafficLight(x,z){
const pole=this.box(.12,2.8,.12,0x292c2e,x,1.4,z);
const housing=this.box(.35,1,.3,0x15191c,x,2.5,z);
const red=new THREE.Mesh(
new THREE.SphereGeometry(.08,8,8),
this.material(0xff3131,.2,1)
);
red.position.set(x,2.76,z-.17);
this.scene.add(red);
}
buildVehicles(){
this.city.vehicles.forEach(vehicle=>{
const mesh=this.createVehicle(vehicle);
this.vehicleMeshes.push({data:vehicle,mesh});
});
}
createVehicle(vehicle){
const group=new THREE.Group();
const color=vehicle.type==="bus"?0x5a8994:[0xc34f49,0x4779a6,0xc69a45,0x557d60][Math.floor(Math.random()*4)];
const body=new THREE.Mesh(
new THREE.BoxGeometry(
vehicle.type==="bus"?2.1:1.65,
.55,
vehicle.type==="bus"?4.2:3
),
this.material(color,.55)
);
body.position.y=.55;
body.castShadow=true;
group.add(body);
const roof=new THREE.Mesh(
new THREE.BoxGeometry(
vehicle.type==="bus"?1.8:1.35,
.42,
vehicle.type==="bus"?2.7:1.5
),
this.material(0x27323a,.35,.1)
);
roof.position.y=.95;
group.add(roof);
for(const z of[-1,1]){
for(const x of[-.72,.72]){
const wheel=new THREE.Mesh(
new THREE.CylinderGeometry(.22,.22,.14,12),
this.material(0x16191b)
);
wheel.rotation.z=Math.PI/2;
wheel.position.set(x,.28,z*1.05);
group.add(wheel);
}
}
group.position.set(vehicle.x,0,vehicle.z);
this.scene.add(group);
return group;
}
buildPeople(){
this.city.people.forEach(person=>{
const mesh=this.createPerson(person);
this.peopleMeshes.push({data:person,mesh});
});
}
createPerson(person){
const group=new THREE.Group();
const colors=[0x4d82c5,0xc76b5d,0x5da56b,0xc28b49,0x8766a8,0x3f8b8c];
const shirt=colors[Math.floor(Math.random()*colors.length)];
const body=new THREE.Mesh(
new THREE.CylinderGeometry(.25,.3,.9,10),
this.material(shirt,.8)
);
body.position.y=.75;
body.castShadow=true;
group.add(body);
const head=new THREE.Mesh(
new THREE.SphereGeometry(.25,12,10),
this.material(0xc88e6c,.8)
);
head.position.y=1.45;
head.castShadow=true;
group.add(head);
const leg1=this.box(.11,.55,.13,0x252b34,0,0,0);
const leg2=this.box(.11,.55,.13,0x252b34,0,0,0);
leg1.position.set(-.12,.25,0);
leg2.position.set(.12,.25,0);
group.add(leg1);
group.add(leg2);
const arm1=this.box(.1,.55,.1,shirt,0,0,0);
const arm2=this.box(.1,.55,.1,shirt,0,0,0);
arm1.position.set(-.35,.78,0);
arm2.position.set(.35,.78,0);
group.add(arm1);
group.add(arm2);
group.position.set(person.x,0,person.z);
this.scene.add(group);
return{group,body,head,leg1,leg2,arm1,arm2};
}
createEcho(){
this.echo=new THREE.Group();
const body=new THREE.Mesh(
new THREE.SphereGeometry(.55,20,16),
new THREE.MeshStandardMaterial({
color:0xf5ffff,
roughness:.18,
emissive:0x00b89d,
emissiveIntensity:.45
})
);
body.position.y=.85;
body.scale.y=1.15;
this.echo.add(body);
const head=new THREE.Mesh(
new THREE.SphereGeometry(.36,20,16),
new THREE.MeshStandardMaterial({
color:0xffffff,
roughness:.2,
emissive:0x00d9ba,
emissiveIntensity:.25
})
);
head.position.y=1.55;
this.echo.add(head);
const glow=new THREE.PointLight(0x00ffcc,1.2,6);
glow.position.y=1;
this.echo.add(glow);
this.echo.position.copy(this.echoPosition);
this.scene.add(this.echo);
}
bindControls(){
this.renderer.domElement.addEventListener("mousedown",e=>{
this.dragging=true;
this.lastMouse.x=e.clientX;
this.lastMouse.y=e.clientY;
});
window.addEventListener("mouseup",()=>this.dragging=false);
window.addEventListener("mousemove",e=>{
if(!this.dragging)return;
const dx=e.clientX-this.lastMouse.x;
const dy=e.clientY-this.lastMouse.y;
this.cameraYaw-=dx*.008;
this.cameraPitch=THREE.MathUtils.clamp(this.cameraPitch+dy*.006,.3,1.15);
this.lastMouse.x=e.clientX;
this.lastMouse.y=e.clientY;
});
this.renderer.domElement.addEventListener("wheel",e=>{
e.preventDefault();
this.cameraDistance+=e.deltaY*.025;
this.cameraDistance=THREE.MathUtils.clamp(this.cameraDistance,16,70);
},{passive:false});
}
updatePeople(){
this.peopleMeshes.forEach(item=>{
const p=item.data;
const g=item.mesh;
g.position.x=p.x;
g.position.z=p.z;
const moving=p.speed>0;
if(moving){
const t=this.clock.elapsedTime*8;
const swing=Math.sin(t+g.position.x)*.35;
item.mesh.leg1.rotation.x=swing;
item.mesh.leg2.rotation.x=-swing;
item.mesh.arm1.rotation.x=-swing*.7;
item.mesh.arm2.rotation.x=swing*.7;
g.position.y=Math.abs(Math.sin(t))*0.035;
}else{
item.mesh.leg1.rotation.x=0;
item.mesh.leg2.rotation.x=0;
}
});
}
updateVehicles(){
this.vehicleMeshes.forEach(item=>{
const v=item.data;
item.mesh.position.x=v.x;
item.mesh.position.z=v.z;
if(v.direction<0)item.mesh.rotation.y=Math.PI;
else item.mesh.rotation.y=0;
});
}
updateEcho(){
const pulse=1+Math.sin(this.clock.elapsedTime*3)*.025;
this.echo.scale.set(pulse,pulse,pulse);
this.echo.position.y=.05+Math.sin(this.clock.elapsedTime*2)*.04;
}
updateCamera(){
const cp=Math.cos(this.cameraPitch);
const x=this.target.x+Math.sin(this.cameraYaw)*cp*this.cameraDistance;
const z=this.target.z+Math.cos(this.cameraYaw)*cp*this.cameraDistance;
const y=this.target.y+Math.sin(this.cameraPitch)*this.cameraDistance;
this.camera.position.lerp(new THREE.Vector3(x,y,z),.06);
this.camera.lookAt(this.target.x,this.target.y+1,this.target.z);
}
updateLighting(){
const time=this.city.hour!==undefined
?this.city.hour
:8;
let brightness=1;
if(time>=20||time<6)brightness=.25;
else if(time>=17)brightness=.65;
else if(time<8)brightness=.75;
this.sun.intensity=1.25*brightness;
this.ambient.intensity=.58*brightness+.12;
if(time>=20||time<6){
this.scene.background.set(0x071421);
this.scene.fog.color.set(0x071421);
}else if(time>=17){
this.scene.background.set(0xd28f70);
this.scene.fog.color.set(0xd28f70);
}else{
this.scene.background.set(0x8fc5df);
this.scene.fog.color.set(0x8fc5df);
}
}
setEchoPosition(x,z){
this.echoPosition.set(x,.05,z);
this.echo.position.copy(this.echoPosition);
this.target.set(x,0,z);
}
start(){
const loop=()=>{
requestAnimationFrame(loop);
this.updatePeople();
this.updateVehicles();
this.updateEcho();
this.updateCamera();
this.updateLighting();
this.renderer.render(this.scene,this.camera);
};
loop();
}
resize(){
this.camera.aspect=window.innerWidth/window.innerHeight;
this.camera.updateProjectionMatrix();
this.renderer.setSize(window.innerWidth,window.innerHeight);
}
}
