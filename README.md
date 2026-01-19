# Semeru

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1+-black.svg)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5.2+-black.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2+-orange.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-19.2+-blue.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4+-38B2AC.svg)](https://tailwindcss.com/)

## Sistem Evaluasi Monitoring Edukasi & Riset Unggulan

Semeru is a comprehensive educational platform designed to streamline academic monitoring and research competition management for universities and educational institutions. The system provides a unified solution for tracking student achievements, managing events and competitions, and facilitating content management through an intuitive web interface.

## Description

Semeru serves as a digital ecosystem that bridges the gap between academic administration and student development. The platform enables:

- **Academic Monitoring (Jejak)**: Real-time tracking of student achievements, seminar participation, leadership roles, and academic performance
- **Event Management (Laga)**: Comprehensive handling of competitions, training programs, and seminars with participant management
- **Content Management (CMS)**: Centralized platform for managing educational content and resources
- **User Management**: Role-based access control for students (Mahasiswa), mentors, administrators, and super administrators

Built with modern web technologies, Semeru ensures scalability, security, and an excellent user experience for all stakeholders in the educational process.

## Architecture

The project follows a **Full-Stack Architecture** with clear separation between backend API and frontend application:

### Backend (API)
- **Layered Architecture**: Presentation → Business Logic → Data Access → Infrastructure
- **RESTful API Design**: Clean HTTP endpoints with proper status codes and error handling
- **Microservice-Ready Structure**: Modular service organization for future scalability

### Frontend (App)
- **Component-Based Architecture**: Reusable UI components with clear responsibility separation
- **Feature-Driven Development**: Organized by business domains (authentication, CMS, jejak, laga)
- **Modern React Patterns**: Hooks, context, and state management for complex interactions

### Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        A[Next.js App]
        B[React Components]
        C[State Management<br/>Zustand]
        D[API Client<br/>Axios]
    end

    subgraph "Backend (Express.js)"
        E[Express Router]
        F[Authentication<br/>Middleware]
        G[Authorization<br/>Middleware]
        H[Controllers]
        I[Services]
        J[Prisma ORM]
    end

    subgraph "Database"
        K[(PostgreSQL)]
    end

    A --> D
    D --> E
    B --> C
    E --> F
    E --> G
    F --> H
    G --> H
    H --> I
    I --> J
    J --> K

    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style K fill:#e8f5e8
```

## Tech Stack

### Backend (API)
- **Runtime & Framework**: Node.js 18+, Express.js 5.2+, TypeScript 5.9+
- **Database & ORM**: PostgreSQL 13+, Prisma 7.2+ with type-safe queries
- **Authentication & Security**: JWT, bcrypt, Helmet, CORS
- **Validation & Utilities**: Zod schemas, Morgan logging, express-rate-limit
- **Development Tools**: Nodemon, Jest, TS-Node

### Frontend (App)
- **Framework**: Next.js 16.1+ with App Router
- **UI Library**: React 19.2+, TypeScript 5+
- **Styling**: Tailwind CSS 4+, class-variance-authority, clsx, tailwind-merge
- **State Management**: Zustand for client-side state
- **HTTP Client**: Axios for API communication
- **Icons**: Lucide React
- **Development Tools**: ESLint, TypeScript compiler

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 13 or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/taufanAli65/semeru.git
   cd semeru
   ```

2. **Setup Backend (API)**
   ```bash
   cd api
   npm install
   cp .env.local.example .env
   ```

3. **Setup Frontend (App)**
   ```bash
   cd ../app
   npm install
   ```

4. **Database Setup**
   ```bash
   cd ../api
   npx prisma generate
   npx prisma migrate dev
   npm run prisma:seed  # Creates initial super admin account
   ```

5. **Run the Applications**
   ```bash
   # Terminal 1: Start API server
   cd api
   npm run dev

   # Terminal 2: Start frontend app
   cd ../app
   npm run dev
   ```

The applications will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000 (configurable via PORT env var)

### Available Scripts

#### API Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run test suite
- `npx prisma studio` - Open database management interface
- `npx prisma migrate dev` - Run database migrations

#### App Scripts
- `npm run dev` - Start Next.js development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
semeru/
├── api/                          # Backend API (Express.js)
│   ├── src/
│   │   ├── app.ts               # Express application setup
│   │   ├── server.ts            # Server entry point
│   │   ├── config/              # Environment & database config
│   │   │   ├── index.config.ts
│   │   │   └── prisma.config.ts
│   │   ├── controllers/         # HTTP request handlers
│   │   │   └── authentication.controller.ts
│   │   ├── helpers/             # Utility functions
│   │   │   ├── password.helper.ts
│   │   │   └── validator.helper.ts
│   │   ├── middlewares/         # Express middlewares
│   │   │   ├── authenticate.middleware.ts
│   │   │   ├── authorize.middleware.ts
│   │   │   ├── errorHandler.middleware.ts
│   │   │   └── rateLimiter.middleware.ts
│   │   ├── routes/              # API route definitions
│   │   │   └── authentication.router.ts
│   │   ├── services/            # Business logic layer
│   │   │   ├── authentication/
│   │   │   │   └── user.service.ts
│   │   │   ├── cms/             # Planned: Content management
│   │   │   ├── jejak/           # Planned: Academic monitoring
│   │   │   └── laga/            # Planned: Event management
│   │   ├── types/               # TypeScript type definitions
│   │   │   └── authentication.type.ts
│   │   ├── utils/               # Utility functions
│   │   │   └── logger.utils.ts
│   │   └── validators/          # Request validation schemas
│   │       └── authentication.validator.ts
│   ├── prisma/                  # Database schema & migrations
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── logs/                    # Application logs
│   ├── package.json
│   └── tsconfig.json
│
├── app/                         # Frontend App (Next.js)
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── globals.css      # Global styles
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── (authentication)/ # Auth route group
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── register/
│   │   │   │     └── page.tsx
│   │   │   ├── (cms)/           # CMS route group
│   │   │   │   └── dashboard/
│   │   │   │       └── page.tsx
│   │   │   ├── (jejak)/         # Monitoring route group
│   │   │   └── (laga)/          # Events route group
│   │   ├── components/          # Reusable UI components
│   │   │   ├── layouts/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── ui/              # Base UI components
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Logo.tsx
│   │   │       └── Modal.tsx
│   │   ├── features/            # Feature-specific components
│   │   │   ├── authentication/
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   └── RegisterForm.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAuth.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.service.ts
│   │   │   │   └── types/
│   │   │   │       └── index.ts
│   │   │   ├── cms/             # Planned: CMS features
│   │   │   ├── jejak/           # Planned: Monitoring features
│   │   │   ├── laga/            # Planned: Event features
│   │   │   └── landing/         # Landing page features
│   │   │       └── components/
│   │   │           ├── HeroSection.tsx
│   │   │           ├── LandingFooter.tsx
│   │   │           └── LandingNavbar.tsx
│   │   ├── lib/                 # External library configurations
│   │   │   ├── axios.ts         # HTTP client setup
│   │   │   ├── store.ts         # State management setup
│   │   │   └── utils.ts         # Utility functions
│   │   └── types/               # TypeScript type definitions
│   │       └── api.ts           # API response types
│   ├── public/                  # Static assets
│   │   └── patterns/            # Background patterns
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md                    # This file
```

### Key Directories Explanation

- **`api/src/controllers/`**: Handle HTTP requests, validate input, orchestrate business logic
- **`api/src/services/`**: Contain domain business logic, interact with data layer
- **`api/src/routes/`**: Define API endpoints, map URLs to controller methods
- **`api/src/middlewares/`**: Cross-cutting concerns (auth, security, logging)
- **`app/src/components/`**: Reusable UI building blocks
- **`app/src/features/`**: Feature-specific components, hooks, and services
- **`app/src/app/`**: Next.js pages organized by route groups
- **`prisma/`**: Database schema, migrations, and seeding scripts

## Features

### ✅ Implemented Features

#### Authentication & User Management
- **Multi-Role Authentication**: Support for SuperAdmin, Admin, Mentor, and Mahasiswa roles
- **JWT-Based Security**: Secure token authentication with configurable expiration
- **User Registration/Login**: Complete user lifecycle management
- **Profile Management**: Update user information and preferences
- **Admin Controls**: User CRUD operations for administrators

#### Security & Performance
- **Password Security**: bcrypt hashing with salt rounds
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Secure cross-origin resource sharing
- **Security Headers**: Helmet.js for comprehensive security headers
- **Request Validation**: Zod schema validation for all inputs

#### Developer Experience
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Hot Reload**: Development servers with automatic reloading
- **Database Management**: Prisma Studio for visual database interaction
- **Comprehensive Logging**: Configurable logging levels and formats
- **Environment Configuration**: Flexible environment-based settings

### 🚧 Planned Features

#### Content Management System (CMS)
- **Static Content Management**: Pages, articles, and resources
- **Media Upload**: File and image handling with cloud storage
- **Content Categories**: Organized content taxonomy
- **Rich Text Editor**: WYSIWYG content creation

#### Jejak (Academic Monitoring)
- **Achievement Tracking**: Record academic achievements and milestones
- **Performance Monitoring**: GPA, course completion, and progress tracking
- **Mentor Assignments**: Link students with academic mentors
- **Semester Reviews**: Periodic evaluation and feedback system
- **Certificate Management**: Digital credential storage and verification

#### Laga (Event & Competition Management)
- **Event Creation**: Competitions, seminars, workshops, and training programs
- **Participant Registration**: Online registration with capacity management
- **Event Analytics**: Attendance tracking and engagement metrics
- **Certificate Generation**: Automated certificate creation and distribution
- **Event Scheduling**: Calendar integration and conflict resolution

## API Endpoints

For comprehensive API documentation including detailed request/response examples, authentication, and usage guides, see:

📖 **[Complete API Documentation](./docs/api-doc.md)**

### Quick API Reference

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| POST | `/login` | User authentication | Public |
| POST | `/register` | User registration | Public |
| GET | `/user/:userId` | Get user profile | Authenticated |
| PUT | `/user/info` | Update user info | Authenticated |
| GET | `/users` | List all users | SuperAdmin |
| DELETE | `/user/:userId` | Delete user | SuperAdmin |
| PATCH | `/user/:userId/role` | Change role | SuperAdmin |
| GET | `/users/role/:role` | Filter by role | SuperAdmin |

### Monev (Monitoring & Evaluation) (`/api/v1/jejak`)

#### Mentor Endpoints
| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| POST | `/mentor/:mentorId/mentees` | Assign mentees to mentor | Admin, Mentor |
| GET | `/mentor/:mentorId/mentees` | Get mentee list | Admin, Mentor |
| PATCH | `/mentor/records/:record_id` | Approve/reject records | Admin, Mentor |
| GET | `/mentor/period/:period_id/records` | Get period records | Admin, Mentor |
| GET | `/mentor/records/:record_id` | Get single record | Admin, Mentor |

#### Mentee Endpoints
| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| POST | `/mentee/records` | Add single record | Mahasiswa |
| POST | `/mentee/records/bulk` | Add bulk records | Mahasiswa |
| GET | `/mentee/records/current` | Get current period | Mahasiswa |
| PATCH | `/mentee/records/:record_id` | Update record | Mahasiswa |
| DELETE | `/mentee/records/:record_id` | Delete record | Mahasiswa |
| GET | `/mentee/records/past` | Get past records | Mahasiswa |

### Health Check
| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| GET | `/api/v1/health` | API status check | Public |

## Database Schema

The system uses PostgreSQL with the following core entities:

- **users**: User accounts with authentication and role management
- **user_information**: Extended profile data for students and mentors
- **activity**: Events, competitions, and training programs
- **activity_images**: Media assets for activities
- **trn_activity_registration**: Participant registrations and attendance
- **monev_periods**: Academic monitoring periods
- **monev_records**: Achievement and performance records

## Environment Variables

### API Environment Variables
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/semeru"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"

# Security
SEEDER_PASSWORD="initial-admin-password"

# Server
PORT=8000
NODE_ENV="development"

# CORS
ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
```

### App Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript types and tests
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request with detailed description

### Development Guidelines
- Follow TypeScript strict mode
- Write comprehensive tests for new features
- Update documentation for API changes
- Maintain consistent code formatting
- Use meaningful commit messages

## License

This project is licensed under the ISC License - see the package.json files for details.

## Author

**taufanAli65**
- GitHub: [@taufanAli65](https://github.com/taufanAli65)
- Project: [Semeru](https://github.com/taufanAli65/semeru)

---

<parameter name="filePath">/Users/alienz/mgondinf/semeru/README.md