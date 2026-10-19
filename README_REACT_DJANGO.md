# Hospital Management — React + Django

The project is split into two parts:

- `frontend/`: React + Vite user interface (doctors, patients, appointments and dashboard).
- Django project at the root: existing models, SQLite database, admin and Django REST API.

The React development server proxies `/api` and `/media` to Django at `http://127.0.0.1:8000`.

## Requirements

- Python 3.10+
- Node.js 20.19+ or 22.12+

## 1. Start Django backend

Open a terminal in the `Hospital_Management` project root (the folder containing `manage.py`):

```bash
python -m venv .venv
```

Activate the environment:

**Windows PowerShell**
```powershell
.\.venv\Scripts\Activate.ps1
```

**Windows Command Prompt**
```bat
.venv\Scripts\activate.bat
```

Install dependencies and run migrations:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
python manage.py check
python manage.py migrate
python manage.py runserver
```

Django runs at `http://127.0.0.1:8000/`. Keep this terminal open.

If you already have a virtual environment and installed dependencies, activate it and run only the install/check/migrate/runserver commands as needed. Back up `db.sqlite3` before applying migrations to an existing database.

## 2. Start React frontend

Open a **second** terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL Vite prints (normally `http://localhost:5173/`). Keep both terminals open.

## 3. Build the React frontend

From the `frontend` folder:

```bash
npm run build
```

The production build is generated in `frontend/dist/`. The supplied Vite proxy is for local development; production deployment needs the frontend and API to be hosted/configured appropriately.

## API endpoints used by React

- `GET/POST /api/doctors/`; `GET/PUT/DELETE /api/doctors/<id>/`
- `GET/POST /api/patients/`; `GET/PUT/DELETE /api/patients/<id>/`
- `GET/POST /api/appointments/`; `GET/PUT/DELETE /api/appointments/<id>/`

## Notes

- The original Django template pages and admin are retained.
- The React UI uses the existing Django REST API for CRUD operations. Existing records remain in the project's SQLite database.
- Appointment creation through the API can leave the optional linked Django user empty; the existing template-based workflow is retained as well.
- If `python` is not recognized on Windows, try `py` in place of `python`.
