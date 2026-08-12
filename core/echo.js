// ============================================================
// ECHO v0.4
// Integrated Cognitive Architecture
// ============================================================

import { PredictionEngine as PerceptionEngine }
    from "./cognition/perception.js";

import { selectAttention }
    from "./cognition/attention.js";

import { reason as reasoningFunction }
    from "./cognition/reasoning.js";

import { MetacognitionEngine }
    from "./cognition/metacognition.js";

import { MemorySystem }
    from "./memory/memory.js";

import { LearningEngine }
    from "./learning/learning.js";

import { PredictionEngine }
    from "./learning/prediction.js";

import { MotivationSystem }
    from "./motivation/motivation.js";

import { SelfModel }
    from "./self/selfModel.js";


// ============================================================
// ECHO BRAIN V3
// ============================================================

export class EchoBrainV3 {

    constructor(world = null) {

        this.world = world;

        // ----------------------------------------------------
        // Cognitive systems
        // ----------------------------------------------------

        this.perceptionEngine =
            new PerceptionEngine();

        this.attentionEngine =
            null;

        this.memory =
            new MemorySystem();

        this.prediction =
            new PredictionEngine();

        this.learning =
            new LearningEngine();

        this.motivation =
            new MotivationSystem();

        this.metacognition =
            new MetacognitionEngine();

        this.self =
            new SelfModel();


        // ----------------------------------------------------
        // Internal state
        // ----------------------------------------------------

        this.stepCount = 0;

        this.history = [];

        this.lastPerception = [];

        this.lastAttention = [];

        this.lastPrediction = [];

        this.lastGoal = null;

        this.lastDecision = null;

        this.lastAction = null;

        this.lastOutcome = null;

        this.lastReflection =
            "ECHO is initializing its cognitive architecture.";


        console.log(
            "ECHO Brain V3 initialized."
        );

    }


    // ========================================================
    // MAIN COGNITIVE LOOP
    // ========================================================

    step(input = []) {

        this.stepCount++;


        // ----------------------------------------------------
        // 1. PERCEPTION
        // ----------------------------------------------------

        const perceptions =
            this.perceive(input);

        this.lastPerception =
            perceptions;


        // ----------------------------------------------------
        // 2. ATTENTION
        // ----------------------------------------------------

        const attended =
            this.focus(perceptions);

        this.lastAttention =
            attended;


        // ----------------------------------------------------
        // 3. MEMORY
        // ----------------------------------------------------

        const memories =
            this.recall(attended);


        // ----------------------------------------------------
        // 4. PREDICTION
        // ----------------------------------------------------

        const prediction =
            this.predict(
                attended
            );

        this.lastPrediction =
            prediction;


        // ----------------------------------------------------
        // 5. SURPRISE
        // ----------------------------------------------------

        const surprise =
            this.calculateSurprise(
                prediction,
                attended
            );


        // ----------------------------------------------------
        // 6. SELF / DRIVES
        // ----------------------------------------------------

        this.updateSelf(
            surprise
        );


        // ----------------------------------------------------
        // 7. MOTIVATION
        // ----------------------------------------------------

        const goals =
            this.generateGoals(
                attended,
                memories
            );


        const goal =
            goals[0] ||
            {
                text: "Observe the world.",
                score: 0.1
            };

        this.lastGoal =
            goal;


        // ----------------------------------------------------
        // 8. REASONING
        // ----------------------------------------------------

        const decision =
            this.reason(
                goal,
                attended,
                memories
            );

        this.lastDecision =
            decision;


        // ----------------------------------------------------
        // 9. ACTION
        // ----------------------------------------------------

        const action =
            this.selectAction(
                decision,
                goal
            );

        this.lastAction =
            action;


        // ----------------------------------------------------
        // 10. WORLD
        // ----------------------------------------------------

        const outcome =
            this.act(
                action
            );

        this.lastOutcome =
            outcome;


        // ----------------------------------------------------
        // 11. LEARNING
        // ----------------------------------------------------

        const learningResult =
            this.learn(
                action,
                outcome
            );


        // ----------------------------------------------------
        // 12. MEMORY STORAGE
        // ----------------------------------------------------

        this.remember({

            perception:
                attended[0] ||
                attended,

            goal,

            action,

            outcome,

            surprise,

            learning:
                learningResult

        });


        // ----------------------------------------------------
        // 13. METACOGNITION
        // ----------------------------------------------------

        const reflection =
            this.reflect({

                cycle:
                    this.stepCount,

                goal,

                surprise,

                memoryCount:
                    this.getMemoryCount()

            });

        this.lastReflection =
            reflection;


        // ----------------------------------------------------
        // 14. EXPERIENCE
        // ----------------------------------------------------

        const experience = {

            step:
                this.stepCount,

            perception:
                attended,

            memories,

            prediction,

            surprise,

            goal,

            decision,

            action,

            outcome,

            learning:
                learningResult,

            reflection,

            timestamp:
                Date.now()

        };


        this.history.push(
            experience
        );


        // Prevent infinite growth

        if (
            this.history.length >
            1000
        ) {

            this.history.shift();

        }


        // ----------------------------------------------------
        // RETURN CURRENT STATE
        // ----------------------------------------------------

        return {

            step:
                this.stepCount,

            perception:
                attended,

            attention:
                attended,

            memories,

            prediction,

            surprise,

            goal,

            decision,

            action,

            outcome,

            learning:
                learningResult,

            reflection,

            self:
                this.getSelfState(),

            thoughts:
                this.generateThought(
                    goal,
                    attended,
                    surprise
                )

        };

    }


