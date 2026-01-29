# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

ECOdometer is a Next.js 16.1.6 application using React 19, TypeScript, Tailwind CSS 4.x, and DaisyUI 5.x for UI components. The project follows the App Router architecture (not Pages Router).

## Development Commands

### Starting the development server
```bash
npm run dev
```
The app runs at http://localhost:3000 with hot reload enabled.

### Building for production
```bash
npm run build
```

### Starting production server
```bash
npm start
```

### Linting
```bash
npm run lint
```

## Architecture

### App Router Structure
This project uses Next.js App Router (not Pages Router). All routes are defined in the `app/` directory:
- `app/page.tsx` - Home page
- `app/layout.tsx` - Root layout with global navbar and font configuration
- `app/login/page.tsx` - Login page
- `app/globals.css` - Global styles with Tailwind CSS and DaisyUI

### Styling Setup
- **Tailwind CSS 4.x**: Uses the new `@import "tailwindcss"` syntax in globals.css (not the old @tailwind directives)
- **DaisyUI**: Component library loaded via `@plugin "daisyui"` in globals.css
- **Fonts**: Uses Geist Sans and Geist Mono via next/font/google
- **Theme**: CSS variables defined in globals.css with dark mode support via `prefers-color-scheme`
- **Path alias**: `@/*` maps to the root directory (configured in tsconfig.json)

### TypeScript Configuration
- Strict mode enabled
- JSX configured as "react-jsx" (not "preserve")
- Module resolution: "bundler"

### Key Dependencies
- Next.js 16.1.6 with React 19
- Tailwind CSS 4.1.18 (note: v4.x has breaking changes from v3.x)
- DaisyUI 5.5.14
- TypeScript 5.x
