---
name: Laravel-Inspired System Architecture
description: Rules for codebase structure and where different types of files belong in this FastAPI + React application.
---

# Laravel-Inspired System Architecture

Welcome to the **ClearPath** codebase! This project uses a **monolithic repository structure** heavily inspired by Laravel, but it runs on **FastAPI (Python)** and **React (TypeScript/Vite)**.

You must follow these strict directory layout rules whenever you create, modify, or move files.

## 🚨 CRITICAL RULE 🚨
**Never create a standalone `frontend/` or `backend/` directory.** The codebase is fully unified at the root level. 

## 1. Backend Rules (Python / FastAPI)
The Python application lives entirely at the root, masquerading as Laravel directories:
- **`app/`**: Contains core Python logic.
  - `app/models/`: SQLAlchemy ORM definitions.
  - `app/schemas/`: Pydantic validation schemas.
  - `app/core/`: Configuration, security, dependencies.
  - `app/services/`: Core business logic.
- **`routes/`**: Contains FastAPI API router modules (e.g., `routes/auth.py`, `routes/api.py`).
  - Previously referred to as `backend/app/routers`, it is now strictly `routes/` at the root.
- **`database/`**: Alembic configuration and migrations (this replaced the legacy `alembic` directory).

## 2. Frontend Rules (React / TypeScript / Vite)
The Vite configuration and package scripts rest at the project root. The actual source code mimics Laravel's asset layout:
- **`resources/js/`**: Contains the entirety of the React source code.
  - **`resources/js/pages/`**: React page components.
  - **`resources/js/components/`**: Reusable UI components.
  - **`resources/js/main.tsx`**: The Vite entry point.
- **`public/`**: Contains static assets like `index.html`, SVGs, and images.

## 3. Configuration & Entry Points
- Node.js dependencies: `package.json` (at root)
- Frontend build tool: `vite.config.ts` (at root)
- Python dependencies: `requirements.txt` and `pyproject.toml` (at root)
- Python entrypoint: usually executed from root via `uvicorn app.main:app`

When adding a new feature, refer to the `FEATURE_IMPLEMENTATION.md` for the blueprint, but substitute `backend/app/` with `app/` and `frontend/src/` with `resources/js/`.
