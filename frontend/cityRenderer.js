/*
=========================================================
 ECHO — GREENHAVEN 3D CITY RENDERER
 v0.6

 This file only renders the city.
 It does NOT control ECHO's thoughts.
=========================================================
*/

import * as THREE from
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";


export class CityRenderer {

    constructor(
        container,
        city
    ) {

        this.container = container;

        this.city = city;

        this.meshes = {};

        this.clock = new THREE.Clock();

        this.peopleMeshes = {};

        this.init();

        this.buildCity();

        this.start();

    }


    /*
    =====================================================
    INITIALIZE
    =====================================================
    */

    init() {

        this.scene =
            new THREE.Scene();


        /*
        Sky
        */

        this.scene.background =
            new THREE.Color(
                0x87b9d8
            );


        /*
        Camera
        */

        this.camera =
            new THREE.PerspectiveCamera(

                55,

                window.innerWidth /
                window.innerHeight,

                0.1,

                500

            );


        this.camera.position.set(
            0,
            32,
            38
        );


        this.camera.lookAt(
            0,
            0,
            0
        );


        /*
        Renderer
        */

        this.renderer =
            new THREE.WebGLRenderer({

                antialias: true

            });


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        this.renderer.shadowMap.enabled =
            true;


        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        this.container.innerHTML = "";


        this.container.appendChild(
            this.renderer.domElement
        );


        /*
        Lighting
        */

        this.createLighting();


        /*
        Ground
        */

        this.createGround();


        /*
        Resize
        */

        window.addEventListener(
            "resize",
            () => this.resize()
        );

    }


    /*
    =====================================================
    LIGHTING
    =====================================================
    */

    createLighting() {

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                0.65
            );


        this.scene.add(
            ambient
        );


        const sun =
            new THREE.DirectionalLight(
                0xffffff,
                1.15
            );


        sun.position.set(
            -30,
            45,
            20
        );


        sun.castShadow =
            true;


        sun.shadow.mapSize.width =
            2048;


        sun.shadow.mapSize.height =
            2048;


        sun.shadow.camera.left =
            -60;


        sun.shadow.camera.right =
            60;


        sun.shadow.camera.top =
            60;


        sun.shadow.camera.bottom =
            -60;


        this.scene.add(
            sun
        );