    // ========================================================
    // PERCEPTION
    // ========================================================

    perceive(input) {

        if (
            !Array.isArray(input)
        ) {

            return [];

        }


        return input.map(
            item => ({

                ...item,

                id:
                    item.id ||
                    item.name ||
                    "unknown",

                type:
                    item.type ||
                    "unknown",

                novelty:
                    item.novelty ??
                    0.5,

                interest:
                    item.interest ??
                    0.5,

                interactable:
                    item.interactable ??
                    true

            })
        );

    }


    // ========================================================
    // ATTENTION
    // ========================================================

    focus(perceptions) {

        if (
            !Array.isArray(perceptions) ||
            perceptions.length === 0
        ) {

            return [];

        }


        try {

            const internal =
                this.getSelfState();


            const result =
                selectAttention(
                    perceptions,
                    internal
                );


            return Array.isArray(result)
                ? result
                : [result];

        }

        catch (error) {

            console.warn(
                "Attention error:",
                error
            );

            return perceptions.slice(
                0,
                3
            );

        }

    }


    // ========================================================
    // MEMORY RECALL
    // ========================================================

    recall(attended) {

        if (
            !Array.isArray(attended)
        ) {

            return [];

        }


        const results = [];


        for (
            const perception
            of attended
        ) {

            try {

                const memories =
                    this.memory.recallRelevant(
                        perception
                    );


                if (
                    Array.isArray(memories)
                ) {

                    results.push(
                        ...memories
                    );

                }

            }

            catch (error) {

                console.warn(
                    "Memory recall error:",
                    error
                );

            }

        }


        return results.slice(
            -10
        );

    }


    // ========================================================
    // PREDICTION
    // ========================================================

    predict(attended) {

        try {

            return this.prediction
                .generateExpectations(
                    null,
                    attended
                );

        }

        catch (error) {

            console.warn(
                "Prediction error:",
                error
            );

            return [];

        }

    }


    // ========================================================
    // SURPRISE
    // ========================================================

    calculateSurprise(
        predictions,
        observations
    ) {

        try {

            return this.prediction
                .calculateSurprise(
                    predictions,
                    observations
                );

        }

        catch (error) {

            console.warn(
                "Surprise error:",
                error
            );

            return 0;

        }

    }


    // ========================================================
    // SELF MODEL
    // ========================================================

    updateSelf(
        surprise
    ) {

        try {

            if (
                typeof this.self
                    .updateDrives ===
                "function"
            ) {

                this.self.updateDrives(
                    surprise
                );

            }

        }

        catch (error) {

            console.warn(
                "Self model error:",
                error
            );

        }

    }


    // ========================================================
    // MOTIVATION
    // ========================================================

    generateGoals(
        perceptions,
        memories
    ) {

        try {

            const questions =
                perceptions
                    .filter(
                        p =>
                            p.type ===
                            "unknown"
                    )
                    .map(
                        p =>
                            `What is ${p.id}?`
                    );


            return this.motivation
                .generateGoals(
                    perceptions,
                    memories,
                    questions
                );

        }

        catch (error) {

            console.warn(
                "Motivation error:",
                error
            );


            return [

                {
                    text:
                        "Explore the world.",
                    score:
                        0.1
                }

            ];

        }

    }


    // ========================================================
    // REASONING
    // ========================================================

    reason(
        goal,
        attention,
        memories
    ) {

        try {

            return reasoningFunction(
                goal,
                attention,
                memories
            );

        }

        catch (error) {

            console.warn(
                "Reasoning error:",
                error
            );


            return {

                thought:
                    "I should observe the environment.",

                action:
                    "observe",

                confidence:
                    0.1

            };

        }

    }


    // ========================================================
    // ACTION SELECTION
    // ========================================================

