# Organization Management - Frontend

A modern, responsive web application for managing organizational departments and sub-departments. Built with Next.js 16, React 19, and TypeScript.

## Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes with automatic redirect
- Session management with cookies
- Secure logout functionality

### 📊 Department Management
- **Create Departments**: Add new departments with optional sub-departments in a single form
- **Edit Departments**: Update department names and details
- **Delete Departments**: Remove departments with confirmation dialogs
- **View Modes**: Switch between grid and list views
- **Search**: Real-time search across department and sub-department names
- **Sub-Departments**: 
  - Create sub-departments inline when creating a department
  - Add sub-departments to existing departments
  - Edit and delete sub-departments
  - Expandable/collapsible sub-department lists

### 🎨 User Interface
- Modern, clean design with Tailwind CSS
- Responsive layout (mobile, tablet, desktop)
- Dark mode support (via next-themes)
- Toast notifications for user feedback
- Loading states and error handling
- Accessible components with proper ARIA labels

### 🔧 Technical Features
- GraphQL API integration with Apollo Client
- Form validation with React Hook Form and Zod
- Type-safe TypeScript throughout
- Modular component architecture
- Custom hooks for reusable logic
- Optimistic UI updates
- Error boundary handling

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **GraphQL Client**: Apollo Client
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Formatting**: date-fns
- **State Management**: React Context API

## Prerequisites

- Node.js (v20 or higher)
- npm, yarn, pnpm, or bun
- Backend server running (see server README)

## Getting Started

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5050/graphql
NEXT_PUBLIC_API_URL=http://localhost:5050
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages (login, register)
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── department/       # Department-related components
│   │   ├── form/        # Department and sub-department forms
│   │   ├── department-card.tsx
│   │   ├── departments-view.tsx
│   │   ├── list.tsx
│   │   └── header.tsx
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── loader.tsx
│   ├── protected-route.tsx
│   └── providers.tsx
├── contexts/            # React contexts
│   └── auth-context.tsx
├── hooks/              # Custom React hooks
│   ├── use-departments.ts
│   ├── use-department-mutations.ts
│   ├── use-department-handlers.ts
│   ├── use-department-modals.ts
│   ├── use-department-search.ts
│   ├── use-delete-confirmation.ts
│   └── use-toast.ts
└── lib/               # Utilities and configurations
    ├── apollo-client.ts
    ├── constants.ts
    ├── graphql/       # GraphQL queries and mutations
    ├── rest-client.ts
    ├── types.ts
    └── utils.ts
```

## Key Features Explained

### Authentication Flow
- Users can register or login via `/auth/register` and `/auth/login`
- JWT tokens are stored in HTTP-only cookies
- Protected routes automatically redirect unauthenticated users
- Unauthorized API errors trigger automatic redirect to login

### Department Management
- **Create**: Use the "Add Department" button to open a form where you can:
  - Enter department name
  - Optionally add multiple sub-departments inline
  - All created in a single API call
- **Edit**: Click the edit icon on any department card
- **Delete**: Use the delete option with confirmation dialog
- **Search**: Type in the header search bar to filter departments in real-time

### View Modes
- **Grid View**: Card-based layout showing departments in a responsive grid
- **List View**: Table-based layout with expandable rows for sub-departments
- Both views support all CRUD operations

### Custom Hooks
- `useDepartments`: Fetches and manages department data
- `useDepartmentMutations`: Handles all create/update/delete operations
- `useDepartmentHandlers`: Wraps mutations with error handling and callbacks
- `useDepartmentModals`: Manages modal state for forms
- `useDepartmentSearch`: Provides search/filter functionality
- `useDeleteConfirmation`: Manages delete confirmation dialog state

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_GRAPHQL_URL` | GraphQL API endpoint | `http://localhost:5050/graphql` |
| `NEXT_PUBLIC_API_URL` | REST API endpoint | `http://localhost:5050` |

## Component Architecture

The application follows a modular architecture:

- **Pages**: Top-level route components
- **Views**: Main content area components (e.g., `DepartmentsView`)
- **Forms**: Reusable form components with validation
- **UI Components**: Base components from shadcn/ui
- **Hooks**: Business logic and state management
- **Contexts**: Global state (authentication)

## Error Handling

- GraphQL errors are caught and displayed via toast notifications
- Unauthorized errors automatically redirect to login
- Network errors show user-friendly messages
- Form validation errors are displayed inline

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Write reusable components and hooks
4. Add proper error handling
5. Ensure responsive design
6. Test on multiple browsers

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
