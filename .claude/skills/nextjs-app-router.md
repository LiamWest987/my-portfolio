# Next.js 15 App Router - Claude Skill

**Purpose**: Comprehensive guide for building with Next.js 15 App Router, Server Components, and Server Actions for The Mordecai Collective.

---

## Overview

Next.js 15 with App Router represents a fundamental shift in how React applications are built:

- **Server Components by default**: All components are Server Components unless marked with `'use client'`
- **Server Actions**: First-class support for server-side mutations with `'use server'`
- **Async Components**: Server Components can be async and fetch data directly
- **Improved caching**: Granular control over static and dynamic rendering
- **Turbopack**: Faster development builds (enabled with `next dev --turbopack`)

**Project Context**: The Mordecai Collective is a faith-based platform connecting builders and givers. The application uses:
- Next.js 15.0+ with App Router
- React 19.2+
- TypeScript
- Tailwind CSS v4
- Sanity CMS (next-sanity)
- Supabase for authentication
- Vercel for deployment

---

## Server Components vs Client Components

### Server Components (Default)

**When to use**:
- Fetching data from APIs or databases
- Accessing backend resources directly
- Keeping sensitive logic/tokens on the server
- Reducing client-side JavaScript bundle
- SEO-critical content

**Characteristics**:
- Run only on the server
- Can be async (use `async/await` directly)
- Can import server-only modules
- Cannot use React hooks (`useState`, `useEffect`, etc.)
- Cannot use browser APIs
- Cannot use event handlers

**Example from The Mordecai Collective**:

```tsx
// app/(marketing)/articles/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Server Component - async, generates metadata, fetches data
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug); // Direct data fetching

  if (!article) {
    return {
      title: "Article Not Found | The Mordecai Collective",
    };
  }

  return {
    title: `${article.title} | The Mordecai Collective`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound(); // Renders not-found.tsx
  }

  return (
    <article className="py-12">
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
}
```

### Client Components

**When to use**:
- Interactive UI requiring event handlers (`onClick`, `onChange`, etc.)
- React hooks (`useState`, `useEffect`, `useContext`, etc.)
- Browser-only APIs (`window`, `localStorage`, `IntersectionObserver`)
- Third-party libraries that depend on browser APIs
- Real-time features (WebSockets)

**Characteristics**:
- Marked with `'use client'` directive at the top of the file
- Can use all React features
- Hydrated on the client (interactive)
- Cannot be async
- Cannot import server-only modules

**Example - Interactive Navigation**:

```tsx
// components/marketing/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background">
      <nav>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link href="/about">About</Link>
            <Link href="/articles">Articles</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
```

### Composition Pattern (Best Practice)

**Keep Client Components small and leaf-level**:

```tsx
// ✅ Good: Server Component with Client Component children
// app/page.tsx (Server Component)
import { Header } from '@/components/marketing/Header'; // Client
import { Hero } from '@/components/marketing/Hero'; // Server
import { ArticleList } from '@/components/marketing/ArticleList'; // Server

export default async function HomePage() {
  const articles = await fetchRecentArticles(); // Server-side fetch

  return (
    <div>
      <Header /> {/* Client Component - only this needs JS */}
      <Hero /> {/* Server Component - static */}
      <ArticleList articles={articles} /> {/* Server Component - pre-rendered */}
    </div>
  );
}
```

```tsx
// ❌ Bad: Making entire tree client-side unnecessarily
'use client';

export default function HomePage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles').then(r => r.json()).then(setArticles);
  }, []);

  // Now everything is client-rendered, slower, worse SEO
  return (
    <div>
      <Header />
      <Hero />
      <ArticleList articles={articles} />
    </div>
  );
}
```

### Performance Implications

| Aspect | Server Components | Client Components |
|--------|------------------|------------------|
| Bundle size | Not sent to client | Increases bundle size |
| Initial load | Faster (pre-rendered HTML) | Slower (needs hydration) |
| SEO | Excellent (content in HTML) | Poor (content in JS) |
| Interactivity | None | Full React interactivity |
| Data fetching | Direct (no API needed) | Requires API or props |
| Sensitive data | Safe (never sent to client) | Risky (visible in bundle) |

