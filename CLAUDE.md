# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WYLM is a comprehensive personal website platform built with Next.js 14+ (App Router), TypeScript, PostgreSQL, and Prisma. It combines a portal homepage, blog system, photography gallery, and product showcase with user authentication and admin management.

## Development Commands

### Essential Commands

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Database Operations
npm run db:generate      # Generate Prisma Client (run after schema changes)
npm run db:migrate       # Create and apply database migrations
npm run db:seed          # Seed database with initial data
npm run db:studio        # Open Prisma Studio (visual database editor)
npm run db:reset         # Reset database (WARNING: deletes all data)
```

### Testing Individual Components

When testing specific features:
- Use Prisma Studio (`npm run db:studio`) to inspect/modify database records
- Check API routes at `http://localhost:3000/api/*`
- Default admin credentials after seeding: phone `13800138000`, password `Admin123456`

## Architecture

### Route Organization (Next.js App Router)

The app uses route groups for logical separation:

- **`(public)/`** - Public pages accessible without authentication
  - `/` - Portal homepage with masonry layout
  - `/blog` - Blog listing and detail pages
  - `/gallery` - Photography gallery with waterfall layout
  - `/products` - Product showcase pages

- **`(auth)/`** - Authentication pages
  - `/login` - User login (password or SMS code)
  - `/register` - User registration with SMS verification

- **`(admin)/admin/`** - Admin dashboard (requires admin role)
  - `/admin/dashboard` - Statistics dashboard
  - `/admin/users` - User management
  - `/admin/posts` - Blog post management
  - `/admin/photos` - Photo management
  - `/admin/products` - Product management
  - `/admin/settings` - System configuration

- **`api/`** - API routes organized by feature
  - `auth/` - Authentication (login, register, send-code)
  - `blog/` - Blog posts, categories, tags
  - `gallery/` - Photos and albums
  - `products/` - Products and plans
  - `comments/` - Comment system
  - `likes/` - Like functionality
  - `admin/` - Admin-specific operations

### Database Architecture

The Prisma schema (`prisma/schema.prisma`) is organized into logical sections:

1. **User System** - Users, roles, permissions with RBAC
2. **Blog System** - Posts, categories, tags with many-to-many relationships
3. **Photography System** - Photos, albums, EXIF metadata
4. **Product System** - Products, pricing plans, subscriptions
5. **Interaction System** - Comments, likes, favorites, donations
6. **Order System** - Orders, payments with status tracking
7. **System Config** - Site configuration, page modules, operation logs, statistics

Key patterns:
- All IDs use `cuid()` for globally unique identifiers
- Soft deletes via status enums (ACTIVE/INACTIVE/BANNED, DRAFT/PUBLISHED/ARCHIVED)
- Polymorphic relationships using `targetType` + `targetId` pattern (comments, likes, favorites)
- Cascading deletes configured at database level via `onDelete: Cascade`
- Indexes on foreign keys and frequently queried fields

### Authentication & Authorization

- **JWT-based authentication** using `jsonwebtoken` library
  - Token generated in `src/lib/auth/jwt.ts`
  - 7-day expiration by default
  - Payload includes: `userId`, `phone`, `roles[]`

- **Password hashing** with `bcryptjs` (10 salt rounds)

- **Role-Based Access Control (RBAC)**
  - Roles: 超级管理员, 内容编辑者, 普通用户, 游客
  - Permissions stored in `permissions` table, linked via `role_permissions`
  - Check user roles from JWT payload in API routes

- **API Authentication Pattern**:
  ```typescript
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  const payload = JwtHelper.verify(token)
  if (!payload) return ApiResponseHelper.unauthorized()
  ```

### API Response Pattern

All API routes use standardized responses via `ApiResponseHelper` (`src/lib/utils/response.ts`):

