# Health Oracle

A comprehensive health monitoring and prediction system that helps users track their health metrics and receive AI-powered predictions for various health conditions.

## Project Structure

```
health-oracle/
├── backend/
│   ├── auth-service/        # Firebase authentication
│   ├── profile-service/     # User profile management
│   ├── wearable-service/    # Health data from wearables
│   ├── prediction-service/  # ML model integration
│   ├── alert-service/      # Health alerts and notifications
│   └── scheduler-service/   # Automated tasks
└── frontend/
    ├── web/                # React.js web application
    └── mobile/             # React Native mobile app
```

## Prerequisites

- Node.js 18+
- MongoDB
- Firebase account
- Expo CLI (for mobile development)

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Create `.env` files in each service directory
   - Add necessary API keys and configuration

3. Start the development servers:
   ```bash
   npm start
   ```

## Available Scripts

- `npm start`: Start all services
- `npm run start:backend`: Start all backend services
- `npm run start:web`: Start web frontend
- `npm run start:mobile`: Start mobile frontend

## Features

- User authentication with Firebase
- Health data tracking and visualization
- AI-powered health predictions
- Real-time health alerts
- Cross-platform support (Web + Mobile)

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend (Web)**: React.js
- **Frontend (Mobile)**: React Native (Expo)
- **Authentication**: Firebase
- **ML Models**: FastAPI (External APIs)
- **Database**: MongoDB 