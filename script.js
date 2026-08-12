/* =========================================================
   ECHO v0.3
   AUTONOMOUS MIND ENGINE
========================================================= */


/* =========================================================
   AUTONOMOUS BRAIN
========================================================= */

class AutonomousBrain {

  constructor() {

    this.cycle = 0;

    this.minutes = 0;

    this.energy = 0.75;

    this.curiosity = 0.90;

    this.memory = [];

    this.inspectedTargets = new Map();
  }


  step(perceptions) {

    this.cycle += 1;

    this.minutes += 2;

    this.energy = Math.max(
      0.20,
      this.energy - 0.005
    );


    const items =
      perceptions && perceptions.length
        ? perceptions
        : [
            {
              id: "Village Ground",
              distance: 2,
              pos: { x: 0, z: 0 }
            }
          ];


    /* -----------------------------------------
       TARGET SELECTION
    ----------------------------------------- */

    let target = items[0];

    let minVisits = Infinity;


    items.forEach((p) => {

      const visits =
        this.inspectedTargets.get(p.id) || 0;


      if (visits < minVisits) {

        minVisits = visits;

        target = p;
      }

    });


    const currentVisits =
      this.inspectedTargets.get(target.id) || 0;


    this.inspectedTargets.set(
      target.id,
      currentVisits + 1
    );


    /* -----------------------------------------
       SURPRISE
    ----------------------------------------- */

    const distance =
      typeof target.distance === "number"
        ? target.distance
        : 1;


    const surprise = Math.max(
      0.05,
      Math.min(
        0.95,
        (1 / (distance + 0.5)) +
        (0.3 / (currentVisits + 1))
      )
    );


    /* -----------------------------------------
       GOALS
    ----------------------------------------- */

    let activeGoal =
      `Approach and inspect ${target.id}`;


    let subGoals = [
      `Calculate vector to ${target.id}`,
      `Scan local geometry`
    ];


    if (distance < 1.5) {

      activeGoal =
        `Analyze physical composition of ${target.id}`;


      subGoals = [
        `Store high-res spatial model`,
        `Update topological map`
      ];
    }


    /* -----------------------------------------
       METACOGNITION
    ----------------------------------------- */

    const reflections = [

      `Targeting ${target.id} at ${distance}m. Surprise delta: ${surprise.toFixed(2)}.`,

      `Evaluating distance to ${target.id}. Spatial uncertainty decreasing.`,

      `High cognitive focus on ${target.id}. Energy efficient state maintained.`,

      `Re-indexing ${target.id} into episodic memory buffer.`
    ];


    const reflection =
      reflections[
        this.cycle % reflections.length
      ];


    /* -----------------------------------------
       TIME
    ----------------------------------------- */

    const totalMinutes =
      8 * 60 + this.minutes;


    const hrs =
      String(
        Math.floor(
          (totalMinutes / 60) % 24
        )
      ).padStart(2, "0");


    const mins =
      String(
        Math.floor(totalMinutes % 60)
      ).padStart(2, "0");


    const timeString =
      `Day 1 - ${hrs}:${mins} AM`;


    /* -----------------------------------------
       MEMORY
    ----------------------------------------- */

    this.memory.push({

      cycle: this.cycle,

      target: target.id,

      surprise,

      timestamp: Date.now()

    });


    if (this.memory.length > 50) {

      this.memory.shift();
    }


    /* -----------------------------------------
       OUTPUT
    ----------------------------------------- */

    return {

      cycle: this.cycle,

      timeString,

      surpriseScore: surprise,

      activeGoal,

      subGoals,

      latestReflection: reflection,

      action: {

        type: "MoveTowards",

        target

      },

      energy: this.energy,

      curiosity: this.curiosity
    };
  }
}


/* =========================================================
   BRAIN INSTANCE
========================================================= */

const brain =
  new AutonomousBrain();


/* =========================================================
   THREE.JS WORLD
========================================================= */

const container =
  document.getElementById(
    "canvas-container"
  );


let scene;

let camera;

let renderer;

let echoMesh;

let currentVectorTarget = null;

const entities = [];


