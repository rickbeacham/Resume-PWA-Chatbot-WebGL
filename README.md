This foundational commit establishes the architecture for a personal portfolio web application built with React 19, TypeScript, and Tailwind CSS. The focus is on high performance, modern "Apple-like" aesthetics (Glassmorphism), and robust AI integration.

### ✨ Key Features & Architecture

* **Core UI & Stack:** Setup a strongly typed React 19 application using **TypeScript** and **Tailwind CSS**.
* **Apple-Style Aesthetic:** Implemented a clean, **Glassmorphism** UI (frosted glass effects), custom Tailwind animations, and system fonts.
* **Responsive Design:** Created a mobile-first layout for all core sections (Hero, About, Experience, Skills, Education).

### 🚀 Performance & Graphics

* **WebGL Shader Background:** Integrated a custom `ShaderBackground` component that renders a GPU-accelerated **"Aurora/Mesh Gradient"** effect using raw WebGL, providing a fluid 60fps animation without the cost of video assets.

### 🤖 Generative AI Integration

* **Gemini Chat Widget:** Built a floating "AI Assistant" chat interface powered by the **`@google/genai` SDK** and the **Gemini 2.5 Flash** model.
* **Context-Aware:** Configured the AI with a custom **System Instruction** that injects resume data, enabling the bot to answer specific questions about the user's experience and skills.

### 💾 Data & Type Safety

* **Structured Data:** Decoupled content from presentation by moving all resume data (Experience, Skills, Education) into a centralized `constants.ts` file.
* **Type Safety:** Defined clear TypeScript interfaces (`ExperienceItem`, `ChatMessage`) to enforce data integrity across the application.

### 🌐 PWA (Progressive Web App) Foundation

* **Offline Support:** Added a **Service Worker** (`serviceWorker.js`) to cache critical assets (`index.html`, `manifest.json`) for offline access.
* **Installability:** Configured a `manifest.json` with Data URI icons to allow installation to mobile home screens.
* **Correct Registration:** Implemented robust Service Worker registration in `index.tsx` using `import.meta.url` for correct path resolution.

### ➕ Functional Enhancements

* Added a "Download Resume" button triggering `window.print()` for easy PDF generation.
* Implemented smooth scrolling anchor links for the top navigation bar.
