import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";

export class CityRenderer{
constructor(container,city){
this.container=container;
this.city=city;
this.clock=new THREE.Clock();
this.peopleMeshes={};
this.vehicleMeshes=[];
this.cameraDistance=38;
this.cameraYaw=0;
this.cameraPitch=.65;
this.target=new THREE.Vector3(0,0,0);
this.echoPosition=new THREE.Vector3(0,0,4);
this.dragging=false;
this.lastMouse={x:0,y:0};
this.init();
this.buildCity();
this.createEcho();
this.bindControls();
this.start();
}
mat(color,roughness=.8,metalness=0,emissive=0){
return new THREE.MeshStandardMaterial({
color,
roughness,
metalness,
emissive,
emissiveIntensity:emissive?0.35:0
});
}
box(w,h,d,color,x,y,z){
const mesh=new THREE.Mesh(
new THREE.BoxGeometry(w,h,d),
this.mat(color)
);
mesh.position.set(x,y,z);
mesh.castShadow=true;
mesh.receiveShadow=true;
this.scene.add(mesh);
return mesh;
}
init(){
this.scene=new THREE.Scene();
this.scene.background=new THREE.Color(0x87b9d8);
this.scene.fog=new THREE.Fog(0x87b9d8,55,110);
this.camera=new THREE.PerspectiveCamera(
55,
window.innerWidth/window.innerHeight,
.1,
300
);
this.camera.position.set(0,28,38);
this.camera.lookAt(0,0,0);
this.renderer=new THREE.WebGLRenderer({
antialias:true
});
this.renderer.setPixelRatio(
Math.min(window.devicePixelRatio,2)
);
this.renderer.setSize(
window.innerWidth,
window.innerHeight
);
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
this.ambient=new THREE.AmbientLight(
0xffffff,
.62
);
this.scene.add(this.ambient);
this.sun=new THREE.DirectionalLight(
0xffffff,
1.15
);
this.sun.position.set(
-30,
45,
20
);
this.sun.castShadow=true;
this.sun.shadow.mapSize.width=2048;
this.sun.shadow.mapSize.height=2048;
this.sun.shadow.camera.left=-60;
this.sun.shadow.camera.right=60;
this.sun.shadow.camera.top=60;
this.sun.shadow.camera.bottom=-60;
this.scene.add(this.sun);
}
createGround(){
const ground=new THREE.Mesh(
new THREE.PlaneGeometry(110,110),
this.mat(0x4c7c4d,1)
);
ground.rotation.x=-Math.PI/2;
ground.receiveShadow=true;
this.scene.add(ground);
const grid=new THREE.GridHelper(
100,
50,
0x315d39,
0x315d39
);
grid.position.y=.01;
grid.material.transparent=true;
grid.material.opacity=.14;
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
const mesh=new THREE.Mesh(
geometry,
this.mat(0x292d32,.95)
);
mesh.rotation.x=-Math.PI/2;
mesh.position.set(
road.x,
.025,
road.z
);
mesh.receiveShadow=true;
this.scene.add(mesh);
this.createRoadLines(road);
});
}
createRoadLines(road){
const material=this.mat(0xf0d85a,.8);
if(road.direction==="x"){
for(
let x=road.x-road.length/2+2;
x<road.x+road.length/2;
x+=4
){
const line=new THREE.Mesh(
new THREE.PlaneGeometry(2,.09),
material
);
line.rotation.x=-Math.PI/2;
line.position.set(x,.06,road.z);
this.scene.add(line);
}
}else{
for(
let z=road.z-road.length/2+2;
z<road.z+road.length/2;
z+=4
){
const line=new THREE.Mesh(
new THREE.PlaneGeometry(.09,2),
material
);
line.rotation.x=-Math.PI/2;
line.position.set(road.x,.06,z);
this.scene.add(line);
}
}
}
buildSidewalks(){
this.city.roads.forEach(road=>{
const material=this.mat(0x8a8c86,.95);
if(road.direction==="x"){
for(const side of[-1,1]){
const sidewalk=new THREE.Mesh(
new THREE.PlaneGeometry(
road.length,
.9
),
material
);
sidewalk.rotation.x=-Math.PI/2;
sidewalk.position.set(
road.x,
.045,
road.z+
side*(road.width/2+.55)
);
this.scene.add(sidewalk);
}
}else{
for(const side of[-1,1]){
const sidewalk=new THREE.Mesh(
new THREE.PlaneGeometry(
.9,
road.length
),
material
);
sidewalk.rotation.x=-Math.PI/2;
sidewalk.position.set(
road.x+
side*(road.width/2+.55),
.045,
road.z
);
this.scene.add(sidewalk);
}
}
});
}
buildBuildings(){
this.city.buildings.forEach(b=>{
this.createBuilding(b);
});
}
createBuilding(b){
const [w,h,d]=b.size;
const colors={
house:0xc89061,
apartment:0x8193a5,
market:0xd1a94f,
cafe:0xb16d50,
bank:0x657e91,
gym:0x428679,
library:0x76668f,
clinic:0xd5d7d5,
school:0xd0a054,
station:0x607a8d,
workshop:0x896f58
};
const color=colors[b.type]||0x999999;
this.box(
w,
h,
d,
color,
b.x,
h/2,
b.z
);
this.createRoof(b,w,h,d);
this.createWindows(b,w,h,d);
this.createDoor(b,d);
this.createSign(b,w,h,d);
}
createRoof(b,w,h,d){
if(b.type==="apartment"||b.type==="station"){
this.box(
w+.2,
.35,
d+.2,
0x45484b,
b.x,
h+.18,
b.z
);
return;
}
const roof=new THREE.Mesh(
new THREE.ConeGeometry(
Math.max(w,d)*.7,
.7,
4
),
this.mat(0x493a34)
);
roof.position.set(
b.x,
h+.35,
b.z
);
roof.rotation.y=Math.PI/4;
roof.castShadow=true;
this.scene.add(roof);
}
createWindows(b,w,h,d){
const windowMaterial=this.mat(
0x91dce8,
.25,
.05,
0x173d43
);
const rows=Math.max(
1,
Math.floor(h/1.8)
);
const cols=Math.max(
1,
Math.floor(w/1.7)
);
for(let row=0;row<rows;row++){
for(let col=0;col<cols;col++){
const x=
b.x-w/2+
.9+
col*1.55;
const y=
1.2+
row*1.55;
if(y>h-.4)continue;
const window=new THREE.Mesh(
new THREE.BoxGeometry(
.55,
.6,
.08
),
windowMaterial
);
window.position.set(
x,
y,
b.z-d/2-.05
);
this.scene.add(window);
}
}
}
createDoor(b,d){
this.box(
.85,
1.65,
.12,
0x493126,
b.x,
.825,
b.z-d/2-.08
);
}
createSign(b,w,h,d){
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
if(!names[b.type])return;
const sign=this.box(
Math.min(w*.75,4.5),
.5,
.12,
0x172229,
b.x,
Math.min(h-.45,3.6),
b.z-d/2-.12
);
sign.material.emissive=new THREE.Color(
0x06342d
);
sign.material.emissiveIntensity=.6;
}
buildParks(){
this.city.parks.forEach(p=>{
const grass=new THREE.Mesh(
new THREE.PlaneGeometry(
p.width,
p.depth
),
this.mat(0x3d8147,1)
);
grass.rotation.x=-Math.PI/2;
grass.position.set(
p.x,
.05,
p.z
);
grass.receiveShadow=true;
this.scene.add(grass);
const path=new THREE.Mesh(
new THREE.PlaneGeometry(
p.width*.8,
1
),
this.mat(0xb6aa8b,.95)
);
path.rotation.x=-Math.PI/2;
path.position.set(
p.x,
.07,
p.z
);
this.scene.add(path);
for(let i=0;i<6;i++){
const x=
p.x+
(Math.random()-.5)*
p.width*.75;
const z=
p.z+
(Math.random()-.5)*
p.depth*.7;
this.createTree(x,z);
}
for(let i=0;i<3;i++){
this.createBench(
p.x-p.width*.25+i*3,
p.z+2
);
}
});
}
createBench(x,z){
this.box(
1.8,
.18,
.45,
0x65432d,
x,
.65,
z
);
this.box(
.12,
.55,
.12,
0x333333,
x-.65,
.32,
z
);
this.box(
.12,
.55,
.12,
0x333333,
x+.65,
.32,
z
);
}
buildNature(){
this.city.nature.forEach(t=>{
this.createTree(t.x,t.z);
});
}
createTree(x,z){
const trunk=new THREE.Mesh(
new THREE.CylinderGeometry(
.2,
.3,
2,
8
),
this.mat(0x65442c)
);
trunk.position.set(
x,
1,
z
);
trunk.castShadow=true;
this.scene.add(trunk);
const crown=new THREE.Mesh(
new THREE.SphereGeometry(
1.25,
12,
10
),
this.mat(0x2f7038)
);
crown.position.set(
x,
2.65,
z
);
crown.scale.y=.9;
crown.castShadow=true;
this.scene.add(crown);
}
buildStreetFurniture(){
this.city.roads.forEach(road=>{
if(road.direction==="x"){
for(
let x=road.x-road.length/2+5;
x<road.x+road.length/2;
x+=10
){
this.createStreetLight(
x,
road.z-road.width/2-1.2
);
}
}else{
for(
let z=road.z-road.length/2+5;
z<road.z+road.length/2;
z+=10
){
this.createStreetLight(
road.x+road.width/2+1.2,
z
);
}
}
});
}
createStreetLight(x,z){
this.box(
.08,
3,
.08,
0x34383b,
x,
1.5,
z
);
const lamp=new THREE.Mesh(
new THREE.SphereGeometry(
.16,
10,
10
),
this.mat(
0xffd77a,
.25,
0,
0xffa000
)
);
lamp.position.set(
x,
3.1,
z
);
this.scene.add(lamp);
}
buildVehicles(){
this.city.vehicles.forEach(v=>{
const mesh=this.createVehicle(v);
this.vehicleMeshes.push({
data:v,
mesh
});
});
}
createVehicle(v){
const group=new THREE.Group();
const colors=[
0xb94e48,
0x4a78a5,
0xc69d48,
0x578363
];
const color=
v.type==="bus"
?0x548995
:colors[
Math.floor(
Math.random()*colors.length
)
];
const body=new THREE.Mesh(
new THREE.BoxGeometry(
v.type==="bus"?2.1:1.65,
.55,
v.type==="bus"?4.2:3
),
this.mat(color,.6)
);
body.position.y=.55;
body.castShadow=true;
group.add(body);
const glass=new THREE.Mesh(
new THREE.BoxGeometry(
v.type==="bus"?1.75:1.3,
.4,
v.type==="bus"?2.5:1.4
),
this.mat(0x27343a,.25)
);
glass.position.y=.92;
group.add(glass);
group.position.set(
v.x,
0,
v.z
);
this.scene.add(group);
return group;
}
buildPeople(){
this.city.people.forEach(p=>{
this.createPerson(p);
});
}
createPerson(p){
const group=new THREE.Group();
const colors=[
0x4d82c5,
0xc76b5d,
0x5da56b,
0xc28b49,
0x8766a8,
0x428d8c
];
const shirt=colors[
Math.floor(
Math.random()*colors.length
)
];
const body=new THREE.Mesh(
new THREE.CylinderGeometry(
.27,
.32,
.9,
10
),
this.mat(shirt)
);
body.position.y=.75;
body.castShadow=true;
group.add(body);
const head=new THREE.Mesh(
new THREE.SphereGeometry(
.25,
12,
10
),
this.mat(0xc58b68)
);
head.position.y=1.45;
head.castShadow=true;
group.add(head);
const leg1=this.box(
.11,
.55,
.13,
0x252b34,
0,
.25,
0
);
const leg2=this.box(
.11,
.55,
.13,
0x252b34,
0,
.25,
0
);
const arm1=this.box(
.1,
.55,
.1,
shirt,
0,
.75,
0
);
const arm2=this.box(
.1,
.55,
.1,
shirt,
0,
.75,
0
);
group.add(leg1);
group.add(leg2);
group.add(arm1);
group.add(arm2);
leg1.position.x=-.12;
leg2.position.x=.12;
arm1.position.x=-.35;
arm2.position.x=.35;
group.position.set(
p.x,
0,
p.z
);
this.scene.add(group);
this.peopleMeshes[p.id]={
group,
body,
head,
leg1,
leg2,
arm1,
arm2
};
}
createEcho(){
this.echo=new THREE.Group();
const body=new THREE.Mesh(
new THREE.SphereGeometry(
.55,
20,
16
),
new THREE.MeshStandardMaterial({
color:0xf7ffff,
roughness:.18,
emissive:0x00b89d,
emissiveIntensity:.55
})
);
body.position.y=.85;
body.scale.y=1.15;
this.echo.add(body);
const head=new THREE.Mesh(
new THREE.SphereGeometry(
.34,
20,
16
),
new THREE.MeshStandardMaterial({
color:0xffffff,
roughness:.2,
emissive:0x00d9ba,
emissiveIntensity:.3
})
);
head.position.y=1.55;
this.echo.add(head);
const glow=new THREE.PointLight(
0x00ffcc,
1.5,
7
);
glow.position.y=1;
this.echo.add(glow);
this.echo.position.copy(
this.echoPosition
);
this.scene.add(this.echo);
}
updatePeople(){
this.city.people.forEach(p=>{
const m=this.peopleMeshes[p.id];
if(!m)return;
m.group.position.x=p.x;
m.group.position.z=p.z;
const moving=
p.speed>0&&
p.destination&&
p.activity!=="sitting";
if(moving){
const swing=
Math.sin(
this.clock.elapsedTime*8+
p.x
)*.4;
m.leg1.rotation.x=swing;
m.leg2.rotation.x=-swing;
m.arm1.rotation.x=-swing*.7;
m.arm2.rotation.x=swing*.7;
m.group.position.y=
Math.abs(
Math.sin(
this.clock.elapsedTime*8+
p.x
)
)*.035;
}else{
m.leg1.rotation.x=0;
m.leg2.rotation.x=0;
m.arm1.rotation.x=0;
m.arm2.rotation.x=0;
}
});
}
updateVehicles(){
this.vehicleMeshes.forEach(item=>{
const v=item.data;
item.mesh.position.x=v.x;
item.mesh.position.z=v.z;
item.mesh.rotation.y=
v.direction<0?Math.PI:0;
});
}
updateEcho(){
const pulse=
1+
Math.sin(
this.clock.elapsedTime*3
)*.025;
this.echo.scale.set(
pulse,
pulse,
pulse
);
this.echo.position.y=
Math.sin(
this.clock.elapsedTime*2
)*.04;
}
updateCamera(){
const cp=Math.cos(
this.cameraPitch
);
const x=
this.target.x+
Math.sin(this.cameraYaw)*
cp*
this.cameraDistance;
const z=
this.target.z+
Math.cos(this.cameraYaw)*
cp*
this.cameraDistance;
const y=
this.target.y+
Math.sin(this.cameraPitch)*
this.cameraDistance;
const desired=new THREE.Vector3(
x,
y,
z
);
this.camera.position.lerp(
desired,
.06
);
this.camera.lookAt(
this.target.x,
this.target.y+1,
this.target.z
);
}
updateLighting(){
const hour=
this.city.hour+
this.city.minute/60;
if(hour>=20||hour<6){
this.scene.background.set(
0x071421
);
this.scene.fog.color.set(
0x071421
);
this.sun.intensity=.25;
this.ambient.intensity=.25;
}else if(hour<9){
this.scene.background.set(
0x9bc5d8
);
this.scene.fog.color.set(
0x9bc5d8
);
this.sun.intensity=.75;
this.ambient.intensity=.55;
}else if(hour<17){
this.scene.background.set(
0x87b9d8
);
this.scene.fog.color.set(
0x87b9d8
);
this.sun.intensity=1.15;
this.ambient.intensity=.62;
}else{
this.scene.background.set(
0xd18d68
);
this.scene.fog.color.set(
0xd18d68
);
this.sun.intensity=.65;
this.ambient.intensity=.5;
}
}
setEchoPosition(x,z){
this.echoPosition.set(
x,
0,
z
);
this.echo.position.copy(
this.echoPosition
);
this.target.set(
x,
0,
z
);
}
bindControls(){
this.renderer.domElement.addEventListener(
"mousedown",
e=>{
this.dragging=true;
this.lastMouse.x=e.clientX;
this.lastMouse.y=e.clientY;
}
);
window.addEventListener(
"mouseup",
()=>{
this.dragging=false;
}
);
window.addEventListener(
"mousemove",
e=>{
if(!this.dragging)return;
const dx=
e.clientX-this.lastMouse.x;
const dy=
e.clientY-this.lastMouse.y;
this.cameraYaw-=dx*.008;
this.cameraPitch=
THREE.MathUtils.clamp(
this.cameraPitch+dy*.006,
.3,
1.15
);
this.lastMouse.x=e.clientX;
this.lastMouse.y=e.clientY;
}
);
this.renderer.domElement.addEventListener(
"wheel",
e=>{
e.preventDefault();
this.cameraDistance+=
e.deltaY*.025;
this.cameraDistance=
THREE.MathUtils.clamp(
this.cameraDistance,
16,
70
);
},
{passive:false}
);
}
update(){
this.updatePeople();
this.updateVehicles();
this.updateEcho();
this.updateCamera();
this.updateLighting();
}
start(){
const animate=()=>{
requestAnimationFrame(
animate
);
this.update();
this.renderer.render(
this.scene,
this.camera
);
};
animate();
}
resize(){
this.camera.aspect=
window.innerWidth/
window.innerHeight;
this.camera.updateProjectionMatrix();
this.renderer.setSize(
window.innerWidth,
window.innerHeight
);
}
}
