# Focus

Focus is a high-performance productivity web application featuring a beautiful, Wayland-inspired layout with a dynamic widget system. It provides a modular environment where each feature is encapsulated as a "mini-app" (widget) that can be dragged, dropped, and organized according to your workflow.

## ✨ Key Features

-   **Modular Widget System**: Add, remove, and arrange widgets on a flexible grid.
-   **Advanced Drag & Drop**: Intuitive layout management similar to modern tiling window managers.
-   **Local Persistence**: All data is stored locally using **IndexedDB (via Dexie)**, ensuring your data stays private and persists across sessions.
-   **Glassmorphism UI**: A premium, modern design with backdrop blurs and sleek Shadcn UI components.
-   **Responsive & Fast**: Built with Vite and React for near-instant load times.

## 🛠️ Built-in Widgets

### 1. 🌦️ Advanced Weather
-   **Current Conditions**: Temperature, humidity, and wind speed.
-   **Hourly Forecast**: Scrollable 24-hour weather prediction.
-   **City Search**: Search and save multiple locations worldwide.

### 2. 🍅 Pomodoro Timer
-   **Task Focus**: Link sessions to specific tasks.
-   **Custom Cycles**: Adjustable work and break durations.
-   **Weekly Stats**: Visual bar chart tracking your focus time over the last 7 days.
-   **Browser Notifications**: Stay alerted when your session ends.

### 3. 📝 Advanced Notes
-   **Multiple Notes**: Manage an unlimited number of notes in a single widget.
-   **Markdown Support**: Toggle between edit mode and a clean Markdown preview.
-   **Color Categories**: Organize notes with custom background colors.

### 4. 🔢 Advanced Calculator
-   **Scientific Mode**: Support for `sin`, `cos`, `tan`, `sqrt`, `log`, and more.
-   **Unit Converter**: Quickly convert Length (m, ft, cm, in) and Weight (kg, lb, oz).
-   **History**: Keeps track of your recent calculations.

### 5. ✅ Todo List
-   Seamlessly manage your daily tasks with persistence.

### 6. ⏰ Clock
-   Beautifully displayed time and date to keep you on track.

## 🚀 Tech Stack

-   **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
-   **State & Data**: [TanStack Query](https://tanstack.com/query/latest), [Dexie.js](https://dexie.org/) (IndexedDB)
-   **Router**: [TanStack Router](https://tanstack.com/router/latest)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites
- Node.js (Latest LTS)
- pnpm

### Installation
1. Clone the repository
2. Install dependencies:
    ```bash
    pnpm install
    ```
3. Start the development server:
    ```bash
    pnpm dev
    ```

## 🏗️ Architecture

Widgets are registered in `src/features/widgets/registry.tsx` and rendered via the `WidgetRenderer`. Each widget is a self-contained feature located in `src/features/widgets/[widget_name]`.