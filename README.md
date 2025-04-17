<div align="center"> 
    <img src="./frontend/public/logo-white.svg" width="200px" height="200px"/>
    <h1>Uni Global - Study Abroad Assistant 🧑‍🎓</h1>
    <p>Your AI-powered guide to studying abroad. Get personalized assistance with university        selection, documentation, and application process.</p>
</div>



## Project Overview

Uni Global is a comprehensive platform designed to help students navigate the complex process of applying to universities abroad. The application uses AI to provide personalized guidance, generate application documents, and streamline the entire study abroad journey.

### Key Features

- **AI-Powered Chat Assistant**: Get instant answers to your study abroad questions
- **Document Generation**: Create professional motivational and recommendation letters
- **University Matching**: Find universities that match your profile and preferences
- **Application Tracking**: Monitor your application progress in one place

## Technology Stack

### Frontend
- Next.js (React framework)
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Zustand (State management)

### Backend
- Go (Golang)
- Gin Web Framework
- GORM (ORM for database operations)
- JWT Authentication
- Google Gemini API (AI capabilities)

### Database
- PostgreSQL

## Project Structure

```
uni-global/
├── backend/               # Go backend code
│   ├── cmd/               # Application entry points
│   ├── internal/          # Internal packages
│   │   ├── db/            # Database connection
│   │   ├── handlers/      # API handlers
│   │   ├── middleware/    # Middleware components
│   │   ├── models/        # Data models
│   │   └── repository/    # Data access layer
│   └── pkg/               # Shared packages
├── frontend/              # Next.js frontend code
│   ├── app/               # Next.js app router
│   ├── components/        # Reusable UI components
│   ├── lib/               # Utility functions
│   ├── public/            # Static assets
│   ├── services/          # API client services
│   └── stores/            # State management
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Go 1.21+
- PostgreSQL
- Google API Key (for Gemini AI)

### Environment Setup

1. Clone the repository
   ```bash
   git clone https://github.com/xvrwedhk/uni-global.git
   cd uni-global
   ```
### Running the Application

#### Development Mode

Start the backend server:
```bash
cd backend
go run cmd/main.go
```

Start the frontend development server:
```bash
cd frontend
pnpm install
pnpm dev
```

The application will be available at http://localhost:3000

## API Documentation
The backend API provides endpoints for:

- User authentication (login, register)
- Chat interactions
- Letter generation (motivational and recommendation)
- University information

Detailed API documentation is available at: http://localhost:8080/swagger/index.html when running the backend server. 
> Bonus: https://xvrwedhk.github.io/uni-global-docs/

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the [MIT License](LICENCE)
