
# UniForge

UniForge is a web platform that helps university students discover projects, find teammates, and explore hackathons.

## Technologies

- HTML
- CSS
- JavaScript
- Node.js
- JSON Server (Mock REST API)

## How to Run

### 1. Install dependencies

Install Node.js, then open a terminal in the project root folder and run:

```bash
npm install
```

### 2. Start the API server

Run:

```bash
npx json-server db.json
```

The API will be available at:

http://localhost:3000/projects

### 3. Open the frontend

Open `frontend/start.html` in a web browser.

Keep the API server running while using the website.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /projects | Retrieve all projects |
| POST | /projects | Create a new project |

## Features

- View available student projects
- Create and publish new projects
- Browse hackathon information
- Communicate with a mock backend using HTTP GET and POST requests

## API Demonstration

1. Start JSON Server.
2. Open the UniForge website.
3. Existing projects are loaded using GET.
4. Click "New Post" and fill out the form.
5. Click "Publish" to send a POST request.
6. Open http://localhost:3000/projects to verify that the new project was saved.