---

## Server Actions

Server Actions allow you to run server-side code directly from forms and event handlers without creating API routes.

### Creating Server Actions

**File-level Server Actions** (`'use server'` at top of file):

```tsx
// app/actions/newsletter.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  audience: z.enum(['builder', 'giver']),
});

export async function subscribeToNewsletter(formData: FormData) {
  // 1. Validate input (ALWAYS validate on server)
  const rawData = {
    email: formData.get('email'),
    audience: formData.get('audience'),
  };

  const validation = subscribeSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.flatten().fieldErrors,
    };
  }

  const { email, audience } = validation.data;

  try {
    // 2. Perform server-side operation
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY!, // Server-only secret
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: audience === 'builder' ? [2] : [3],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe');
    }

    // 3. Revalidate cached data if needed
    revalidatePath('/builders');
    revalidatePath('/givers');

    return {
      success: true,
      message: 'Successfully subscribed!',
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      error: { general: 'Something went wrong. Please try again.' },
    };
  }
}
```

**Inline Server Actions** (inside Server Components):

```tsx
// app/(marketing)/contact/page.tsx
import { redirect } from 'next/navigation';
import { z } from 'zod';

export default function ContactPage() {
  async function handleContactForm(formData: FormData) {
    'use server'; // Inline server action

    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Validate
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      message: z.string().min(10),
    });

    const validation = schema.safeParse({ name, email, message });

    if (!validation.success) {
      // Handle errors - will cover this below
      return;
    }

    // Save to database
    await saveContactSubmission(validation.data);

    // Redirect to success page
    redirect('/contact/success');
  }

  return (
    <form action={handleContactForm}>
      <input name="name" required />
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send Message</button>
    </form>
  );
}
```

### Form Handling Patterns

**Basic Form with Server Action**:

```tsx
// Server Component
export default function NewsletterSignup() {
  async function subscribe(formData: FormData) {
    'use server';

    const email = formData.get('email');
    // Process subscription...
  }

  return (
    <form action={subscribe}>
      <input type="email" name="email" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}
```

**Form with Loading State** (requires Client Component):

```tsx
// components/NewsletterForm.tsx
'use client';

import { useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from '@/app/actions/newsletter';

function SubmitButton() {
  const { pending } = useFormStatus(); // Hook to get form submission state

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Subscribing...' : 'Subscribe'}
    </button>
  );
}

export function NewsletterForm() {
  return (
    <form action={subscribeToNewsletter}>
      <input type="email" name="email" required />
      <select name="audience" required>
        <option value="builder">Builder</option>
        <option value="giver">Giver</option>
      </select>
      <SubmitButton />
    </form>
  );
}
```

**Form with Error Handling** (using `useFormState`):

```tsx
// components/NewsletterFormWithErrors.tsx
'use client';

import { useFormState } from 'react-dom';
import { subscribeToNewsletter } from '@/app/actions/newsletter';

const initialState = {
  success: false,
  error: null,
  message: '',
};

export function NewsletterFormWithErrors() {
  const [state, formAction] = useFormState(subscribeToNewsletter, initialState);

  return (
    <form action={formAction}>
      <div>
        <input type="email" name="email" required />
        {state.error?.email && (
          <p className="text-red-500">{state.error.email}</p>
        )}
      </div>

      <div>
        <select name="audience" required>
          <option value="">Select audience</option>
          <option value="builder">Builder</option>
          <option value="giver">Giver</option>
        </select>
        {state.error?.audience && (
          <p className="text-red-500">{state.error.audience}</p>
        )}
      </div>

      <button type="submit">Subscribe</button>

      {state.success && (
        <p className="text-green-500">{state.message}</p>
      )}
      {state.error?.general && (
        <p className="text-red-500">{state.error.general}</p>
      )}
    </form>
  );
}
```

### Revalidation

**revalidatePath**: Purge cached data for a specific path

```tsx
'use server';

import { revalidatePath } from 'next/cache';

export async function updateArticle(articleId: string, data: ArticleData) {
  // Update article in database
  await db.article.update(articleId, data);

  // Revalidate specific paths
  revalidatePath('/articles'); // List page
  revalidatePath(`/articles/${data.slug}`); // Detail page
  revalidatePath('/', 'layout'); // Revalidate entire layout tree
}
```