if (
  container &&
  typeof THREE !== "undefined"
) {


  /* -----------------------------------------
     SCENE
  ----------------------------------------- */

  scene =
    new THREE.Scene();


  scene.background =
    new THREE.Color(
      0x0e1422
    );


  /* -----------------------------------------
     CAMERA
  ----------------------------------------- */

  camera =
    new THREE.PerspectiveCamera(

      60,

      window.innerWidth /
        window.innerHeight,

      0.1,

      1000
    );


  camera.position.set(
    0,
    10,
    15
  );


  camera.lookAt(
    0,
    0,
    0
  );


  /* -----------------------------------------
     RENDERER
  ----------------------------------------- */

  renderer =
    new THREE.WebGLRenderer({

      antialias: true

    });


  renderer.setSize(

    window.innerWidth,

    window.innerHeight

  );


  container.appendChild(
    renderer.domElement
  );


  /* -----------------------------------------
     LIGHTING
  ----------------------------------------- */

  const ambientLight =
    new THREE.AmbientLight(

      0xffffff,

      0.7

    );


  scene.add(
    ambientLight
  );


  const dirLight =
    new THREE.DirectionalLight(

      0xffffff,

      0.6

    );


  dirLight.position.set(
    10,
    20,
    10
  );


  scene.add(
    dirLight
  );


  /* -----------------------------------------
     GROUND
  ----------------------------------------- */

  const ground =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        50,
        50
      ),

      new THREE.MeshStandardMaterial({

        color: 0x1a261a,

        roughness: 0.8

      })

    );


  ground.rotation.x =
    -Math.PI / 2;


  scene.add(
    ground
  );


  /* -----------------------------------------
     ECHO AGENT
  ----------------------------------------- */

  echoMesh =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.8,
        32,
        32
      ),

      new THREE.MeshStandardMaterial({

        color: 0xffffff,

        roughness: 0.1,

        metalness: 0.2

      })

    );


  echoMesh.position.set(
    0,
    0.8,
    4
  );


  scene.add(
    echoMesh
  );


  /* -----------------------------------------
     ENVIRONMENT OBJECTS
  ----------------------------------------- */

  const objectList = [

    {

      id: "Old Man",

      type: "npc",

      mesh:
        new THREE.Mesh(

          new THREE.CylinderGeometry(
            0.4,
            0.4,
            1.2
          ),

          new THREE.MeshStandardMaterial({

            color: 0xd97706

          })

        ),

      pos: [
        -4,
        0.6,
        -2
      ]

    },


    {

      id: "Wooden House",

      type: "building",

      mesh:
        new THREE.Mesh(

          new THREE.BoxGeometry(
            3,
            2.5,
            3
          ),

          new THREE.MeshStandardMaterial({

            color: 0x78350f

          })

        ),

      pos: [
        4,
        1.25,
        -4
      ]

    },


    {

      id: "Water Well",

      type: "object",

      mesh:
        new THREE.Mesh(

          new THREE.CylinderGeometry(
            0.8,
            0.8,
            0.8
          ),

          new THREE.MeshStandardMaterial({

            color: 0x64748b

          })

        ),

      pos: [
        0,
        0.4,
        -4
      ]

    }

  ];


  /* -----------------------------------------
     ADD OBJECTS
  ----------------------------------------- */

  objectList.forEach(
    (entity) => {

      entity.mesh.position.set(
        ...entity.pos
      );


      scene.add(
        entity.mesh
      );


      entities.push(
        entity
      );

    }
  );


  /* -----------------------------------------
     ANIMATION LOOP
  ----------------------------------------- */

  function animate() {

    requestAnimationFrame(
      animate
    );


    if (echoMesh) {

      echoMesh.rotation.y +=
        0.01;


      if (
        currentVectorTarget
      ) {

        echoMesh.position.x +=
          (
            currentVectorTarget.x -
            echoMesh.position.x
          ) * 0.03;


        echoMesh.position.z +=
          (
            currentVectorTarget.z -
            echoMesh.position.z
          ) * 0.03;

      }

    }


    renderer.render(
      scene,
      camera
    );

  }


  animate();


  /* -----------------------------------------
     WINDOW RESIZE
  ----------------------------------------- */

  window.addEventListener(
    "resize",
    () => {

      camera.aspect =
        window.innerWidth /
        window.innerHeight;


      camera.updateProjectionMatrix();


      renderer.setSize(

        window.innerWidth,

        window.innerHeight

      );

    }
  );

}


