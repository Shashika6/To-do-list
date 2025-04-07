
# Todo List Application

A full-stack Todo List application built with React, TypeScript, and Node.js.

## Demo 

## Features

- Create, read, update, and delete todos
- Filter todos by priority, status and created time
- Search functionality
- Create tasks with dependencies between tasks 
- Create recurring tasks (A new task will be created upon completion of the old one)
- Responsive design with SCSS styling

## Future improvements

- Improve UX by adding prompts on user action (eg:- delete)
- Allowing user to edit recurrence and add a due date with reminder
- Use a cron job like aws lambda for auto generation of to-do
- Use docker for one script setup of project
- Improve test coverage by adding more unit and e2e tests

## Tech Stack

- Node.js with Express
- React.js
- Sass (SCSS)
- Mongodb cloud (Key attached on env)
- TypeScript

## Project Structure

```
.
├── frontend/          # React frontend application
└── backend/           # Node.js backend server
```

## Setup Instructions

### Backend Setup

1. Navigate to the `backend` directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the backend server:

```bash
npm run dev
```

The server will run on `http://localhost:3001`.

### Frontend Setup

1. Navigate to the `frontend` directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`.

## Testing Scripts

### Backend Scripts

- `npm start` - Start the backend server
- `npm run dev` - Start the server in development mode with hot reloading
- `npm test` - Run backend tests

### Frontend Scripts

- `npm start` - Start the development server
- `npm test` - Run frontend tests
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality