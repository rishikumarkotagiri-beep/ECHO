// core/echo.js
// ECHO v0.4 — Integrated Cognitive Loop

import { Perception } from "./cognition/perception.js";
import { Attention } from "./cognition/attention.js";
import { Reasoning } from "./cognition/reasoning.js";
import { Metacognition } from "./cognition/metacognition.js";

import { Memory } from "./memory/memory.js";
import { Learning } from "./learning/learning.js";
import { Prediction } from "./learning/prediction.js";

import { Motivation } from "./motivation/motivation.js";
import { SelfModel } from "./self/self.js";


export class EchoBrainV3 {

    constructor(world = null) {

        this.world = world;

        // -------------------------
        // Cognitive systems
        // -------------------------

        this.perception = new Perception();
        this.attention = new Attention();
        this.memory = new Memory();
        this.motivation = new Motivation();
        this.reasoning = new Reasoning();
        this.prediction = new Prediction();
        this.learning = new Learning();
        this.metacognition = new Metacognition();

        // -------------------------
        // Self model
        // -------------------------

        this.self = new SelfModel();

        // -------------------------
        // Internal state
        // -------------------------

        this.stepCount = 0;

        this.lastPerception = null;
        this.lastAttention = null;
        this.lastGoal = null;
        this.lastPrediction = null;
        this.lastAction = null;
        this.lastOutcome = null;

        this.history = [];

        console.log("ECHO Brain V3 initialized.");
    }


    // =========================================================
    // MAIN COGNITIVE LOOP
    // =========================================================

    step(input = {}) {

        this.stepCount++;

        // -----------------------------------------------------
        // 1. PERCEPTION
        // -----------------------------------------------------

        const perceptions = this.perceive(input);

        this.lastPerception = perceptions;


        // -----------------------------------------------------
        // 2. ATTENTION
        // -----------------------------------------------------

        const attended = this.focus(perceptions);

        this.lastAttention = attended;


        // -----------------------------------------------------
        // 3. MEMORY RETRIEVAL
        // -----------------------------------------------------

        const memories = this.recall(attended);


        // -----------------------------------------------------
        // 4. PREDICTION
        // -----------------------------------------------------

        const prediction = this.predict(
            attended,
            memories
        );

        this.lastPrediction = prediction;


        // -----------------------------------------------------
        // 5. SURPRISE
        // -----------------------------------------------------

        const surprise = this.calculateSurprise(
            attended,
            prediction
        );


        // -----------------------------------------------------
        // 6. UPDATE SELF / DRIVES
        // -----------------------------------------------------

        this.updateSelf({
            surprise,
            attended
        });


        // -----------------------------------------------------
        // 7. MOTIVATION / GOAL GENERATION
        // -----------------------------------------------------

        const goal = this.generateGoal({
            perceptions: attended,
            memories,
            surprise
        });

        this.lastGoal = goal;


        // -----------------------------------------------------
        // 8. REASONING
        // -----------------------------------------------------

        const decision = this.reason({
            perceptions: attended,
            memories,
            goal,
            prediction,
            surprise
        });


        // -----------------------------------------------------
        // 9. ACTION SELECTION
        // -----------------------------------------------------

        const action = this.selectAction(
            decision,
            goal
        );

        this.lastAction = action;


        // -----------------------------------------------------
        // 10. ACT ON WORLD
        // -----------------------------------------------------

        const outcome = this.act(action);

        this.lastOutcome = outcome;


        // -----------------------------------------------------
        // 11. LEARNING
        // -----------------------------------------------------

        const learningResult = this.learn({
            perception: attended,
            prediction,
            action,
            outcome,
            surprise
        });


        // -----------------------------------------------------
        // 12. MEMORY STORAGE
        // -----------------------------------------------------

        this.remember({
            perception: attended,
            goal,
            action,
            outcome,
            surprise,
            learningResult
        });


        // -----------------------------------------------------
        // 13. METACOGNITION
        // -----------------------------------------------------

        const reflection = this.reflect({
            perception: attended,
            memories,
            goal,
            prediction,
            action,
            outcome,
            surprise
        });


        // -----------------------------------------------------
        // 14. SAVE COMPLETE EXPERIENCE
        // -----------------------------------------------------

        const experience = {

            step: this.stepCount,

            perception: attended,

            memories,

            prediction,

            surprise,

            goal,

            decision,

            action,

            outcome,

            learning: learningResult,

            reflection,

            timestamp: Date.now()
        };


        this.history.push(experience);


        // Prevent infinite memory growth
        if (this.history.length > 1000) {
            this.history.shift();
        }


        // -----------------------------------------------------
        // RETURN ECHO'S CURRENT STATE
        // -----------------------------------------------------

        return {

            step: this.stepCount,

            perception: attended,

            attention: attended,

            memories,

            prediction,

            surprise,

            goal,

            decision,

            action,

            outcome,

            learning: learningResult,

            reflection,

            self: this.getSelfState()
        };
    }


