# Organization Management System

A full-stack application for managing organizational departments and sub-departments. Built with NestJS (GraphQL) backend and Next.js frontend.

## 📚 Documentation

- **[Frontend README](./frontend/README.md)** - Frontend-specific documentation, features, and setup
- **[Server README](./server/README.md)** - Backend-specific documentation, API details, and setup

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with registration and login
- **Department Management**: Create, read, update, and delete departments
- **Sub-Department Management**: Hierarchical organization structure with nested departments
- **Search & Filter**: Real-time search across departments and sub-departments
- **Multiple View Modes**: Grid and list views for different preferences
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### User Experience
- Modern, intuitive UI with Tailwind CSS
- Toast notifications for user feedback
- Confirmation dialogs for destructive actions
- Loading states and error handling
- Protected routes with automatic redirects
- Dark mode support

### Technical Highlights
- Type-safe TypeScript throughout
- GraphQL API with Apollo Server
- Modular, maintainable architecture
- Reusable components and hooks
- Form validation with Zod
- Optimistic UI updates

## 📁 Project Structure

```
organization_management/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/      # Next.js pages and routes
│   │   ├── components/  # React components
│   │   ├── hooks/    # Custom React hooks
│   │   ├── contexts/ # React contexts
│   │   └── lib/      # Utilities and configurations
│   └── package.json
│
└── server/           # NestJS backend application
    ├── src/
    │   ├── modules/  # Feature modules (auth, departments, users)
    │   ├── common/   # Shared utilities
    │   ├── config/   # Configuration files
    │   └── database/ # Database setup and migrations
    └── package.json
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI + shadcn/ui
- **GraphQL Client**: Apollo Client
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **API**: GraphQL (Apollo Server)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator, class-transformer
- **Security**: Helmet, Throttler
- **Logging**: Pino

## 📋 Prerequisites

- Node.js (v20 or higher)
- PostgreSQL database
- npm, yarn, pnpm, or bun

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd organization_management
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with:
# DATABASE_URL=postgresql://username:password@localhost:5432/organization_db
# JWT_SECRET=your-secret-key-here
# JWT_EXPIRES_IN=3600
# NODE_ENV=development
# PORT=5050

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

The GraphQL playground will be available at `http://localhost:5050/graphql`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
# NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5050/graphql
# NEXT_PUBLIC_API_URL=http://localhost:5050

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📖 Usage

### Authentication
1. Navigate to `/auth/register` to create a new account
2. Or go to `/auth/login` if you already have an account
3. After login, you'll be redirected to the dashboard

### Managing Departments
1. **Create Department**: Click "Add Department" button
   - Enter department name
   - Optionally add sub-departments inline
   - Click "Create department"
2. **Edit Department**: Click the menu icon (⋮) on a department card → "Edit Department"
3. **Delete Department**: Click the menu icon → "Delete Department" → Confirm
4. **Add Sub-Department**: Click the menu icon → "Add Sub-Department"
5. **Search**: Use the search bar in the header to filter departments

### View Modes
- **Grid View**: Card-based layout (default)
- **List View**: Table-based layout with expandable rows
- Switch between views using the tabs

## 🔧 Development

### Backend Commands

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Database migrations
npm run migration:generate  # Generate new migration
npm run migration:run       # Run pending migrations
npm run migration:revert    # Revert last migration

# Testing
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e

# Linting
npm run lint
npm run format
```

### Frontend Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint
```

## 🔐 Authentication Flow

1. User registers/logs in via REST endpoint
2. Server returns JWT token and user data
3. Frontend stores token in HTTP-only cookie
4. All GraphQL requests include token in Authorization header
5. Protected routes check authentication status
6. Unauthorized requests redirect to login

## 📊 API Structure

### GraphQL Queries
- `getDepartments`: Fetch all departments with sub-departments
- `getDepartment(id)`: Fetch single department
- `getSubDepartments`: Fetch all sub-departments

### GraphQL Mutations
- `createDepartment(input)`: Create department (supports inline sub-departments)
- `updateDepartment(input)`: Update department name
- `deleteDepartment(id)`: Delete department and its sub-departments
- `createSubDepartment(input)`: Create sub-department
- `updateSubDepartment(input)`: Update sub-department name
- `deleteSubDepartment(id)`: Delete sub-department

### REST Endpoints
- `POST /auth/register`: User registration
- `POST /auth/login`: User login

## 🏗️ Architecture

### Frontend Architecture
- **Component-based**: Modular, reusable components
- **Hook-based logic**: Business logic in custom hooks
- **Context for global state**: Authentication state
- **Type-safe**: Full TypeScript coverage
- **Form validation**: Zod schemas with React Hook Form

### Backend Architecture
- **Modular design**: Feature-based modules
- **GraphQL-first**: Type-safe API with code generation
- **Guards & Decorators**: Authentication and authorization
- **DTOs**: Data validation and transformation
- **Service layer**: Business logic separation

## 🔒 Security Features

- JWT-based authentication
- Password hashing with Argon2
- Rate limiting with Throttler
- CORS configuration
- Helmet for security headers
- Input validation on all endpoints
- Protected routes on frontend
- Automatic token refresh handling

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/organization_db
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=3600
NODE_ENV=development
PORT=5050
THROTTLE_TTL=60000
THROTTLE_LIMIT=10
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5050/graphql
NEXT_PUBLIC_API_URL=http://localhost:5050
```

## 🧪 Testing

### Backend
- Unit tests with Jest
- E2E tests for API endpoints
- Test coverage reporting

### Frontend
- Component testing (recommended: add testing library)
- Integration tests for user flows

## 📦 Deployment

### Backend
1. Build the application: `npm run build`
2. Set production environment variables
3. Run migrations: `npm run migration:run`
4. Start server: `npm run start:prod`

### Frontend
1. Build the application: `npm run build`
2. Set production environment variables
3. Start server: `npm run start`
4. Or deploy to Vercel/Netlify

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all code
3. Write meaningful commit messages
4. Add proper error handling
5. Ensure responsive design
6. Test thoroughly before submitting

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org) and [NestJS](https://nestjs.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

