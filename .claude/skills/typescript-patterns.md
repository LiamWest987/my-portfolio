# TypeScript Patterns

## Overview

This skill documents type-safe TypeScript patterns for The Mordecai Collective website, built with Next.js 15, Sanity CMS, React 19, and modern tooling. All patterns follow 2025 best practices: strict mode always enabled, Zod for runtime validation, type inference over explicit types, and never using `any`.

**Stack:**
- Next.js 15 (App Router with React Server Components)
- React 19
- TypeScript 5.9
- Sanity CMS (next-sanity 11.6)
- Zod 4.1 (runtime validation)
- React Hook Form 7.66
- Supabase (type-safe client)

---

## Strict Mode Configuration

### tsconfig.json Settings

Our project uses the strictest TypeScript configuration possible:

```json
{
  "compilerOptions": {
    // Type Checking - STRICTEST
    "strict": true,                              // Enable all strict checks
    "noUncheckedIndexedAccess": true,           // Array/object access returns T | undefined
    "noImplicitOverride": true,                 // Require explicit override keyword
    "noPropertyAccessFromIndexSignature": true, // Force bracket notation for dynamic keys
    "noImplicitReturns": true,                  // All code paths must return
    "noFallthroughCasesInSwitch": true,        // Require break in switch cases
    "noUnusedLocals": true,                     // Error on unused variables
    "noUnusedParameters": true,                 // Error on unused parameters
    "allowUnusedLabels": false,                 // Disallow unused labels
    "allowUnreachableCode": false               // Error on unreachable code
  }
}
```

### Why Each Setting Matters

#### `strict: true`
Enables all strict type-checking options. This is non-negotiable for production code.

```typescript
// ❌ Without strict mode
function greet(name) {  // Implicitly any
  return "Hello " + name.toUpperCase();
}

// ✅ With strict mode
function greet(name: string): string {
  return `Hello ${name.toUpperCase()}`;
}
```

#### `noUncheckedIndexedAccess: true`
**Critical for safety.** Array and object access returns `T | undefined`, forcing null checks.

```typescript
// ❌ Without noUncheckedIndexedAccess
const items = ["apple", "banana"];
const first = items[0];  // Type: string (unsafe!)
console.log(first.toUpperCase());  // Runtime error if items is empty

// ✅ With noUncheckedIndexedAccess
const items = ["apple", "banana"];
const first = items[0];  // Type: string | undefined
if (first) {
  console.log(first.toUpperCase());  // Safe!
}

// Better: Use optional chaining
console.log(items[0]?.toUpperCase());
```

#### `noPropertyAccessFromIndexSignature: true`
Forces bracket notation for dynamic property access, making dynamic keys explicit.

```typescript
interface Settings {
  theme: string;
  [key: string]: unknown;
}

const settings: Settings = { theme: "dark", customProp: "value" };

// ❌ Error with noPropertyAccessFromIndexSignature
const value = settings.customProp;

// ✅ Correct: Use bracket notation for dynamic keys
const value = settings["customProp"];

// ✅ Or: Use defined properties directly
const theme = settings.theme;
```

### Common Errors and Fixes

#### Error: "Object is possibly 'undefined'"

```typescript
// ❌ Error
function getFirstName(user?: { name: string }) {
  return user.name.split(" ")[0];  // Error: user is possibly undefined
}

// ✅ Fix: Guard clause
function getFirstName(user?: { name: string }) {
  if (!user) return null;
  return user.name.split(" ")[0];
}

// ✅ Fix: Optional chaining
function getFirstName(user?: { name: string }) {
  return user?.name.split(" ")[0];
}
```

#### Error: "Type 'X | undefined' is not assignable to type 'X'"

```typescript
// ❌ Error
const users = ["Alice", "Bob"];
const firstUser: string = users[0];  // Error: string | undefined

// ✅ Fix: Type guard
const firstUser = users[0];
if (firstUser) {
  const name: string = firstUser;  // Now safe
}

// ✅ Fix: Nullish coalescing
const firstUser: string = users[0] ?? "Guest";

// ✅ Fix: Non-null assertion (only if you're 100% certain)
const firstUser: string = users[0]!;  // Use sparingly!
```