    // =========================================================
    // PERCEPTION
    // =========================================================

    perceive(input) {

        try {

            if (typeof this.perception.process === "function") {
                return this.perception.process(input);
            }

            if (typeof this.perception.perceive === "function") {
                return this.perception.perceive(input);
            }

        } catch (error) {

            console.warn(
                "Perception error:",
                error
            );
        }

        return input;
    }


    // =========================================================
    // ATTENTION
    // =========================================================

    focus(perceptions) {

        try {

            if (typeof this.attention.select === "function") {
                return this.attention.select(perceptions);
            }

            if (typeof this.attention.focus === "function") {
                return this.attention.focus(perceptions);
            }

            if (typeof this.attention.rank === "function") {

                const ranked =
                    this.attention.rank(perceptions);

                return ranked?.[0] || perceptions;
            }

        } catch (error) {

            console.warn(
                "Attention error:",
                error
            );
        }

        return perceptions;
    }


    // =========================================================
    // MEMORY
    // =========================================================

    recall(perception) {

        try {

            if (typeof this.memory.recall === "function") {

                return this.memory.recall(
                    perception
                );
            }

            if (typeof this.memory.retrieve === "function") {

                return this.memory.retrieve(
                    perception
                );
            }

        } catch (error) {

            console.warn(
                "Memory recall error:",
                error
            );
        }

        return [];
    }


    // =========================================================
    // PREDICTION
    // =========================================================

    predict(perception, memories) {

        try {

            if (typeof this.prediction.predict === "function") {

                return this.prediction.predict(
                    perception,
                    memories
                );
            }

        } catch (error) {

            console.warn(
                "Prediction error:",
                error
            );
        }

        return {
            expected: null,
            confidence: 0
        };
    }


    // =========================================================
    // SURPRISE
    // =========================================================

    calculateSurprise(
        perception,
        prediction
    ) {

        try {

            if (
                typeof this.prediction.surprise ===
                "function"
            ) {

                return this.prediction.surprise(
                    perception,
                    prediction
                );
            }

            if (
                typeof this.prediction.calculateSurprise ===
                "function"
            ) {

                return this.prediction.calculateSurprise(
                    perception,
                    prediction
                );
            }

        } catch (error) {

            console.warn(
                "Surprise calculation error:",
                error
            );
        }

        return 0;
    }


    // =========================================================
    // SELF MODEL
    // =========================================================

    updateSelf({
        surprise,
        attended
    }) {

        try {

            if (
                typeof this.self.update ===
                "function"
            ) {

                this.self.update({
                    surprise,
                    perception: attended
                });
            }

        } catch (error) {

            console.warn(
                "Self-model error:",
                error
            );
        }
    }


    // =========================================================
    // MOTIVATION
    // =========================================================

    generateGoal(context) {

        try {

            if (
                typeof this.motivation.generateGoal ===
                "function"
            ) {

                return this.motivation.generateGoal(
                    context
                );
            }

            if (
                typeof this.motivation.getGoal ===
                "function"
            ) {

                return this.motivation.getGoal(
                    context
                );
            }

        } catch (error) {

            console.warn(
                "Motivation error:",
                error
            );
        }


        // Fallback goal

        return {
            type: "explore",
            reason: "No stronger goal available",
            priority: 0.1
        };
    }


