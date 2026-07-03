# AI Agent Instructions for ResumeJobMatcher

## Project overview
- Backend Node.js API project located under `server/`.
- Uses Express 5, Mongoose, JWT auth, bcrypt password hashing, dotenv, and CORS.
- There is no frontend code in this repository.

## Key entry points
- Start the server from `server/` with `npm start`.
- Primary application file: `server/server.js`.
- MongoDB connection: `server/config/db.js`.
- Authentication routes: `server/routes/authRouter.js`.
- Controller logic: `server/controllers/authController.js`.
- User schema: `server/models/user.js`.
- Auth middleware: `server/middlewares/authMiddleware.js`.

## Conventions
- CommonJS modules (`require` / `module.exports`).
- Async/await for database and auth operations.
- Environment variables expected in `.env`:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `PORT`
- No tests are currently present; avoid assuming test coverage.

## What to do first
- Use the `server/package.json` scripts for build/run commands.
- Inspect `server/server.js` for middleware and route registration.
- Preserve existing auth flow when modifying authentication or protected endpoints.

## When adding features
- Keep backend logic within `server/`.
- Route handlers should delegate business logic to controllers.
- Use `authMiddleware` for protected routes.
- Add new model files under `server/models/` and keep schema definitions isolated.

## Notes
- `README.md` exists but is empty, so do not rely on repository docs for implementation details.
- If you need to change environment settings, add or update `.env.example` instead of `.env`.