---

## Type Generation

### Sanity TypeGen Workflow

Sanity TypeGen generates TypeScript types from your Sanity schema definitions.

**Setup:**

```bash
# Install Sanity CLI
npm install -g sanity

# Extract schema types
npx sanity schema extract --path=sanity/schema.json

# Generate TypeScript types
npx sanity typegen generate
```

**Generated types location:** `sanity/types.ts`

**Usage example:**

```typescript
// sanity/types.ts (generated)
export interface Article {
  _id: string;
  _type: "article";
  title: string;
  slug: { current: string };
  publishedAt: string;
  author: {
    name: string;
    image?: { asset: { _ref: string } };
  };
  audience: "giver" | "builder" | "both";
  content: PortableTextBlock[];
  excerpt?: string;
  mainImage?: {
    asset: { _ref: string };
    alt?: string;
  };
}

// lib/sanity/queries.ts
import type { Article } from "@/sanity/types";

export async function getArticles(): Promise<Article[]> {
  return client.fetch(
    `*[_type == "article"] | order(publishedAt desc)`
  );
}
```

### GROQ Query Typing with defineQuery

Use `defineQuery` from `next-sanity` for type-safe GROQ queries.

```typescript
import { defineQuery } from "next-sanity";
import type { Article } from "@/sanity/types";

// Define typed query
const ARTICLES_QUERY = defineQuery(
  `*[_type == "article" && audience match $audience] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage {
      asset->{ url, metadata }
    },
    author->{ name, image }
  } | order(publishedAt desc)`
);

// Use in Server Component
export async function getArticlesByAudience(
  audience: "giver" | "builder" | "both"
): Promise<Article[]> {
  return client.fetch(ARTICLES_QUERY, { audience });
}
```

### Supabase Type Generation

Generate types from your Supabase database schema.

```bash
# Install Supabase CLI
npm install -D supabase

# Login
npx supabase login

# Link project
npx supabase link --project-ref <your-project-ref>

# Generate types
npx supabase gen types typescript --linked > lib/supabase/database.types.ts
```

**Usage:**

```typescript
import type { Database } from "@/lib/supabase/database.types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fully typed queries
const { data: subscribers } = await supabase
  .from("newsletter_subscribers")  // Type: Database["public"]["Tables"]["newsletter_subscribers"]
  .select("*")
  .eq("audience", "giver");
```

---

## Component Typing Patterns

### Function Components vs React.FC

**Modern best practice: Use regular function syntax, not `React.FC`.**

```typescript
// ❌ Avoid React.FC (deprecated pattern)
import type { FC } from "react";

const Header: FC<{ title: string }> = ({ title }) => {
  return <h1>{title}</h1>;
};

// ✅ Use function syntax with typed props interface
interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

// ✅ For Server Components (async)
interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return <article>{/* ... */}</article>;
}
```

### Props Interfaces with JSDoc

Document component props with JSDoc for better DX.

```typescript
interface ButtonProps extends React.ComponentProps<"button"> {
  /** Visual style variant */
  variant?: "default" | "destructive" | "outline" | "ghost";

  /** Button size */
  size?: "default" | "sm" | "lg" | "icon";

  /** Render as child component (using Radix Slot) */
  asChild?: boolean;
}

/**
 * Button component with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Button variant="destructive" size="lg">Delete</Button>
 * ```
 */