    // =========================================================
    // REASONING
    // =========================================================

    reason(context) {

        try {

            if (
                typeof this.reasoning.decide ===
                "function"
            ) {

                return this.reasoning.decide(
                    context
                );
            }

            if (
                typeof this.reasoning.reason ===
                "function"
            ) {

                return this.reasoning.reason(
                    context
                );
            }

        } catch (error) {

            console.warn(
                "Reasoning error:",
                error
            );
        }


        return {

            action: "observe",

            confidence: 0.1,

            reason:
                "No reasoning strategy available"
        };
    }


    // =========================================================
    // ACTION SELECTION
    // =========================================================

    selectAction(
        decision,
        goal
    ) {

        if (!decision) {

            return {
                type: "observe"
            };
        }


        if (decision.action) {

            if (typeof decision.action === "string") {

                return {
                    type: decision.action,
                    goal
                };
            }

            return decision.action;
        }


        if (decision.type) {

            return decision;
        }


        // Final fallback

        return {
            type: "observe",
            goal
        };
    }


    // =========================================================
    // WORLD INTERACTION
    // =========================================================

    act(action) {

        if (!this.world) {

            return {

                success: false,

                action,

                message:
                    "No world connected."
            };
        }


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


        } catch (error) {

            console.error(
                "World action failed:",
                error
            );

            return {

                success: false,

                action,

                error: error.message
            };
        }


        return {

            success: false,

            action,

            message:
                "World does not support actions."
        };
    }


    // =========================================================
    // LEARNING
    // =========================================================

    learn(context) {

        try {

            if (
                typeof this.learning.learn ===
                "function"
            ) {

                return this.learning.learn(
                    context
                );
            }


            if (
                typeof this.learning.update ===
                "function"
            ) {

                return this.learning.update(
                    context
                );
            }

        } catch (error) {

            console.warn(
                "Learning error:",
                error
            );
        }


        return {
            learned: false
        };
    }


    // =========================================================
    // MEMORY STORAGE
    // =========================================================

    remember(experience) {

        try {

            if (
                typeof this.memory.recordEpisode ===
                "function"
            ) {

                return this.memory.recordEpisode(
                    experience
                );
            }


            if (
                typeof this.memory.store ===
                "function"
            ) {

                return this.memory.store(
                    experience
                );
            }


            if (
                typeof this.memory.remember ===
                "function"
            ) {

                return this.memory.remember(
                    experience
                );
            }

        } catch (error) {

            console.warn(
                "Memory storage error:",
                error
            );
        }

        return null;
    }


    // =========================================================
    // METACOGNITION
    // =========================================================

    reflect(context) {

        try {

            if (
                typeof this.metacognition.reflect ===
                "function"
            ) {

                return this.metacognition.reflect(
                    context
                );
            }


            if (
                typeof this.metacognition.evaluate ===
                "function"
            ) {

                return this.metacognition.evaluate(
                    context
                );
            }

        } catch (error) {

            console.warn(
                "Metacognition error:",
                error
            );
        }


        return {

            confidence: 0,

            reflection:
                "Unable to reflect."
        };
    }


    // =========================================================
    // SELF STATE
    // =========================================================

    getSelfState() {

        try {

            if (
                typeof this.self.getState ===
                "function"
            ) {

                return this.self.getState();
            }

        } catch (error) {

            console.warn(
                "Self state error:",
                error
            );
        }


        return {

            curiosity: 0,

            energy: 1,

            stress: 0
        };
    }


    // =========================================================
    // HISTORY
    // =========================================================

    getHistory() {

        return this.history;
    }


    // =========================================================
    // RESET
    // =========================================================

    reset() {

        this.stepCount = 0;

        this.lastPerception = null;
        this.lastAttention = null;
        this.lastGoal = null;
        this.lastPrediction = null;
        this.lastAction = null;
        this.lastOutcome = null;

        this.history = [];

        console.log(
            "ECHO cognitive state reset."
        );
    }
}


export default EchoBrainV3;
