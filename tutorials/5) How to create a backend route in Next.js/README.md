# Tutorial 5: How to Create a Backend Route in Next.js

In this tutorial, you'll learn how to create API routes (backend endpoints) in Next.js using the App Router.

## What You'll Learn

- How to create API routes in Next.js 15+ App Router
- How to handle different HTTP methods (GET, POST, PUT, DELETE)
- How to read request data and send responses
- How to connect your API routes to Supabase
- Best practices for API route structure

## Understanding Next.js API Routes

In Next.js, API routes are special files that create backend endpoints. They live in the `app` directory and use a file called `route.ts` (or `route.js`).

### File Structure

```
app/
  └── api/
      └── hello/
          └── route.ts
```

This creates an API endpoint at: `/api/hello`

## Step-by-Step Instructions

### Step 1: Create the API Route Folder

1. Navigate to the `app` folder in your project
2. Create a folder called `api` (if it doesn't exist)
3. Inside `api`, create a folder for your endpoint name
   - Example: For `/api/users`, create `app/api/users/`

**Example structure:**
```
app/
  └── api/
      └── users/
```

### Step 2: Create the `route.ts` File

1. Inside your endpoint folder, create a file called `route.ts`
   - This is a special file name that Next.js recognizes as an API route
   - The file must be named exactly `route.ts`

### Step 3: Export HTTP Method Functions

1. Export functions named after HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, etc.
2. Each function receives a `Request` object and returns a `Response`

**Basic example for `app/api/hello/route.ts`:**

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello, World!" });
}
```

This creates a GET endpoint at `/api/hello` that returns JSON.

### Step 4: Handle Request Data

For POST, PUT, and PATCH requests, you'll need to read data from the request body:

**Example for `app/api/users/route.ts`:**

```typescript
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Read the request body
  const body = await request.json();
  
  // Access the data
  const { name, email } = body;
  
  // Process the data (e.g., save to database)
  // ... your logic here ...
  
  // Return a response
  return NextResponse.json(
    { message: "User created", name, email },
    { status: 201 }
  );
}
```

### Step 5: Handle Query Parameters

For GET requests, you can read query parameters:

**Example:**

```typescript
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  // Use the id parameter
  return NextResponse.json({ id });
}
```

Access it at: `/api/users?id=123`

## Complete Examples

### Example 1: Simple GET Endpoint

```typescript
// app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "Hello from the API!",
    timestamp: new Date().toISOString()
  });
}
```

### Example 2: POST Endpoint with Request Body

```typescript
// app/api/messages/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, author } = body;
    
    // Validate the data
    if (!text || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Process the data (save to database, etc.)
    // ... your logic here ...
    
    return NextResponse.json(
      { message: "Message created", text, author },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
```

### Example 3: GET Endpoint with Query Parameters

```typescript
// app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  
  // Use parameters for pagination, filtering, etc.
  return NextResponse.json({
    limit: limit || 10,
    offset: offset || 0,
    users: [] // Your data here
  });
}
```

### Example 4: Connecting to Supabase

```typescript
// app/api/profiles/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Read request body
    const body = await request.json();
    const { name, bio } = body;
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from("profiles")
      .insert({ user_id: user.id, name, bio })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## HTTP Status Codes

Use appropriate status codes in your responses:

- **200**: Success (OK)
- **201**: Created successfully
- **400**: Bad request (client error)
- **401**: Unauthorized
- **404**: Not found
- **500**: Internal server error

## Best Practices

1. **Always validate input**: Check that required fields are present
2. **Handle errors gracefully**: Use try-catch blocks
3. **Return appropriate status codes**: Help clients understand what happened
4. **Use TypeScript**: Get type safety for your API routes
5. **Keep routes focused**: One route should do one thing well
6. **Authenticate requests**: Check if users are logged in when needed

## Calling Your API from the Frontend

Once you've created an API route, you can call it from your frontend:

```typescript
// In a Client Component or form handler
const response = await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
  }),
});

const data = await response.json();
console.log(data);
```

## Common Patterns

### Dynamic Routes

For routes like `/api/users/[id]`, create:
```
app/
  └── api/
      └── users/
          └── [id]/
              └── route.ts
```

Then access the ID:
```typescript
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  // Use id...
}
```

### Multiple Methods in One File

You can export multiple methods from the same file:

```typescript
export async function GET() { /* ... */ }
export async function POST() { /* ... */ }
export async function PUT() { /* ... */ }
export async function DELETE() { /* ... */ }
```

## Next Steps

Now that you can create API routes, try:
- Creating a full CRUD API (Create, Read, Update, Delete)
- Connecting your API to Supabase
- Building a complete profile system (Tutorial 6)

## See It Working

Check out the example page at `/examples/backend-route` to see a working API route example!

