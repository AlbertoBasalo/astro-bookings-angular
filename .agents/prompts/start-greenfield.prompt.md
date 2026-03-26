---
name: start-greenfield
description: Initial prompt to start a new project in a greenfield context with the Architect orchestrator
argument-hint: Provide a briefing or project context to start a new greenfield project.
agent: Architect
---

# Starting a new greenfield project

Work with the user by using the #tool:vscode/askQuestions to elicit the project context, user needs, and requirements.

Then call your subagents to generate the PRD, ADD, and specs.

## Context

- Read the current project briefing or any context provided by the user.
- Ask questions to clarify the project goals, user needs, and requirements.

## Output

- PRD file with the product requirements and user needs.
- ADD file with the architectural design decisions.
- specs folder with all specs needed to start implementation