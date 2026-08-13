export class CityWorld{
  constructor(){
    this.name="Greenhaven";
    this.day=1;
    this.hour=8;
    this.minute=0;
    this.cycle=0;
    this.weather="Clear";
    this.roads=[];
    this.buildings=[];
    this.parks=[];
    this.people=[];
    this.vehicles=[];
    this.events=["Greenhaven wakes up.","People begin their morning routines."];
    this.createWorld();
  }

  r(a,b){return a+Math.random()*(b-a)}
  pick(a){return a[Math.floor(Math.random()*a.length)]}

  createWorld(){
    const xs=[-48,-24,0,24,48];
    const zs=[-48,-24,0,24,48];

    xs.forEach((x,i)=>{
      this.roads.push({
        x,
        z:0,
        width:7,
        length:120,
        direction:"z",
        name:`Avenue ${i+1}`
      });
    });

    zs.forEach((z,i)=>{
      this.roads.push({
        x:0,
        z,
        width:7,
        length:120,
        direction:"x",
        name:`Street ${i+1}`
      });
    });

    this.roads.push(
      {x:0,z:-60,width:9,length:120,direction:"x",name:"Ocean Drive"},
      {x:0,z:60,width:9,length:120,direction:"x",name:"Sunset Boulevard"}
    );

    const types=[
      "house","house","house","apartment",
      "market","cafe","bank","gym","library",
      "clinic","school","hotel","club","workshop",
      "office","restaurant","store"
    ];

    let id=0;

    for(let x=-54;x<=54;x+=12){
      for(let z=-54;z<=54;z+=12){

        if(Math.abs(x)<8||Math.abs(z)<8)continue;

        const type=this.pick(types);

        const h=
          type==="apartment"||type==="office"
          ?this.r(8,16)
          :this.r(4,8);

        this.buildings.push({
          id:`b${id++}`,
          name:this.nameFor(type,id),
          type,
          x:x+this.r(-2,2),
          z:z+this.r(-2,2),
          w:this.r(6,10),
          h,
          d:this.r(6,10),
          activity:this.activityFor(type)
        });
      }
    }

    this.parks=[
      {
        id:"central",
        name:"Central Park",
        x:-30,
        z:30,
        w:22,
        d:18,
        activity:"relaxing"
      },
      {
        id:"palm",
        name:"Palm Garden",
        x:30,
        z:30,
        w:18,
        d:16,
        activity:"socializing"
      },
      {
        id:"riverside",
        name:"Riverside Walk",
        x:-35,
        z:-32,
        w:18,
        d:12,
        activity:"walking"
      },
      {
        id:"beach",
        name:"Greenhaven Beach",
        x:38,
        z:-42,
        w:28,
        d:14,
        activity:"swimming"
      },
      {
        id:"square",
        name:"Civic Square",
        x:0,
        z:32,
        w:16,
        d:12,
        activity:"meeting"
      }
    ];

    const names=[
      "Mira","Arjun","Raman","Anika","Kiran",
      "Sonia","Dev","Meera","Rahul","Priya",
      "Vikram","Asha","Kabir","Nisha","Ravi",
      "Tara","Neel","Isha","Sameer","Aarav",
      "Diya","Rohan","Sana","Varun","Pooja",
      "Aditya","Kavya","Manoj","Sneha","Amit"
    ];

    const roles=[
      "resident","resident","resident",
      "worker","worker","student","runner",
      "shopkeeper","tourist","artist",
      "driver","gym","reader"
    ];

    for(let i=0;i<90;i++){

      const role=this.pick(roles);

      const home=this.pick(
        this.buildings.filter(
          b=>b.type==="house"||b.type==="apartment"
        )
      );

      const person={
        id:`p${i}`,
        name:i<names.length?names[i]:`Citizen ${i+1}`,
        role,
        x:home.x+this.r(-3,3),
        z:home.z+this.r(-3,3),
        home,
        work:null,
        destination:null,
        activity:"at home",
        mood:this.pick([
          "calm",
          "happy",
          "curious",
          "busy",
          "tired"
        ]),
        energy:this.r(.5,1),
        speed:
          role==="runner"
          ?0.10
          :role==="student"
          ?.055
          :.045,
        wait:0
      };

      if([
        "worker",
        "shopkeeper",
        "driver",
        "gym",
        "artist"
      ].includes(role)){
        person.work=this.pick(
          this.buildings.filter(
            b=>!["house","apartment"].includes(b.type)
          )
        );
      }

      if(role==="student"){
        person.work=this.pick(
          this.buildings.filter(
            b=>b.type==="school"
          )
        );
      }

      if(role==="gym"){
        person.work=this.pick(
          this.buildings.filter(
            b=>b.type==="gym"
          )
        );
      }

      this.people.push(person);
    }

    for(let i=0;i<28;i++){

      this.vehicles.push({
        id:`car${i}`,
        type:this.pick([
          "sedan",
          "taxi",
          "sport",
          "van",
          "bus"
        ]),
        road:
          i%2
          ?this.roads[i%this.roads.length]
          :this.roads[(i+3)%this.roads.length],
        offset:this.r(-55,55),
        speed:this.r(.035,.085),
        dir:i%2?1:-1
      });
    }

    this.buildings.slice(0,10).forEach(b=>{
      this.events.push(
        `${b.name} is opening for the day.`
      );
    });
  }

  nameFor(t,i){

    const n={
      house:"Residential House",
      apartment:"Greenhaven Apartments",
      market:"Market",
      cafe:"Corner Cafe",
      bank:"Greenhaven Bank",
      gym:"Greenhaven Gym",
      library:"Greenhaven Library",
      clinic:"Greenhaven Clinic",
      school:"Greenhaven School",
      hotel:"Palm Hotel",
      club:"Neon Palm Club",
      workshop:"Auto Workshop",
      office:"Business Center",
      restaurant:"Sunset Restaurant",
      store:"City Store"
    };

    return `${n[t]||"Building"} ${i}`;
  }

  activityFor(t){

    return{
      house:"home",
      apartment:"home",
      market:"shopping",
      cafe:"eating",
      bank:"working",
      gym:"exercise",
      library:"reading",
      clinic:"health",
      school:"education",
      hotel:"hospitality",
      club:"entertainment",
      workshop:"repairing",
      office:"working",
      restaurant:"eating",
      store:"shopping"
    }[t]||"busy";
  }

  getTime(){
    return{
      day:this.day,
      hour:this.hour,
      minute:this.minute
    };
  }

  formatTime(){

    const h=this.hour%12||12;
    const s=this.hour>=12?"PM":"AM";

    return`Day ${this.day} — ${String(h).padStart(2,"0")}:${String(this.minute).padStart(2,"0")} ${s}`;
  }

  chooseDestination(p){

    const h=this.hour;

    if(h<9){

      p.destination={
        x:p.home.x+this.r(-2,2),
        z:p.home.z+this.r(-2,2),
        kind:"home"
      };

    }else if(h<12&&p.work){

      p.destination={
        x:p.work.x+this.r(-2,2),
        z:p.work.z+this.r(-2,2),
        kind:"work"
      };

    }else if(h<14){

      p.destination=this.randomPublic();

    }else if(h<18&&p.work){

      p.destination={
        x:p.work.x+this.r(-2,2),
        z:p.work.z+this.r(-2,2),
        kind:"work"
      };

    }else if(h<21){

      p.destination=this.randomPublic();

    }else{

      p.destination={
        x:p.home.x+this.r(-2,2),
        z:p.home.z+this.r(-2,2),
        kind:"home"
      };
    }
  }

  randomPublic(){

    const t=this.pick([
      ...this.parks,
      ...this.buildings.filter(
        b=>!["house","apartment"].includes(b.type)
      )
    ]);

    return{
      x:t.x+this.r(-3,3),
      z:t.z+this.r(-3,3),
      kind:t.type||"park"
    };
  }

  chooseActivity(p){

    if(p.role==="runner")return"running";
    if(p.role==="student")return"studying";
    if(p.role==="shopkeeper")return"working";
    if(p.role==="gym")return"exercising";
    if(p.role==="artist")return"creating";

    if(p.destination?.kind==="home")
      return"at home";

    if(p.destination?.kind==="work")
      return"working";

    return this.pick([
      "walking",
      "talking",
      "shopping",
      "relaxing",
      "observing"
    ]);
  }

  updatePeople(){

    this.people.forEach(p=>{

      if(p.wait>0){
        p.wait--;
        return;
      }

      if(!p.destination)
        this.chooseDestination(p);

      const dx=p.destination.x-p.x;
      const dz=p.destination.z-p.z;

      const d=Math.hypot(dx,dz);

      if(d<.45){

        p.destination=null;

        p.activity=this.chooseActivity(p);

        p.wait=Math.floor(
          this.r(10,45)
        );

        return;
      }

      p.x+=dx/d*p.speed;
      p.z+=dz/d*p.speed;

      p.activity=this.chooseActivity(p);
    });
  }

  updateVehicles(){

    this.vehicles.forEach(v=>{

      v.offset+=v.speed*v.dir;

      if(v.offset>58)
        v.offset=-58;

      if(v.offset<-58)
        v.offset=58;
    });
  }

  tick(){

    this.cycle++;

    this.minute+=2;

    if(this.minute>=60){
      this.minute-=60;
      this.hour++;
    }

    if(this.hour>=24){
      this.hour=0;
      this.day++;
    }

    this.updatePeople();
    this.updateVehicles();

    if(Math.random()<.035){

      this.events.unshift(
        this.pick([
          "Traffic builds near the avenue.",
          "A street musician starts playing.",
          "A delivery van stops outside a store.",
          "A group gathers in the park.",
          "Someone begins jogging along Riverside Walk.",
          "A taxi picks up a passenger.",
          "People leave the gym.",
          "Students cross the school road.",
          "A bus arrives downtown.",
          "The city keeps moving."
        ])
      );

      if(this.events.length>12)
        this.events.pop();
    }
  }

  getNearby(x,z,r=18){

    const out=[];

    this.buildings.forEach(b=>{

      const d=Math.hypot(
        x-b.x,
        z-b.z
      );

      if(d<r){

        out.push({
          name:b.name,
          type:b.type,
          distance:d,
          activity:b.activity,
          x:b.x,
          z:b.z
        });
      }
    });

    this.parks.forEach(b=>{

      const d=Math.hypot(
        x-b.x,
        z-b.z
      );

      if(d<r){

        out.push({
          name:b.name,
          type:"park",
          distance:d,
          activity:b.activity,
          x:b.x,
          z:b.z
        });
      }
    });

    this.people.forEach(p=>{

      const d=Math.hypot(
        x-p.x,
        z-p.z
      );

      if(d<r){

        out.push({
          name:p.name,
          type:"person",
          distance:d,
          activity:p.activity,
          mood:p.mood,
          x:p.x,
          z:p.z
        });
      }
    });

    return out.sort(
      (a,b)=>a.distance-b.distance
    );
  }
}

export class VillageWorld extends CityWorld{}