export function Button({
  variant = "default",
  size = "default",
  asChild = false,
  className,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
```

### Children Typing

**Use `ReactNode` for general children (recommended).**

```typescript
import type { ReactNode, ReactElement } from "react";

// ✅ Most flexible: Accept any renderable content
interface CardProps {
  children: ReactNode;  // string | number | JSX.Element | null | undefined
  title: string;
}

export function Card({ children, title }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}

// ✅ Strict: Only accept single React element
interface WrapperProps {
  children: ReactElement;  // Must be single JSX element
}

export function Wrapper({ children }: WrapperProps) {
  return <div className="wrapper">{children}</div>;
}

// ✅ Render prop pattern
interface DataListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
}

export function DataList<T>({ data, renderItem }: DataListProps<T>) {
  return <ul>{data.map((item, i) => <li key={i}>{renderItem(item, i)}</li>)}</ul>;
}
```

### Event Handler Types

**Use React's built-in event types.**

```typescript
import type { FormEvent, ChangeEvent, MouseEvent } from "react";

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string }) => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log("Button clicked:", e.currentTarget.name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleInputChange} />
      <input name="email" type="email" />
      <button type="submit" onClick={handleButtonClick}>Submit</button>
    </form>
  );
}
```

### Generic Components with Constraints

```typescript
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps<T extends SelectOption> {
  options: T[];
  value: T["value"];
  onChange: (value: T["value"]) => void;
  renderOption?: (option: T) => ReactNode;
}

export function Select<T extends SelectOption>({
  options,
  value,
  onChange,
  renderOption,
}: SelectProps<T>) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {renderOption ? renderOption(option) : option.label}
        </option>
      ))}
    </select>
  );
}

// Usage with custom type
interface AudienceOption extends SelectOption {
  icon: string;
  description: string;
}

const audiences: AudienceOption[] = [
  { value: "giver", label: "Givers", icon: "🎁", description: "..." },
  { value: "builder", label: "Builders", icon: "🔨", description: "..." },
];

<Select
  options={audiences}
  value={selectedAudience}
  onChange={setSelectedAudience}
  renderOption={(opt) => (
    <span>
      {opt.icon} {opt.label}
    </span>
  )}
/>;
```

---

## API Response Typing

### Type Guards

Type guards narrow types at runtime, essential for external data.

```typescript
// Built-in type guards
function processValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();  // TypeScript knows value is string
  }
  return value.toFixed(2);  // TypeScript knows value is number
}

function handleElement(element: HTMLElement | null) {
  if (element instanceof HTMLInputElement) {
    return element.value;  // TypeScript knows it's HTMLInputElement
  }
  return element?.textContent;
}

// Custom type guard with "is" predicate
interface Article {
  _type: "article";
  title: string;
  slug: { current: string };
}

interface CaseStudy {
  _type: "caseStudy";
  title: string;
  company: string;
}

type Content = Article | CaseStudy;

// Type predicate function
function isArticle(content: Content): content is Article {
  return content._type === "article";
}

function getContentUrl(content: Content): string {
  if (isArticle(content)) {
    return `/articles/${content.slug.current}`;  // TypeScript knows content is Article
  }
  return `/studies/${content.company.toLowerCase()}`;  // TypeScript knows content is CaseStudy
}

// Advanced: Array type guard
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
```

### Zod Validation Schemas

**Zod provides runtime validation + automatic TypeScript type inference.**

```typescript
import { z } from "zod";

// Newsletter signup schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  audience: z.enum(["giver", "builder", "both"], {
    errorMap: () => ({ message: "Please select an audience" }),
  }),

  interests: z
    .array(z.string())
    .min(1, "Please select at least one interest")
    .optional(),

  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
});

// Infer TypeScript type from schema
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
// Type: {
//   email: string;
//   name: string;
//   audience: "giver" | "builder" | "both";
//   interests?: string[] | undefined;
//   agreedToTerms: boolean;
// }

// Use in React Hook Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function NewsletterForm() {
  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      name: "",
      audience: "both",
      agreedToTerms: false,
    },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    // data is fully typed and validated
    await subscribeToNewsletter(data);
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* ... */}</form>;
}

// Server-side validation
export async function subscribeToNewsletter(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    name: formData.get("name"),
    audience: formData.get("audience"),
    agreedToTerms: formData.get("agreedToTerms") === "true",
  };

  // Validate with Zod
  const result = newsletterSchema.safeParse(rawData);

  if (!result.success) {
    return { error: result.error.flatten() };
  }

  // result.data is fully typed
  const validatedData = result.data;
  // Insert to database...
}
```

### Type Narrowing with Discriminated Unions

**Use a literal type property to discriminate between union members.**

```typescript
// API response types with discriminated union
interface SuccessResponse<T> {
  success: true;  // Discriminant
  data: T;
}

