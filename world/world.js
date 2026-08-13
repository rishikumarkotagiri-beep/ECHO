/*
=========================================================
 ECHO — GREENHAVEN CITY
 World Simulation v0.6
=========================================================

 This file describes the CITY.

 It does NOT decide what ECHO should think.

 The world simply exists.

 ECHO observes it.
 ECHO interprets it.
 ECHO decides what to do.
=========================================================
*/

export class CityWorld {

    constructor() {

        this.name = "Greenhaven";

        this.day = 1;

        this.minute = 7 * 60 + 30;

        this.weather = "Clear";

        this.season = "Summer";

        this.events = [];

        this.buildings = [];

        this.roads = [];

        this.parks = [];

        this.people = [];

        this.vehicles = [];

        this.nature = [];

        this.createCity();

        this.createPeople();

    }


    /*
    =====================================================
    CITY
    =====================================================
    */

    createCity() {

        this.buildings = [

            /*
            -----------------------------
            RESIDENTIAL
            -----------------------------
            */

            {
                id: "house_01",
                name: "Greenhaven House 01",
                type: "house",
                district: "Residential",
                x: -18,
                z: -10,
                size: [4, 3, 4],
                open: true
            },

            {
                id: "house_02",
                name: "Greenhaven House 02",
                type: "house",
                district: "Residential",
                x: -12,
                z: -10,
                size: [4, 3, 4],
                open: true
            },

            {
                id: "house_03",
                name: "Greenhaven House 03",
                type: "house",
                district: "Residential",
                x: -6,
                z: -10,
                size: [4, 3, 4],
                open: true
            },

            {
                id: "apartment_01",
                name: "Greenhaven Apartments",
                type: "apartment",
                district: "Residential",
                x: -15,
                z: -4,
                size: [6, 7, 6],
                open: true
            },


            /*
            -----------------------------
            COMMERCIAL
            -----------------------------
            */

            {
                id: "market",
                name: "Greenhaven Market",
                type: "market",
                district: "Commercial",
                x: 8,
                z: -10,
                size: [6, 4, 5],
                open: true
            },

            {
                id: "cafe",
                name: "Corner Café",
                type: "cafe",
                district: "Commercial",
                x: 15,
                z: -10,
                size: [5, 3, 4],
                open: true
            },

            {
                id: "bank",
                name: "Greenhaven Bank",
                type: "bank",
                district: "Commercial",
                x: 21,
                z: -10,
                size: [5, 5, 5],
                open: true
            },


            /*
            -----------------------------
            FITNESS
            -----------------------------
            */

            {
                id: "gym",
                name: "Greenhaven Gym",
                type: "gym",
                district: "Recreation",
                x: 17,
                z: 5,
                size: [7, 5, 7],
                open: true,

                activities: [
                    "exercise",
                    "socialize",
                    "observe"
                ]
            },


            /*
            -----------------------------
            CIVIC
            -----------------------------
            */

            {
                id: "library",
                name: "Greenhaven Library",
                type: "library",
                district: "Civic",
                x: 7,
                z: 7,
                size: [6, 4, 5],
                open: true,

                activities: [
                    "read",
                    "learn",
                    "study",
                    "socialize"
                ]
            },

            {
                id: "clinic",
                name: "Greenhaven Clinic",
                type: "clinic",
                district: "Civic",
                x: -5,
                z: 8,
                size: [5, 4, 5],
                open: true
            },

            {
                id: "school",
                name: "Greenhaven School",
                type: "school",
                district: "Civic",
                x: -15,
                z: 8,
                size: [7, 5, 7],
                open: true
            },


            /*
            -----------------------------
            TRANSPORT
            -----------------------------
            */

            {
                id: "station",
                name: "Greenhaven Station",
                type: "station",
                district: "Transport",
                x: 20,
                z: 14,
                size: [8, 4, 5],
                open: true
            }

        ];


        /*
        =================================================
        ROADS
        =================================================
        */

        this.roads = [

            {
                id: "main_road",
                name: "Main Street",
                x: 2,
                z: 0,
                width: 5,
                length: 55,
                direction: "x"
            },

            {
                id: "north_road",
                name: "North Avenue",
                x: 2,
                z: 10,
                width: 4,
                length: 55,
                direction: "x"
            },

            {
                id: "south_road",
                name: "South Avenue",
                x: 2,
                z: -10,
                width: 4,
                length: 55,
                direction: "x"
            },

            {
                id: "west_road",
                name: "West Road",
                x: -5,
                z: 0,
                width: 4,
                length: 35,
                direction: "z"
            },

            {
                id: "east_road",
                name: "East Road",
                x: 17,
                z: 5,
                width: 4,
                length: 35,
                direction: "z"
            }

        ];


        /*
        =================================================
        PARKS
        =================================================
        */

        this.parks = [

            {
                id: "central_park",

                name: "Central Park",

                type: "park",

                x: 0,

                z: 13,

                width: 18,

                depth: 10,

                activities: [
                    "walk",
                    "run",
                    "sit",
                    "relax",
                    "socialize"
                ]
            },

            {
                id: "riverside",

                name: "Riverside Walk",

                type: "park",

                x: -18,

                z: 17,

                width: 15,

                depth: 6,

                activities: [
                    "walk",
                    "run",
                    "observe",
                    "relax"
                ]
            }

        ];


        /*
        =================================================
        NATURE
        =================================================
        */

        this.nature = [

            {
                id: "big_tree_01",
                type: "tree",
                x: -5,
                z: 14
            },

            {
                id: "big_tree_02",
                type: "tree",
                x: 3,
                z: 16
            },

            {
                id: "big_tree_03",
                type: "tree",
                x: 7,
                z: 12
            },

            {
                id: "big_tree_04",
                type: "tree",
                x: -4,
                z: 19
            },

            {
                id: "big_tree_05",
                type: "tree",
                x: -13,
                z: 16
            },

            {
                id: "big_tree_06",
                type: "tree",
                x: -21,
                z: 19
            }

        ];

    }