**revalidateTag**: Purge cached data by tag

```tsx
// When fetching data, add cache tags
export async function fetchArticles() {
  const articles = await fetch('https://api.sanity.io/...', {
    next: {
      tags: ['articles'], // Add cache tag
    },
  });
  return articles;
}

// In Server Action, revalidate by tag
'use server';

import { revalidateTag } from 'next/cache';

export async function publishArticle(articleId: string) {
  await db.article.publish(articleId);

  revalidateTag('articles'); // Revalidates ALL fetches tagged with 'articles'
}
```

**Time-based revalidation**:

```tsx
// Revalidate every 60 seconds
export async function fetchArticles() {
  const articles = await fetch('https://api.sanity.io/...', {
    next: {
      revalidate: 60, // Revalidate after 60 seconds
    },
  });
  return articles;
}
```

### Security Best Practices

**1. ALWAYS validate input**:

```tsx
'use server';

import { z } from 'zod';

export async function updateProfile(formData: FormData) {
  // ✅ Good: Validate everything
  const schema = z.object({
    name: z.string().min(2).max(50),
    bio: z.string().max(500),
    website: z.string().url().optional(),
  });

  const validation = schema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
    website: formData.get('website'),
  });

  if (!validation.success) {
    return { error: validation.error.flatten() };
  }

  // Now safe to use validation.data
  await saveProfile(validation.data);
}
```

**2. ALWAYS check authentication**:

```tsx
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function deleteAccount() {
  // ✅ Good: Check auth first
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Now safe to perform action for authenticated user
  await db.user.delete(user.id);
}
```

**3. NEVER trust client-side data**:

```tsx
// ❌ Bad: Trusting user ID from client
export async function updateUser(userId: string, data: any) {
  'use server';
  // Attacker could pass ANY userId!
  await db.user.update(userId, data);
}

// ✅ Good: Get user ID from session
export async function updateUser(data: UserData) {
  'use server';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Use user.id from authenticated session
  await db.user.update(user.id, data);
}
```

**4. Rate limiting**:

```tsx
'use server';

import { ratelimit } from '@/lib/ratelimit';

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string;

  // Check rate limit
  const { success } = await ratelimit.limit(email);

  if (!success) {
    return {
      error: 'Too many requests. Please try again later.',
    };
  }

  // Process subscription...
}
```

### When to Use Server Actions vs API Routes

**Use Server Actions when**:
- Simple form submissions
- Data mutations from forms
- Actions triggered by user interactions
- Want type safety end-to-end
- Building primarily with Server Components

**Use API Routes when**:
- Need to be called from external sources (mobile apps, webhooks)
- Need specific HTTP methods/headers
- Building REST/GraphQL APIs
- Need fine-grained middleware
- Require custom response formats

**Example - Both approaches**:

```tsx
// Server Action (for internal forms)
// app/actions/contact.ts
'use server';

export async function submitContactForm(formData: FormData) {
  // Only callable from your Next.js app
  const data = validateAndParse(formData);
  await saveToDatabase(data);
  await sendEmail(data);
  return { success: true };
}

// API Route (for external integrations)
// app/api/contact/route.ts
export async function POST(request: Request) {
  // Can be called from anywhere (mobile app, Zapier, etc.)
  const data = await request.json();
  const validated = validateAndParse(data);
  await saveToDatabase(validated);
  await sendEmail(validated);
  return Response.json({ success: true });
}
```

---

## Project Structure

### The Mordecai Collective Structure

