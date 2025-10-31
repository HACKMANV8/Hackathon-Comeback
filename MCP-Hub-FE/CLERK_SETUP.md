# Clerk Authentication Setup

This project uses [Clerk](https://clerk.com/) for authentication in Next.js App Router.

## ✅ What's Already Configured

1. **Package Installed**: `@clerk/nextjs` (latest version)
2. **Middleware Setup**: `middleware.ts` with `clerkMiddleware()`
3. **Layout Wrapped**: `app/layout.tsx` wrapped with `<ClerkProvider>`
4. **Header Updated**: Authentication UI components added to the header
   - Sign In / Sign Up buttons for unauthenticated users
   - User button for authenticated users
   - Publish Server button only shown to authenticated users

## 🚀 Getting Started

### Step 1: Get Your Clerk Keys

1. Go to [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
2. Sign up or log in to Clerk
3. Create a new application or select an existing one
4. Go to **API Keys** in the sidebar
5. Copy your **Publishable Key** and **Secret Key**

### Step 2: Configure Environment Variables

1. Create a `.env.local` file in the root of your project:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Clerk keys to `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   ```

### Step 3: Start Your Development Server

```bash
npm run dev
```

### Step 4: Test Authentication

1. Navigate to `http://localhost:3000`
2. Click "Sign Up" in the header
3. Create a new account
4. You should see the user button in the header after signing up

## 📁 File Structure

```
MCP-Hub-FE/
├── middleware.ts              # Clerk middleware (protects routes)
├── app/
│   └── layout.tsx            # ClerkProvider wraps the app
├── components/
│   └── header.tsx            # Auth UI components
└── .env.local               # Your Clerk keys (create this)
```

## 🔒 Protected Routes (Optional)

To protect specific routes, you can update `middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/publish(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

## 🎨 Customization

### Appearance

You can customize Clerk's appearance to match your design:

```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#06b6d4", // cyan-500
          colorBackground: "#000000",
          colorText: "#ffffff",
        },
      }}
    >
      {/* ... */}
    </ClerkProvider>
  );
}
```

### Using Auth in Server Components

```tsx
import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { userId } = await auth()
  
  if (!userId) {
    return <div>Please sign in</div>
  }
  
  return <div>Hello, {userId}!</div>
}
```

### Using Auth in Client Components

```tsx
'use client'

import { useUser } from '@clerk/nextjs'

export default function ClientComponent() {
  const { isLoaded, isSignedIn, user } = useUser()
  
  if (!isLoaded) return <div>Loading...</div>
  if (!isSignedIn) return <div>Not signed in</div>
  
  return <div>Hello, {user.firstName}!</div>
}
```

## 📚 Additional Resources

- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Components](https://clerk.com/docs/components/overview)
- [Clerk Customization](https://clerk.com/docs/customization/overview)

## 🎯 Key Features Implemented

- ✅ Modal-based sign in/sign up (no redirect to separate pages)
- ✅ User button with profile management
- ✅ Conditional rendering based on auth state
- ✅ Protected "Publish Server" button for authenticated users only
- ✅ App Router compatibility with latest Next.js 16

## 🔧 Troubleshooting

### "Clerk: Missing publishable key"
- Make sure you've created `.env.local` file
- Verify your keys are correctly copied from Clerk dashboard
- Restart your dev server after adding environment variables

### Middleware not working
- Ensure `middleware.ts` is in the root of your project (not in `app/`)
- Check that the file exports `clerkMiddleware()` correctly

### Styling issues with UserButton
- UserButton is fully customizable via the `appearance` prop
- See: https://clerk.com/docs/customization/overview