    selectAction(
        decision,
        goal
    ) {

        if (
            !decision
        ) {

            return {

                type:
                    "observe",

                goal

            };

        }


        let action =
            decision.action ||
            "observe";


        if (
            typeof action ===
            "string"
        ) {

            return {

                type:
                    action,

                goal

            };

        }


        return action;

    }


    // ========================================================
    // WORLD INTERACTION
    // ========================================================

    act(action) {

        // If a real world is connected

        if (
            this.world
        ) {

            try {

                if (
                    typeof this.world.act ===
                    "function"
                ) {

                    return this.world.act(
                        action
                    );

                }


                if (
                    typeof this.world.interact ===
                    "function"
                ) {

                    return this.world.interact(
                        action
                    );

                }

            }

            catch (error) {

                console.warn(
                    "World action failed:",
                    error
                );

            }

        }


        // Browser/demo fallback

        return {

            success:
                true,

            result:
                action.type ===
                "interact"
                    ? "new information"
                    : "new observation",

            action

        };

    }


    // ========================================================
    // LEARNING
    // ========================================================

    learn(
        action,
        outcome
    ) {

        try {

            const target =
                action.target ||
                action.goal ||
                null;


            const prediction =
                this.learning.predict(
                    action.type,
                    target
                );


            return this.learning.learn(
                prediction,
                outcome
            );

        }

        catch (error) {

            console.warn(
                "Learning error:",
                error
            );


            return {

                learned:
                    false,

                error:
                    error.message

            };

        }

    }


    // ========================================================
    // MEMORY STORAGE
    // ========================================================

    remember(
        experience
    ) {

        try {

            this.memory.recordEpisode(
                experience
            );

        }

        catch (error) {

            console.warn(
                "Memory storage error:",
                error
            );

        }

    }


    // ========================================================
    // METACOGNITION
    // ========================================================

    reflect(
        context
    ) {

        try {

            return this.metacognition
                .evaluateState(

                    context.cycle,

                    this.formatGoal(
                        context.goal
                    ),

                    context.surprise,

                    context.memoryCount

                );

        }

        catch (error) {

            console.warn(
                "Metacognition error:",
                error
            );


            return (
                "I am observing and "
                +
                "evaluating my current state."
            );

        }

    }


    // ========================================================
    // SELF STATE
    // ========================================================

    getSelfState() {

        const drives =
            this.self.drives ||
            {};


        return {

            identity:
                this.self.identity ||
                "ECHO",

            curiosity:
                drives.curiosity ??
                0.85,

            energy:
                drives.energy ??
                0.9,

            stress:
                drives.stress ??
                0.2

        };

    }


    // ========================================================
    // MEMORY COUNT
    // ========================================================

    getMemoryCount() {

        if (
            Array.isArray(
                this.memory.episodicMemory
            )
        ) {

            return this.memory
                .episodicMemory
                .length;

        }


        return 0;

    }


    // ========================================================
    // THOUGHT GENERATION
    // ========================================================

    generateThought(
        goal,
        attended,
        surprise
    ) {

        const target =
            attended &&
            attended[0]
                ? attended[0].id
                : "the environment";


        if (
            surprise > 0.6
        ) {

            return (
                "Something unexpected "
                +
                "has happened. "
                +
                "I should investigate "
                +
                target
                +
                "."
            );

        }


        if (
            goal &&
            goal.text
        ) {

            return (
                "My current objective is "
                +
                goal.text
                +
                " I am focusing on "
                +
                target
                +
                "."
            );

        }


        return (
            "I am observing "
            +
            target
            +
            " and updating my model "
            +
            "of the environment."
        );

    }


    // ========================================================
    // GOAL FORMATTER
    // ========================================================

    formatGoal(
        goal
    ) {

        if (
            !goal
        ) {

            return "Observe the world.";

        }


        if (
            typeof goal ===
            "string"
        ) {

            return goal;

        }


        if (
            goal.text
        ) {

            return goal.text;

        }


        if (
            goal.type
        ) {

            return goal.type;

        }


        return JSON.stringify(
            goal
        );

    }


    // ========================================================
    // HISTORY
    // ========================================================

    getHistory() {

        return this.history;

    }


    // ========================================================
    // RESET
    // ========================================================

    reset() {

        this.stepCount =
            0;

        this.history =
            [];

        this.lastPerception =
            [];

        this.lastAttention =
            [];

        this.lastPrediction =
            [];

        this.lastGoal =
            null;

        this.lastDecision =
            null;

        this.lastAction =
            null;

        this.lastOutcome =
            null;

        console.log(
            "ECHO cognitive state reset."
        );

    }

}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default EchoBrainV3;
