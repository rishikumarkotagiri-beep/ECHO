import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";

export class CityRenderer {
  constructor(container, city) {
    this.container = container;
    this.city = city;
    this.clock = new THREE.Clock();
    this.peopleMeshes = {};
    this.vehicleMeshes = [];
    this.echoPosition = new THREE.Vector3(0, 0, 4);
    this.target = new THREE.Vector3(0, 0, 4);
    this.cameraDistance = 22;
    this.cameraYaw = 0;
    this.cameraPitch = 0.48;
    this.cameraHeight = 3.8;
    this.dragging = false;
    this.lastMouse = { x: 0, y: 0 };
    this.dynamicLights = [];
    this.neonMaterials = [];
    this.init();
    this.buildCity();
    this.createEcho();
    this.bindControls();
    this.start();
  }

  material(color, roughness = 0.75, emissive = 0x000000, intensity = 0) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0.08,
      emissive,
      emissiveIntensity: intensity
    });
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x79b3d1);
    this.scene.fog = new THREE.Fog(0x79b3d1, 55, 120);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      400
    );

    this.camera.position.set(0, 8, 22);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance"
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    this.createLighting();
    this.createGround();

    window.addEventListener("resize", () => this.resize());
  }

  createLighting() {
    this.ambient = new THREE.AmbientLight(0xb9d9e8, 0.55);
    this.scene.add(this.ambient);

    this.sun = new THREE.DirectionalLight(0xffe8c4, 1.25);
    this.sun.position.set(-35, 55, 30);
    this.sun.castShadow = true;

    this.sun.shadow.mapSize.width = 2048;
    this.sun.shadow.mapSize.height = 2048;
    this.sun.shadow.camera.left = -75;
    this.sun.shadow.camera.right = 75;
    this.sun.shadow.camera.top = 75;
    this.sun.shadow.camera.bottom = -75;
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 180;

    this.scene.add(this.sun);

    const hemisphere = new THREE.HemisphereLight(
      0x8fd3ff,
      0x315032,
      0.35
    );

    this.scene.add(hemisphere);
  }

  createGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(150, 150),
      this.material(0x4d814d, 1)
    );

    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const cityGround = new THREE.Mesh(
      new THREE.PlaneGeometry(75, 65),
      this.material(0x668f59, 1)
    );

    cityGround.rotation.x = -Math.PI / 2;
    cityGround.position.y = 0.01;
    cityGround.receiveShadow = true;
    this.scene.add(cityGround);

    const grid = new THREE.GridHelper(
      100,
      50,
      0x315b3b,
      0x315b3b
    );

    grid.position.y = 0.015;
    grid.material.transparent = true;
    grid.material.opacity = 0.06;
    this.scene.add(grid);
  }

  buildCity() {
    this.buildRoads();
    this.buildSidewalks();
    this.buildBuildings();
    this.buildParks();
    this.buildNature();
    this.buildStreetLights();
    this.buildVehicles();
    this.buildPeople();
    this.buildPalmTrees();
    this.buildRoadDetails();
  }

  buildRoads() {
    if (!this.city.roads) return;

    this.city.roads.forEach(road => {
      const geometry =
        road.direction === "x"
          ? new THREE.PlaneGeometry(road.length, road.width)
          : new THREE.PlaneGeometry(road.width, road.length);

      const mesh = new THREE.Mesh(
        geometry,
        this.material(0x25292e, 0.9)
      );

      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(road.x, 0.035, road.z);
      mesh.receiveShadow = true;

      this.scene.add(mesh);
      this.createRoadLines(road);
      this.createRoadEdges(road);
    });
  }

  createRoadLines(road) {
    const material = new THREE.MeshBasicMaterial({
      color: 0xf0d15d
    });

    if (road.direction === "x") {
      for (
        let x = road.x - road.length / 2 + 2;
        x < road.x + road.length / 2;
        x += 4
      ) {
        const line = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 0.08),
          material
        );

        line.rotation.x = -Math.PI / 2;
        line.position.set(x, 0.07, road.z);
        this.scene.add(line);
      }
    } else {
      for (
        let z = road.z - road.length / 2 + 2;
        z < road.z + road.length / 2;
        z += 4
      ) {
        const line = new THREE.Mesh(
          new THREE.PlaneGeometry(0.08, 2),
          material
        );

        line.rotation.x = -Math.PI / 2;
        line.position.set(road.x, 0.07, z);
        this.scene.add(line);
      }
    }
  }

  createRoadEdges(road) {
    const curbMaterial = this.material(0x747978, 0.9);

    if (road.direction === "x") {
      [-1, 1].forEach(side => {
        const curb = new THREE.Mesh(
          new THREE.BoxGeometry(
            road.length,
            0.18,
            0.22
          ),
          curbMaterial
        );

        curb.position.set(
          road.x,
          0.11,
          road.z + side * (road.width / 2 + 0.05)
        );

        curb.castShadow = true;
        this.scene.add(curb);
      });
    } else {
      [-1, 1].forEach(side => {
        const curb = new THREE.Mesh(
          new THREE.BoxGeometry(
            0.22,
            0.18,
            road.length
          ),
          curbMaterial
        );

        curb.position.set(
          road.x + side * (road.width / 2 + 0.05),
          0.11,
          road.z
        );

        curb.castShadow = true;
        this.scene.add(curb);
      });
    }
  }

  buildSidewalks() {
    if (!this.city.roads) return;

    this.city.roads.forEach(road => {
      const material = this.material(0x92928d, 0.95);

      if (road.direction === "x") {
        [-1, 1].forEach(side => {
          const sidewalk = new THREE.Mesh(
            new THREE.PlaneGeometry(
              road.length,
              1.05
            ),
            material
          );

          sidewalk.rotation.x = -Math.PI / 2;
          sidewalk.position.set(
            road.x,
            0.08,
            road.z + side * (road.width / 2 + 0.65)
          );

          sidewalk.receiveShadow = true;
          this.scene.add(sidewalk);
        });
      } else {
        [-1, 1].forEach(side => {
          const sidewalk = new THREE.Mesh(
            new THREE.PlaneGeometry(
              1.05,
              road.length
            ),
            material
          );

          sidewalk.rotation.x = -Math.PI / 2;
          sidewalk.position.set(
            road.x + side * (road.width / 2 + 0.65),
            0.08,
            road.z
          );

          sidewalk.receiveShadow = true;
          this.scene.add(sidewalk);
        });
      }
    });
  }

  buildBuildings() {
    if (!this.city.buildings) return;

    this.city.buildings.forEach(building => {
      this.createBuilding(building);
    });
  }

  createBuilding(building) {
    const size = building.size || [5, 4, 5];
    const width = size[0];
    const height = size[1];
    const depth = size[2];

    const colors = {
      house: 0xc68d69,
      apartment: 0x74889a,
      market: 0xd2a84c,
      cafe: 0xb66c4f,
      bank: 0x607b8e,
      gym: 0x3e8976,
      library: 0x76658d,
      clinic: 0xd5d6d2,
      school: 0xd0a158,
      station: 0x607b8d,
      workshop: 0x806b57
    };

    const color = colors[building.type] || 0x999999;
    const group = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      this.material(color, 0.72)
    );

    body.position.y = height / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    this.createRoof(group, building, width, height, depth);
    this.createWindows(group, width, height, depth);
    this.createDoor(group, depth);
    this.createBuildingSign(
      group,
      building,
      width,
      height,
      depth
    );

    group.position.set(
      building.x,
      0,
      building.z
    );

    this.scene.add(group);
  }

  createRoof(group, building, width, height, depth) {
    if (
      building.type === "apartment" ||
      building.type === "station"
    ) {
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(
          width + 0.25,
          0.35,
          depth + 0.25
        ),
        this.material(0x41464a, 0.9)
      );

      roof.position.y = height + 0.18;
      roof.castShadow = true;
      group.add(roof);
      return;
    }

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(
        Math.max(width, depth) * 0.72,
        0.85,
        4
      ),
      this.material(0x4b3932, 0.9)
    );

    roof.position.y = height + 0.4;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;

    group.add(roof);
  }

  createWindows(group, width, height, depth) {
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x79d4e2,
      roughness: 0.18,
      metalness: 0.2,
      emissive: 0x124047,
      emissiveIntensity: 0.28
    });

    const columns = Math.max(
      1,
      Math.floor(width / 1.35)
    );

    const rows = Math.max(
      1,
      Math.floor(height / 1.45)
    );

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const y = 1.15 + row * 1.3;

        if (y > height - 0.35) continue;

        const x =
          -width / 2 +
          0.72 +
          col * 1.3;

        const window = new THREE.Mesh(
          new THREE.BoxGeometry(
            0.5,
            0.58,
            0.08
          ),
          windowMaterial
        );

        window.position.set(
          x,
          y,
          -depth / 2 - 0.05
        );

        group.add(window);

        if (width >= 5) {
          const sideWindow = new THREE.Mesh(
            new THREE.BoxGeometry(
              0.08,
              0.58,
              0.5
            ),
            windowMaterial
          );

          sideWindow.position.set(
            width / 2 + 0.05,
            y,
            x
          );

          group.add(sideWindow);
        }
      }
    }
  }

  createDoor(group, depth) {
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.85,
        1.7,
        0.12
      ),
      this.material(0x452d24, 0.75)
    );

    door.position.set(
      0,
      0.85,
      -depth / 2 - 0.08
    );

    group.add(door);
  }

  createBuildingSign(group, building, width, height, depth) {
    const types = [
      "market",
      "cafe",
      "bank",
      "gym",
      "library",
      "clinic",
      "school",
      "station",
      "workshop"
    ];

    if (!types.includes(building.type)) return;

    const colors = {
      market: 0xffc84a,
      cafe: 0xff8d4d,
      bank: 0x64b8ff,
      gym: 0x00e6c8,
      library: 0xa984ff,
      clinic: 0xffffff,
      school: 0xffbd55,
      station: 0x66d9ff,
      workshop: 0xff8c66
    };

    const neon = colors[building.type] || 0x00e6c8;

    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.min(width * 0.78, 4.3),
        0.48,
        0.1
      ),
      new THREE.MeshStandardMaterial({
        color: neon,
        emissive: neon,
        emissiveIntensity: 0.55,
        roughness: 0.3
      })
    );

    sign.position.set(
      0,
      Math.min(height - 0.45, 3.5),
      -depth / 2 - 0.13
    );

    group.add(sign);
    this.neonMaterials.push(sign.material);
  }

  buildParks() {
    if (!this.city.parks) return;

    this.city.parks.forEach(park => {
      const grass = new THREE.Mesh(
        new THREE.PlaneGeometry(
          park.width,
          park.depth
        ),
        this.material(0x3c8147, 1)
      );

      grass.rotation.x = -Math.PI / 2;
      grass.position.set(
        park.x,
        0.07,
        park.z
      );

      grass.receiveShadow = true;
      this.scene.add(grass);

      const path = new THREE.Mesh(
        new THREE.PlaneGeometry(
          park.width * 0.82,
          0.9
        ),
        this.material(0xb7aa8d, 0.95)
      );

      path.rotation.x = -Math.PI / 2;
      path.position.set(
        park.x,
        0.08,
        park.z
      );

      this.scene.add(path);

      for (let i = 0; i < 7; i++) {
        const x =
          park.x +
          (Math.random() - 0.5) *
            park.width *
            0.75;

        const z =
          park.z +
          (Math.random() - 0.5) *
            park.depth *
            0.7;

        this.createTree(x, z);
      }

      for (let i = 0; i < 3; i++) {
        this.createBench(
          park.x - 4 + i * 4,
          park.z + 2
        );
      }
    });
  }

  createBench(x, z) {
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(
        1.8,
        0.18,
        0.45
      ),
      this.material(0x67442e)
    );

    seat.position.set(
      x,
      0.65,
      z
    );

    seat.castShadow = true;
    this.scene.add(seat);

    const back = new THREE.Mesh(
      new THREE.BoxGeometry(
        1.8,
        0.55,
        0.12
      ),
      this.material(0x67442e)
    );

    back.position.set(
      x,
      0.9,
      z + 0.18
    );

    this.scene.add(back);
  }

  buildNature() {
    if (!this.city.nature) return;

    this.city.nature.forEach(tree => {
      this.createTree(
        tree.x,
        tree.z
      );
    });
  }

  createTree(x, z) {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.18,
        0.28,
        2.1,
        8
      ),
      this.material(0x67442c)
    );

    trunk.position.set(
      x,
      1.05,
      z
    );

    trunk.castShadow = true;
    this.scene.add(trunk);

    const crown = new THREE.Mesh(
      new THREE.SphereGeometry(
        1.2,
        16,
        12
      ),
      this.material(0x2e743b, 1)
    );

    crown.position.set(
      x,
      2.55,
      z
    );

    crown.scale.y = 0.9;
    crown.castShadow = true;

    this.scene.add(crown);

    const crown2 = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.75,
        12,
        10
      ),
      this.material(0x3c8b48, 1)
    );

    crown2.position.set(
      x + 0.5,
      2.35,
      z - 0.2
    );

    crown2.castShadow = true;
    this.scene.add(crown2);
  }

  buildPalmTrees() {
    const palms = [
      [-27, -8],
      [-25, -1],
      [-27, 8],
      [27, -10],
      [28, 3],
      [26, 16],
      [-20, 24],
      [-5, 25],
      [12, 24],
      [25, 24]
    ];

    palms.forEach(p => {
      this.createPalm(
        p[0],
        p[1]
      );
    });
  }

  createPalm(x, z) {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.12,
        0.25,
        4.2,
        9
      ),
      this.material(0x765032)
    );

    trunk.position.set(
      x,
      2.1,
      z
    );

    trunk.castShadow = true;
    this.scene.add(trunk);

    for (let i = 0; i < 8; i++) {
      const leaf = new THREE.Mesh(
        new THREE.BoxGeometry(
          0.12,
          0.08,
          2.8
        ),
        this.material(0x286b36)
      );

      leaf.position.set(
        x,
        4.2,
        z
      );

      leaf.rotation.y =
        i * Math.PI / 4;

      leaf.rotation.z = 0.35;
      leaf.castShadow = true;

      this.scene.add(leaf);
    }
  }

  buildStreetLights() {
    if (!this.city.roads) return;

    this.city.roads.forEach(road => {
      if (road.direction === "x") {
        for (
          let x =
            road.x -
            road.length / 2 +
            5;
          x <
            road.x +
              road.length / 2;
          x += 10
        ) {
          this.createStreetLight(
            x,
            road.z -
              road.width / 2 -
              1
          );
        }
      } else {
        for (
          let z =
            road.z -
            road.length / 2 +
            5;
          z <
            road.z +
              road.length / 2;
          z += 10
        ) {
          this.createStreetLight(
            road.x +
              road.width / 2 +
              1,
            z
          );
        }
      }
    });
  }

  createStreetLight(x, z) {
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.055,
        0.08,
        3.3,
        8
      ),
      this.material(0x303437, 0.5)
    );

    pole.position.set(
      x,
      1.65,
      z
    );

    pole.castShadow = true;
    this.scene.add(pole);

    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.65,
        0.07,
        0.07
      ),
      this.material(0x303437)
    );

    arm.position.set(
      x + 0.28,
      3.15,
      z
    );

    this.scene.add(arm);

    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.16,
        10,
        10
      ),
      this.material(
        0xffd27b,
        0.2,
        0xff9a00,
        0.9
      )
    );

    lamp.position.set(
      x + 0.58,
      3.12,
      z
    );

    this.scene.add(lamp);

    const light = new THREE.PointLight(
      0xffae55,
      0.25,
      7
    );

    light.position.copy(
      lamp.position
    );

    this.scene.add(light);
    this.dynamicLights.push(light);
  }

  buildVehicles() {
    if (!this.city.vehicles) return;

    this.city.vehicles.forEach(vehicle => {
      const mesh =
        this.createVehicle(vehicle);

      this.scene.add(mesh);

      this.vehicleMeshes.push({
        data: vehicle,
        mesh
      });
    });
  }

  createVehicle(vehicle) {
    const group = new THREE.Group();

    const colors = [
      0xb84e4e,
      0x4b78a8,
      0xd0a43d,
      0x4d8568,
      0x7b7f87,
      0xc7c0ad
    ];

    const color =
      vehicle.type === "bus"
        ? 0x438d98
        : colors[
            Math.floor(
              Math.random() *
                colors.length
            )
          ];

    const width =
      vehicle.type === "bus"
        ? 2.1
        : 1.7;

    const length =
      vehicle.type === "bus"
        ? 4.5
        : 3.2;

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(
        width,
        0.62,
        length
      ),
      this.material(color, 0.55)
    );

    body.position.y = 0.55;
    body.castShadow = true;
    group.add(body);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(
        width * 0.78,
        0.48,
        length * 0.48
      ),
      this.material(
        0x24363d,
        0.22
      )
    );

    cabin.position.y = 0.95;
    group.add(cabin);

    const wheelMaterial =
      this.material(0x111315, 0.95);

    [
      [-width / 2, -length * 0.28],
      [width / 2, -length * 0.28],
      [-width / 2, length * 0.28],
      [width / 2, length * 0.28]
    ].forEach(p => {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.28,
          0.28,
          0.18,
          12
        ),
        wheelMaterial
      );

      wheel.rotation.z =
        Math.PI / 2;

      wheel.position.set(
        p[0],
        0.3,
        p[1]
      );

      group.add(wheel);
    });

    const lights = this.material(
      0xfff0b0,
      0.15,
      0xffc54c,
      0.8
    );

    [-0.52, 0.52].forEach(x => {
      const headlight = new THREE.Mesh(
        new THREE.BoxGeometry(
          0.24,
          0.12,
          0.05
        ),
        lights
      );

      headlight.position.set(
        x,
        0.63,
        -length / 2 - 0.04
      );

      group.add(headlight);
    });

    group.position.set(
      vehicle.x,
      0,
      vehicle.z
    );

    return group;
  }

  buildPeople() {
    if (!this.city.people) return;

    this.city.people.forEach(person => {
      this.createPerson(person);
    });
  }

  createPerson(person) {
    const group = new THREE.Group();

    const colors = [
      0x4f83cc,
      0xd26c5c,
      0x62a86d,
      0xc18a45,
      0x8c69ad,
      0x4d9a9a
    ];

    const shirtColor =
      colors[
        Math.floor(
          Math.random() *
            colors.length
        )
      ];

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.27,
        0.32,
        0.9,
        10
      ),
      this.material(
        shirtColor,
        0.75
      )
    );

    body.position.y = 0.8;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.25,
        14,
        12
      ),
      this.material(
        0xc58b68,
        0.8
      )
    );

    head.position.y = 1.5;
    head.castShadow = true;
    group.add(head);

    const legMaterial =
      this.material(0x252b34);

    const leftLeg = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.11,
        0.55,
        0.13
      ),
      legMaterial
    );

    leftLeg.position.set(
      -0.12,
      0.28,
      0
    );

    group.add(leftLeg);

    const rightLeg = leftLeg.clone();

    rightLeg.position.x = 0.12;
    group.add(rightLeg);

    const leftArm = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.1,
        0.55,
        0.1
      ),
      this.material(shirtColor)
    );

    leftArm.position.set(
      -0.35,
      0.78,
      0
    );

    group.add(leftArm);

    const rightArm = leftArm.clone();

    rightArm.position.x = 0.35;
    group.add(rightArm);

    group.position.set(
      person.x,
      0,
      person.z
    );

    this.scene.add(group);

    this.peopleMeshes[person.id] = {
      group,
      leftLeg,
      rightLeg,
      leftArm,
      rightArm
    };
  }

  createEcho() {
    this.echo = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.42,
        0.7,
        8,
        16
      ),
      new THREE.MeshStandardMaterial({
        color: 0xf4ffff,
        roughness: 0.2,
        metalness: 0.12,
        emissive: 0x00c8aa,
        emissiveIntensity: 0.35
      })
    );

    body.position.y = 1;
    body.castShadow = true;
    this.echo.add(body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.34,
        20,
        16
      ),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.18,
        metalness: 0.1,
        emissive: 0x00d9ba,
        emissiveIntensity: 0.25
      })
    );

    head.position.y = 1.72;
    head.castShadow = true;
    this.echo.add(head);

    const eye = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.28,
        0.09,
        0.06
      ),
      new THREE.MeshStandardMaterial({
        color: 0x061416,
        emissive: 0x00ffcc,
        emissiveIntensity: 1.3
      })
    );

    eye.position.set(
      0,
      1.75,
      -0.32
    );

    this.echo.add(eye);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(
        0.72,
        0.035,
        8,
        32
      ),
      new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 1
      })
    );

    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.12;
    this.echo.add(ring);

    const glow = new THREE.PointLight(
      0x00ffcc,
      2,
      9
    );

    glow.position.y = 1;
    this.echo.add(glow);

    this.echo.position.copy(
      this.echoPosition
    );

    this.scene.add(this.echo);
  }

  setEchoPosition(x, z) {
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

  updatePeople() {
    if (!this.city.people) return;

    this.city.people.forEach(person => {
      const mesh =
        this.peopleMeshes[
          person.id
        ];

      if (!mesh) return;

      mesh.group.position.x =
        person.x;

      mesh.group.position.z =
        person.z;

      if (
        person.destination &&
        person.speed > 0
      ) {
        const swing =
          Math.sin(
            this.clock.elapsedTime *
              8 +
              person.x
          ) * 0.45;

        mesh.leftLeg.rotation.x =
          swing;

        mesh.rightLeg.rotation.x =
          -swing;

        mesh.leftArm.rotation.x =
          -swing * 0.7;

        mesh.rightArm.rotation.x =
          swing * 0.7;
      } else {
        mesh.leftLeg.rotation.x = 0;
        mesh.rightLeg.rotation.x = 0;
        mesh.leftArm.rotation.x = 0;
        mesh.rightArm.rotation.x = 0;
      }
    });
  }

  updateVehicles() {
    this.vehicleMeshes.forEach(item => {
      const vehicle = item.data;

      item.mesh.position.x =
        vehicle.x;

      item.mesh.position.z =
        vehicle.z;

      item.mesh.rotation.y =
        vehicle.direction < 0
          ? Math.PI
          : 0;
    });
  }

  updateEcho() {
    if (!this.echo) return;

    const time =
      this.clock.elapsedTime;

    const pulse =
      1 +
      Math.sin(time * 3) *
        0.035;

    this.echo.scale.set(
      pulse,
      pulse,
      pulse
    );

    this.echo.position.y =
      Math.sin(time * 2) *
      0.05;

    const ring =
      this.echo.children[3];

    if (ring) {
      ring.rotation.z =
        time * 0.8;
    }
  }

  updateCamera() {
    const horizontal =
      Math.cos(
        this.cameraPitch
      );

    const x =
      this.target.x +
      Math.sin(
        this.cameraYaw
      ) *
      horizontal *
      this.cameraDistance;

    const z =
      this.target.z +
      Math.cos(
        this.cameraYaw
      ) *
      horizontal *
      this.cameraDistance;

    const y =
      this.target.y +
      this.cameraHeight +
      Math.sin(
        this.cameraPitch
      ) *
      this.cameraDistance;

    const desired =
      new THREE.Vector3(
        x,
        y,
        z
      );

    this.camera.position.lerp(
      desired,
      0.08
    );

    this.camera.lookAt(
      this.target.x,
      1.1,
      this.target.z
    );
  }

  updateLighting() {
    if (
      !this.city ||
      typeof this.city.getTime !==
        "function"
    ) {
      return;
    }

    const time =
      this.city.getTime();

    const hour =
      time.hour +
      time.minute / 60;

    if (
      hour >= 20 ||
      hour < 6
    ) {
      this.scene.background.set(
        0x071421
      );

      this.scene.fog.color.set(
        0x071421
      );

      this.sun.intensity = 0.25;
      this.ambient.intensity = 0.25;

      this.dynamicLights.forEach(
        light => {
          light.intensity = 0.8;
        }
      );

      this.neonMaterials.forEach(
        material => {
          material.emissiveIntensity = 1.2;
        }
      );
    } else if (hour < 9) {
      this.scene.background.set(
        0xa1cbd9
      );

      this.scene.fog.color.set(
        0xa1cbd9
      );

      this.sun.intensity = 0.8;
      this.ambient.intensity = 0.5;

      this.dynamicLights.forEach(
        light => {
          light.intensity = 0.2;
        }
      );
    } else if (hour < 17) {
      this.scene.background.set(
        0x79b3d1
      );

      this.scene.fog.color.set(
        0x79b3d1
      );

      this.sun.intensity = 1.25;
      this.ambient.intensity = 0.55;

      this.dynamicLights.forEach(
        light => {
          light.intensity = 0.15;
        }
      );
    } else {
      this.scene.background.set(
        0xd18d6d
      );

      this.scene.fog.color.set(
        0xd18d6d
      );

      this.sun.intensity = 0.7;
      this.ambient.intensity = 0.42;

      this.dynamicLights.forEach(
        light => {
          light.intensity = 0.45;
        }
      );
    }
  }

  buildRoadDetails() {
    const material =
      new THREE.MeshBasicMaterial({
        color: 0xf3f0d2
      });

    const intersections = [
      [0, -1],
      [-3, 3],
      [18, 5]
    ];

    intersections.forEach(
      ([x, z]) => {
        for (
          let i = -3;
          i <= 3;
          i++
        ) {
          const stripe =
            new THREE.Mesh(
              new THREE.PlaneGeometry(
                0.5,
                3.5
              ),
              material
            );

          stripe.rotation.x =
            -Math.PI / 2;

          stripe.position.set(
            x + i * 0.8,
            0.09,
            z
          );

          this.scene.add(stripe);
        }
      }
    );
  }

  bindControls() {
    this.renderer.domElement.addEventListener(
      "mousedown",
      event => {
        this.dragging = true;
        this.lastMouse.x =
          event.clientX;
        this.lastMouse.y =
          event.clientY;
      }
    );

    window.addEventListener(
      "mouseup",
      () => {
        this.dragging = false;
      }
    );

    window.addEventListener(
      "mousemove",
      event => {
        if (!this.dragging) return;

        const dx =
          event.clientX -
          this.lastMouse.x;

        const dy =
          event.clientY -
          this.lastMouse.y;

        this.cameraYaw -=
          dx * 0.008;

        this.cameraPitch =
          THREE.MathUtils.clamp(
            this.cameraPitch +
              dy * 0.005,
            0.22,
            1.05
          );

        this.lastMouse.x =
          event.clientX;

        this.lastMouse.y =
          event.clientY;
      }
    );

    this.renderer.domElement.addEventListener(
      "wheel",
      event => {
        event.preventDefault();

        this.cameraDistance +=
          event.deltaY * 0.025;

        this.cameraDistance =
          THREE.MathUtils.clamp(
            this.cameraDistance,
            9,
            45
          );
      },
      { passive: false }
    );
  }

  update() {
    this.updatePeople();
    this.updateVehicles();
    this.updateEcho();
    this.updateCamera();
    this.updateLighting();
  }

  start() {
    const animate = () => {
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

  resize() {
    this.camera.aspect =
      window.innerWidth /
      window.innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
}
