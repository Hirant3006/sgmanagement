# Sugar Cane Machine Management System

A lightweight, cost-effective management system for a family business, built with React and Node.js.

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

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Frontend Setup
```bash
cd sg-fe
npm install
npm run dev
```

### Backend Setup
```bash
cd sg-be
npm install
npm run dev
```

## Deployment Guide

### Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Deploy frontend:
   ```bash
   cd sg-fe
   vercel
   ```
4. Configure environment variables in Vercel dashboard:
   - VITE_API_URL: Your backend API URL
   - VITE_APP_ENV: production
   - VITE_APP_TITLE: Sugar Cane Machine Management

### Backend Deployment (Render)

1. Create a Render account at https://render.com
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - NODE_ENV: production
   - PORT: 3000
   - DB_PATH: /opt/render/project/src/data/family_business.db
   - CORS_ORIGIN: Your frontend URL
   - JWT_SECRET: (Generate a secure random string)
   - JWT_EXPIRES_IN: 24h

### Database Management

The SQLite database is automatically backed up every 24 hours in production. Backups are stored in the same directory as the main database file.

## Features

- User Authentication
- Machine Management
- Order Management
- Machine Types and Subtypes
- Filtering and Search
- Responsive Design

## Tech Stack

### Frontend
- React
- Vite
- Ant Design
- React Router
- Day.js

### Backend
- Node.js
- Express
- SQLite
- JWT Authentication

## License

MIT 