import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";

export class CityRenderer {
  constructor(container, city) {
    this.container = container;
    this.city = city;
    this.clock = new THREE.Clock();
    this.peopleMeshes = {};
    this.vehicleMeshes = [];
    this.echoPosition = new THREE.Vector3(0, 0, 4);
    this.cameraDistance = 24;
    this.cameraYaw = 0;
    this.cameraPitch = 0.58;
    this.target = new THREE.Vector3(0, 0, 4);
    this.dragging = false;
    this.lastMouse = { x: 0, y: 0 };
    this.dynamicLights = [];
    this.neonLights = [];
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
      metalness: 0.05,
      emissive,
      emissiveIntensity: intensity
    });
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x82b8d4);
    this.scene.fog = new THREE.Fog(0x82b8d4, 55, 115);

    this.camera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / window.innerHeight,
      0.1,
      400
    );

    this.camera.position.set(0, 15, 24);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance"
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
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    this.createLighting();
    this.createGround();

    window.addEventListener("resize", () => this.resize());
  }

  createLighting() {
    this.ambient = new THREE.AmbientLight(
      0xb8d9e8,
      0.58
    );
    this.scene.add(this.ambient);

    this.sun = new THREE.DirectionalLight(
      0xfff1d0,
      1.35
    );

    this.sun.position.set(-35, 55, 30);
    this.sun.castShadow = true;

    this.sun.shadow.mapSize.width = 2048;
    this.sun.shadow.mapSize.height = 2048;
    this.sun.shadow.camera.left = -80;
    this.sun.shadow.camera.right = 80;
    this.sun.shadow.camera.top = 80;
    this.sun.shadow.camera.bottom = -80;
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 180;

    this.scene.add(this.sun);

    const hemi = new THREE.HemisphereLight(
      0x9bd8ff,
      0x31502f,
      0.38
    );

    this.scene.add(hemi);
  }

  createGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(150, 150),
      this.material(0x47784b, 1)
    );

    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;

    this.scene.add(ground);

    const cityBase = new THREE.Mesh(
      new THREE.PlaneGeometry(70, 60),
      this.material(0x5f8c55, 1)
    );

    cityBase.rotation.x = -Math.PI / 2;
    cityBase.position.y = 0.015;
    cityBase.receiveShadow = true;

    this.scene.add(cityBase);
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
          ? new THREE.PlaneGeometry(
              road.length,
              road.width
            )
          : new THREE.PlaneGeometry(
              road.width,
              road.length
            );

      const roadMesh = new THREE.Mesh(
        geometry,
        this.material(0x303337, 0.92)
      );

      roadMesh.rotation.x = -Math.PI / 2;
      roadMesh.position.set(
        road.x,
        0.035,
        road.z
      );

      roadMesh.receiveShadow = true;

      this.scene.add(roadMesh);

      this.createRoadLines(road);
      this.createCurbs(road);
    });
  }

  createRoadLines(road) {
    const lineMaterial = new THREE.MeshStandardMaterial({
      color: 0xf2d66d,
      emissive: 0x4b3900,
      emissiveIntensity: 0.08
    });

    if (road.direction === "x") {
      for (
        let x = road.x - road.length / 2 + 2;
        x < road.x + road.length / 2;
        x += 4
      ) {
        const line = new THREE.Mesh(
          new THREE.PlaneGeometry(1.8, 0.09),
          lineMaterial
        );

        line.rotation.x = -Math.PI / 2;
        line.position.set(
          x,
          0.075,
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
          new THREE.PlaneGeometry(0.09, 1.8),
          lineMaterial
        );

        line.rotation.x = -Math.PI / 2;
        line.position.set(
          road.x,
          0.075,
          z
        );

        this.scene.add(line);
      }
    }
  }

  createCurbs(road) {
    const curbMaterial = this.material(
      0x777b78,
      0.9
    );

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
          0.12,
          road.z +
            side * (road.width / 2 + 0.05)
        );

        curb.castShadow = true;
        curb.receiveShadow = true;

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
          road.x +
            side * (road.width / 2 + 0.05),
          0.12,
          road.z
        );

        curb.castShadow = true;
        curb.receiveShadow = true;

        this.scene.add(curb);
      });
    }
  }

  buildSidewalks() {
    if (!this.city.roads) return;

    this.city.roads.forEach(road => {
      const sidewalkMaterial = this.material(
        0x9a9990,
        0.95
      );

      if (road.direction === "x") {
        [-1, 1].forEach(side => {
          const sidewalk = new THREE.Mesh(
            new THREE.PlaneGeometry(
              road.length,
              1.05
            ),
            sidewalkMaterial
          );

          sidewalk.rotation.x = -Math.PI / 2;

          sidewalk.position.set(
            road.x,
            0.07,
            road.z +
              side * (road.width / 2 + 0.62)
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
            sidewalkMaterial
          );

          sidewalk.rotation.x = -Math.PI / 2;

          sidewalk.position.set(
            road.x +
              side * (road.width / 2 + 0.62),
            0.07,
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
    const size =
      building.size || [5, 4, 5];

    const width = size[0];
    const height = size[1];
    const depth = size[2];

    const colors = {
      house: 0xc88d68,
      apartment: 0x788b9b,
      market: 0xd5a84d,
      cafe: 0xb86f50,
      bank: 0x617a8d,
      gym: 0x438879,
      library: 0x76658f,
      clinic: 0xd5d6d2,
      school: 0xd1a15b,
      station: 0x617a8d,
      workshop: 0x866d58
    };

    const color =
      colors[building.type] ||
      0x929292;

    const group = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(
        width,
        height,
        depth
      ),
      this.material(color, 0.72)
    );

    body.position.y = height / 2;
    body.castShadow = true;
    body.receiveShadow = true;

    group.add(body);

    this.createRoof(
      group,
      building,
      width,
      height,
      depth
    );

    this.createWindows(
      group,
      building,
      width,
      height,
      depth
    );

    this.createDoor(
      group,
      building,
      depth
    );

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

  createRoof(
    group,
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
          width + 0.25,
          0.35,
          depth + 0.25
        ),
        this.material(0x41464b, 0.9)
      );

      roof.position.y =
        height + 0.18;

      roof.castShadow = true;

      group.add(roof);
      return;
    }

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(
        Math.max(width, depth) * 0.72,
        0.8,
        4
      ),
      this.material(0x4c3b34, 0.9)
    );

    roof.position.y =
      height + 0.4;

    roof.rotation.y =
      Math.PI / 4;

    roof.castShadow = true;

    group.add(roof);
  }

  createWindows(
    group,
    building,
    width,
    height,
    depth
  ) {
    const windowMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x8dd6e5,
        roughness: 0.18,
        metalness: 0.15,
        emissive: 0x123f48,
        emissiveIntensity: 0.28
      });

    const columns = Math.max(
      1,
      Math.floor(width / 1.45)
    );

    const rows = Math.max(
      1,
      Math.floor(height / 1.55)
    );

    for (
      let row = 0;
      row < rows;
      row++
    ) {
      for (
        let col = 0;
        col < columns;
        col++
      ) {
        const y =
          1.15 + row * 1.35;

        if (y > height - 0.35)
          continue;

        const x =
          -width / 2 +
          0.8 +
          col * 1.35;

        const frontWindow =
          new THREE.Mesh(
            new THREE.BoxGeometry(
              0.52,
              0.58,
              0.08
            ),
            windowMaterial
          );

        frontWindow.position.set(
          x,
          y,
          -depth / 2 - 0.05
        );

        group.add(frontWindow);

        if (width > 4) {
          const sideWindow =
            new THREE.Mesh(
              new THREE.BoxGeometry(
                0.08,
                0.58,
                0.52
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

  createDoor(
    group,
    building,
    depth
  ) {
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.85,
        1.7,
        0.12
      ),
      this.material(
        0x432c23,
        0.75
      )
    );

    door.position.set(
      0,
      0.85,
      -depth / 2 - 0.08
    );

    group.add(door);
  }

  createBuildingSign(
    group,
    building,
    width,
    height,
    depth
  ) {
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

    if (
      !types.includes(
        building.type
      )
    ) {
      return;
    }

    const neon =
      building.type === "gym"
        ? 0x00e6c8
        : building.type === "cafe"
        ? 0xff9c4a
        : building.type === "market"
        ? 0xffd15c
        : 0x66d9ff;

    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.min(
          width * 0.78,
          4.4
        ),
        0.52,
        0.1
      ),
      this.material(
        neon,
        0.25,
        neon,
        0.8
      )
    );

    sign.position.set(
      0,
      Math.min(
        height - 0.4,
        3.5
      ),
      -depth / 2 - 0.13
    );

    group.add(sign);

    const glow =
      new THREE.PointLight(
        neon,
        0.25,
        5
      );

    glow.position.set(
      0,
      Math.min(
        height - 0.4,
        3.5
      ),
      -depth / 2 - 0.8
    );

    group.add(glow);

    this.neonLights.push(
      sign.material
    );
  }

  buildParks() {
    if (!this.city.parks) return;

    this.city.parks.forEach(park => {
      const grass = new THREE.Mesh(
        new THREE.PlaneGeometry(
          park.width,
          park.depth
        ),
        this.material(
          0x3d8248,
          1
        )
      );

      grass.rotation.x =
        -Math.PI / 2;

      grass.position.set(
        park.x,
        0.06,
        park.z
      );

      grass.receiveShadow = true;

      this.scene.add(grass);

      const path = new THREE.Mesh(
        new THREE.PlaneGeometry(
          park.width * 0.82,
          1
        ),
        this.material(
          0xb7aa8d,
          0.95
        )
      );

      path.rotation.x =
        -Math.PI / 2;

      path.position.set(
        park.x,
        0.075,
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
      this.material(0x68452d)
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
        0.65,
        0.12
      ),
      this.material(0x68452d)
    );

    back.position.set(
      x,
      0.9,
      z + 0.2
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
    const trunk =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.18,
          0.28,
          2.1,
          8
        ),
        this.material(
          0x67442c
        )
      );

    trunk.position.set(
      x,
      1.05,
      z
    );

    trunk.castShadow = true;

    this.scene.add(trunk);

    const crown =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          1.25,
          14,
          12
        ),
        this.material(
          0x2f763b,
          1
        )
      );

    crown.position.set(
      x,
      2.55,
      z
    );

    crown.scale.y = 0.88;
    crown.castShadow = true;

    this.scene.add(crown);

    const crown2 =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.85,
          12,
          10
        ),
        this.material(
          0x3d8a47,
          1
        )
      );

    crown2.position.set(
      x + 0.55,
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
      [-28, 7],
      [28, -10],
      [28, 3],
      [26, 17],
      [-22, 24],
      [18, 24],
      [8, 24],
      [-5, 24]
    ];

    palms.forEach(
      p => this.createPalm(
        p[0],
        p[1]
      )
    );
  }

  createPalm(x, z) {
    const trunk =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.12,
          0.25,
          4.2,
          9
        ),
        this.material(
          0x765032
        )
      );

    trunk.position.set(
      x,
      2.1,
      z
    );

    trunk.rotation.z =
      (Math.random() - 0.5) * 0.12;

    trunk.castShadow = true;

    this.scene.add(trunk);

    for (
      let i = 0;
      i < 8;
      i++
    ) {
      const leaf =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.12,
            0.08,
            2.8
          ),
          this.material(
            0x286c37
          )
        );

      leaf.position.set(
        x,
        4.2,
        z
      );

      leaf.rotation.y =
        i * Math.PI / 4;

      leaf.rotation.z =
        0.35;

      leaf.castShadow = true;

      this.scene.add(leaf);
    }
  }

  buildStreetLights() {
    if (!this.city.roads) return;

    this.city.roads.forEach(
      road => {
        if (
          road.direction === "x"
        ) {
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
      }
    );
  }

  createStreetLight(x, z) {
    const pole =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.055,
          0.08,
          3.3,
          8
        ),
        this.material(
          0x303437,
          0.5
        )
      );

    pole.position.set(
      x,
      1.65,
      z
    );

    pole.castShadow = true;

    this.scene.add(pole);

    const arm =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.7,
          0.07,
          0.07
        ),
        this.material(
          0x303437
        )
      );

    arm.position.set(
      x + 0.3,
      3.12,
      z
    );

    this.scene.add(arm);

    const lamp =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.17,
          10,
          10
        ),
        this.material(
          0xffd27d,
          0.15,
          0xff9b00,
          1
        )
      );

    lamp.position.set(
      x + 0.62,
      3.1,
      z
    );

    this.scene.add(lamp);

    const light =
      new THREE.PointLight(
        0xffb45d,
        0.35,
        8
      );

    light.position.copy(
      lamp.position
    );

    this.scene.add(light);

    this.dynamicLights.push(light);
  }

  buildRoadDetails() {
    const crosswalkMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xf1f1d6
      });

    const positions = [
      [0, -1],
      [-3, 3],
      [18, 5]
    ];

    positions.forEach(
      ([x, z]) => {
        for (
          let i = -3;
          i <= 3;
          i++
        ) {
          const stripe =
            new THREE.Mesh(
              new THREE.PlaneGeometry(
                0.55,
                4
              ),
              crosswalkMaterial
            );

          stripe.rotation.x =
            -Math.PI / 2;

          stripe.position.set(
            x + i * 0.85,
            0.085,
            z
          );

          this.scene.add(stripe);
        }

        this.createTrafficLight(
          x + 3.5,
          z + 2
        );
      }
    );
  }

  createTrafficLight(x, z) {
    const pole =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.06,
          0.08,
          3.2,
          8
        ),
        this.material(
          0x25282a
        )
      );

    pole.position.set(
      x,
      1.6,
      z
    );

    this.scene.add(pole);

    const housing =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.42,
          1.1,
          0.3
        ),
        this.material(
          0x151719
        )
      );

    housing.position.set(
      x,
      3,
      z
    );

    this.scene.add(housing);

    const colors = [
      0xff3030,
      0xffc52d,
      0x36ef6d
    ];

    colors.forEach(
      (color, i) => {
        const bulb =
          new THREE.Mesh(
            new THREE.SphereGeometry(
              0.075,
              10,
              10
            ),
            this.material(
              color,
              0.2,
              color,
              0.8
            )
          );

        bulb.position.set(
          x,
          3.3 - i * 0.32,
          z - 0.17
        );

        this.scene.add(bulb);
      }
    );
  }

  buildVehicles() {
    if (!this.city.vehicles) return;

    this.city.vehicles.forEach(
      vehicle => {
        const mesh =
          this.createVehicle(
            vehicle
          );

        this.scene.add(mesh);

        this.vehicleMeshes.push({
          data: vehicle,
          mesh
        });
      }
    );
  }

  createVehicle(vehicle) {
    const group =
      new THREE.Group();

    const colors = [
      0xb84e4e,
      0x4976a7,
      0xd0a53e,
      0x4d8567,
      0x777d87,
      0xc9c5b8
    ];

    const color =
      vehicle.type === "bus"
        ? 0x438b98
        : colors[
            Math.floor(
              Math.random() *
                colors.length
            )
          ];

    const width =
      vehicle.type === "bus"
        ? 2.1
        : 1.75;

    const length =
      vehicle.type === "bus"
        ? 4.6
        : 3.2;

    const body =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          width,
          0.62,
          length
        ),
        this.material(
          color,
          0.58
        )
      );

    body.position.y = 0.55;
    body.castShadow = true;

    group.add(body);

    const cabin =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          width * 0.78,
          0.48,
          length * 0.48
        ),
        this.material(
          0x29383e,
          0.25,
          0x061013,
          0.15
        )
      );

    cabin.position.y = 0.95;

    group.add(cabin);

    this.createWheel(
      group,
      -width / 2,
      -length * 0.28
    );

    this.createWheel(
      group,
      width / 2,
      -length * 0.28
    );

    this.createWheel(
      group,
      -width / 2,
      length * 0.28
    );

    this.createWheel(
      group,
      width / 2,
      length * 0.28
    );

    const headlightMaterial =
      this.material(
        0xfff3bf,
        0.2,
        0xffd15a,
        0.7
      );

    [-0.52, 0.52].forEach(
      x => {
        const light =
          new THREE.Mesh(
            new THREE.BoxGeometry(
              0.25,
              0.12,
              0.05
            ),
            headlightMaterial
          );

        light.position.set(
          x,
          0.63,
          -length / 2 - 0.04
        );

        group.add(light);
      }
    );

    group.position.set(
      vehicle.x,
      0,
      vehicle.z
    );

    return group;
  }

  createWheel(group, x, z) {
    const wheel =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.28,
          0.28,
          0.18,
          12
        ),
        this.material(
          0x111315,
          0.95
        )
      );

    wheel.rotation.z =
      Math.PI / 2;

    wheel.position.set(
      x,
      0.3,
      z
    );

    group.add(wheel);
  }

  buildPeople() {
    if (!this.city.people) return;

    this.city.people.forEach(
      person => {
        this.createPerson(
          person
        );
      }
    );
  }

  createPerson(person) {
    const group =
      new THREE.Group();

    const shirts = [
      0x4d82c5,
      0xc96b5d,
      0x5ca76b,
      0xc18b45,
      0x8467a7,
      0x4b9999
    ];

    const shirt =
      shirts[
        Math.floor(
          Math.random() *
            shirts.length
        )
      ];

    const body =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          0.27,
          0.55,
          5,
          8
        ),
        this.material(
          shirt,
          0.75
        )
      );

    body.position.y = 0.82;
    body.castShadow = true;

    group.add(body);

    const head =
      new THREE.Mesh(
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

    head.position.y = 1.55;
    head.castShadow = true;

    group.add(head);

    const leftLeg =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.12,
          0.58,
          0.14
        ),
        this.material(
          0x252b34
        )
      );

    leftLeg.position.set(
      -0.13,
      0.28,
      0
    );

    group.add(leftLeg);

    const rightLeg =
      leftLeg.clone();

    rightLeg.position.x = 0.13;

    group.add(rightLeg);

    const leftArm =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.1,
          0.58,
          0.1
        ),
        this.material(
          shirt
        )
      );

    leftArm.position.set(
      -0.35,
      0.82,
      0
    );

    group.add(leftArm);

    const rightArm =
      leftArm.clone();

    rightArm.position.x = 0.35;

    group.add(rightArm);

    group.position.set(
      person.x,
      0,
      person.z
    );

    group.userData = {
      leftLeg,
      rightLeg,
      leftArm,
      rightArm
    };

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
          0.58,
          28,
          20
        ),
        new THREE.MeshStandardMaterial({
          color: 0xf7ffff,
          roughness: 0.16,
          metalness: 0.05,
          emissive: 0x00c9ad,
          emissiveIntensity: 0.6
        })
      );

    body.position.y = 0.85;
    body.scale.y = 1.12;

    this.echo.add(body);

    const ring =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          0.8,
          0.035,
          8,
          32
        ),
        this.material(
          0x00ffcc,
          0.2,
          0x00ffcc,
          1
        )
      );

    ring.rotation.x =
      Math.PI / 2;

    ring.position.y = 0.15;

    this.echo.add(ring);

    const light =
      new THREE.PointLight(
        0x00ffcc,
        2,
        9
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

    this.city.people.forEach(
      person => {
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
            -swing * 0.65;

          mesh.rightArm.rotation.x =
            swing * 0.65;
        } else {
          mesh.leftLeg.rotation.x = 0;
          mesh.rightLeg.rotation.x = 0;
          mesh.leftArm.rotation.x = 0;
          mesh.rightArm.rotation.x = 0;
        }
      }
    );
  }

  updateVehicles() {
    this.vehicleMeshes.forEach(
      item => {
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
      }
    );
  }

  updateEcho() {
    if (!this.echo) return;

    const t =
      this.clock.elapsedTime;

    const pulse =
      1 +
      Math.sin(t * 3) *
        0.035;

    this.echo.scale.set(
      pulse,
      pulse,
      pulse
    );

    this.echo.position.y =
      Math.sin(t * 2) *
      0.05;

    const ring =
      this.echo.children[1];

    if (ring) {
      ring.rotation.z =
        t * 0.8;
    }
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
      0.075
    );

    this.camera.lookAt(
      this.target.x,
      0.9,
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
        0x081421
      );

      this.scene.fog.color.set(
        0x081421
      );

      this.sun.intensity = 0.22;
      this.ambient.intensity = 0.24;

      this.dynamicLights.forEach(
        light => {
          light.intensity = 0.8;
        }
      );
    } else if (hour < 9) {
      this.scene.background.set(
        0xa6cbd9
      );

      this.scene.fog.color.set(
        0xa6cbd9
      );

      this.sun.intensity = 0.8;
      this.ambient.intensity = 0.5;
    } else if (hour < 17) {
      this.scene.background.set(
        0x82b8d4
      );

      this.scene.fog.color.set(
        0x82b8d4
      );

      this.sun.intensity = 1.3;
      this.ambient.intensity = 0.6;
    } else {
      this.scene.background.set(
        0xd28e6b
      );

      this.scene.fog.color.set(
        0xd28e6b
      );

      this.sun.intensity = 0.68;
      this.ambient.intensity = 0.45;
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
            0.28,
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
            10,
            55
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
