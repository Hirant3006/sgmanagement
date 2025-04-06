# Sugarcane Machine Management System

A comprehensive system for managing sugarcane machine business operations.

## Project Structure

```
sgmanagement/
├── sg-fe/              # Frontend React application
├── sg-be/              # Backend Node.js application
└── .cursorrules/       # Cursor IDE rules and configurations
```

## Components

### Frontend (sg-fe)
- React application with Material UI
- Features:
  - User Authentication
  - Dashboard Overview
  - Order Management
  - Machine Type Management
- Tech Stack:
  - React
  - Material UI
  - React Router
  - Context API

### Backend (sg-be)
- Node.js REST API
- Features:
  - User Authentication
  - Order Management
  - Machine Type Management
  - SQLite Database
- Tech Stack:
  - Node.js
  - Express
  - SQLite
  - JWT Authentication

### Cursor Rules (.cursorrules)
- IDE configurations and rules
- Code snippets
- Project documentation

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Hirant3006/sgmanagement.git
cd sgmanagement
```

2. Set up Frontend:
```bash
cd sg-fe
npm install
npm run dev
```

3. Set up Backend:
```bash
cd ../sg-be
npm install
npm run dev
```

## Development

- Frontend runs on: http://localhost:5173
- Backend runs on: http://localhost:3000

## Contributing

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "Add your feature description"
```

3. Push to your branch:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub 