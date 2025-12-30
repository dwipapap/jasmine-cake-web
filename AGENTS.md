# AGENTS.md - Dapur Keluarga (Jasmine Cake and Cookies)

> Guidelines for AI coding agents working in this Next.js 16 + Supabase codebase.

## Build & Development Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint (eslint-config-next with TypeScript)
```

**No test framework configured** - this project does not have tests yet.

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS 4 with custom theme
- **UI Components**: shadcn/ui pattern (Radix UI + class-variance-authority)
- **Forms**: react-hook-form + zod validation
- **Icons**: lucide-react

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── admin/              # Admin panel (protected)
│   ├── galeri/             # Product gallery
│   ├── produk/[id]/        # Product detail
│   └── layout.tsx          # Root layout
├── components/
│   ├── admin/              # Admin-specific components
│   ├── gallery/            # Gallery components
│   ├── home/               # Homepage components
│   ├── layout/             # Navbar, Footer, WhatsAppButton
│   ├── product/            # Product detail components
│   ├── testimonial/        # Testimonial components
│   └── ui/                 # Base UI components (shadcn/ui style)
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   ├── server.ts       # Server Supabase client
│   │   └── types.ts        # Database types (auto-generated style)
│   ├── actions.ts          # Server Actions (all mutations)
│   └── utils.ts            # Utility functions + constants
└── middleware.ts           # Auth middleware for /admin routes
```

## Code Style Guidelines

### Imports

```typescript
// 1. External packages first
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 2. Internal absolute imports (use @/ alias)
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";

// 3. Use barrel exports from feature directories
import { HeroSection, CategorySection } from "@/components/home";
import { Navbar, Footer, WhatsAppButton } from "@/components/layout";
```

### TypeScript

- **Strict mode enabled** - no implicit any
- **Never use**: `as any`, `@ts-ignore`, `@ts-expect-error`
- **Type imports**: Use `import type` for type-only imports
- **Database types**: Derive from `Database["public"]["Tables"]["table_name"]["Row"]`

```typescript
// Correct: Derived types from database schema
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type ProductWithImages = Product & {
  product_images: ProductImage[];
  categories: Category | null;
};

// Correct: Explicit function parameter types
export async function createProduct(formData: {
  name: string;
  description?: string;
  category_id: string;
  is_available: boolean;
}) { ... }
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files (pages) | kebab-case | `admin/login/page.tsx` |
| Files (components) | PascalCase | `HeroSection.tsx` |
| Files (utils) | camelCase | `actions.ts`, `utils.ts` |
| Components | PascalCase | `CategoryCard`, `AdminSidebar` |
| Functions | camelCase | `createProduct`, `formatWhatsAppLink` |
| Variables | camelCase | `formData`, `selectedIndex` |
| Constants | UPPER_SNAKE_CASE | `SIDEBAR_ITEMS`, `WHATSAPP_NUMBER` |
| Database tables | snake_case | `product_images`, `categories` |
| Props interfaces | ComponentNameProps | `ButtonProps`, `AdminSidebarProps` |

### Components

```typescript
// Client components: Add directive at top
"use client";

import { useState } from "react";

// Props interface defined before component
interface AdminSidebarProps {
  onLogout: () => void;
}

// Named export (not default)
export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // ...
}

// For forwardRef components, set displayName
Button.displayName = "Button";
```

### Server Actions

All data mutations go through Server Actions in `src/lib/actions.ts`:

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProduct(formData: { ... }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .insert({ ... })
    .select()
    .single();

  // Return error object, don't throw
  if (error) {
    return { error: error.message };
  }

  // Revalidate affected paths
  revalidatePath("/admin/produk");
  revalidatePath("/galeri");
  revalidatePath("/");

  return { data };
}
```

### Error Handling

- **Server Actions**: Return `{ error: string }` or `{ success: true, data }` - never throw
- **Components**: Use state to track errors, display user-friendly messages
- **Catch blocks**: Avoid empty catch - at minimum log or comment why ignored

```typescript
// Server Action pattern
if (error) {
  return { error: error.message };
}
return { success: true };

// Component pattern
const result = await createProduct(formData);
if (result.error) {
  setError(result.error);
  return;
}
```

### Styling (Tailwind CSS)

- **Custom theme colors**: `burgundy-*` (50-900), `cream-*` (50-500), `gold`, `warm-gray`
- **Use `cn()` utility** for conditional classes (from `@/lib/utils`)
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "flex items-center gap-3 rounded-lg px-3 py-2",
  isActive ? "bg-burgundy-100 text-burgundy-900" : "text-burgundy-600"
)} />
```

### Supabase Usage

```typescript
// Server Components / Server Actions
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

// Client Components
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// Always type with Database
createServerClient<Database>(url, key, options);
```

## Important Patterns

### Authentication

- Middleware protects `/admin/*` routes (except `/admin/login`)
- Uses Supabase Auth with SSR cookie handling
- Check `supabase.auth.getUser()` for auth state

### Data Fetching

- **Server Components**: Fetch directly with Supabase client
- **Mutations**: Always use Server Actions from `lib/actions.ts`
- **Revalidation**: Call `revalidatePath()` after mutations

### File Uploads

```typescript
// Upload to Supabase Storage bucket "kue"
const { error } = await supabase.storage
  .from("kue")
  .upload(fileName, file);

const { data: { publicUrl } } = supabase.storage
  .from("kue")
  .getPublicUrl(fileName);
```

## Do NOT

- Use `export default` for components (use named exports)
- Suppress TypeScript errors with `any` or ignore comments
- Throw errors in Server Actions (return error objects)
- Mix data fetching patterns (keep Server Actions for mutations)
- Add new dependencies without clear justification
