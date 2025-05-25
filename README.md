# Volley Insights

## Project Overview
Volley Insights is a client-side web application designed for volleyball coaches and enthusiasts to track and analyze game statistics. It allows for detailed real-time event recording, player performance tracking, and post-game statistical review. The application is a Progressive Web App (PWA), enabling offline use and installation on the user's home screen.

## Key Features
*   **Team Management**: Create teams, add/edit players (name, shirt number, role).
*   **Game Creation**: Set up games with details like opponent, date, and location.
*   **Live Game Recording**:
    *   Dynamic scoreboard, serving indicator, and rotation tracker.
    *   Input for various event types: serves (including aces, errors), receptions (perfect, good, poor, error), sets (good, neutral, poor, error, point), spikes (kill, error, blocked, in-play), blocks (point, error, touch), and digs (good, error, cover). Supports simple and advanced detail levels for event input.
    *   Player substitutions with tracking.
    *   Undo/redo functionality for recorded events.
*   **Statistical Analysis**:
    *   View statistics per set or for the entire game.
    *   Individual player statistics, including basic counts (e.g., total serves, total attacks) and advanced metrics (e.g., serving efficiency, attack percentage, reception rating).
    *   Team-level statistics summarizing overall performance.
    *   Visualizations using charts (e.g., pie charts for serve types, bar charts for attack targets and results).
*   **PDF Export**: Export comprehensive game and player statistics to a PDF document with options for customization (e.g., selecting specific sets or players).
*   **Customizable Game View**: Users can show or hide different sections of the game recording interface (e.g., rotation display, event log) to suit their preferences.
*   **Multi-language Support**: The application interface is available in English, French, and Arabic.

## Architecture & Technology Stack
*   **Frontend Framework**: Vue.js 3 (utilizing both Composition API for newer components and Options API for some older ones).
*   **Routing**: Vue Router, with lazy loading implemented for most routes to improve initial load time.
*   **Styling**: Tailwind CSS (with Just-In-Time (JIT) compilation for production builds to optimize CSS size).
*   **State Management**: Primarily relies on local component state and props/events for communication between components. Game and team data is persisted in the browser's `localStorage`.
*   **Internationalization (i18n)**: Vue I18n is used to provide multi-language support.
*   **Charting**: Chart.js and its Vue wrapper `vue-chartjs` are used for data visualization.
*   **Progressive Web App (PWA)**: Configured to allow for offline access and "add to home screen" functionality on supported devices.

## Project Structure
The project follows a standard Vue CLI structure:
*   `public/`: Contains static assets like `index.html`, icons, and manifest files for the PWA.
*   `src/`: Main application source code.
    *   `src/assets/`: Static assets used by the application (e.g., images, global CSS files).
    *   `src/components/`: Reusable Vue components, typically categorized by feature or view (e.g., `Game` for game recording, `StatScreen` for statistics display, `Team` for team management, `common` for generic UI elements).
    *   `src/locales/`: Translation files (JSON format) for each supported language (English, French, Arabic).
    *   `src/router/`: Vue Router configuration, defining application routes and component mappings.
    *   `src/views/`: Top-level Vue components that serve as pages for the defined routes.
    *   `src/main.js`: The entry point for the Vue application, where the Vue instance is initialized and global plugins are mounted.
    *   `src/App.vue`: The root Vue component of the application.

## Getting Started / How to Use

### For End Users
After the application is hosted or served locally, navigate to it in your web browser.
1.  Start by creating a team and adding players to your roster.
2.  Once a team is set up, you can create a new game.
3.  During the game, use the live recording interface to track scores, player rotations, and specific volleyball events.
4.  After the game, or at any point during it, you can view detailed statistics for the team and individual players.
5.  Use the PDF export feature to generate reports.

As a PWA, you can also install Volley Insights on your device for quick access and offline use.

### For Developers

#### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```
Navigate to the application in your browser (typically `http://localhost:8080`).

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## License
This project is currently unlicensed. All rights reserved.