```
app/
├── layout.tsx                    # Root layout (fonts, metadata)
├── page.tsx                      # Homepage (/)
├── globals.css                   # Global styles
│
├── (marketing)/                  # Route group - shared layout
│   ├── about/
│   │   └── page.tsx             # /about
│   ├── articles/
│   │   ├── page.tsx             # /articles (list)
│   │   └── [slug]/
│   │       └── page.tsx         # /articles/[slug] (detail)
│   ├── studies/
│   │   ├── page.tsx             # /studies (list)
│   │   └── [slug]/
│   │       └── page.tsx         # /studies/[slug] (detail)
│   ├── builders/
│   │   └── page.tsx             # /builders
│   ├── givers/
│   │   └── page.tsx             # /givers
│   ├── resources/
│   │   └── page.tsx             # /resources
│   ├── contact/
│   │   └── page.tsx             # /contact
│   ├── privacy/
│   │   └── page.tsx             # /privacy
│   └── terms/
│       └── page.tsx             # /terms
│
├── (auth)/                       # Route group - future auth pages
│   ├── login/
│   │   └── page.tsx             # /login
│   └── signup/
│       └── page.tsx             # /signup
│
├── (member)/                     # Route group - future member area
│   ├── layout.tsx               # Member-only layout
│   ├── dashboard/
│   │   └── page.tsx             # /dashboard
│   └── profile/
│       └── page.tsx             # /profile
│
└── api/                          # API Routes (future)
    └── webhook/
        └── route.ts              # /api/webhook
```

### File Conventions

| File | Purpose | Example |
|------|---------|---------|
| `layout.tsx` | Shared UI for route segment and children | Navigation, footer |
| `page.tsx` | Unique UI for route, makes path publicly accessible | Homepage, article detail |
| `loading.tsx` | Loading UI (Suspense boundary) | Skeleton screens |
| `error.tsx` | Error UI (Error boundary) | Error messages |
| `not-found.tsx` | 404 UI | Custom 404 page |
| `template.tsx` | Re-renders on navigation (unlike layout) | Analytics tracking |
| `default.tsx` | Fallback for parallel routes | Default slot content |

**Example - Root Layout**:

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env["NEXT_PUBLIC_SITE_URL"] ?? "http://localhost:3000"
  ),
  title: {
    default: "The Mordecai Collective",
    template: "%s | The Mordecai Collective", // Page title | Site name
  },
  description: "Walk alongside builders and stewards in their divine moment",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "The Mordecai Collective",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

**Example - Loading State**:

```tsx
// app/(marketing)/articles/loading.tsx
export default function ArticlesLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Skeleton UI */}
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Example - Error Boundary**:

```tsx
// app/(marketing)/articles/error.tsx
'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function ArticlesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Articles error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load the articles. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

**Example - Not Found**:

```tsx
// app/(marketing)/articles/not-found.tsx
import Link from 'next/link';

export default function ArticleNotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The article you're looking for doesn't exist.
        </p>
        <Link
          href="/articles"
          className="inline-block px-4 py-2 bg-primary text-white rounded"
        >
          Back to Articles
        </Link>
      </div>
    </div>
  );
}
```

### Route Groups

Route groups organize routes without affecting URL structure. Wrap folder name in parentheses: `(groupName)`

**Benefits**:
- Organize routes logically
- Share layouts among specific routes
- Create multiple root layouts (for different sections)

**Example**:

```
app/
├── (marketing)/
│   ├── layout.tsx       # Marketing layout (public header/footer)
│   ├── page.tsx         # / (homepage)
│   ├── about/
│   └── articles/
│
└── (member)/
    ├── layout.tsx       # Member layout (authenticated, sidebar)
    ├── dashboard/       # /dashboard (not /member/dashboard)
    └── profile/         # /profile
```

**Marketing Layout**:

```tsx
// app/(marketing)/layout.tsx
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

**Member Layout**:

```tsx
// app/(member)/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/member/Sidebar';

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

### Parallel Routes & Intercepting Routes

**Parallel Routes** - Render multiple pages in the same layout simultaneously

```
app/
└── dashboard/
    ├── @analytics/
    │   └── page.tsx     # Slot for analytics
    ├── @team/
    │   └── page.tsx     # Slot for team
    ├── layout.tsx
    └── page.tsx
```

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2 gap-4">
        <div>{analytics}</div>
        <div>{team}</div>
      </div>
    </div>
  );
}
```

**Intercepting Routes** - Intercept a route and show it in current context (e.g., modal)

```
app/
└── photos/
    ├── [id]/
    │   └── page.tsx           # /photos/123 (full page)
    └── (.)[id]/
        └── page.tsx           # Intercept /photos/123 (show in modal)
