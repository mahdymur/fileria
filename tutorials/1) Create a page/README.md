# Tutorial 1: Create a Page

In this tutorial, you'll learn how to create a new page in your Next.js application using the App Router.

## What You'll Learn

- How to create a new page route in Next.js 15+ using the App Router
- How to structure your page files
- How to navigate to your new page

## Step-by-Step Instructions

### Step 1: Create a New Folder in the `app` Directory

1. Open your project in Cursor
2. Navigate to the `app` folder (this is where all your pages live)
3. Create a new folder with the name you want for your page URL
   - For example: if you want a page at `/about`, create a folder called `about`
   - If you want a page at `/contact`, create a folder called `contact`

**Example:** To create an "About" page, create a folder called `about`:
```
app/
  └── about/
```

### Step 2: Create a `page.tsx` File

1. Inside your new folder, create a file called `page.tsx`
   - This is a special file name that Next.js recognizes as a page
   - The file must be named exactly `page.tsx` (not `Page.tsx` or `page.js`)

### Step 3: Write Your Page Component

1. Open the `page.tsx` file you just created
2. Write a React component that exports a default function
3. Return JSX (the HTML-like code) that will be displayed on your page

**Example code for `app/about/page.tsx`:**

```typescript
export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-muted-foreground">
          This is the about page. You can add any content you want here!
        </p>
      </div>
    </div>
  );
}
```

### Step 4: View Your New Page

1. Make sure your development server is running (`npm run dev`)
2. Open your browser and navigate to `http://localhost:3000/your-page-name`
   - For the example above, it would be `http://localhost:3000/about`

## Key Concepts

- **App Router**: Next.js 15+ uses the App Router, where folders in the `app` directory automatically become routes
- **page.tsx**: This is a special file name that Next.js uses to create pages
- **Default Export**: Your page component must be the default export (use `export default`)

## Common Patterns

### Adding a Layout

If you want all pages in a folder to share the same layout, create a `layout.tsx` file in that folder:

```typescript
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto p-4">
      {children}
    </div>
  );
}
```

### Adding Metadata

You can add page metadata (title, description) by exporting a `metadata` object:

```typescript
export const metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
};

export default function AboutPage() {
  // ... your component code
}
```

## Next Steps

Once you've created your first page, try:
- Adding multiple pages
- Linking between pages using Next.js `Link` component
- Styling your pages with Tailwind CSS classes

## See It Working

Check out the example page at `/examples/create-page` to see a working example of this tutorial!