interface ErrorResponse {
  success: false;  // Discriminant
  error: {
    message: string;
    code: string;
  };
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Type narrowing happens automatically
function handleResponse<T>(response: ApiResponse<T>) {
  if (response.success) {
    // TypeScript knows response is SuccessResponse<T>
    console.log(response.data);
  } else {
    // TypeScript knows response is ErrorResponse
    console.error(response.error.message);
  }
}

// Real-world example: Content types
interface ArticleContent {
  type: "article";
  title: string;
  body: PortableTextBlock[];
}

interface VideoContent {
  type: "video";
  title: string;
  videoUrl: string;
  duration: number;
}

interface PodcastContent {
  type: "podcast";
  title: string;
  audioUrl: string;
  transcript?: string;
}

type ContentBlock = ArticleContent | VideoContent | PodcastContent;

function renderContent(content: ContentBlock) {
  switch (content.type) {
    case "article":
      return <Article body={content.body} />;  // body is available
    case "video":
      return <Video url={content.videoUrl} duration={content.duration} />;
    case "podcast":
      return <Podcast url={content.audioUrl} transcript={content.transcript} />;
  }
}
```

### Unknown vs Any (Never Use Any)

```typescript
// ❌ NEVER use any (disables type checking)
function processData(data: any) {
  return data.whatever.you.want;  // No errors, but will crash at runtime
}

// ✅ Use unknown (requires type checking)
function processData(data: unknown) {
  // Must narrow type before using
  if (typeof data === "object" && data !== null && "name" in data) {
    return (data as { name: string }).name;
  }
  throw new Error("Invalid data");
}

// ✅ Better: Use type guard
function isValidData(data: unknown): data is { name: string; email: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    "email" in data &&
    typeof (data as { name: unknown }).name === "string" &&
    typeof (data as { email: unknown }).email === "string"
  );
}

function processData(data: unknown) {
  if (isValidData(data)) {
    return data.name;  // Fully typed
  }
  throw new Error("Invalid data");
}

// ✅ Best: Use Zod for runtime validation
const dataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

function processData(data: unknown) {
  const result = dataSchema.safeParse(data);
  if (result.success) {
    return result.data.name;  // Fully typed
  }
  throw new Error("Invalid data");
}
```

---

## Common Patterns

### Async Server Components Typing

```typescript
import { notFound } from "next/navigation";
import type { Article } from "@/sanity/types";

// Page props are always Promise in Next.js 15+
interface ArticlePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArticlePage({
  params,
  searchParams,
}: ArticlePageProps) {
  // Await params (Next.js 15 requirement)
  const { slug } = await params;
  const search = await searchParams;

  // Fetch data
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();  // Type-safe 404
  }

  return (
    <article>
      <h1>{article.title}</h1>
      {/* TypeScript knows article exists here */}
    </article>
  );
}

// Generate static params for SSG
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug.current,
  }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.mainImage?.asset.url ?? "" }],
    },
  };
}
```

### Client Components with useState

```typescript
"use client";

import { useState, useEffect } from "react";
import type { Article } from "@/sanity/types";

interface ArticleListProps {
  initialArticles: Article[];
}

