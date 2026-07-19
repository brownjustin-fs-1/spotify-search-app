# JB Music Search App

## Project Overview

JB Music Search is a full-stack music search project with a Node.js and Express backend. The original project plan used Spotify authentication, but Spotify’s updated developer requirements require Premium access. With instructor approval, the project now uses Google OAuth for authentication.

The backend authenticates users with Google, creates a JSON Web Token (JWT), and saves a secure hash of that token in a MySQL database using Sequelize.

## Current Features

- Google OAuth 2.0 authentication
- Express authentication routes
- One-hour JWT creation after successful authentication
- MySQL database connection through Sequelize
- Database persistence of authenticated user information
- SHA-256 hashing of JWTs before database storage
- Environment variables for credentials and configuration
- Authentication failure handling

## Planned Features

- Music search functionality
- Artist, album, and track results
- Protected backend routes
- Responsive frontend interface
- User logout and session management

---

## Technology

- Node.js
- Express
- Google OAuth 2.0
- Passport.js
- JSON Web Tokens
- MySQL
- Sequelize
- dotenv
- CORS

---

## Prerequisites

Before running this project, install:

- Node.js 20 or newer
- npm
- MySQL 8.4
- Git
- VS Code or another code editor

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/brownjustin-fs-1/spotify-search-app.git
```

Enter the backend folder:

```bash
cd spotify-search-app/backend
```

Install the dependencies:

```bash
npm install
```

---

## Database Setup

Start MySQL and sign in as the root user.

Create the project database:

```sql
CREATE DATABASE jb_music_search;
```

Create an application user with a private password:

```sql
CREATE USER 'jb_app'@'%' IDENTIFIED BY 'your-private-password';
```

Give the application user access to the project database:

```sql
GRANT ALL PRIVILEGES ON jb_music_search.* TO 'jb_app'@'%';
FLUSH PRIVILEGES;
```

---

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=3001

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

JWT_SECRET=your-jwt-secret

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=jb_music_search
DB_USER=jb_app
DB_PASSWORD=your-database-password
```

The `.env` file is excluded from Git and should never be committed to the repository.

---

## Google OAuth Setup

Create a web application OAuth client in the Google Auth Platform.

Use this authorized redirect URI:

```text
http://localhost:3001/auth/google/callback
```

While the Google application is in testing mode, add the Google account used for development as a test user.

---

## Running the Application

Make sure MySQL is running, then start the development server:

```bash
npm run dev
```

The terminal should confirm:

```text
Database connected
Server running on port 3001
```

Open the backend:

```text
http://localhost:3001
```

Start Google authentication:

```text
http://localhost:3001/auth/google
```

---

## Authentication Routes

| Method | Route                   | Purpose                                    |
| ------ | ----------------------- | ------------------------------------------ |
| GET    | `/`                     | Confirms that the backend is running       |
| GET    | `/auth/google`          | Starts Google authentication               |
| GET    | `/auth/google/callback` | Handles Google’s OAuth response            |
| GET    | `/auth/failure`         | Returns an authentication failure response |

After successful authentication, the backend creates a JWT that expires after one hour. The usable JWT is returned to the client, while only its SHA-256 hash is stored in MySQL.

---

## Database Verification

Sign in to the project database and verify that the authentication table exists:

```sql
SHOW TABLES;
```

View saved authentication sessions without displaying token hashes:

```sql
SELECT id, displayName, email, expiresAt, createdAt
FROM auth_sessions;
```

---

## Links

[GitHub Repository](https://github.com/brownjustin-fs-1/spotify-search-app)

Local backend:

```text
http://localhost:3001
```
