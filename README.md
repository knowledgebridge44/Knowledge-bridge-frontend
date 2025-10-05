# Knowledge Bridge - Frontend (React + Vite)

Modern React frontend for the Knowledge Bridge academic platform, integrated with Laravel backend using Sanctum SPA cookie-based authentication.

## 🏗️ Architecture

- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **TailwindCSS** for utility-first styling with light/dark theme support
- **React Router v7** for client-side routing
- **React Query (TanStack Query)** for server state management
- **Axios** for API communication with CSRF protection
- **Sanctum SPA Cookies** for secure, same-origin authentication

## 📁 Project Structure

```
src/
├── api/              # API client and endpoint definitions
├── assets/           # Static assets (images, fonts)
├── components/       # Shared UI components (Button, Input, Card, etc.)
├── features/         # Feature-specific components and logic
├── hooks/            # Custom React hooks (useAuth, useTheme, useCourses)
├── layouts/          # Page layouts (MainLayout, DashboardLayout)
├── pages/            # Route components (Landing, Login, Dashboard, etc.)
├── providers/        # Context providers (AuthProvider, ThemeProvider)
├── router/           # Route configuration and guards
├── services/         # Utility services (storage, validators)
├── styles/           # Global styles and Tailwind config
├── types/            # TypeScript type definitions
├── App.tsx           # Root application component
└── main.tsx          # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Laravel backend running (see backend_laravel README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` if needed (default points to `http://localhost:8000`)

### Development

Run the Vite dev server (with hot module replacement):

```bash
npm run dev
```

The app will be available at `http://localhost:5173` with API proxying to the Laravel backend.

**Important**: Make sure your Laravel backend is running on `http://localhost:8000` or update the proxy configuration in `vite.config.ts`.

### Building for Production

Build optimized production assets:

```bash
npm run build
```

This will output files to `../backend_laravel/public/frontend/` which Laravel will serve in production.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 🧪 Testing

### Run Unit Tests

```bash
npm run test
```

### Run Tests with UI

```bash
npm run test:ui
```

### Run E2E Tests

```bash
npm run test:e2e
```

## 🔐 Authentication Flow

The app uses Sanctum's SPA cookie-based authentication:

1. On app boot, fetch CSRF cookie from `/sanctum/csrf-cookie`
2. Login via `POST /api/login` with credentials
3. Laravel returns httpOnly session cookie
4. All subsequent requests automatically include the session cookie
5. CSRF token is extracted from cookie and sent in `X-XSRF-TOKEN` header for state-changing requests

No tokens are stored in localStorage or exposed to JavaScript, enhancing security.

## 🎨 Theming

The app supports light and dark themes:

- Theme preference is stored in localStorage
- Toggle using the theme button in the navigation
- CSS variables in TailwindCSS for easy customization
- Respects system preference on first load

### Customizing Theme

Edit theme colors in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: { ... },
      academic: { ... },
      'dark-academic': { ... }
    }
  }
}
```

## 📦 Key Dependencies

### Production
- `react` & `react-dom`: UI library
- `react-router-dom`: Client-side routing
- `@tanstack/react-query`: Server state management
- `axios`: HTTP client
- `recharts`: Charts for admin analytics
- `clsx`: Utility for conditional class names
- `date-fns`: Date utilities

### Development
- `typescript`: Type checking
- `vite`: Build tool
- `tailwindcss`: CSS framework
- `vitest`: Unit testing
- `@testing-library/react`: Component testing
- `playwright`: E2E testing
- `msw`: API mocking for tests

## 🗂️ API Integration

All API calls go through the centralized axios client in `src/api/axios.ts` which handles:

- CSRF token management
- Cookie-based authentication
- Global error handling
- Request/response interceptors
- Automatic retry on CSRF mismatch (419)

### Using API Hooks

```tsx
import { useCourses, useEnrollCourse } from '@/hooks/useCourses';

function CoursesPage() {
  const { data: courses, isLoading } = useCourses();
  const enrollMutation = useEnrollCourse();

  const handleEnroll = (courseId: number) => {
    enrollMutation.mutate(courseId);
  };

  // ...
}
```

## 🛣️ Routing & Guards

### Route Protection

- `AuthGuard`: Requires authentication
- `RoleGuard`: Requires specific user role (admin, teacher, student)
- `GuestGuard`: Redirects authenticated users away from login/register

### Route Structure

```
/                    → Landing page (public)
/login               → Login (guest only)
/register            → Register (guest only)
/dashboard           → Dashboard (authenticated)
/courses             → Courses list (authenticated)
/courses/:id         → Course detail (authenticated)
/lessons/:id         → Lesson detail (authenticated, enrolled)
/questions           → Q&A forum (authenticated)
/profile             → User profile (authenticated)
/admin/*             → Admin panel (admin only)
```

## 🎯 Key Features

### For Students
- Browse and enroll in courses
- View lessons and download materials
- Ask questions and post answers
- Rate lessons
- Earn badges
- Track learning progress

### For Teachers
- Create and manage courses
- Upload lessons and materials
- Respond to student questions
- View course analytics

### For Admins
- Approve pending lessons
- Review and moderate reports
- View platform analytics
- Manage users (future feature)

## 📚 Development Guidelines

### Component Guidelines
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript for all new code
- Follow the existing folder structure

### Styling Guidelines
- Use Tailwind utility classes
- Use the custom CSS classes from `globals.css` (`.btn`, `.input`, `.card`)
- Ensure AA contrast ratios for accessibility
- Support both light and dark themes
- Make all components responsive

### State Management
- Use React Query for server state
- Use Context API for global client state (auth, theme)
- Keep local component state when appropriate
- Avoid prop drilling with composition

## 🔧 Configuration Files

- `vite.config.ts`: Vite configuration, build output, proxy settings
- `tsconfig.json`: TypeScript compiler options
- `tailwind.config.js`: Tailwind theme customization
- `postcss.config.js`: PostCSS plugins (Tailwind, Autoprefixer)

## 🚨 Troubleshooting

### CORS Errors
- Ensure Laravel backend has proper CORS configuration
- Check that Vite proxy is configured correctly
- Verify `withCredentials: true` in axios config

### CSRF Token Mismatch
- Clear cookies and restart both servers
- Check that `/sanctum/csrf-cookie` is accessible
- Verify CSRF token is being sent in `X-XSRF-TOKEN` header

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check TypeScript errors: `npm run typecheck`
- Ensure all imports use `@/` alias for src imports

## 📖 Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)

## 📝 License

This project is part of the Knowledge Bridge platform.

---

**Note**: This frontend is designed to work integrated with the Laravel backend. Make sure the backend is properly configured and running before starting frontend development.