export function ArticleList({ initialArticles }: ArticleListProps) {
  // Type inferred from initialArticles
  const [articles, setArticles] = useState(initialArticles);

  // Explicit typing for complex state
  const [filters, setFilters] = useState<{
    audience: "giver" | "builder" | "both" | null;
    search: string;
  }>({
    audience: null,
    search: "",
  });

  // Type-safe state updates
  const handleFilterChange = (audience: typeof filters.audience) => {
    setFilters((prev) => ({ ...prev, audience }));
  };

  // Effects with proper typing
  useEffect(() => {
    const filtered = initialArticles.filter((article) => {
      if (filters.audience && article.audience !== filters.audience) {
        return false;
      }
      if (filters.search && !article.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
    setArticles(filtered);
  }, [filters, initialArticles]);

  return <div>{/* Render articles */}</div>;
}
```

### Form Handling with Server Actions

```typescript
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

// Define schema
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  audience: z.enum(["giver", "builder", "both"]),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Server action with proper return type
type ActionResult =
  | { success: true; message: string }
  | { success: false; errors: z.ZodFormattedError<ContactFormData> };

export async function submitContactForm(
  formData: FormData
): Promise<ActionResult> {
  // Parse and validate
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    audience: formData.get("audience"),
  };

  const result = contactSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.format(),
    };
  }

  // result.data is fully typed as ContactFormData
  const { name, email, message, audience } = result.data;

  // Process submission (send email, save to DB, etc.)
  await sendContactEmail({ name, email, message, audience });

  return {
    success: true,
    message: "Thank you! We'll be in touch soon.",
  };
}

// Client component using the action
"use client";

import { useActionState } from "react";
import { submitContactForm } from "./actions";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    null
  );

  return (
    <form action={formAction}>
      <input name="name" required />
      {state?.success === false && state.errors.name && (
        <p className="text-red-500">{state.errors.name._errors[0]}</p>
      )}

      <input name="email" type="email" required />
      {state?.success === false && state.errors.email && (
        <p className="text-red-500">{state.errors.email._errors[0]}</p>
      )}

      <textarea name="message" required />
      {state?.success === false && state.errors.message && (
        <p className="text-red-500">{state.errors.message._errors[0]}</p>
      )}

      <select name="audience" required>
        <option value="giver">Giver</option>
        <option value="builder">Builder</option>
        <option value="both">Both</option>
      </select>

      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </button>

      {state?.success && <p className="text-green-500">{state.message}</p>}
    </form>
  );
}
```

### API Route Handlers

```typescript
// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
  audience: z.enum(["giver", "builder", "both"]),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: unknown = await request.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, audience } = result.data;

    // Process subscription
    await addToNewsletter(email, audience);

    return NextResponse.json(
      { success: true, message: "Subscribed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET with typed search params
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const audience = searchParams.get("audience");

  // Validate query param
  if (audience && !["giver", "builder", "both"].includes(audience)) {
    return NextResponse.json(
      { error: "Invalid audience parameter" },
      { status: 400 }
    );
  }

  const subscribers = await getSubscribers(
    audience as "giver" | "builder" | "both" | null
  );

  return NextResponse.json({ subscribers });
}
```

### Middleware Typing

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Type-safe header access
  const userAgent = request.headers.get("user-agent");
  const referer = request.headers.get("referer");

  // Type-safe cookie access
  const sessionCookie = request.cookies.get("session");
  if (sessionCookie) {
    const sessionValue: string = sessionCookie.value;
  }

  // Type-safe URL manipulation
  const url = request.nextUrl.clone();
  url.pathname = "/new-path";

  // Set response headers
  response.headers.set("x-custom-header", "value");

  return response;
}

export const config = {
  matcher: ["/protected/:path*"],
};
```

---

## Type Utilities

### Built-in Utilities

```typescript
interface Article {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date;
  author: {
    name: string;
    email: string;
  };
  content: string;
  draft: boolean;
}

// Pick: Select specific properties
type ArticlePreview = Pick<Article, "id" | "title" | "slug">;
// { id: string; title: string; slug: string; }

// Omit: Exclude specific properties
type PublicArticle = Omit<Article, "draft">;
// All Article properties except draft

// Partial: Make all properties optional
type ArticleUpdate = Partial<Article>;
// { id?: string; title?: string; ... }

// Required: Make all properties required
type RequiredArticle = Required<Partial<Article>>;
// { id: string; title: string; ... } (all required)

// Record: Create object type with specific keys/values
type AudienceLabels = Record<"giver" | "builder" | "both", string>;
// { giver: string; builder: string; both: string; }

const labels: AudienceLabels = {
  giver: "Givers",
  builder: "Builders",
  both: "Both",
};

// Readonly: Make all properties readonly
type ImmutableArticle = Readonly<Article>;
// Cannot modify properties after creation

// ReturnType: Extract return type from function
async function getArticles() {
  return [{ id: "1", title: "Test" }];
}
type Articles = Awaited<ReturnType<typeof getArticles>>;
// { id: string; title: string; }[]

// Parameters: Extract parameter types from function
function createArticle(title: string, content: string, draft: boolean) {
  // ...
}
type CreateArticleParams = Parameters<typeof createArticle>;
// [string, string, boolean]

// NonNullable: Remove null and undefined
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string

// Exclude: Remove types from union
type Audience = "giver" | "builder" | "both";
type SpecificAudience = Exclude<Audience, "both">;
// "giver" | "builder"

// Extract: Select types from union
type Event =
  | { type: "click"; x: number; y: number }
  | { type: "keypress"; key: string }
  | { type: "scroll"; scrollTop: number };

type ClickEvent = Extract<Event, { type: "click" }>;
// { type: "click"; x: number; y: number }
```

### Custom Utility Types for The Mordecai Collective

```typescript
// Audience filter type
export type Audience = "giver" | "builder" | "both";

// Content with audience targeting
export type AudienceTargeted<T> = T & {
  audience: Audience;
};

// Nullable utility (common pattern)
export type Nullable<T> = T | null;

// Optional fields utility
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Example usage
interface Article {
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
}

type ArticleDraft = WithOptional<Article, "publishedAt">;
// { id: string; title: string; content: string; publishedAt?: Date }

// Sanity reference helper
export type SanityRef<T extends string = string> = {
  _ref: string;
  _type: T;
};

// Sanity image with alt text
export interface SanityImage {
  asset: SanityRef<"sanity.imageAsset">;
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Make specific properties required
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Example
type ArticleWithImage = WithRequired<
  Article & { mainImage?: SanityImage },
  "mainImage"
>;
// mainImage is now required

// Async function return type helper
export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<T>>;

// Deep partial (makes nested properties optional too)
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### Type Inference with typeof and keyof

```typescript
// typeof: Get type of a value
const audienceOptions = {
  giver: { label: "Givers", icon: "🎁" },
  builder: { label: "Builders", icon: "🔨" },
  both: { label: "Both", icon: "✨" },
} as const;  // Important: use 'as const' for literal types

type AudienceOption = typeof audienceOptions[keyof typeof audienceOptions];
// { label: "Givers" | "Builders" | "Both"; icon: "🎁" | "🔨" | "✨" }

type AudienceKey = keyof typeof audienceOptions;
// "giver" | "builder" | "both"

// keyof: Get union of object keys
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

type UserKeys = keyof User;
// "id" | "name" | "email" | "role"

// Practical example: Type-safe object access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = {
  id: "1",
  name: "John",
  email: "john@example.com",
  role: "user",
};

