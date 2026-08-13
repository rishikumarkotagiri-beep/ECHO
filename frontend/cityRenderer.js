import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";

export class CityRenderer{

  constructor(container,city){

    this.container=container;
    this.city=city;

    this.clock=new THREE.Clock();

    this.peopleMeshes=[];
    this.vehicleMeshes=[];

    this.echoPos=new THREE.Vector3(0,0,4);

    this.yaw=0;
    this.pitch=.34;
    this.distance=9;

    this.drag=false;
    this.last={x:0,y:0};

    this.keys={};

    this.autoTarget=null;
    this.autoTimer=0;

    this.init();
    this.build();
    this.createEcho();
    this.controls();
    this.resize();

    window.addEventListener(
      "resize",
      ()=>this.resize()
    );

    this.animate();
  }

  mat(c,r=.75,e=0){

    return new THREE.MeshStandardMaterial({
      color:c,
      roughness:r,
      metalness:.08,
      emissive:e,
      emissiveIntensity:e?.5:0
    });
  }

  init(){

    this.scene=new THREE.Scene();

    this.scene.background=
      new THREE.Color(0x7db6d4);

    this.scene.fog=
      new THREE.Fog(
        0x7db6d4,
        70,
        180
      );

    this.camera=
      new THREE.PerspectiveCamera(
        68,
        1,
        .1,
        500
      );

    this.renderer=
      new THREE.WebGLRenderer({
        antialias:true,
        powerPreference:"high-performance"
      });

    this.renderer.setPixelRatio(
      Math.min(devicePixelRatio,2)
    );

    this.renderer.shadowMap.enabled=true;

    this.renderer.shadowMap.type=
      THREE.PCFSoftShadowMap;

    this.renderer.outputEncoding=
      THREE.sRGBEncoding;

    this.renderer.toneMapping=
      THREE.ACESFilmicToneMapping;

    this.renderer.toneMappingExposure=1.15;

    this.container.innerHTML="";

    this.container.appendChild(
      this.renderer.domElement
    );

    this.ambient=
      new THREE.AmbientLight(
        0xffffff,
        .55
      );

    this.scene.add(this.ambient);

    this.sun=
      new THREE.DirectionalLight(
        0xffe2b5,
        1.35
      );

    this.sun.position.set(
      -60,
      90,
      45
    );

    this.sun.castShadow=true;

    this.sun.shadow.mapSize.set(
      2048,
      2048
    );

    this.sun.shadow.camera.left=-100;
    this.sun.shadow.camera.right=100;
    this.sun.shadow.camera.top=100;
    this.sun.shadow.camera.bottom=-100;

    this.scene.add(this.sun);

    this.hemi=
      new THREE.HemisphereLight(
        0x8bd6ff,
        0x31522f,
        .35
      );

    this.scene.add(this.hemi);
  }

