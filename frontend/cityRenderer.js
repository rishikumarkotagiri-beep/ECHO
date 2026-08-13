import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";

export class CityRenderer {
  constructor(container, city) {
    this.container = container;
    this.city = city;
    this.clock = new THREE.Clock();

    this.peopleMeshes = {};
    this.vehicleMeshes = [];

    this.echoPosition = new THREE.Vector3(0, 0, 4);
    this.cameraDistance = 32;
    this.cameraYaw = 0;
    this.cameraPitch = 0.62;

    this.target = new THREE.Vector3(0, 0, 4);

    this.dragging = false;
    this.lastMouse = { x: 0, y: 0 };

    this.init();
    this.buildCity();
    this.createEcho();
    this.bindControls();
    this.start();
  }

  material(color, roughness = 0.8, emissive = 0x000000) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness,
      metalness: 0,
      emissive: emissive,
      emissiveIntensity: emissive !== 0x000000 ? 0.35 : 0
    });
  }

  init() {
    this.scene = new THREE.Scene();

    this.scene.background = new THREE.Color(0x86b9d5);
    this.scene.fog = new THREE.Fog(0x86b9d5, 45, 105);

    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      300
    );

    this.camera.position.set(0, 24, 32);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    this.createLighting();
    this.createGround();

    window.addEventListener("resize", () => {
      this.resize();
    });
  }

  createLighting() {
    this.ambient = new THREE.AmbientLight(
      0xffffff,
      0.65
    );

    this.scene.add(this.ambient);

    this.sun = new THREE.DirectionalLight(
      0xffffff,
      1.15
    );

    this.sun.position.set(
      -30,
      45,
      25
    );

    this.sun.castShadow = true;

    this.sun.shadow.mapSize.width = 2048;
    this.sun.shadow.mapSize.height = 2048;

    this.sun.shadow.camera.left = -70;
    this.sun.shadow.camera.right = 70;
    this.sun.shadow.camera.top = 70;
    this.sun.shadow.camera.bottom = -70;

    this.scene.add(this.sun);
  }

  createGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      this.material(0x47784c, 1)
    );

    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;

    ground.receiveShadow = true;

    this.scene.add(ground);

    const grid = new THREE.GridHelper(
      110,
      55,
      0x315c37,
      0x315c37
    );

    grid.position.y = 0.01;

    grid.material.transparent = true;
    grid.material.opacity = 0.12;

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
  }

  buildRoads() {
    if (!this.city.roads) return;

    this.city.roads.forEach(road => {
      const geometry =
        road.direction === "x"
          ? new THREE.PlaneGeometry(
              road.length,
              road.width
            )
          : new THREE.PlaneGeometry(
              road.width,
              road.length
            );

      const mesh = new THREE.Mesh(
        geometry,
        this.material(0x292d32, 0.95)
      );

      mesh.rotation.x = -Math.PI / 2;

      mesh.position.set(
        road.x,
        0.025,
        road.z
      );

      mesh.receiveShadow = true;

      this.scene.add(mesh);

      this.createRoadLines(road);
    });
  }

  createRoadLines(road) {
    const lineMaterial = new THREE.MeshBasicMaterial({
      color: 0xf0d45a
    });

    if (road.direction === "x") {
      for (
        let x = road.x - road.length / 2 + 2;
        x < road.x + road.length / 2;
        x += 4
      ) {
        const line = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 0.08),
          lineMaterial
        );

        line.rotation.x = -Math.PI / 2;

        line.position.set(
          x,
          0.06,
          road.z
        );

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
          lineMaterial
        );

        line.rotation.x = -Math.PI / 2;

        line.position.set(
          road.x,
          0.06,
          z
        );

        this.scene.add(line);
      }
    }
  }

  buildSidewalks() {
    if (!this.city.roads) return;

    this.city.roads.forEach(road => {
      const material = this.material(
        0x858780,
        0.95
      );

      if (road.direction === "x") {
        [-1, 1].forEach(side => {
          const sidewalk = new THREE.Mesh(
            new THREE.PlaneGeometry(
              road.length,
              0.9
            ),
            material
          );

          sidewalk.rotation.x = -Math.PI / 2;

          sidewalk.position.set(
            road.x,
            0.05,
            road.z +
              side * (road.width / 2 + 0.55)
          );

          this.scene.add(sidewalk);
        });
      } else {
        [-1, 1].forEach(side => {
          const sidewalk = new THREE.Mesh(
            new THREE.PlaneGeometry(
              0.9,
              road.length
            ),
            material
          );

          sidewalk.rotation.x = -Math.PI / 2;

          sidewalk.position.set(
            road.x +
              side * (road.width / 2 + 0.55),
            0.05,
            road.z
          );

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
      house: 0xc99168,
      apartment: 0x7f92a5,
      market: 0xd0a64c,
      cafe: 0xb56c4e,
      bank: 0x637d90,
      gym: 0x438b77,
      library: 0x796993,
      clinic: 0xd5d7d6,
      school: 0xd1a154,
      station: 0x627b8d,
      workshop: 0x866d58
    };

    const color =
      colors[building.type] || 0x999999;

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(
        width,
        height,
        depth
      ),
      this.material(color, 0.75)
    );

    body.position.set(
      building.x,
      height / 2,
      building.z
    );

    body.castShadow = true;
    body.receiveShadow = true;

    this.scene.add(body);

    this.createRoof(
      building,
      width,
      height,
      depth
    );

    this.createWindows(
      building,
      width,
      height,
      depth
    );

    this.createDoor(
      building,
      depth
    );

    this.createBuildingSign(
      building,
      width,
      height,
      depth
    );
  }

  createRoof(
    building,
    width,
    height,
    depth
  ) {
    if (
      building.type === "apartment" ||
      building.type === "station"
    ) {
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(
          width + 0.2,
          0.35,
          depth + 0.2
        ),
        this.material(0x46494c, 0.9)
      );

      roof.position.set(
        building.x,
        height + 0.18,
        building.z
      );

      roof.castShadow = true;

      this.scene.add(roof);

      return;
    }

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(
        Math.max(width, depth) * 0.7,
        0.7,
        4
      ),
      this.material(0x4b3a34, 0.9)
    );

    roof.position.set(
      building.x,
      height + 0.35,
      building.z
    );

    roof.rotation.y = Math.PI / 4;

    roof.castShadow = true;

    this.scene.add(roof);
  }

  createWindows(
    building,
    width,
    height,
    depth
  ) {
    const windowMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x8fdce7,
        roughness: 0.2,
        metalness: 0.1,
        emissive: 0x163b42,
        emissiveIntensity: 0.3
      });

    const columns = Math.max(
      1,
      Math.floor(width / 1.5)
    );

    const rows = Math.max(
      1,
      Math.floor(height / 1.7)
    );

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const window = new THREE.Mesh(
          new THREE.BoxGeometry(
            0.52,
            0.62,
            0.08
          ),
          windowMaterial
        );

        const x =
          building.x -
          width / 2 +
          0.8 +
          col * 1.35;

        const y =
          1.15 +
          row * 1.45;

        if (y > height - 0.35) {
          continue;
        }

        window.position.set(
          x,
          y,
          building.z -
            depth / 2 -
            0.05
        );

        this.scene.add(window);
      }
    }
  }

  createDoor(building, depth) {
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.85,
        1.65,
        0.12
      ),
      this.material(0x493024, 0.8)
    );

    door.position.set(
      building.x,
      0.825,
      building.z -
        depth / 2 -
        0.08
    );

    this.scene.add(door);
  }

  createBuildingSign(
    building,
    width,
    height,
    depth
  ) {
    const signTypes = [
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

    if (!signTypes.includes(building.type)) {
      return;
    }

    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.min(width * 0.75, 4.5),
        0.5,
        0.12
      ),
      this.material(
        0x15252a,
        0.4,
        0x06372f
      )
    );

    sign.position.set(
      building.x,
      Math.min(
        height - 0.45,
        3.6
      ),
      building.z -
        depth / 2 -
        0.12
    );

    this.scene.add(sign);
  }

  buildParks() {
    if (!this.city.parks) return;

    this.city.parks.forEach(park => {
      const grass = new THREE.Mesh(
        new THREE.PlaneGeometry(
          park.width,
          park.depth
        ),
        this.material(0x3d8147, 1)
      );

      grass.rotation.x = -Math.PI / 2;

      grass.position.set(
        park.x,
        0.055,
        park.z
      );

      grass.receiveShadow = true;

      this.scene.add(grass);

      const path = new THREE.Mesh(
        new THREE.PlaneGeometry(
          park.width * 0.82,
          0.9
        ),
        this.material(0xb4a889, 0.95)
      );

      path.rotation.x = -Math.PI / 2;

      path.position.set(
        park.x,
        0.07,
        park.z
      );

      this.scene.add(path);

      for (let i = 0; i < 5; i++) {
        const x =
          park.x +
          (Math.random() - 0.5) *
            park.width *
            0.72;

        const z =
          park.z +
          (Math.random() - 0.5) *
            park.depth *
            0.65;

        this.createTree(x, z);
      }

      for (let i = 0; i < 3; i++) {
        this.createBench(
          park.x -
            park.width * 0.25 +
            i * 3,
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

    this.scene.add(seat);

    const leg1 = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.12,
        0.55,
        0.12
      ),
      this.material(0x303437)
    );

    leg1.position.set(
      x - 0.6,
      0.35,
      z
    );

    this.scene.add(leg1);

    const leg2 = leg1.clone();

    leg2.position.x =
      x + 0.6;

    this.scene.add(leg2);
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
        0.2,
        0.3,
        2,
        8
      ),
      this.material(0x65442c)
    );

    trunk.position.set(
      x,
      1,
      z
    );

    trunk.castShadow = true;

    this.scene.add(trunk);

    const crown = new THREE.Mesh(
      new THREE.SphereGeometry(
        1.2,
        12,
        10
      ),
      this.material(0x2e7139, 1)
    );

    crown.position.set(
      x,
      2.55,
      z
    );

    crown.scale.y = 0.9;

    crown.castShadow = true;

    this.scene.add(crown);
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
        0.06,
        0.08,
        3.2,
        8
      ),
      this.material(0x34383b, 0.5)
    );

    pole.position.set(
      x,
      1.6,
      z
    );

    pole.castShadow = true;

    this.scene.add(pole);

    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.16,
        10,
        10
      ),
      this.material(
        0xffe4a0,
        0.2,
        0xffa000
      )
    );

    lamp.position.set(
      x,
      3.2,
      z
    );

    this.scene.add(lamp);
  }

  buildVehicles() {
    if (!this.city.vehicles) return;

    this.city.vehicles.forEach(vehicle => {
      const group =
        new THREE.Group();

      const colors = [
        0xb9504a,
        0x4e78a5,
        0xc49a45,
        0x548363
      ];

      const color =
        vehicle.type === "bus"
          ? 0x4e8995
          : colors[
              Math.floor(
                Math.random() *
                  colors.length
              )
            ];

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(
          vehicle.type === "bus"
            ? 2.1
            : 1.7,
          0.6,
          vehicle.type === "bus"
            ? 4.2
            : 3
        ),
        this.material(color, 0.6)
      );

      body.position.y = 0.55;

      body.castShadow = true;

      group.add(body);

      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(
          vehicle.type === "bus"
            ? 1.7
            : 1.3,
          0.4,
          vehicle.type === "bus"
            ? 2.6
            : 1.4
        ),
        this.material(0x26353c, 0.25)
      );

      glass.position.y = 0.95;

      group.add(glass);

      group.position.set(
        vehicle.x,
        0,
        vehicle.z
      );

      this.scene.add(group);

      this.vehicleMeshes.push({
        data: vehicle,
        mesh: group
      });
    });
  }

  buildPeople() {
    if (!this.city.people) return;

    this.city.people.forEach(person => {
      this.createPerson(person);
    });
  }

  createPerson(person) {
    const group =
      new THREE.Group();

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
        12,
        10
      ),
      this.material(
        0xc58b68,
        0.8
      )
    );

    head.position.y = 1.5;

    head.castShadow = true;

    group.add(head);

    const leftLeg =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.11,
          0.55,
          0.13
        ),
        this.material(
          0x252b34
        )
      );

    leftLeg.position.set(
      -0.12,
      0.28,
      0
    );

    group.add(leftLeg);

    const rightLeg =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.11,
          0.55,
          0.13
        ),
        this.material(
          0x252b34
        )
      );

    rightLeg.position.set(
      0.12,
      0.28,
      0
    );

    group.add(rightLeg);

    const leftArm =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.1,
          0.55,
          0.1
        ),
        this.material(
          shirtColor
        )
      );

    leftArm.position.set(
      -0.35,
      0.78,
      0
    );

    group.add(leftArm);

    const rightArm =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.1,
          0.55,
          0.1
        ),
        this.material(
          shirtColor
        )
      );

    rightArm.position.set(
      0.35,
      0.78,
      0
    );

    group.add(rightArm);

    group.position.set(
      person.x,
      0,
      person.z
    );

    this.scene.add(group);

    this.peopleMeshes[
      person.id
    ] = {
      group,
      leftLeg,
      rightLeg,
      leftArm,
      rightArm
    };
  }

  createEcho() {
    this.echo =
      new THREE.Group();

    const body =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.55,
          20,
          16
        ),
        new THREE.MeshStandardMaterial({
          color: 0xf7ffff,
          roughness: 0.18,
          emissive: 0x00b89d,
          emissiveIntensity: 0.55
        })
      );

    body.position.y = 0.8;

    body.scale.y = 1.15;

    this.echo.add(body);

    const head =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.34,
          20,
          16
        ),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.2,
          emissive: 0x00d9ba,
          emissiveIntensity: 0.35
        })
      );

    head.position.y = 1.55;

    this.echo.add(head);

    const light =
      new THREE.PointLight(
        0x00ffcc,
        1.5,
        7
      );

    light.position.y = 1;

    this.echo.add(light);

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
          ) * 0.4;

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
      const vehicle =
        item.data;

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

    const pulse =
      1 +
      Math.sin(
        this.clock.elapsedTime * 3
      ) *
        0.025;

    this.echo.scale.set(
      pulse,
      pulse,
      pulse
    );

    this.echo.position.y =
      Math.sin(
        this.clock.elapsedTime * 2
      ) *
        0.04;
  }

  updateCamera() {
    const pitchCos =
      Math.cos(
        this.cameraPitch
      );

    const x =
      this.target.x +
      Math.sin(
        this.cameraYaw
      ) *
        pitchCos *
        this.cameraDistance;

    const z =
      this.target.z +
      Math.cos(
        this.cameraYaw
      ) *
        pitchCos *
        this.cameraDistance;

    const y =
      this.target.y +
      Math.sin(
        this.cameraPitch
      ) *
        this.cameraDistance;

    this.camera.position.lerp(
      new THREE.Vector3(
        x,
        y,
        z
      ),
      0.06
    );

    this.camera.lookAt(
      this.target.x,
      1,
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
      this.ambient.intensity = 0.28;
    } else if (hour < 9) {
      this.scene.background.set(
        0x9bc5d8
      );

      this.scene.fog.color.set(
        0x9bc5d8
      );

      this.sun.intensity = 0.75;
      this.ambient.intensity = 0.55;
    } else if (hour < 17) {
      this.scene.background.set(
        0x87b9d8
      );

      this.scene.fog.color.set(
        0x87b9d8
      );

      this.sun.intensity = 1.15;
      this.ambient.intensity = 0.65;
    } else {
      this.scene.background.set(
        0xd18f6b
      );

      this.scene.fog.color.set(
        0xd18f6b
      );

      this.sun.intensity = 0.65;
      this.ambient.intensity = 0.5;
    }
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
        if (!this.dragging) {
          return;
        }

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
              dy * 0.006,
            0.3,
            1.15
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
            14,
            70
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