const userName = getProperty(user, "name");  // Type: string
const userRole = getProperty(user, "role");  // Type: "admin" | "user"
// const invalid = getProperty(user, "invalid");  // Error: not a key of User

// Advanced: Mapped types with keyof
type ReadonlyFields<T, K extends keyof T> = {
  readonly [P in K]: T[P];
} & Omit<T, K>;

type UserWithReadonlyId = ReadonlyFields<User, "id">;
// { readonly id: string; name: string; email: string; role: "admin" | "user" }

// Const assertions for strict typing
const routes = {
  home: "/",
  about: "/about",
  articles: "/articles",
  contact: "/contact",
} as const;

type Route = typeof routes[keyof typeof routes];
// "/" | "/about" | "/articles" | "/contact" (literal types!)

type RouteName = keyof typeof routes;
// "home" | "about" | "articles" | "contact"
```

---

## Real Examples from The Mordecai Collective

### Article Type from Sanity

```typescript
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImage, Audience } from "@/lib/types";

export interface Article {
  _id: string;
  _type: "article";
  _createdAt: string;
  _updatedAt: string;

  title: string;
  slug: { current: string; _type: "slug" };

  publishedAt: string;
  audience: Audience;

  excerpt?: string;
  mainImage?: SanityImage;

  author: {
    _id: string;
    name: string;
    bio?: PortableTextBlock[];
    image?: SanityImage;
  };

