# Tutorial 2: Create a Component

In this tutorial, you'll learn how to create reusable React components in your Next.js application.

## What You'll Learn

- How to create a new React component
- How to organize components in your project
- How to use components in your pages
- How to pass data to components using props

## Step-by-Step Instructions

### Step 1: Create a Component File

1. Open your project in Cursor
2. Navigate to the `components` folder
3. Create a new file with a descriptive name ending in `.tsx`
   - Use PascalCase (capitalize each word): `MyComponent.tsx`
   - Example: `WelcomeMessage.tsx`, `UserCard.tsx`, `Button.tsx`

**Example:** To create a welcome message component, create `components/WelcomeMessage.tsx`

### Step 2: Write Your Component

1. Open the component file you just created
2. Write a React component function
3. Export it so other files can use it

**Example code for `components/WelcomeMessage.tsx`:**

```typescript
export function WelcomeMessage({ name }: { name: string }) {
  return (
    <div className="p-4 bg-accent rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Welcome, {name}!</h2>
      <p className="text-muted-foreground">
        Thanks for visiting our app. We're glad you're here!
      </p>
    </div>
  );
}
```

### Step 3: Use Your Component in a Page

1. Open the page where you want to use your component (e.g., `app/page.tsx`)
2. Import your component at the top of the file
3. Use it in your JSX like an HTML tag

**Example code for using the component:**

```typescript
import { WelcomeMessage } from "@/components/WelcomeMessage";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <WelcomeMessage name="Sarah" />
      <WelcomeMessage name="John" />
    </div>
  );
}
```

### Step 4: View Your Component

1. Make sure your development server is running (`npm run dev`)
2. Navigate to the page where you used your component
3. You should see your component rendered on the page!

## Key Concepts

### Components are Reusable

Components let you write code once and use it many times. Notice in the example above, we used `<WelcomeMessage />` twice with different names!

### Props (Properties)

Props are how you pass data to components. In the example:
- `name` is a prop
- The component receives `name` as a parameter
- You can use `{name}` in your JSX to display it

### Component Types

There are two ways to define props:

**Option 1: Inline (for simple components)**
```typescript
export function MyComponent({ prop1, prop2 }: { prop1: string; prop2: number }) {
  // component code
}
```

**Option 2: TypeScript Interface (for complex components)**
```typescript
interface MyComponentProps {
  prop1: string;
  prop2: number;
  optionalProp?: boolean; // The ? makes it optional
}

export function MyComponent({ prop1, prop2, optionalProp }: MyComponentProps) {
  // component code
}
```

## Common Patterns

### Component with Children

Sometimes you want to pass content between component tags:

```typescript
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="border rounded-lg p-4">
      {children}
    </div>
  );
}

// Usage:
<Card>
  <h2>Title</h2>
  <p>Content goes here</p>
</Card>
```

### Component with Default Props

You can provide default values for props:

```typescript
export function Button({ 
  text = "Click me", 
  variant = "primary" 
}: { 
  text?: string; 
  variant?: "primary" | "secondary" 
}) {
  return <button className={`btn btn-${variant}`}>{text}</button>;
}
```

### Conditional Rendering

Show different content based on props:

```typescript
export function UserStatus({ isOnline }: { isOnline: boolean }) {
  return (
    <div>
      {isOnline ? (
        <span className="text-green-500">Online</span>
      ) : (
        <span className="text-gray-500">Offline</span>
      )}
    </div>
  );
}
```

## Best Practices

1. **One component per file**: Keep each component in its own file
2. **Descriptive names**: Use clear, descriptive names for your components
3. **Organize by feature**: Group related components in folders (e.g., `components/auth/`, `components/ui/`)
4. **Keep components small**: If a component gets too big, break it into smaller components

## Next Steps

Once you've created your first component, try:
- Creating components that use other components
- Adding TypeScript types for better code safety
- Creating a component library in `components/ui/` for reusable UI elements

## See It Working

Check out the example page at `/examples/create-component` to see a working example of this tutorial!