        this.sun =
            sun;

    }


    /*
    =====================================================
    GROUND
    =====================================================
    */

    createGround() {

        const ground =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    100,
                    100
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x4b7547,

                    roughness:
                        0.95

                })

            );


        ground.rotation.x =
            -Math.PI / 2;


        ground.receiveShadow =
            true;


        this.scene.add(
            ground
        );

    }


    /*
    =====================================================
    CITY
    =====================================================
    */

    buildCity() {

        this.buildRoads();

        this.buildParks();

        this.buildBuildings();

        this.buildNature();

        this.buildStreetFurniture();

        this.buildPeople();

    }


    /*
    =====================================================
    ROADS
    =====================================================
    */

    buildRoads() {

        this.city.roads.forEach(
            road => {

                const width =
                    road.width;

                const length =
                    road.length;


                const geometry =
                    road.direction === "x"

                        ? new THREE.PlaneGeometry(
                            length,
                            width
                        )

                        : new THREE.PlaneGeometry(
                            width,
                            length
                        );


                const material =
                    new THREE.MeshStandardMaterial({

                        color:
                            0x30343a,

                        roughness:
                            0.9

                    });


                const mesh =
                    new THREE.Mesh(
                        geometry,
                        material
                    );


                mesh.rotation.x =
                    -Math.PI / 2;


                mesh.position.set(
                    road.x,
                    0.025,
                    road.z
                );


                mesh.receiveShadow =
                    true;


                this.scene.add(
                    mesh
                );


                /*
                Road markings
                */

                this.createRoadLines(
                    road
                );

            }
        );

    }


    /*
    =====================================================
    ROAD LINES
    =====================================================
    */

    createRoadLines(
        road
    ) {

        const lineMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xf3d46a

            });


        if (
            road.direction === "x"
        ) {

            for (
                let x = road.x -
                        road.length / 2 + 2;

                x <
                    road.x +
                    road.length / 2;

                x += 4
            ) {

                const line =
                    new THREE.Mesh(

                        new THREE.PlaneGeometry(
                            2,
                            0.08
                        ),

                        lineMaterial

                    );


                line.rotation.x =
                    -Math.PI / 2;


                line.position.set(
                    x,
                    0.035,
                    road.z
                );


                this.scene.add(
                    line
                );

            }

        }

        else {

            for (
                let z =
                    road.z -
                    road.length / 2 + 2;

                z <
                    road.z +
                    road.length / 2;

                z += 4
            ) {

                const line =
                    new THREE.Mesh(

                        new THREE.PlaneGeometry(
                            0.08,
                            2
                        ),

                        lineMaterial

                    );


                line.rotation.x =
                    -Math.PI / 2;


                line.position.set(
                    road.x,
                    0.035,
                    z
                );


                this.scene.add(
                    line
                );

            }

        }

    }


    /*
    =====================================================
    BUILDINGS
    =====================================================
    */

    buildBuildings() {

        this.city.buildings.forEach(
            building => {

                this.createBuilding(
                    building
                );

            }
        );

    }


    /*
    =====================================================
    BUILD ONE BUILDING
    =====================================================
    */

    createBuilding(
        building
    ) {

        const [
            width,
            height,
            depth
        ] =
            building.size;


        const colors = {

            house:
                0xc98f64,

            apartment:
                0x8c9aaa,

            market:
                0xd8b45d,

            cafe:
                0xb87554,

            bank:
                0x8796a6,

            gym:
                0x658f83,

            library:
                0x7b6b92,

            clinic:
                0xd5d5d5,

            school:
                0xd0a35e,

            station:
                0x697886

        };


        const color =
            colors[
                building.type
            ] ||
            0x999999;


        /*
        Main building
        */

        const body =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width,
                    height,
                    depth
                ),

                new THREE.MeshStandardMaterial({

                    color,

                    roughness:
                        0.75

                })

            );


        body.position.set(

            building.x,

            height / 2,

            building.z

        );


        body.castShadow =
            true;


        body.receiveShadow =
            true;


        this.scene.add(
            body
        );


        /*
        Roof
        */

        const roofHeight =
            building.type ===
            "apartment"

                ? 0.4

                : 0.65;


        const roof =
            new THREE.Mesh(

                new THREE.ConeGeometry(

                    Math.max(
                        width,
                        depth
                    ) * 0.72,

                    roofHeight,

                    4

                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x493b36,

                    roughness:
                        0.85

                })

            );


        roof.position.set(

            building.x,

            height +
            roofHeight / 2,

            building.z

        );


        roof.rotation.y =
            Math.PI / 4;


        roof.castShadow =
            true;


        this.scene.add(
            roof
        );


        /*
        Windows
        */

        this.createWindows(
            building,
            width,
            height,
            depth
        );


        /*
        Door
        */

        this.createDoor(
            building,
            width,
            depth
        );


        /*
        Sign
        */

        if (
            [
                "gym",
                "cafe",
                "market",
                "library",
                "clinic",
                "bank",
                "school",
                "station"
            ].includes(
                building.type
            )
        ) {

            this.createSign(
                building,
                width,
                height,
                depth
            );

        }


        /*
        Save mesh
        */

        this.meshes[
            building.id
        ] = body;

    }


    /*
    =====================================================
    WINDOWS
    =====================================================
    */

    createWindows(
        building,
        width,
        height,
        depth
    ) {

        const windowMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x8ed8e8,

                emissive:
                    0x183b42,

                emissiveIntensity:
                    0.25

            });


        const rows =
            Math.max(
                1,
                Math.floor(
                    height / 2
                )
            );


        const columns =
            Math.max(
                1,
                Math.floor(
                    width / 1.5
                )
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

                const window =
                    new THREE.Mesh(

                        new THREE.BoxGeometry(
                            0.55,
                            0.7,
                            0.08
                        ),

                        windowMaterial

                    );


                const x =
                    building.x -
                    width / 2 +
                    0.8 +
                    col * 1.2;


                const y =
                    1.2 +
                    row * 1.5;


                window.position.set(
                    x,
                    y,
                    building.z -
                    depth / 2 -
                    0.045
                );


                this.scene.add(
                    window
                );

            }

        }

    }


    /*
    =====================================================
    DOOR
    =====================================================
    */

    createDoor(
        building,
        width,
        depth
    ) {

        const door =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.8,
                    1.7,
                    0.12
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x4b3329

                })

            );


        door.position.set(

            building.x,

            0.85,

            building.z -
            depth / 2 -
            0.07

        );


        this.scene.add(
            door
        );

    }


    /*
    =====================================================
    SIGN
    =====================================================
    */

    createSign(
        building,
        width,
        height,
        depth
    ) {

        const sign =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    Math.min(
                        width * 0.8,
                        4
                    ),
                    0.55,
                    0.12
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x222a30,

                    emissive:
                        0x071014,

                    emissiveIntensity:
                        0.2

                })

            );


        sign.position.set(

            building.x,

            Math.min(
                height - 0.5,
                3.5
            ),

            building.z -
            depth / 2 -
            0.1

        );


        this.scene.add(
            sign
        );

    }


    /*
    =====================================================
    PARKS
    =====================================================
    */

    buildParks() {

        this.city.parks.forEach(
            park => {

                const grass =
                    new THREE.Mesh(

                        new THREE.PlaneGeometry(
                            park.width,
                            park.depth
                        ),

                        new THREE.MeshStandardMaterial({

                            color:
                                0x3d7d42,

                            roughness:
                                1

                        })

                    );


                grass.rotation.x =
                    -Math.PI / 2;


                grass.position.set(
                    park.x,
                    0.04,
                    park.z
                );


                grass.receiveShadow =
                    true;


                this.scene.add(
                    grass
                );


                /*
                Walking paths
                */

                this.createParkPath(
                    park
                );


                /*
                Benches
                */

                this.createBenches(
                    park
                );


                /*
                Trees
                */

                for (
                    let i = 0;
                    i < 8;
                    i++
                ) {

                    const x =
                        park.x +
                        (
                            Math.random() -
                            0.5
                        ) *
                        park.width *
                        0.8;


                    const z =
                        park.z +
                        (
                            Math.random() -
                            0.5
                        ) *
                        park.depth *
                        0.8;


                    this.createTree(
                        x,
                        z
                    );

                }

            }
        );

    }


    /*
    =====================================================
    PARK PATH
    =====================================================
    */

    createParkPath(
        park
    ) {

        const path =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    park.width * 0.8,
                    1.2
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0xb5a98b

                })

            );


        path.rotation.x =
            -Math.PI / 2;


        path.position.set(
            park.x,
            0.065,
            park.z
        );


        this.scene.add(
            path
        );

    }


    /*
    =====================================================
    BENCHES
    =====================================================
    */

    createBenches(
        park
    ) {

        for (
            let i = 0;
            i < 3;
            i++
        ) {

            const bench =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        1.8,
                        0.18,
                        0.45
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            0x6b4932

                    })

                );


            bench.position.set(

                park.x -
                park.width * 0.25 +
                i * 3,

                0.65,

                park.z +
                2

            );


            this.scene.add(
                bench
            );

        }

    }


    /*
    =====================================================
    NATURE
    =====================================================
    */

    buildNature() {

        this.city.nature.forEach(
            tree => {

                this.createTree(
                    tree.x,
                    tree.z
                );

            }
        );

    }


    /*
    =====================================================
    TREE
    =====================================================
    */

    createTree(
        x,
        z
    ) {

        const trunk =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.25,
                    0.35,
                    2,
                    8
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x65452d

                })

            );


        trunk.position.set(
            x,
            1,
            z
        );


        trunk.castShadow =
            true;


        this.scene.add(
            trunk
        );


        const crown =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    1.35,
                    12,
                    12
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x2f6d36,

                    roughness:
                        0.9

                })

            );


        crown.position.set(
            x,
            2.7,
            z
        );


        crown.castShadow =
            true;


        this.scene.add(
            crown
        );

    }


    /*
    =====================================================
    STREET FURNITURE
    =====================================================
    */

    buildStreetFurniture() {

        /*
        Street lights along Main Street.
        */

        for (
            let x = -22;
            x <= 26;
            x += 6
        ) {

            this.createStreetLight(
                x,
                -3
            );

            this.createStreetLight(
                x,
                3
            );

        }

    }


    /*
    =====================================================
    STREET LIGHT
    =====================================================
    */

    createStreetLight(
        x,
        z
    ) {

        const pole =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.06,
                    0.08,
                    3.2,
                    8
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x34383b

                })

            );


        pole.position.set(
            x,
            1.6,
            z
        );


        this.scene.add(
            pole
        );


        const lamp =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.16,
                    10,
                    10
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0xffe7a3,

                    emissive:
                        0xffb83d,

                    emissiveIntensity:
                        0.5

                })

            );


        lamp.position.set(
            x,
            3.25,
            z
        );


        this.scene.add(
            lamp
        );

    }


    /*
    =====================================================
    PEOPLE
    =====================================================
    */

    buildPeople() {

        this.city.people.forEach(
            person => {

                this.createPerson(
                    person
                );

            }
        );

    }


    /*
    =====================================================
    PERSON
    =====================================================
    */

    createPerson(
        person
    ) {

        const colors = [

            0x4f83cc,

            0xd26c5c,

            0x62a86d,

            0xc18a45,

            0x8c69ad,

            0x4d9a9a

        ];


        const color =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        const body =
            new THREE.Mesh(

                new THREE.CapsuleGeometry(
                    0.28,
                    0.8,
                    5,
                    10
                ),

                new THREE.MeshStandardMaterial({

                    color,

                    roughness:
                        0.75

                })

            );


        body.position.set(

            person.x,

            0.8,

            person.z

        );


        body.castShadow =
            true;


        this.scene.add(
            body
        );


        /*
        Head
        */

        const head =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.25,
                    12,
                    12
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0xc58b68

                })

            );


        head.position.set(

            person.x,

            1.55,

            person.z

        );


        head.castShadow =
            true;


        this.scene.add(
            head
        );


        this.peopleMeshes[
            person.id
        ] = {

            body,

            head

        };

    }


    /*
    =====================================================
    UPDATE PEOPLE
    =====================================================
    */

    updatePeople() {

        this.city.people.forEach(
            person => {

                const meshes =
                    this.peopleMeshes[
                        person.id
                    ];


                if (!meshes) {

                    return;

                }


                meshes.body.position.x =
                    person.x;


                meshes.body.position.z =
                    person.z;


                meshes.head.position.x =
                    person.x;


                meshes.head.position.z =
                    person.z;


                /*
                Small walking animation.
                */

                const moving =
                    person.destination &&
                    person.activity !==
                    "sitting";


                if (moving) {

                    const bounce =
                        Math.sin(
                            Date.now() *
                            0.01
                        ) *
                        0.035;


                    meshes.body.position.y =
                        0.8 +
                        bounce;


                    meshes.head.position.y =
                        1.55 +
                        bounce;

                }

            }
        );

    }


    /*
    =====================================================
    UPDATE
    =====================================================
    */

    update() {

        this.updatePeople();

        this.updateLighting();

    }


    /*
    =====================================================
    DAY / NIGHT
    =====================================================
    */

    updateLighting() {

        const time =
            this.city.getTime();


        const hour =
            time.hour +
            time.minute / 60;


        /*
        Night
        */

        if (
            hour >= 21 ||
            hour < 6
        ) {

            this.scene.background =
                new THREE.Color(
                    0x07101c
                );


            this.sun.intensity =
                0.25;

        }


        /*
        Morning
        */

        else if (
            hour >= 6 &&
            hour < 9
        ) {

            this.scene.background =
                new THREE.Color(
                    0x9bc4d8
                );


            this.sun.intensity =
                0.75;

        }


        /*
        Day
        */

        else if (
            hour >= 9 &&
            hour < 17
        ) {

            this.scene.background =
                new THREE.Color(
                    0x87b9d8
                );


            this.sun.intensity =
                1.15;

        }


        /*
        Evening
        */

        else {

            this.scene.background =
                new THREE.Color(
                    0xd38e68
                );


            this.sun.intensity =
                0.65;

        }

    }


    /*
    =====================================================
    ANIMATION
    =====================================================
    */

    start() {

        const animate =
            () => {

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


    /*
    =====================================================
    RESIZE
    =====================================================
    */

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