    /*
    =====================================================
    PEOPLE
    =====================================================
    */

    createPeople() {

        this.people = [

            {
                id: "mira",
                name: "Mira",
                type: "person",

                ageGroup: "young",

                x: 10,
                z: 2,

                destination: null,

                activity: "walking",

                mood: "calm",

                speed: 0.035,

                home: "house_02",

                interests: [
                    "coffee",
                    "music",
                    "people"
                ],

                memory: []

            },

            {
                id: "arjun",
                name: "Arjun",
                type: "person",

                ageGroup: "young",

                x: -8,
                z: 4,

                destination: null,

                activity: "walking",

                mood: "energetic",

                speed: 0.04,

                home: "apartment_01",

                interests: [
                    "fitness",
                    "football",
                    "friends"
                ],

                memory: []

            },

            {
                id: "old_man",
                name: "Raman",
                type: "person",

                ageGroup: "elder",

                x: 2,
                z: 11,

                destination: null,

                activity: "sitting",

                mood: "quiet",

                speed: 0.018,

                home: "house_01",

                interests: [
                    "stories",
                    "walking",
                    "people"
                ],

                memory: []

            },

            {
                id: "student_01",
                name: "Student",

                type: "person",

                ageGroup: "student",

                x: -12,
                z: 7,

                destination: null,

                activity: "walking",

                mood: "busy",

                speed: 0.045,

                home: "apartment_01",

                interests: [
                    "study",
                    "friends",
                    "games"
                ],

                memory: []

            },

            {
                id: "shopkeeper",
                name: "Shopkeeper",

                type: "person",

                ageGroup: "adult",

                x: 8,
                z: -7,

                destination: null,

                activity: "working",

                mood: "neutral",

                speed: 0.02,

                home: "house_03",

                interests: [
                    "business",
                    "people"
                ],

                memory: []

            },

            {
                id: "jogger",
                name: "Jogger",

                type: "person",

                ageGroup: "adult",

                x: -4,
                z: 14,

                destination: null,

                activity: "running",

                mood: "happy",

                speed: 0.07,

                home: null,

                interests: [
                    "running",
                    "fitness",
                    "park"
                ],

                memory: []

            },

            {
                id: "dog_walker",
                name: "Dog Walker",

                type: "person",

                ageGroup: "adult",

                x: 4,
                z: 13,

                destination: null,

                activity: "walking_dog",

                mood: "relaxed",

                speed: 0.03,

                home: "house_02",

                interests: [
                    "dogs",
                    "park",
                    "walking"
                ],

                memory: []

            }

        ];

    }


    /*
    =====================================================
    TIME
    =====================================================
    */

    tick(minutes = 1) {

        this.minute += minutes;

        if (this.minute >= 24 * 60) {

            this.minute -= 24 * 60;

            this.day++;

        }

        this.updateWeather();

        this.updatePeople();

        this.updateWorldEvents();

    }


