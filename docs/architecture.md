# ECHO Architecture v0.3

The system is divided into Brain, World, and Adapter layers.

Brain:
Perception → Attention → Memory Retrieval → Motivation → Reasoning → Prediction → Action → Metacognition → Learning.

World:
Provides objects and consequences.

Adapter:
Connects the same brain to a browser renderer now and a future game engine later.

Design principle: no renderer-specific code inside `core/`.
