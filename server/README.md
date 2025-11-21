# Organization Management API

A GraphQL-based API for managing organizational departments and sub-departments, built with NestJS, TypeScript, and PostgreSQL. This project handles user authentication, department hierarchies, and implements various security best practices.

## Features

- **GraphQL API** - Flexible querying with auto-generated schema
- **JWT Authentication** - Secure token-based authentication system
- **Department Management** - Full CRUD operations for departments and sub-departments
- **Authorization** - Creator-based access control (only creators can modify their resources)
- **Rate Limiting** - Global rate limiting to prevent DoS attacks
- **Input Validation** - Comprehensive validation with sanitization
- **TypeORM** - Database migrations and type-safe queries
- **Security** - Helmet, CORS configuration, and production-ready security settings

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **API**: GraphQL (Apollo Server)
- **Authentication**: JWT with Passport
- **Validation**: class-validator, class-transformer
- **Logging**: Pino
- **Security**: Helmet, Throttler

## Prerequisites

Before you start, make sure you have:

- Node.js (v22 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository and navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables. Create a `.env` file in the server directory:
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/organization_db

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=3600

# App Configuration
NODE_ENV=development
PORT=3000

# Rate Limiting (optional - defaults shown)
THROTTLE_TTL=60000
THROTTLE_LIMIT=10

# CORS (for production - comma-separated origins)
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

4. Run database migrations:
```bash
npm run migration:run
```

## Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

Once running, you can access:
- **GraphQL Playground**: http://localhost:3000/graphql (development only)
- **Swagger Docs**: http://localhost:3000/docs

## Project Structure

```
src/
├── common/              # Shared utilities
│   ├── decorators/     # Custom decorators (@CurrentUser, @Public, validation decorators)
│   ├── guards/         # Authentication and rate limiting guards
│   ├── filters/        # Exception filters
│   ├── interceptors/   # Logging interceptor
│   └── dto/            # Shared DTOs
├── config/             # Configuration modules
├── database/           # Database setup and migrations
├── modules/
│   ├── auth/          # Authentication module
│   ├── users/         # User management
│   └── departments/   # Department CRUD operations
└── main.ts            # Application entry point
```

## API Overview

### Authentication

The API uses JWT authentication. Most endpoints require a valid token in the Authorization header:
```
Authorization: Bearer <your-token>
```

Public endpoints (registration and login) don't require authentication.

### REST API Endpoints

#### Authentication

**POST `/auth/register`** - Register a new user

Creates a new user account and returns JWT token.

Request body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response (201 Created):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

Validation rules:
- `username`: Required, minimum 3 characters
- `password`: Required, minimum 6 characters

---

**POST `/auth/login`** - Authenticate and get JWT token

Authenticates a user and returns JWT access token.

Request body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

Error responses:
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Validation errors

---

### GraphQL Operations

#### Departments
- `createDepartment(input: CreateDepartmentInput!)` - Create a department (with optional sub-departments)
- `getDepartments` - Get all departments with their sub-departments
- `getDepartment(id: Int!)` - Get a single department by ID
- `updateDepartment(input: UpdateDepartmentInput!)` - Update department name (creator only)
- `deleteDepartment(id: Int!)` - Delete a department and all sub-departments (creator only)

#### Sub-Departments
- `createSubDepartment(input: CreateSubDepartmentInput!)` - Create a sub-department
- `getSubDepartments` - Get all sub-departments
- `getSubDepartment(id: Int!)` - Get a single sub-department by ID
- `updateSubDepartment(input: UpdateSubDepartmentInput!)` - Update sub-department name
- `deleteSubDepartment(id: Int!)` - Delete a sub-department

### Example REST API Usage

**Register a new user:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securepassword123"
  }'
```

**Login and get token:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securepassword123"
  }'
```

**Use token for authenticated requests:**
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "query": "query { getDepartments { id name } }"
  }'
```

### Example GraphQL Queries

**Create a department:**
```graphql
mutation {
  createDepartment(input: {
    name: "Engineering"
    subDepartments: [
      { name: "Backend" }
      { name: "Frontend" }
    ]
  }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

**Get all departments:**
```graphql
query {
  getDepartments {
    id
    name
    createdAt
    subDepartments {
      id
      name
    }
  }
}
```

## Security Features

### Authentication & Authorization
- JWT-based authentication
- Creator-only resource modification
- Type-safe user context via `@CurrentUser` decorator

### Rate Limiting
- Global rate limiting (default: 10 requests per minute)
- Configurable via `THROTTLE_TTL` and `THROTTLE_LIMIT` environment variables
- Protects against DoS and brute force attacks

### Input Validation
- All inputs validated and sanitized
- Name fields: 2-100 characters, alphanumeric + spaces/hyphens/underscores
- ID validation: positive integers only
- Automatic whitespace trimming

### Production Security
- Helmet for HTTP security headers
- CORS configured with origin whitelisting
- GraphQL playground and introspection disabled in production
- Generic error messages to prevent information leakage

## Database Migrations

```bash
# Generate a new migration
npm run migration:generate -- src/database/migrations/MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Development

```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRES_IN` | Token expiration in seconds | Required |
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `3000` |
| `THROTTLE_TTL` | Rate limit window (ms) | `60000` |
| `THROTTLE_LIMIT` | Max requests per window | `10` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | All (dev) |

## Notes

- The API uses GraphQL, so you can query exactly the fields you need
- All department mutations require authentication
- Only the creator of a department can update/delete it
- Sub-departments inherit permissions from their parent department
- Rate limiting is applied globally to all endpoints

## License

This project is private and unlicensed.
