# Agents Instructions

- **Root_Folder**: /
- **Agents_Folder**: .agents
- **Agents_file**: AGENTS.md
- **Project_Folder**: project

## Product Overview

AstroBookings Angular client is a frontend for rocket launch bookings.

- It uses the API at http://localhost:3000 as the source of truth.
- API docs live in project/api for briefing, routes, and model contracts.
- The app covers rockets, launches, customers, and bookings.

## Technical Implementation

### Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: Angular21
- **Database**: None on client side, Rest API at Localhost:3000
- **Security**: No auth required at this stage
- **Testing**: Angular unit and component tests
- **Logging**: Browser console and Angular error handling

### Development workflow

```bash
# Set up the project
npm install
# Build/Compile the project
npm run build
# Run the project
npm start
# Test the project
npm test
# Deploy the project
TBD by environment
```

### Folder structure
```text
.                         # Project root
├── AGENTS.md             # This file with instructions for AI agents
├── .agents/              # Agents related files (skills, specs, etc)
│   ├── agents/           # Specific agent definitions
│   ├── prompts/          # Reusable prompts directory
│   └── skills/           # Custom agent skills
├── project/              # Project related files (specs, plans, docs)
│   ├── api/              # API briefing, endpoints, and model contracts
│   └── briefing.md       # Project briefing document
```

## Environment
- **OS dev**: Windows
- **Terminal**: bash
- **Git remote**: TBD
- **Default branch**: main

## Behavior Guidelines

- Code and documentation must be in English.
- Chat responses must be in the language of the user prompt.
- Replace template placeholders with project values.
- Treat API contracts as source of truth.

### Naming Conventions

Use slugs with hyphens for non code file names when practical.

Use these prefixes for specs, branches, and commit messages:

- `feat` : New features or significant changes.
- `fix` : Bug fixes or minor improvements.
- `chore` : Routine tasks and maintenance.
