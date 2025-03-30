# Uni Global Frontend Documentation

## Overview
The frontend of Uni Global is a Next.js application that provides an intuitive interface for students seeking assistance with university applications abroad. It features a responsive design, AI-powered chat assistance, and document generation capabilities.

## Tech Stack
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- Shadcn UI for component design
- Zustand for state management
- Axios for API communication

## Project Structure
```
frontend/
├── app/                 # Next.js app router pages
├── components/          # UI components organized by feature
│   ├── chat/            # Chat-related components
│   ├── letters/         # Letter generation components
│   └── ui/              # Reusable UI elements
├── lib/                 # Utility functions and API setup
├── public/              # Static assets and images
├── services/            # API service functions
└── stores/              # Zustand state stores
```

## Key Features

### Authentication
- JWT-based authentication with secure cookie storage
- Login, registration, and Google OAuth integration
- Protected routes via middleware

### Chat System
- Real-time messaging with AI assistant
- Chat history with search functionality
- Markdown rendering for rich responses

### Letter Generation
- Step-by-step form for motivational and recommendation letters
- Document preview with copy capability
- History of previously generated documents

### UI Components
- Responsive design for all device sizes
- Loading states and error handling
- Toast notifications for user feedback

## Setup & Running
1. Install dependencies: `npm install`
2. Configure environment variables in `.env.local`
3. Start development server: `npm run dev`
4. Access the application at http://localhost:3000

The frontend communicates with the Golang backend API for data persistence and AI functionality.