```typescript
// Success
return ApiResponseHelper.success(data, 'Success message')

// Error shortcuts
return ApiResponseHelper.error('Error message', 400)
return ApiResponseHelper.unauthorized()  // 401
return ApiResponseHelper.forbidden()     // 403
return ApiResponseHelper.notFound()      // 404
return ApiResponseHelper.serverError()   // 500
```

Response format:
```typescript
{
  success: boolean
  data?: any
  message?: string
  error?: string
  code?: number
}
```

### Prisma Client Usage

- Singleton instance exported from `src/lib/prisma/client.ts`
- Import as: `import { prisma } from '@/lib/prisma/client'`
- Configured with query logging in development
- Prevents multiple instances in development via global caching

### Component Structure

- **`components/ui/`** - Reusable UI primitives (Button, Input, Card, etc.)
- **`components/layout/`** - Layout components (Header, Footer, Sidebar)
- **`components/features/`** - Feature-specific components organized by domain

Use Tailwind CSS for styling with the `cn()` utility from `src/lib/utils/cn.ts` for conditional classes.

## Environment Variables

Required variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing (change in production!)
- `NEXTAUTH_SECRET` - NextAuth secret (change in production!)

Optional services:
- Aliyun SMS for verification codes
- Aliyun OSS for file storage
- WeChat Pay / Alipay for payments
- Redis for caching

## Development Workflow

### Making Database Changes

1. Edit `prisma/schema.prisma`
2. Run `npm run db:migrate` to create migration
3. Run `npm run db:generate` to update Prisma Client
4. Restart dev server if types don't update

### Adding New API Routes

1. Create route handler in `src/app/api/[feature]/route.ts`
2. Use `ApiResponseHelper` for consistent responses
3. Validate JWT token for protected routes
4. Handle errors with try-catch and return appropriate error responses
5. Follow RESTful conventions (GET for read, POST for create, PUT/PATCH for update, DELETE for delete)

### Adding New Pages

1. Create page in appropriate route group: `(public)`, `(auth)`, or `(admin)`
2. Use Server Components by default for better performance
3. Add 'use client' directive only when needed (forms, interactivity)
4. Import types from `@/types` using path alias

## Important Notes

- **Path Aliases**: Use `@/*` to reference `src/*` (configured in `tsconfig.json`)
- **Route Groups**: Parentheses in folder names `(public)` don't affect URL structure
- **Prisma Client**: Always regenerate after schema changes with `npm run db:generate`
- **SMS Verification**: In development, verification codes are logged to console (not sent via SMS)
- **Security**: Never commit `.env` file - it contains secrets and is gitignored
- **Database Seeding**: Creates default admin account and sample data - safe to run multiple times (uses upsert)

## Common Patterns

### Pagination in API Routes

```typescript
const page = parseInt(searchParams.get('page') || '1')
const pageSize = parseInt(searchParams.get('pageSize') || '10')
const skip = (page - 1) * pageSize

const [data, total] = await Promise.all([
  prisma.model.findMany({ skip, take: pageSize }),
  prisma.model.count()
])

return ApiResponseHelper.success({
  data,
  pagination: {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize)
  }
})
```

### Polymorphic Relations (Comments, Likes, Favorites)

Use `targetType` enum + `targetId` string pattern:
```typescript
await prisma.comment.create({
  data: {
    content: '...',
    authorId: userId,
    targetType: 'POST',  // or 'PHOTO', 'PRODUCT'
    targetId: postId
  }
})
```

### Role Checking

```typescript
const userRoles = payload.roles || []
const isAdmin = userRoles.includes('超级管理员')
if (!isAdmin) return ApiResponseHelper.forbidden()
```

## Tech Stack Summary

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript 5+
- **Database**: PostgreSQL 14+ with Prisma ORM
- **Styling**: Tailwind CSS 4
- **Authentication**: JWT + bcryptjs
- **UI**: Custom component library (no external UI framework)
- **State Management**: React Hooks (no Redux/Zustand)
