# Tutorial 3: Render Our Logged In User

In this tutorial, you'll learn how to get and display information about the currently logged-in user using Supabase authentication.

## What You'll Learn

- How to get the current user from Supabase
- How to display user information in your components
- How to handle cases where no user is logged in
- Server-side vs client-side user fetching

## Prerequisites

- You should have completed the initial setup and connected your Supabase project
- You should have at least one user account created (sign up at `/auth/sign-up`)

## Step-by-Step Instructions

### Step 1: Import the Supabase Client

1. In your component or page file, import the Supabase server client
2. This client is used to access authentication data on the server side

**Add this import at the top of your file:**

```typescript
import { createClient } from "@/lib/supabase/server";
```

### Step 2: Get the User Data

1. Create a Supabase client instance
2. Call `getClaims()` to get the current user's authentication claims
3. Extract the user data from the response

**Example code:**

```typescript
export default async function MyPage() {
  const supabase = await createClient();
  
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  
  // user will be null if no one is logged in
  // user will contain user info if someone is logged in
}
```

### Step 3: Display User Information

1. Check if a user exists
2. Display user information in your JSX
3. Handle the case where no user is logged in

**Complete example for `app/my-profile/page.tsx`:**

```typescript
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyProfilePage() {
  const supabase = await createClient();
  
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  
  // Redirect to login if no user
  if (!user) {
    redirect("/auth/login");
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">My Profile</h1>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="text-sm font-mono">{user.sub}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Create a Reusable User Component

Instead of repeating this code, create a component that displays user info:

**Create `components/user-info.tsx`:**

```typescript
import { createClient } from "@/lib/supabase/server";

export async function UserInfo() {
  const supabase = await createClient();
  
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  
  if (!user) {
    return (
      <div className="p-4 border rounded-lg">
        <p>No user logged in</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 border rounded-lg space-y-2">
      <h3 className="font-bold text-lg">Logged in as:</h3>
      <p className="text-muted-foreground">{user.email}</p>
    </div>
  );
}
```

**Use it in any page:**

```typescript
import { UserInfo } from "@/components/user-info";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <UserInfo />
    </div>
  );
}
```

## Key Concepts

### Server Components vs Client Components

- **Server Components** (default): Run on the server, can directly access Supabase
- **Client Components**: Run in the browser, need special handling for auth

For this tutorial, we're using Server Components (the default).

### User Data Structure

The `user` object (from `data?.claims`) contains:
- `email`: The user's email address
- `sub`: The user's unique ID
- `exp`: Token expiration time
- Other claims depending on your Supabase setup

### Handling No User

Always check if `user` exists before trying to use it:
- Show a login prompt
- Redirect to login page
- Show different content for logged-out users

## Common Patterns

### Conditional Rendering Based on Auth

```typescript
export default async function MyPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  
  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome back, {user.email}!</h1>
          <p>You are logged in.</p>
        </div>
      ) : (
        <div>
          <h1>Please log in</h1>
          <a href="/auth/login">Go to login</a>
        </div>
      )}
    </div>
  );
}
```

### Protected Page Pattern

```typescript
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  
  if (!data?.claims) {
    redirect("/auth/login");
  }
  
  const user = data.claims;
  
  // Page content for logged-in users only
  return <div>Protected content for {user.email}</div>;
}
```

### Displaying User Avatar (if available)

```typescript
export default async function UserProfile() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
        {user?.email?.[0].toUpperCase()}
      </div>
      <div>
        <p className="font-semibold">{user?.email}</p>
      </div>
    </div>
  );
}
```

## Best Practices

1. **Always check for user**: Never assume a user is logged in
2. **Use Server Components**: For better performance and security
3. **Handle errors**: Wrap Supabase calls in try-catch if needed
4. **Redirect appropriately**: Send unauthenticated users to login

## Troubleshooting

### User is always null

- Make sure you're logged in (check `/auth/login`)
- Verify your `.env.local` file has correct Supabase keys
- Restart your development server after changing environment variables

### "Cannot use async component" error

- Make sure your component is marked as `async`
- Server Components can be async, Client Components cannot

## Next Steps

Once you can display user information, try:
- Creating a user profile page
- Adding user-specific data from your database
- Creating personalized dashboards

## See It Working

Check out the example page at `/examples/render-user` to see a working example of this tutorial!