  resize(){

    const w=
      this.container.clientWidth||
      innerWidth;

    const h=
      this.container.clientHeight||
      innerHeight;

    this.camera.aspect=w/h;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w,h);
  }

  build(){

    const ground=
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          180,
          180
        ),
        this.mat(
          0x4b7548,
          1
        )
      );

    ground.rotation.x=-Math.PI/2;

    ground.receiveShadow=true;

    this.scene.add(ground);

    this.city.roads.forEach(
      r=>this.road(r)
    );

    this.city.parks.forEach(
      p=>this.park(p)
    );

    this.city.buildings.forEach(
      b=>this.building(b)
    );

    for(let i=0;i<110;i++){

      const x=-72+
        Math.random()*144;

      const z=-72+
        Math.random()*144;

      if(
        Math.abs(x)<8||
        Math.abs(z)<8
      )continue;

      this.tree(x,z);
    }

    for(let i=0;i<34;i++){

      this.palm(
        -65+Math.random()*130,
        -65+Math.random()*130
      );
    }

    for(let i=0;i<24;i++){

      this.light(
        -58+Math.random()*116,
        -58+Math.random()*116
      );
    }

    this.city.people.forEach(
      p=>this.person(p)
    );

    this.city.vehicles.forEach(
      v=>this.vehicle(v)
    );

    this.city.roads.forEach(r=>{

      if(
        Math.abs(r.x)<1&&
        Math.abs(r.z)<1
      ){

        this.signal(
          r.x,
          r.z
        );
      }
    });
  }

  road(r){

    const g=
      r.direction==="x"
      ?new THREE.PlaneGeometry(
        r.length,
        r.width
      )
      :new THREE.PlaneGeometry(
        r.width,
        r.length
      );

    const m=
      new THREE.Mesh(
        g,
        this.mat(
          0x292d31,
          .95
        )
      );

    m.rotation.x=-Math.PI/2;

    m.position.set(
      r.x,
      .02,
      r.z
    );

    m.receiveShadow=true;

    this.scene.add(m);

    const side=
      this.mat(
        0xf0d55e,
        .6
      );

    for(
      let q=-r.length/2+3;
      q<r.length/2;
      q+=6
    ){

      const g2=
        r.direction==="x"
        ?new THREE.BoxGeometry(
          2,.018,.09
        )
        :new THREE.BoxGeometry(
          .09,.018,2
        );

      const line=
        new THREE.Mesh(
          g2,
          side
        );

      line.position.set(
        r.direction==="x"
        ?r.x+q
        :r.x,
        .045,
        r.direction==="x"
        ?r.z
        :r.z+q
      );

      this.scene.add(line);
    }

    const curb=
      this.mat(
        0x777b7a,
        .9
      );

    for(
      const s of[-1,1]
    ){

      const g3=
        r.direction==="x"
        ?new THREE.BoxGeometry(
          r.length,
          .18,
          .25
        )
        :new THREE.BoxGeometry(
          .25,
          .18,
          r.length
        );

      const c=
        new THREE.Mesh(
          g3,
          curb
        );

      c.position.set(
        r.direction==="x"
        ?r.x+s*0
        :r.x+s*(r.width/2+.08),
        .12,
        r.direction==="x"
        ?r.z+s*(r.width/2+.08)
        :r.z
      );

      c.receiveShadow=true;

      this.scene.add(c);
    }
  }

  park(p){

    const g=
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          p.w,
          p.d
        ),
        this.mat(
          0x367844,
          1
        )
      );

    g.rotation.x=-Math.PI/2;

    g.position.set(
      p.x,
      .04,
      p.z
    );

    this.scene.add(g);

    for(let i=0;i<8;i++){

      this.tree(
        p.x+
        (Math.random()-.5)*
        p.w*.8,

        p.z+
        (Math.random()-.5)*
        p.d*.8
      );
    }
  }

  building(b){

    const colors={
      house:0xc58b68,
      apartment:0x718394,
      market:0xd4a84f,
      cafe:0xb86d55,
      bank:0x5f788c,
      gym:0x398c78,
      library:0x76679a,
      clinic:0xd5d8d4,
      school:0xd0a25d,
      hotel:0xa56c78,
      club:0x4d3c83,
      workshop:0x80624c,
      office:0x71808a,
      restaurant:0xc47b55,
      store:0x8b9d65
    };

    const group=
      new THREE.Group();

    const body=
      new THREE.Mesh(
        new THREE.BoxGeometry(
          b.w,
          b.h,
          b.d
        ),
        this.mat(
          colors[b.type]||0x888888,
          .72
        )
      );

    body.position.y=b.h/2;

    body.castShadow=true;
    body.receiveShadow=true;

    group.add(body);

    const roof=
      new THREE.Mesh(
        new THREE.BoxGeometry(
          b.w+.3,
          .3,
          b.d+.3
        ),
        this.mat(
          0x493d38,
          .9
        )
      );

    roof.position.y=b.h+.15;

    roof.castShadow=true;

    group.add(roof);

    const wm=
      this.mat(
        0x9be0e9,
        .18,
        0x123f48
      );

    const rows=
      Math.max(
        1,
        Math.floor(b.h/2.2)
      );

    const cols=
      Math.max(
        1,
        Math.floor(b.w/1.5)
      );

    for(
      let r=0;
      r<rows;
      r++
    ){

      for(
        let c=0;
        c<cols;
        c++
      ){

        const w=
          new THREE.Mesh(
            new THREE.BoxGeometry(
              .52,
              .62,
              .08
            ),
            wm
          );

        w.position.set(
          -b.w/2+.9+c*1.45,
          1.2+r*1.65,
          -b.d/2-.05
        );

        group.add(w);
      }
    }

    const door=
      new THREE.Mesh(
        new THREE.BoxGeometry(
          .85,
          1.7,
          .12
        ),
        this.mat(
          0x452c24
        )
      );

    door.position.set(
      0,
      .85,
      -b.d/2-.08
    );

    group.add(door);

    if(
      !["house","apartment"]
      .includes(b.type)
    ){

      const sign=
        new THREE.Mesh(
          new THREE.BoxGeometry(
            Math.min(
              b.w*.72,
              5
            ),
            .45,
            .1
          ),
          this.mat(
            b.type==="club"
            ?0xff38b8
            :0x19d8c8,
            .25,
            b.type==="club"
            ?0xff0b9d
            :0x0b6f6c
          )
        );

      sign.position.set(
        0,
        Math.min(
          b.h-.4,
          3.6
        ),
        -b.d/2-.12
      );

      group.add(sign);
    }

    group.position.set(
      b.x,
      0,
      b.z
    );

    this.scene.add(group);
  }

  tree(x,z){

    const t=
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          .16,
          .25,
          2.4,
          8
        ),
        this.mat(
          0x65432d
        )
      );

    t.position.set(
      x,
      1.2,
      z
    );

    t.castShadow=true;

    this.scene.add(t);

    const c=
      new THREE.Mesh(
        new THREE.SphereGeometry(
          1.25,
          12,
          10
        ),
        this.mat(
          0x2e7a3d
        )
      );

    c.position.set(
      x,
      2.75,
      z
    );

    c.scale.y=.9;

    c.castShadow=true;

    this.scene.add(c);
  }

  palm(x,z){

    const t=
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          .14,
          .25,
          4.4,
          8
        ),
        this.mat(
          0x765034
        )
      );

    t.position.set(
      x,
      2.2,
      z
    );

    this.scene.add(t);

    for(let i=0;i<8;i++){

      const l=
        new THREE.Mesh(
          new THREE.BoxGeometry(
            .12,
            .08,
            3
          ),
          this.mat(
            0x226c37
          )
        );

      l.position.set(
        x,
        4.25,
        z
      );

      l.rotation.y=
        i*Math.PI/4;

      l.rotation.z=.35;

      this.scene.add(l);
    }
  }

  light(x,z){

    const p=
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          .04,
          .07,
          3.3,
          6
        ),
        this.mat(
          0x33373a,
          .5
        )
      );

    p.position.set(
      x,
      1.65,
      z
    );

    this.scene.add(p);

    const l=
      new THREE.Mesh(
        new THREE.SphereGeometry(
          .13,
          8,
          8
        ),
        this.mat(
          0xffd37a,
          .2,
          0xff9d21
        )
      );

    l.position.set(
      x,
      3.2,
      z
    );

    this.scene.add(l);
  }

  signal(x,z){

    for(
      const s of[-1,1]
    ){

      const pole=
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            .05,
            .07,
            3.4,
            8
          ),
          this.mat(
            0x25282a
          )
        );

      pole.position.set(
        x+s*4,
        1.7,
        z+s*4
      );

      this.scene.add(pole);

      const box=
        new THREE.Mesh(
          new THREE.BoxGeometry(
            .32,
            .95,
            .25
          ),
          this.mat(
            0x111315
          )
        );

      box.position.set(
        x+s*4,
        3.1,
        z+s*4
      );

      this.scene.add(box);

      [0,1,2].forEach(i=>{

        const m=
          this.mat(
            i===0
            ?0xff3030
            :i===1
            ?0xffc928
            :0x30ff78,
            .2,
            i===0
            ?0xff0000
            :i===1
            ?0xffa000
            :0x00ff55
          );

        const a=
          new THREE.Mesh(
            new THREE.SphereGeometry(
              .07,
              8,
              8
            ),
            m
          );

        a.position.set(
          x+s*4,
          3.42-i*.28,
          z+s*4-.14
        );

        this.scene.add(a);
      });
    }
  }

  person(p){

    const g=
      new THREE.Group();

    const shirt=
      this.pickColor([
        0x3c78b4,
        0xc95d50,
        0x4f9b6a,
        0xc28b4b,
        0x8a63a8,
        0x48a6a1,
        0xe0a84c
      ]);

    const body=
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          .22,
          .28,
          .85,
          8
        ),
        this.mat(shirt)
      );

    body.position.y=.78;

    g.add(body);

    const head=
      new THREE.Mesh(
        new THREE.SphereGeometry(
          .23,
          10,
          8
        ),
        this.mat(
          0xc68a69
        )
      );

    head.position.y=1.42;

    g.add(head);

    for(
      const x of[-.1,.1]
    ){

      const leg=
        new THREE.Mesh(
          new THREE.BoxGeometry(
            .11,
            .58,
            .12
          ),
          this.mat(
            0x24282c
          )
        );

      leg.position.set(
        x,
        .3,
        0
      );

      g.add(leg);
    }

    g.position.set(
      p.x,
      0,
      p.z
    );

    g.userData={
      p,
      legs:g.children.slice(2)
    };

    this.scene.add(g);

    this.peopleMeshes.push(g);
  }

  pickColor(a){
    return a[
      Math.floor(
        Math.random()*a.length
      )
    ];
  }

  vehicle(v){

    const g=
      new THREE.Group();

    const colors=[
      0xc94e4e,
      0x477db5,
      0xd6a638,
      0x4f8c69,
      0xd0d0c8,
      0x7d62a1
    ];

    const w=
      v.type==="bus"
      ?2.2
      :1.75;

    const l=
      v.type==="bus"
      ?5
      :3.5;

    const b=
      new THREE.Mesh(
        new THREE.BoxGeometry(
          w,
          .65,
          l
        ),
        this.mat(
          this.pickColor(colors),
          .55
        )
      );

    b.position.y=.55;

    g.add(b);

    const cab=
      new THREE.Mesh(
        new THREE.BoxGeometry(
          w*.8,
          .5,
          l*.45
        ),
        this.mat(
          0x26353a,
          .2
        )
      );

    cab.position.y=.98;

    g.add(cab);

    for(
      const x of[-w/2,w/2]
    ){

      for(
        const z of[-l*.28,l*.28]
      ){

        const wheel=
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              .3,
              .3,
              .18,
              10
            ),
            this.mat(
              0x101214,
              .95
            )
          );

        wheel.rotation.z=
          Math.PI/2;

        wheel.position.set(
          x,
          .3,
          z
        );

        g.add(wheel);
      }
    }

    g.userData={v};

    this.scene.add(g);

    this.vehicleMeshes.push(g);
  }

  createEcho(){

    const g=
      new THREE.Group();

    const body=
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          .32,
          1,
          6,
          12
        ),
        this.mat(
          0x0de5c8,
          .3,
          0x00bda6
        )
      );

    body.position.y=.8;

    g.add(body);

    const eye=
      new THREE.Mesh(
        new THREE.SphereGeometry(
          .13,
          12,
          8
        ),
        this.mat(
          0xffffff,
          .15,
          0xffffff
        )
      );

    eye.position.set(
      0,
      1.55,
      -.28
    );

    g.add(eye);

    const ring=
      new THREE.Mesh(
        new THREE.TorusGeometry(
          .55,
          .035,
          8,
          32
        ),
        this.mat(
          0x00f5d4,
          .2,
          0x00e0c0
        )
      );

    ring.rotation.x=
      Math.PI/2;

    ring.position.y=.05;

    g.add(ring);

    this.echo=g;

    this.scene.add(g);
  }

  controls(){

    window.addEventListener(
      "keydown",
      e=>{
        this.keys[
          e.key.toLowerCase()
        ]=true;
      }
    );

    window.addEventListener(
      "keyup",
      e=>{
        this.keys[
          e.key.toLowerCase()
        ]=false;
      }
    );

    this.renderer.domElement.addEventListener(
      "pointerdown",
      e=>{
        this.drag=true;
        this.last={
          x:e.clientX,
          y:e.clientY
        };
      }
    );

    window.addEventListener(
      "pointerup",
      ()=>this.drag=false
    );

    window.addEventListener(
      "pointermove",
      e=>{

        if(!this.drag)return;

        this.yaw-=
          (e.clientX-this.last.x)*.006;

        this.pitch=
          Math.max(
            .12,
            Math.min(
              .75,
              this.pitch-
              (e.clientY-this.last.y)*.004
            )
          );

        this.last={
          x:e.clientX,
          y:e.clientY
        };
      }
    );

    this.renderer.domElement.addEventListener(
      "wheel",
      e=>{
        this.distance=
          Math.max(
            4,
            Math.min(
              20,
              this.distance+
              e.deltaY*.01
            )
          );
      },
      {passive:true}
    );
  }

  update(dt){

    let moving=false;

    const speed=.12;

    const forward=
      new THREE.Vector3(
        Math.sin(this.yaw),
        0,
        Math.cos(this.yaw)
      );

    const right=
      new THREE.Vector3(
        Math.cos(this.yaw),
        0,
        -Math.sin(this.yaw)
      );

    if(
      this.keys.w||
      this.keys.arrowup
    ){

      this.echoPos.addScaledVector(
        forward,
        speed
      );

      moving=true;
    }

    if(
      this.keys.s||
      this.keys.arrowdown
    ){

      this.echoPos.addScaledVector(
        forward,
        -speed
      );

      moving=true;
    }

    if(
      this.keys.a||
      this.keys.arrowleft
    ){

      this.echoPos.addScaledVector(
        right,
        -speed
      );

      moving=true;
    }

    if(
      this.keys.d||
      this.keys.arrowright
    ){

      this.echoPos.addScaledVector(
        right,
        speed
      );

      moving=true;
    }

    if(!moving){

      this.autoTimer-=dt;

      if(this.autoTimer<=0){

        this.autoTimer=8;

        const t=
          this.city.randomPublic();

        this.autoTarget=
          new THREE.Vector3(
            t.x,
            0,
            t.z
          );
      }

      if(this.autoTarget){

        const d=
          this.autoTarget
          .clone()
          .sub(this.echoPos);

        d.y=0;

        if(d.length()>.7){

          this.echoPos.addScaledVector(
            d.normalize(),
            .045
          );

        }else{

          this.autoTarget=null;
        }
      }
    }

    this.echo.position.copy(
      this.echoPos
    );

    this.echo.position.y=
      Math.sin(
        this.clock.elapsedTime*4
      )*.04;

    this.echo.children[2]
      .rotation.z+=dt*1.5;

    this.peopleMeshes.forEach(
      g=>{

        const p=
          g.userData.p;

        g.position.x=p.x;
        g.position.z=p.z;

        const movingNow=
          p.destination||
          p.activity==="running"||
          p.activity==="walking";

        if(movingNow){

          const s=
            Math.sin(
              this.clock.elapsedTime*9+
              p.x
            )*.35;

          g.userData.legs[0]
            .rotation.x=s;

          g.userData.legs[1]
            .rotation.x=-s;
        }
      }
    );

    this.vehicleMeshes.forEach(
      g=>{

        const v=
          g.userData.v;

        const r=v.road;

        if(r.direction==="x"){

          g.position.set(
            r.x+v.offset,
            0,
            r.z
          );

          g.rotation.y=
            v.dir<0
            ?Math.PI
            :0;

        }else{

          g.position.set(
            r.x,
            0,
            r.z+v.offset
          );

          g.rotation.y=
            v.dir>0
            ?Math.PI/2
            :-Math.PI/2;
        }
      }
    );

    const target=
      this.echoPos.clone();

    target.y=1;

    const h=
      Math.cos(this.pitch)*
      this.distance;

    const desired=
      new THREE.Vector3(
        target.x+
        Math.sin(this.yaw)*h,

        target.y+
        Math.sin(this.pitch)*
        this.distance,

        target.z+
        Math.cos(this.yaw)*h
      );

    this.camera.position.lerp(
      desired,
      .12
    );

    this.camera.lookAt(target);
  }

  lighting(){

    const h=
      this.city.hour+
      this.city.minute/60;

    let bg=0x7db6d4;

    if(
      h>=19||
      h<6
    ){

      bg=0x071322;

    }else if(h>=17){

      bg=0xd58d73;

    }else if(h<9){

      bg=0x9dc9da;
    }

    this.scene.background.set(bg);

    this.scene.fog.color.set(bg);

    this.sun.intensity=
      h>=19||
      h<6
      ? .22
      :h>=17
      ? .7
      :1.35;

    this.ambient.intensity=
      h>=19||
      h<6
      ? .25
      : .55;
  }

  animate(){

    requestAnimationFrame(
      ()=>this.animate()
    );

    const dt=
      Math.min(
        this.clock.getDelta(),
        .05
      );

    this.update(dt);
    this.lighting();

    this.renderer.render(
      this.scene,
      this.camera
    );
  }

  setEchoPosition(x,z){

    this.echoPos.set(
      x,
      0,
      z
    );

    if(this.echo)
      this.echo.position.copy(
        this.echoPos
      );
  }
}