```

Useful for:
- Photo galleries (modal on same page, full page on refresh)
- Login modals (modal from home, full page on direct visit)
- Quick previews

---

## Data Fetching

### Async Server Components

Server Components can be async - fetch data directly without `useEffect`:

```tsx
// ✅ Good: Direct data fetching in Server Component
export default async function ArticlesPage() {
  const articles = await fetchArticles(); // Direct fetch, no API route needed

  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

async function fetchArticles() {
  // Fetch from Sanity CMS
  const articles = await client.fetch(`
    *[_type == "article"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt
    }
  `);

  return articles;
}
```

```tsx
// ❌ Bad: Client Component pattern (old way)
'use client';

import { useState, useEffect } from 'react';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

### Request Deduplication

Next.js automatically deduplicates identical `fetch` requests in the same render pass:

```tsx
// These fetches happen in parallel, but only ONE request is made
async function Header() {
  const user = await fetchUser(); // Request 1
  return <div>Welcome, {user.name}</div>;
}

async function Sidebar() {
  const user = await fetchUser(); // Same request, deduplicated!
  return <div>Profile: {user.email}</div>;
}

async function Page() {
  const user = await fetchUser(); // Still the same request!

  return (
    <div>
      <Header />
      <Sidebar />
      <main>Content for {user.name}</main>
    </div>
  );
}

async function fetchUser() {
  // This fetch is called 3 times, but only executes ONCE
  const res = await fetch('https://api.example.com/user', {
    next: { revalidate: 3600 },
  });
  return res.json();
}
```

**Manual deduplication with `cache()`**:

```tsx
import { cache } from 'react';

// Wrap function in cache() to deduplicate non-fetch requests
export const getUser = cache(async (id: string) => {
  // Database query, not fetch
  const user = await db.user.findUnique({ where: { id } });
  return user;
});

// Now calling getUser() multiple times only executes once
```

### Caching Strategies

**1. Static Rendering (Full Cache)**:

```tsx
// Fully cached at build time, never revalidates
export default async function AboutPage() {
  const content = await fetchAboutContent(); // Cached forever

  return <div>{content}</div>;
}
```

**2. Incremental Static Regeneration (ISR)**:

```tsx
// Revalidate every 60 seconds
async function fetchArticles() {
  const res = await fetch('https://api.sanity.io/articles', {
    next: { revalidate: 60 }, // Revalidate after 60 seconds
  });
  return res.json();
}

export default async function ArticlesPage() {
  const articles = await fetchArticles();
  return <ArticleList articles={articles} />;
}
```

**3. Dynamic Rendering (No Cache)**:

```tsx
// Never cached - always fresh
async function fetchUserData() {
  const res = await fetch('https://api.example.com/user', {
    cache: 'no-store', // Never cache
  });
  return res.json();
}

export default async function DashboardPage() {
  const user = await fetchUserData(); // Fresh on every request
  return <div>Welcome, {user.name}</div>;
}
```

**4. Tag-based Revalidation**:

```tsx
// Tag fetches for granular revalidation
async function fetchArticles() {
  const res = await fetch('https://api.sanity.io/articles', {
    next: {
      tags: ['articles'], // Tag this request
    },
  });
  return res.json();
}

// Later, revalidate all 'articles' fetches
'use server';
import { revalidateTag } from 'next/cache';

export async function publishArticle() {
  await db.article.publish();
  revalidateTag('articles'); // Revalidate all fetches with this tag
}
```

**Caching Decision Tree**:

```
Does data change?
├─ No → Static (build time cache)
├─ Yes, predictably → ISR (time-based revalidation)
├─ Yes, on events → On-demand (tag/path revalidation)
└─ Yes, constantly → Dynamic (no cache)
```

---

## Metadata API

### Static Metadata

```tsx
// app/(marketing)/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about The Mordecai Collective mission and values',
  openGraph: {
    title: 'About The Mordecai Collective',
    description: 'Walk alongside builders and stewards in their divine moment',
    images: ['/og-image-about.jpg'],
  },
};

export default function AboutPage() {
  return <div>About content</div>;
}
```

### Dynamic Metadata

```tsx
// app/(marketing)/articles/[slug]/page.tsx
import type { Metadata } from 'next';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: ArticlePageProps
): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.coverImage.url,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage.url],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <article>{/* Article content */}</article>;
}
```

### OpenGraph Images

**Static OG Image**:

```tsx
export const metadata: Metadata = {
  openGraph: {
    images: ['/og-default.jpg'],
  },
};
```

**Dynamic OG Image (using next/og)**:

```tsx
// app/(marketing)/articles/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: { params: { slug: string } }) {
  const article = await fetchArticleBySlug(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#1a1a1a',
          padding: '60px',
        }}
      >
        <h1 style={{ color: 'white', fontSize: 64 }}>
          {article.title}
        </h1>
        <p style={{ color: '#888', fontSize: 32 }}>
          The Mordecai Collective
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
```

---

## Caching & Revalidation

### Static vs Dynamic Rendering

**Next.js decides rendering strategy automatically**:

| Condition | Result |
|-----------|--------|
| All data is static or cached | Static rendering (at build time) |
| Uses `cookies()`, `headers()`, or `searchParams` | Dynamic rendering (at request time) |
| Uses `fetch` with `cache: 'no-store'` | Dynamic rendering |
| Uses `unstable_noStore()` | Dynamic rendering |
| Has Server Actions | Dynamic rendering |

**Force dynamic rendering**:

```tsx
// app/(member)/dashboard/page.tsx
export const dynamic = 'force-dynamic'; // Never cache this page

export default async function DashboardPage() {
  const user = await getCurrentUser(); // Always fresh
  return <div>Welcome, {user.name}</div>;
}
```

**Force static rendering**:

```tsx
// app/(marketing)/about/page.tsx
export const dynamic = 'force-static'; // Always cache

export default async function AboutPage() {
  return <div>Static content</div>;
}
```

### ISR Patterns

**Time-based revalidation**:

```tsx
// Revalidate entire page every 3600 seconds (1 hour)
export const revalidate = 3600;

export default async function ArticlesPage() {
  const articles = await fetchArticles();
  return <ArticleList articles={articles} />;
}
```

**Per-fetch revalidation**:

```tsx
async function fetchArticles() {
  const res = await fetch('https://api.sanity.io/articles', {
    next: { revalidate: 60 }, // This fetch revalidates every 60s
  });
  return res.json();
}

async function fetchAuthors() {
  const res = await fetch('https://api.sanity.io/authors', {
    next: { revalidate: 3600 }, // This fetch revalidates every hour
  });
  return res.json();
}

export default async function ArticlesPage() {
  const [articles, authors] = await Promise.all([
    fetchArticles(), // Revalidates every 60s
    fetchAuthors(),  // Revalidates every hour
  ]);

  return <ArticleList articles={articles} authors={authors} />;
}
```

### Cache Invalidation Strategies

**1. On-Demand Path Revalidation**:

```tsx
'use server';

import { revalidatePath } from 'next/cache';

export async function publishArticle(slug: string) {
  await db.article.publish(slug);

  revalidatePath('/articles'); // Revalidate list page
  revalidatePath(`/articles/${slug}`); // Revalidate detail page
  revalidatePath('/', 'layout'); // Revalidate entire homepage layout
}
```

**2. On-Demand Tag Revalidation**:

```tsx
// When fetching
async function fetchArticles() {
  const res = await fetch('https://api.sanity.io/articles', {
    next: { tags: ['articles', 'content'] },
  });
  return res.json();
}

async function fetchStudies() {
  const res = await fetch('https://api.sanity.io/studies', {
    next: { tags: ['studies', 'content'] },
  });
  return res.json();
}

// When invalidating
'use server';
import { revalidateTag } from 'next/cache';

export async function publishContent() {
  await db.publish();

  revalidateTag('content'); // Revalidates both articles AND studies
}
```

**3. Webhook-based Revalidation** (from CMS):

```tsx
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Verify secret token from CMS webhook
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const body = await request.json();
  const { type, slug } = body;

  try {
    if (type === 'article') {
      revalidateTag('articles');
      revalidatePath(`/articles/${slug}`);
    } else if (type === 'study') {
      revalidateTag('studies');
      revalidatePath(`/studies/${slug}`);
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}
```

---

## Performance Optimization

### Code Splitting

**Automatic Code Splitting** - Every route is automatically code-split:

```
app/
├── page.tsx           # Only loaded for /
├── about/
│   └── page.tsx       # Only loaded for /about
└── articles/
    └── page.tsx       # Only loaded for /articles
```

**Dynamic Imports** - Lazy load components:

```tsx
import dynamic from 'next/dynamic';

// Lazy load heavy component
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Don't render on server (client-only)
});

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart /> {/* Only loads when page is visited */}
    </div>
  );
}
```

**Conditional Dynamic Imports**:

```tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'));

export function VideoSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div>
      <button onClick={() => setShowVideo(true)}>
        Watch Video
      </button>
      {showVideo && <VideoPlayer />} {/* Only loads when clicked */}
    </div>
  );
}
```

### next/image Optimization

```tsx
import Image from 'next/image';

export function ArticleHero({ article }: { article: Article }) {
  return (
    <Image
      src={article.coverImage.url}
      alt={article.title}
      width={1200}
      height={630}
      priority // Load immediately (above fold)
      placeholder="blur"
      blurDataURL={article.coverImage.blurDataURL}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="w-full h-auto"
    />
  );
}
```

**Benefits**:
- Automatic image optimization (WebP, AVIF)
- Responsive images (srcset)
- Lazy loading by default
- Blur-up placeholders
- No layout shift (CLS)

### Font Optimization (next/font)

**From The Mordecai Collective**:

```tsx
// app/layout.tsx
import { Plus_Jakarta_Sans, Merriweather, Montserrat } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap", // Prevent FOIT (Flash of Invisible Text)
  variable: "--font-sans",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  variable: "--font-serif",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${merriweather.variable} ${montserrat.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans; /* Uses --font-sans */
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-serif; /* Uses --font-serif */
  }
}
```

**Benefits**:
- Self-hosted fonts (no external requests)
- Zero layout shift
- Automatic font subsetting
- Preloading

### Bundle Analysis

```bash
# Install bundle analyzer
npm install @next/bundle-analyzer --save-dev

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your Next.js config
});

# Run analysis
ANALYZE=true npm run build
```

**Optimization checklist**:
- [ ] Remove unused dependencies
- [ ] Use dynamic imports for heavy components
- [ ] Enable tree shaking (`"sideEffects": false` in package.json)
- [ ] Use next/image for all images
- [ ] Use next/font for all fonts
- [ ] Minimize client components
- [ ] Check bundle visualizer for large modules

---

## Examples from The Mordecai Collective

### 1. Marketing Pages Pattern

**Simple static page**:

```tsx
// app/(marketing)/about/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our mission to walk alongside builders and stewards',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold mb-6">
        About The Mordecai Collective
      </h1>
      <div className="prose prose-lg">
        <p>For such a time as this...</p>
      </div>
    </div>
  );
}
```

### 2. Article Detail Page with Dynamic Routes

```tsx
// app/(marketing)/articles/[slug]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { client } from "@/lib/sanity/client";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | The Mordecai Collective",
    };
  }

  return {
    title: `${article.title} | The Mordecai Collective`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      images: [article.coverImage?.url],
    },
  };
}

// Fetch article data
async function fetchArticleBySlug(slug: string) {
  const article = await client.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      readTime,
      audience,
      "relatedArticles": relatedArticles[]->slug.current
    }`,
    { slug },
    {
      next: {
        revalidate: 60, // Revalidate every 60 seconds
        tags: ['articles', `article-${slug}`],
      },
    }
  );

  return article;
}