/* =========================================================
   PERCEPTION SYSTEM
========================================================= */

function getPerceptions() {

  if (
    entities.length > 0 &&
    echoMesh
  ) {

    return entities.map(
      (entity) => {

        const distance =
          echoMesh.position.distanceTo(
            entity.mesh.position
          );


        return {

          id: entity.id,

          type: entity.type,

          distance:
            Math.round(
              distance * 10
            ) / 10,

          pos: entity.mesh.position

        };

      }
    );

  }


  return [

    {

      id: "Old Man",

      distance: 3.0,

      pos: {
        x: -4,
        z: -2
      }

    },

    {

      id: "Wooden House",

      distance: 5.7,

      pos: {
        x: 4,
        z: -4
      }

    },

    {

      id: "Water Well",

      distance: 5.0,

      pos: {
        x: 0,
        z: -4
      }

    }

  ];
}


/* =========================================================
   DOM HELPER
========================================================= */

function setDOMText(
  id,
  text
) {

  const element =
    document.getElementById(id);


  if (element) {

    element.innerText =
      text;

  }

}


/* =========================================================
   COGNITIVE LOOP
========================================================= */

function runSimulation() {

  try {

    const perceptions =
      getPerceptions();


    const output =
      brain.step(
        perceptions
      );


    /* -----------------------------------------
       NAVIGATION
    ----------------------------------------- */

    if (
      output.action &&
      output.action.target &&
      output.action.target.pos
    ) {

      currentVectorTarget =
        output.action.target.pos;

    }


    /* -----------------------------------------
       HUD
    ----------------------------------------- */

    setDOMText(
      "hud-cycle",
      `CYCLE: ${output.cycle}`
    );


    setDOMText(
      "hud-time",
      `TIME: ${output.timeString}`
    );


    setDOMText(
      "hud-goal",
      output.activeGoal
    );


    setDOMText(
      "val-surprise",
      output.surpriseScore.toFixed(2)
    );


    setDOMText(
      "hud-reflection",
      output.latestReflection
    );


    setDOMText(
      "val-energy",
      `${(
        output.energy * 100
      ).toFixed(0)}%`
    );


    /* -----------------------------------------
       ENERGY BAR
    ----------------------------------------- */

    const energyBar =
      document.getElementById(
        "bar-energy"
      );


    if (energyBar) {

      energyBar.style.width =
        `${output.energy * 100}%`;

    }


    /* -----------------------------------------
       SURPRISE BAR
    ----------------------------------------- */

    const surpriseBar =
      document.getElementById(
        "bar-surprise"
      );


    if (surpriseBar) {

      surpriseBar.style.width =
        `${Math.min(
          100,
          output.surpriseScore * 100
        )}%`;

    }


    /* -----------------------------------------
       ACTION
    ----------------------------------------- */

    if (
      output.action &&
      output.action.target
    ) {

      setDOMText(

        "hud-action",

        `ACTION: ${
          output.action.type
        } -> ${
          output.action.target.id
        }`

      );

    }


    /* -----------------------------------------
       SUB-GOALS
    ----------------------------------------- */

    const subGoalsElement =
      document.getElementById(
        "hud-subgoals"
      );


    if (subGoalsElement) {

      subGoalsElement.innerHTML =
        output.subGoals
          .map(
            goal =>
              `<div class="log-entry">› ${goal}</div>`
          )
          .join("");

    }


    /* -----------------------------------------
       PERCEPTIONS
    ----------------------------------------- */

    const perceptionHUD =
      document.getElementById(
        "hud-perceptions"
      );


    if (perceptionHUD) {

      perceptionHUD.innerHTML =
        perceptions
          .map(
            p =>
              `<div class="log-entry">
                ⦿ ${p.id} (${p.distance}m)
              </div>`
          )
          .join("");

    }


    /* -----------------------------------------
       EMOTIONAL TENDENCIES
    ----------------------------------------- */

    const curiosity =
      Math.round(
        output.curiosity * 100
      );


    setDOMText(
      "val-emo-curiosity",
      `${curiosity}%`
    );


  } catch (error) {

    console.error(
      "ECHO Simulation Error:",
      error
    );

  }

}


/* =========================================================
   START ECHO
========================================================= */

runSimulation();


setInterval(
  runSimulation,
  2000
);
