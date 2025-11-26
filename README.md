<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

 High-Performance Portfolio PWA with Apple-Style UI & Gemini AI

This commit establishes the foundational architecture for a personal portfolio web application built with React 19, TypeScript, and Tailwind CSS. The project focuses on high performance, modern "Apple-like" aesthetics, and AI integration.

Key Features Implemented:

Core UI & Architecture (App.tsx, index.tsx, index.html):
React 19 & TypeScript: Set up a strongly typed React application using the latest React 19 features (Hooks).
Apple-Style Aesthetic: Implemented a clean, minimalist design using Glassmorphism (frosted glass effects on nav/cards), custom Tailwind animations (fade-in-up), and system fonts.
Responsive Layout: Created a mobile-first responsive design for the Hero, About, Experience, Skills, and Education sections.
Performance & Graphics (App.tsx):
WebGL Shader Background: Integrated a custom ShaderBackground component that renders a GPU-accelerated "Aurora/Mesh Gradient" effect using raw WebGL. This provides a high-quality, fluid background animation (60fps) without the performance cost of video assets.
Generative AI Integration (App.tsx):
Gemini Chat Widget: Built a floating "AI Assistant" chat interface powered by the @google/genai SDK and the Gemini 2.5 Flash model.
Context-Aware: Configured the AI with a custom "System Instruction" that injects the user's resume data, allowing the bot to answer specific questions about Rick's experience and skills.
Data Management (constants.ts, types.ts):
Structured Data: Decoupled content from presentation by moving all resume data (Experience, Skills, Education) into a centralized constants.ts file.
Type Safety: Defined clear TypeScript interfaces (ExperienceItem, ChatMessage) to ensure data integrity across the app.
PWA (Progressive Web App) Foundation (serviceWorker.js, manifest.json):
Offline Support: Added a Service Worker (serviceWorker.js) to cache critical assets (index.html, manifest.json) for offline access.
Installability: Configured a manifest.json with Data URI icons to allow users to install the portfolio to their home screen on mobile devices.
Correct Registration: Implemented robust Service Worker registration in index.tsx using import.meta.url to ensure correct path resolution during build.
Functional Enhancements:
Download Resume: Added a button that triggers window.print() for easy PDF generation.
Smooth Navigation: Implemented smooth scrolling anchor links for the top navigation bar.
