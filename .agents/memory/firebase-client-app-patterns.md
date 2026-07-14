---
name: Firebase-backed React+Vite app patterns
description: Data modeling and testing patterns for apps that use Firebase Auth/Firestore/Storage as the backend instead of the workspace's Postgres+API server.
---

For artifacts where Firebase (not the workspace's Postgres/Drizzle DB or Express API server) is the backend:

- Firebase web config values (apiKey, authDomain, etc.) are public identifiers, safe to store as plain shared env vars (`VITE_FIREBASE_*`), not secrets.
- Role-based multi-user apps (e.g. teacher/student) store the role on a Firestore `users/{uid}` doc keyed by the Firebase Auth uid, read via `onAuthStateChanged` into a React context (`AuthContext`) that also exposes `login`/`register`/`logout`. Route guards redirect by comparing the profile's role to the required role.
- Firestore queries with two or more `where(..., "==", ...)` equality filters do NOT require a manual composite index (only needed when mixing equality with range/orderBy on a different field, or array-contains-any combos) -- safe to use freely for filtering by e.g. `classId` + `date`.
- To verify a Firebase-backed feature end-to-end without browser interaction, write a throwaway Node script *inside* the artifact directory (so `node script.mjs` resolves the installed `firebase` package) that calls the same client SDK functions (`createUserWithEmailAndPassword`, Firestore CRUD) against the real project using the same `VITE_FIREBASE_*` env vars (available as plain `process.env` vars in Node, not just via `import.meta.env`), then deletes its own test data. This catches security-rule/permission problems before manual testing and doesn't require faking data.