// Main page component
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound(); // Renders app/(marketing)/articles/not-found.tsx
  }

  return (
    <div className="min-h-screen bg-background">
      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>

            {/* Article Meta */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-display font-semibold border">
                {article.audience === 'builder' ? 'Builders & Creators' : 'Givers & Stewards'}
              </span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {article.readTime}
                </span>
              </div>
            </div>

            {/* Title & Excerpt */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              {article.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-6">
              {article.excerpt}
            </p>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:font-bold prose-headings:text-primary
                prose-p:text-muted-foreground prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      </article>
    </div>
  );
}

// Generate static paths at build time (optional)
export async function generateStaticParams() {
  const articles = await client.fetch(
    `*[_type == "article"] { "slug": slug.current }`
  );

  return articles.map((article: { slug: string }) => ({
    slug: article.slug,
  }));
}
```

### 3. Server Actions for Newsletter Signup (Future)

```tsx
// app/actions/newsletter.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name is required'),
  audience: z.enum(['builder', 'giver'], {
    errorMap: () => ({ message: 'Please select an audience' }),
  }),
});

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  // 1. Validate input
  const validation = subscribeSchema.safeParse({
    email: formData.get('email'),
    firstName: formData.get('firstName'),
    audience: formData.get('audience'),
  });

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    };
  }

  const { email, firstName, audience } = validation.data;

  try {
    // 2. Call Brevo API
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: firstName,
          AUDIENCE: audience,
        },
        listIds: audience === 'builder' ? [2] : [3],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe');
    }

    // 3. Revalidate pages
    revalidatePath('/builders');
    revalidatePath('/givers');

    return {
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    };
  }
}
```

```tsx
// components/NewsletterForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from '@/app/actions/newsletter';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg disabled:opacity-50"
    >
      {pending ? 'Subscribing...' : 'Subscribe'}
    </button>
  );
}

