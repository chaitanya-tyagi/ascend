# ASCEND — The Grid Awaits

**An interactive career-discovery prototype built around skill exploration, adaptive-style assessments, and game-inspired progression.**

Ascend explores a different way to approach career discovery: instead of presenting users with a static list of career options, it places them in an interactive world where they can explore skill paths, answer assessment questions, and engage with decision-making challenges.

The project combines a custom isometric environment with a multi-stage onboarding experience and prototype assessment logic.

> **Project status:** In development. This repository contains an early-stage frontend prototype. Assessment logic, scoring, and authentication are not production-ready.

## Features

- **Guided onboarding:** A multi-stage entry flow with account-form UI and education-profile selection.
- **Adaptive-style assessment:** A sample assessment that adjusts question difficulty based on previous answers.
- **Skill signals:** Prototype calculations that summarize responses across mathematics, programming, and analytical reasoning.
- **Decision-making challenge:** A resource-allocation scenario designed to explore prioritization, strategic reasoning, and risk-related choices.
- **Interactive world navigation:** A custom isometric map with an avatar, waypoints, challenge nodes, and locked areas.
- **Progression interface:** A status view that brings together signals generated during the current session.
- **Custom visual design:** A dark, minimal interface with crimson accents, custom SVG elements, and animated transitions.

## Tech Stack

- **Framework:** Next.js
- **UI:** React and TypeScript
- **Styling:** Tailwind CSS
- **Graphics:** SVG-based interface and world elements
- **Icons:** Lucide

## Getting Started

### Prerequisites

- Node.js compatible with the project's Next.js version
- pnpm

### Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/chaitanya-tyagi/ascend.git
cd ascend
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

To create and run a production build:

```bash
pnpm build
pnpm start
```

## Current Limitations

Ascend is an experimental prototype, and several parts of the experience are simplified:

- **Authentication:** The account interface is a mock implementation; it does not provide real account creation or authentication.
- **Data persistence:** User progress is held in client-side state and is not saved across sessions.
- **Assessment validity:** Questions, difficulty adjustments, and skill signals are prototype logic, not validated measures of ability.
- **Decision scoring:** Challenge outcomes use simplified rules intended to demonstrate the interaction flow.
- **World progression:** Some areas are locked placeholders for future development.

The prototype should not be interpreted as a validated career assessment or a reliable measure of job readiness.

## Future Development

Potential areas for further development include persistent user profiles, backend authentication, expanded skill paths, evidence-based progression, more sophisticated assessment methods, and additional explorable areas.

These are future directions rather than claims about existing functionality.

## Motivation

Ascend is an independent project exploring how interactive environments and structured progression could make skill discovery and career exploration more engaging.

The long-term goal is to connect exploration, skill development, and opportunity readiness within a single experience.