  content: PortableTextBlock[];

  categories?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
  }>;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
}

// Query helper with type safety
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";

const ARTICLE_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    slug,
    publishedAt,
    audience,
    excerpt,
    mainImage {
      asset->{ url, metadata },
      alt,
      hotspot,
      crop
    },
    author->{ _id, name, bio, image },
    content,
    categories[]->{ _id, title, slug },
    seo
  }
`);

export async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  return client.fetch(ARTICLE_QUERY, { slug });
}
```

### Newsletter Signup Form with Zod

```typescript
// lib/validations/newsletter.ts
import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),

  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long")
    .trim(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long")
    .trim(),

  audience: z.enum(["giver", "builder", "both"], {
    required_error: "Please select an audience",
    invalid_type_error: "Invalid audience selection",
  }),

  interests: z
    .array(
      z.enum([
        "biblical-generosity",
        "kingdom-investing",
        "entrepreneurship",
        "business-ministry",
        "stewardship",
      ])
    )
    .min(1, "Please select at least one interest")
    .max(5, "Please select no more than 5 interests")
    .optional(),

  privacyConsent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to our privacy policy",
    }),

  marketingConsent: z.boolean().default(false),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// components/NewsletterForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema, type NewsletterFormData } from "@/lib/validations/newsletter";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function NewsletterForm() {
  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      audience: "both",
      privacyConsent: false,
      marketingConsent: false,
    },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Subscription failed");

      // Success handling
      form.reset();
    } catch (error) {
      console.error("Newsletter subscription error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="audience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I am a...</FormLabel>
              <FormControl>
                <select {...field} className="w-full rounded border p-2">
                  <option value="giver">Giver</option>
                  <option value="builder">Builder</option>
                  <option value="both">Both</option>
                </select>
              </FormControl>
              <FormDescription>
                Help us send you the most relevant content
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacyConsent"
          render={({ field }) => (
            <FormItem className="flex items-start gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div>
                <FormLabel>
                  I agree to the privacy policy
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </Form>
  );
}
```

### Audience Filter Type Implementation

```typescript
// lib/types/audience.ts
export const AUDIENCES = ["giver", "builder", "both"] as const;
export type Audience = typeof AUDIENCES[number];
// "giver" | "builder" | "both"

export const audienceConfig = {
  giver: {
    label: "Givers",
    description: "Resources for generous Kingdom investors",
    icon: "🎁",
    color: "accent",
    slug: "givers",
  },
  builder: {
    label: "Builders",
    description: "Insights for redemptive entrepreneurs",
    icon: "🔨",
    color: "secondary",
    slug: "builders",
  },
  both: {
    label: "Both",
    description: "Content for all Kingdom workers",
    icon: "✨",
    color: "primary",
    slug: "both",
  },
} as const satisfies Record<Audience, {
  label: string;
  description: string;
  icon: string;
  color: string;
  slug: string;
}>;

export type AudienceConfig = typeof audienceConfig;

// Type guard
export function isValidAudience(value: unknown): value is Audience {
  return typeof value === "string" && AUDIENCES.includes(value as Audience);
}

// Filter component
"use client";

import { useState } from "react";
import type { Audience } from "@/lib/types/audience";
import { audienceConfig } from "@/lib/types/audience";

interface AudienceFilterProps {
  onFilterChange: (audience: Audience | null) => void;
}

export function AudienceFilter({ onFilterChange }: AudienceFilterProps) {
  const [selected, setSelected] = useState<Audience | null>(null);

  const handleSelect = (audience: Audience) => {
    const newSelection = selected === audience ? null : audience;
    setSelected(newSelection);
    onFilterChange(newSelection);
  };

  return (
    <div className="flex gap-4">
      {(Object.keys(audienceConfig) as Audience[]).map((key) => {
        const config = audienceConfig[key];
        return (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={selected === key ? "active" : ""}
          >
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

### Server Action with Proper Typing

```typescript
// app/actions/contact.ts
"use server";