export function NewsletterForm({ audience }: { audience: 'builder' | 'giver' }) {
  const [state, formAction] = useFormState(subscribeToNewsletter, {
    success: false,
    message: '',
    errors: {},
  });

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="audience" value={audience} />

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        {state.errors?.firstName && (
          <p className="text-red-500 text-sm mt-1">{state.errors.firstName[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        {state.errors?.email && (
          <p className="text-red-500 text-sm mt-1">{state.errors.email[0]}</p>
        )}
      </div>

      <SubmitButton />

      {state.message && (
        <p className={state.success ? 'text-green-600' : 'text-red-600'}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

---

## Best Practices Summary

### 2025 Next.js 15 Best Practices

1. **Server Components are default** - Only use `'use client'` when necessary
2. **Keep middleware minimal** - Only use for auth, redirects, headers
3. **Use Server Actions for mutations** - Forms, updates, deletions
4. **Always validate inputs** - Use Zod or similar on the server
5. **Always check authentication** - Never trust client-side data
6. **Prefer static over dynamic** - Use ISR when possible
7. **Use proper caching** - Tag fetches, revalidate strategically
8. **Optimize images** - Always use next/image
9. **Optimize fonts** - Always use next/font
10. **Type everything** - Full TypeScript coverage
11. **Error boundaries** - Handle errors gracefully
12. **Loading states** - Show feedback to users
13. **Metadata for SEO** - Dynamic metadata for dynamic routes
14. **Code split** - Dynamic imports for heavy components
15. **Monitor performance** - Lighthouse, bundle analysis

### Security Checklist

- [ ] Validate all Server Action inputs with Zod
- [ ] Check authentication in all protected routes/actions
- [ ] Never trust user IDs from client (use session)
- [ ] Rate limit Server Actions
- [ ] Use HTTPS-only cookies
- [ ] Sanitize HTML if rendering user content
- [ ] Keep secrets in environment variables (never in code)
- [ ] Use CSP headers (Content Security Policy)
- [ ] Enable CORS only when needed
- [ ] Validate file uploads (type, size, content)

### Performance Checklist

- [ ] Use Server Components by default
- [ ] Minimize client-side JavaScript
- [ ] Use next/image for all images
- [ ] Use next/font for all fonts
- [ ] Enable static rendering when possible
- [ ] Use ISR for semi-static content
- [ ] Tag fetches for granular revalidation
- [ ] Code split with dynamic imports
- [ ] Prefetch links with `<Link>`
- [ ] Optimize database queries (indexes, select only needed fields)
- [ ] Use React.cache() for deduplication
- [ ] Monitor Core Web Vitals

---

## Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [App Router Documentation](https://nextjs.org/docs/app)
- [Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Data Fetching Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [Metadata API Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)

---

**Last Updated**: November 8, 2025
**Next.js Version**: 15.0.1
**React Version**: 19.2.0
