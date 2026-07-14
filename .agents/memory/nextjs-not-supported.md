---
name: Next.js requests on this platform
description: What to do when a user asks for a Next.js app -- this platform's artifact system has no Next.js artifact type.
---

When a user asks for a Next.js (App Router) app, the artifact system only supports these web-capable types: `expo`, `react-vite`, `slides`, `video-js` (no `nextjs`). Ask the user to choose between forcing a manual/unsupported Next.js setup or using React + Vite instead.

**Why:** React + Vite is a first-class supported artifact type with full preview/deploy/workflow support; Next.js has no scaffold or artifact-type integration on this platform.

**How to apply:** If the user accepts React + Vite, adapt their requested folder conventions as closely as possible (e.g. `/app` → `src/pages/` + `src/App.tsx` router via `wouter`, `lib/firebase.ts` → `src/lib/firebase.ts`) rather than trying to replicate Next.js App Router file-based routing.