import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z.string().min(20, "Message must be at least 20 characters").max(2000),
  audience: z.enum(["giver", "builder", "both"]),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Response types
type ContactFormSuccess = {
  success: true;
  message: string;
};

type ContactFormError = {
  success: false;
  error: string;
  fieldErrors?: z.ZodFormattedError<ContactFormData>;
};

type ContactFormResult = ContactFormSuccess | ContactFormError;

// Server action
export async function submitContactForm(
  prevState: ContactFormResult | null,
  formData: FormData
): Promise<ContactFormResult> {
  try {
    // Extract and validate data
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      audience: formData.get("audience"),
    };

    const result = contactSchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        error: "Please check your form inputs",
        fieldErrors: result.error.format(),
      };
    }

    const { name, email, subject, message, audience } = result.data;

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "The Mordecai Collective <hello@mordecaicollective.com>",
      to: ["hello@mordecaicollective.com"],
      replyTo: email,
      subject: `[${audience.toUpperCase()}] ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Audience:</strong> ${audience}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Email send error:", error);
      return {
        success: false,
        error: "Failed to send message. Please try again.",
      };
    }

    // Log to database (optional)
    await logContactSubmission({
      name,
      email,
      subject,
      message,
      audience,
      emailId: data?.id,
    });

    return {
      success: true,
      message: "Thank you! We'll be in touch within 24 hours.",
    };

  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

// Client component using the action
"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/app/actions/contact";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          disabled={isPending}
        />
        {state?.success === false && state.fieldErrors?.name && (
          <p className="text-red-500 text-sm">
            {state.fieldErrors.name._errors[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={isPending}
        />
        {state?.success === false && state.fieldErrors?.email && (
          <p className="text-red-500 text-sm">
            {state.fieldErrors.email._errors[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="audience">I am a...</label>
        <select id="audience" name="audience" required disabled={isPending}>
          <option value="giver">Giver</option>
          <option value="builder">Builder</option>
          <option value="both">Both</option>
        </select>
        {state?.success === false && state.fieldErrors?.audience && (
          <p className="text-red-500 text-sm">
            {state.fieldErrors.audience._errors[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          disabled={isPending}
        />
        {state?.success === false && state.fieldErrors?.subject && (
          <p className="text-red-500 text-sm">
            {state.fieldErrors.subject._errors[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          disabled={isPending}
        />
        {state?.success === false && state.fieldErrors?.message && (
          <p className="text-red-500 text-sm">
            {state.fieldErrors.message._errors[0]}
          </p>
        )}
      </div>

      {state?.success === false && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800">{state.error}</p>
        </div>
      )}

      {state?.success === true && (
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <p className="text-green-800">{state.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-white px-6 py-3 rounded disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
```

---

## Best Practices Summary

1. **Always use strict mode** - Enable all strict TypeScript flags
2. **Zod for runtime validation** - Never trust external data without validation
3. **Prefer type inference** - Let TypeScript infer types when possible
4. **Never use `any`** - Use `unknown` and narrow with type guards
5. **Use discriminated unions** - Make impossible states impossible
6. **Document with JSDoc** - Improve DX with inline documentation
7. **Type external data** - Use Zod schemas for API responses, form data, etc.
8. **Leverage utility types** - Use built-in and custom utilities to stay DRY
9. **Server Actions return types** - Always type action results with success/error discriminated unions
10. **Component props interfaces** - Always define explicit props interfaces, never inline types

---

## Related Skills

- [Vitest Testing](/skills/vitest-testing.md) - Type-safe unit testing
- [Playwright E2E](/skills/playwright-e2e.md) - Type-safe end-to-end testing
- [Sanity Query](/skills/sanity-query.md) - Type-safe CMS queries
- [Accessibility Testing](/skills/accessibility-testing.md) - Type-safe a11y testing