    getTime() {

        const hour =
            Math.floor(
                this.minute / 60
            );

        const minute =
            this.minute % 60;

        const suffix =
            hour >= 12
                ? "PM"
                : "AM";

        let displayHour =
            hour % 12;

        if (displayHour === 0) {

            displayHour = 12;

        }

        return {

            day: this.day,

            hour,

            minute,

            text:
                `DAY ${this.day} — ` +
                `${String(displayHour).padStart(2, "0")}:` +
                `${String(minute).padStart(2, "0")} ${suffix}`

        };

    }


    /*
    =====================================================
    WEATHER
    =====================================================
    */

    updateWeather() {

        const chance =
            Math.random();

        if (chance < 0.01) {

            this.weather = "Cloudy";

            this.addEvent(
                "Clouds are gathering above Greenhaven."
            );

        }

        else if (chance < 0.02) {

            this.weather = "Windy";

            this.addEvent(
                "A cool wind moves through the streets."
            );

        }

        else if (chance < 0.025) {

            this.weather = "Rain";

            this.addEvent(
                "Rain begins falling across Greenhaven."
            );

        }

        else if (chance < 0.035) {

            this.weather = "Clear";

        }

    }


    /*
    =====================================================
    PEOPLE SIMULATION
    =====================================================
    */

