# JB Music Search

JB Music Search is a full-stack music discovery application built with React, Node.js, Express, MySQL, and Sequelize. Users authenticate through Google, receive a one-hour JSON Web Token (JWT), and search for songs, artists, and albums using protected API routes.

The project was originally planned around Spotify authentication. When Spotify developer access required a Premium account, the instructor approved replacing Spotify authentication with Google OAuth. Music results are provided through the iTunes Search API.

## Features

- Responsive React frontend
- Google OAuth 2.0 authentication
- One-hour JWT authentication sessions
- SHA-256 token hashing before database storage
- MySQL-backed session validation
- Automatic JWT refresh before expiration
- Protected frontend and backend routes
- Music search by song, artist, or album
- Real track, artist, album, artwork, genre, and duration data
- Clear loading, empty, success, and error states
- Desktop and mobile layouts
- Links to matching tracks on iTunes

## Technology

### Frontend

- React
- Vite
- JavaScript
- CSS
- Fetch API
- Browser session storage

### Backend

- Node.js
- Express
- Passport.js
- Google OAuth 2.0
- JSON Web Tokens
- MySQL
- Sequelize
- SHA-256 hashing
- iTunes Search API

## Project Structure

```text
spotify-search-app/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js 20.19 or newer
- npm
- MySQL 8.4
- Git
- A Google OAuth web application

## Getting Started

Clone the repository:

```bash
git clone https://github.com/brownjustin-fs-1/spotify-search-app.git
cd spotify-search-app
```

Install the backend dependencies:

```bash
cd backend
npm install
```

Install the frontend dependencies:

```bash
cd ../frontend
npm install
```

## Database Setup

Start MySQL and create the project database:

```sql
CREATE DATABASE jb_music_search;
```

Create an application user with a private password:

```sql
CREATE USER 'jb_app'@'%' IDENTIFIED BY 'your-private-password';
```

Grant access to the project database:

```sql
GRANT ALL PRIVILEGES ON jb_music_search.* TO 'jb_app'@'%';
FLUSH PRIVILEGES;
```

Sequelize creates the `auth_sessions` table when the backend starts.

## Backend Environment Variables

Create `backend/.env`:

```env
PORT=3001

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

JWT_SECRET=your-private-jwt-secret

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=jb_music_search
DB_USER=jb_app
DB_PASSWORD=your-database-password

FRONTEND_URL=http://localhost:5173
```

The backend `.env` file is ignored by Git and must never be committed.

## Frontend Environment Variables

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3001
```

The frontend `.env.local` file is also ignored by Git.

## Google OAuth Setup

Create a Google OAuth web application and configure this authorized redirect URI:

```text
http://localhost:3001/auth/google/callback
```

If the Google application is in testing mode, add the development Google account as a test user.

## Running the Application

Start MySQL before starting the backend.

In the first terminal:

```bash
cd backend
npm run dev
```

The backend should report:

```text
Database connected
Server running on port 3001
```

In a second terminal:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

## Authentication Flow

1. An unauthenticated visitor sees the login screen.
2. The user selects **Continue with Google**.
3. Google returns the authenticated profile to the Express backend.
4. The backend creates a one-hour JWT.
5. Only a SHA-256 hash of the JWT is stored in MySQL.
6. The browser returns to the React frontend with the JWT in the URL fragment.
7. React stores the token in session storage and removes it from the address bar.
8. React validates the token signature, expiration, and database session.
9. A valid user enters the protected music-search interface.
10. Missing, expired, invalid, or unknown sessions return to the login screen.
11. The frontend requests a replacement JWT five minutes before expiration.

## API Routes

### Public Routes

| Method | Route                   | Purpose                                         |
| ------ | ----------------------- | ----------------------------------------------- |
| GET    | `/`                     | Confirms that the backend is running            |
| GET    | `/api/status`           | Confirms that the API is available              |
| GET    | `/auth/google`          | Starts Google authentication                    |
| GET    | `/auth/google/callback` | Handles the Google OAuth response               |
| GET    | `/auth/failure`         | Returns authentication failures to the frontend |

### Protected Routes

| Method | Route                      | Purpose                                        |
| ------ | -------------------------- | ---------------------------------------------- |
| GET    | `/api/session`             | Validates the JWT and database session         |
| GET    | `/api/profile`             | Returns the authenticated Google profile       |
| GET    | `/api/music/search?q=term` | Searches for matching music                    |
| POST   | `/auth/refresh`            | Replaces a valid JWT with a new one-hour token |

Protected routes require this request header:

```text
Authorization: Bearer your-jwt
```

## Music Search

The backend sends protected music queries to Apple’s [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/).

Search responses are normalized before being returned to the frontend. Each result may include:

- Track name
- Artist name
- Album name
- Cover artwork
- Genre
- Duration
- Explicit-content status
- Official iTunes link

## Verification

Run the frontend linter:

```bash
cd frontend
npm run lint
```

Create a production frontend build:

```bash
npm run build
```

Check the backend route syntax:

```bash
cd ..
node --check backend/routes/api.js
node --check backend/routes/auth.js
```

The completed application was also tested for:

- Successful Google authentication
- Missing browser token
- Expired database session
- Protected profile access
- Protected music search
- Successful and empty search states
- Desktop layout
- Mobile layout

## Security Notes

- Credentials are stored only in ignored environment files.
- Usable JWTs are never stored in MySQL.
- JWT hashes use SHA-256.
- Protected requests require both a valid JWT and an active database session.
- Callback tokens are removed from the browser address bar immediately.
- Browser tokens are stored only for the current tab.
- Invalid sessions force the user back to login.

## Repository

[GitHub Repository](https://github.com/brownjustin-fs-1/spotify-search-app)
