# Aapda Matrix — Disaster Response Web App

Responsive React + Vite application using JavaScript, Leaflet / React-Leaflet, Lucide icons, and a dark command-center UI. Includes citizen, rescuer and admin demo workspaces. An optional FastAPI service is included for API-backed incident storage.

## Requirements
- Node.js 20.19+ or 22.12+ recommended
- npm
- Python 3.10+ only if running the optional API

## Run the frontend (mock-data mode)
1. Extract the ZIP.
2. Open the `aapda-matrix` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Open the URL Vite prints, usually `http://localhost:5173`.
6. Select Citizen, Rescuer, or Command Center. No password is needed in demo mode.

Mock incident updates are saved in browser localStorage. Use the role switch button to change workspaces. GPS requires browser permission and localhost/HTTPS. Map tiles need an internet connection.

## Optional FastAPI backend
The frontend defaults to local mock data so it can be demoed without a backend. The included API is a separate prototype service; it stores incidents in memory and resets when restarted.

Windows PowerShell:
```powershell
cd backend
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
macOS/Linux:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Open `http://localhost:8000/docs` to explore the API (`GET /api/health`, `GET/POST /api/incidents`, `PATCH /api/incidents/{incident_id}`). The current frontend remains in mock mode; connecting the UI to the API is a separate integration step and is intentionally not claimed as already wired.

## Feature guide
- **Citizen:** dashboard, confirm SOS flow, GPS attempt, emergency type, report disaster, incident alerts, live map, shelters and hospitals, 112 call link.
- **Rescuer:** incoming SOS queue, accept/responding and resolve controls, incident map.
- **Command Center:** incident KPIs, map, live incident feed, agency status and shelter capacity.
- **PWA foundation:** web app manifest is included. For full offline installation/caching, add a service worker and test on HTTPS; maps and external tiles are not offline-capable.

## Important limitations
This is an academic demonstration, not an emergency service. It does not notify real police, Fire services, NDRF, or 112. Sample incident coordinates and agency statuses are mock data. Do not use it for real-world dispatch without authentication, durable database storage, audit logging, security review, privacy controls, and authorized emergency-service integrations.