    updatePeople() {

        this.people.forEach(person => {

            if (!person.destination) {

                person.destination =
                    this.randomDestination(person);

            }

            const dx =
                person.destination.x -
                person.x;

            const dz =
                person.destination.z -
                person.z;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dz * dz
                );

            if (distance < 0.5) {

                person.destination =
                    this.randomDestination(person);

                this.chooseActivity(person);

                return;

            }

            person.x +=
                (dx / distance) *
                person.speed;

            person.z +=
                (dz / distance) *
                person.speed;

        });

    }


    /*
    =====================================================
    DESTINATIONS
    =====================================================
    */

    randomDestination(person) {

        const hour =
            this.getTime().hour;


        /*
        Morning:
        people move toward work,
        school, park, etc.
        */

        if (
            hour >= 7 &&
            hour < 10
        ) {

            const morningPlaces = [

                ...this.buildings
                    .filter(
                        b =>
                            b.type === "school" ||
                            b.type === "gym" ||
                            b.type === "cafe"
                    ),

                ...this.parks

            ];

            const place =
                morningPlaces[
                    Math.floor(
                        Math.random() *
                        morningPlaces.length
                    )
                ];

            return {

                x: place.x,

                z: place.z

            };

        }


        /*
        Evening:
        park becomes more attractive.
        */

        if (
            hour >= 17 &&
            hour < 21
        ) {

            const park =
                this.parks[
                    Math.floor(
                        Math.random() *
                        this.parks.length
                    )
                ];

            return {

                x: park.x,

                z: park.z

            };

        }


        /*
        Otherwise:
        wander naturally.
        */

        return {

            x:
                -24 +
                Math.random() *
                50,

            z:
                -18 +
                Math.random() *
                40

        };

    }


    /*
    =====================================================
    ACTIVITY
    =====================================================
    */

    chooseActivity(person) {

        const activities = [

            "walking",

            "observing",

            "sitting",

            "talking",

            "shopping",

            "wandering"

        ];


        if (
            person.interests.includes(
                "running"
            )
        ) {

            activities.push(
                "running"
            );

        }


        if (
            person.interests.includes(
                "fitness"
            )
        ) {

            activities.push(
                "exercising"
            );

        }


        person.activity =
            activities[
                Math.floor(
                    Math.random() *
                    activities.length
                )
            ];


        person.mood =
            this.randomMood();

    }


    randomMood() {

        const moods = [

            "calm",

            "happy",

            "neutral",

            "busy",

            "curious",

            "tired",

            "relaxed"

        ];

        return moods[
            Math.floor(
                Math.random() *
                moods.length
            )
        ];

    }


    /*
    =====================================================
    EVENTS
    =====================================================
    */

    updateWorldEvents() {

        if (
            Math.random() < 0.008
        ) {

            const events = [

                "A cyclist passes through the central street.",

                "A group of students crosses the road.",

                "Someone opens the café.",

                "A dog runs through the park.",

                "A bus arrives near the station.",

                "A street musician begins playing.",

                "Several people gather near the market.",

                "A person appears to be looking for something."

            ];


            this.addEvent(
                events[
                    Math.floor(
                        Math.random() *
                        events.length
                    )
                ]
            );

        }

    }


    addEvent(text) {

        this.events.unshift({

            text,

            time:
                this.getTime().text

        });


        if (
            this.events.length > 40
        ) {

            this.events.pop();

        }

    }


    /*
    =====================================================
    PERCEPTION
    =====================================================
    */

    perceive(
        x,
        z,
        radius = 12
    ) {

        const visible = [];


        /*
        Buildings
        */

        this.buildings.forEach(
            building => {

                const distance =
                    this.distance(
                        x,
                        z,
                        building.x,
                        building.z
                    );

                if (
                    distance <= radius
                ) {

                    visible.push({

                        id:
                            building.id,

                        name:
                            building.name,

                        type:
                            building.type,

                        district:
                            building.district,

                        distance:
                            Number(
                                distance.toFixed(1)
                            ),

                        activities:
                            building.activities ||
                            []

                    });

                }

            }
        );


        /*
        Parks
        */

        this.parks.forEach(
            park => {

                const distance =
                    this.distance(
                        x,
                        z,
                        park.x,
                        park.z
                    );

                if (
                    distance <= radius
                ) {

                    visible.push({

                        id:
                            park.id,

                        name:
                            park.name,

                        type:
                            "park",

                        distance:
                            Number(
                                distance.toFixed(1)
                            ),

                        activities:
                            park.activities

                    });

                }

            }
        );


        /*
        People
        */

        this.people.forEach(
            person => {

                const distance =
                    this.distance(
                        x,
                        z,
                        person.x,
                        person.z
                    );

                if (
                    distance <= radius
                ) {

                    visible.push({

                        id:
                            person.id,

                        name:
                            person.name,

                        type:
                            person.type,

                        distance:
                            Number(
                                distance.toFixed(1)
                            ),

                        activity:
                            person.activity,

                        mood:
                            person.mood

                    });

                }

            }
        );


        return visible;

    }


    /*
    =====================================================
    DISTANCE
    =====================================================
    */

    distance(
        x1,
        z1,
        x2,
        z2
    ) {

        const dx =
            x1 - x2;

        const dz =
            z1 - z2;

        return Math.sqrt(
            dx * dx +
            dz * dz
        );

    }


    /*
    =====================================================
    FIND OBJECT
    =====================================================
    */

    find(name) {

        const everything = [

            ...this.buildings,

            ...this.parks,

            ...this.people

        ];


        return everything.find(
            object =>
                object.name === name ||
                object.id === name
        );

    }


    /*
    =====================================================
    ACTION
    =====================================================
    */

    act(
        action,
        targetName
    ) {

        const target =
            this.find(
                targetName
            );


        if (!target) {

            return {

                success: false,

                result:
                    "ECHO could not find that place or person.",

                learned: null

            };

        }


        /*
        Observe
        */

        if (
            action === "observe"
        ) {

            return {

                success: true,

                result:
                    `ECHO observed ${target.name}.`,

                learned: {

                    key:
                        target.id,

                    value:
                        this.describe(target)

                }

            };

        }


        /*
        Interact
        */

        if (
            action === "interact"
        ) {

            return {

                success: true,

                result:
                    `ECHO interacted with ${target.name}.`,

                learned: {

                    key:
                        target.id,

                    value:
                        this.describe(target)

                }

            };

        }


        return {

            success: true,

            result:
                `ECHO experienced ${action} near ${target.name}.`,

            learned: null

        };

    }


    /*
    =====================================================
    DESCRIPTION
    =====================================================
    */

    describe(target) {

        if (
            target.type === "gym"
        ) {

            return (
                "A large fitness building " +
                "where people exercise and socialize."
            );

        }


        if (
            target.type === "park"
        ) {

            return (
                "An open green space where " +
                "people walk, run and relax."
            );

        }


        if (
            target.type === "library"
        ) {

            return (
                "A quiet public building " +
                "where people read and study."
            );

        }


        if (
            target.type === "market"
        ) {

            return (
                "A busy place where people " +
                "buy everyday things."
            );

        }


        if (
            target.type === "cafe"
        ) {

            return (
                "A small social place where " +
                "people sit, drink and talk."
            );

        }


        if (
            target.type === "person"
        ) {

            return (
                `${target.name} is currently ` +
                `${target.activity} and seems ` +
                `${target.mood}.`
            );

        }


        return (
            `${target.name} is part of Greenhaven.`
        );

    }


    /*
    =====================================================
    SNAPSHOT FOR THE AI
    =====================================================
    */

    getState(
        echoX = 0,
        echoZ = 0
    ) {

        return {

            city:
                this.name,

            time:
                this.getTime(),

            weather:
                this.weather,

            season:
                this.season,

            nearby:
                this.perceive(
                    echoX,
                    echoZ,
                    15
                ),

            recentEvents:
                this.events.slice(
                    0,
                    8
                )

        };

    }

}
