# Agents Manifest

Paths and descriptions for agent-related files and directories in the project.

# PROJECT MAP 

## Root folder

Available Values: `/`
{Root_Folder} : `/`

## Agent based folders

Available Values: `.agents` | `.claude` | `.codex` | `.cursor` | `.github` 
{Agents_Folder} : `.agents` 


## Project context folders

Available Values: `context` | `project` | `docs`
{Project_Folder}: `project` 

## {Variables}

{Manifest_File}: `{Agents_Folder}/manifest.md` 
{Specs_Folder}: `{Project_Folder}/specs`
{Plans_Folder}: `{Project_Folder}/specs` 

## Folder Structure

```txt
/                            # Root directory of the project
├── AGENTS.md                # General documentation about agents in the project
├── CHANGELOG.md             # Main project changelog (released features and changes)
├── README.md                # Main project README
├── {Agents_Folder}/         # Agent configuration folder
│   ├── manifest.md          # Path dictionary (this file)
│   ├── agents/              # Specific agent definitions
│   ├── prompts/             # Reusable prompts directory
│   └── skills/              # Skill definitions directory
└── docs/                    # Human documentation (User manuals, guides, etc.)
└── {Project_Folder}/        # Project documentation (Product and architecture)
    ├── ADD.md               # Architecture Design Document
    ├── briefing.md          # Project briefing
    ├── ERM.md               # Entity-Relationship Model
    ├── PRD.md               # Product Requirements Document
    ├── ROADMAP.md           # Product Roadmap and Milestones
    └── specs/               # Specifications and plans
        ├── *.spec.md        # Detailed specifications for features 
        └── *.plan.md        # Implementation plans for features
```