# Tutorial 7: Push to GitHub and Deploy to Vercel

In this tutorial, you'll learn how to push your code to GitHub and deploy it to Vercel so your app is live on the internet!

## What You'll Learn

- How to initialize a Git repository
- How to push your code to GitHub
- How to connect your GitHub repo to Vercel
- How to set environment variables in Vercel
- How to monitor your deployment progress
- How to access your live website

## Prerequisites

- You should have completed the previous tutorials
- You should have a GitHub account (free)
- You should have a Vercel account (free)
- You should have Git installed on your computer

## Step-by-Step Instructions

### Step 1: Initialize Git Repository

If you haven't already initialized Git in your project:

1. Open your terminal in your project folder
2. Run these commands:

```bash
git init
git add .
git commit -m "Initial commit"
```

**What these commands do:**
- `git init` - Initializes a new Git repository
- `git add .` - Stages all files to be committed
- `git commit -m "message"` - Saves your changes with a message

### Step 2: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: Choose a name (e.g., "my-nextjs-app")
   - **Description**: Optional description
   - **Visibility**: Choose **Public** (free) or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (you already have these)
5. Click **"Create repository"**

### Step 3: Connect Your Local Repository to GitHub

GitHub will show you commands to run. Use these exact commands:

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

**What these commands do:**
- `git add .` - Stages all your files
- `git commit -m "message"` - Commits your changes
- `git branch -M main` - Renames your branch to "main"
- `git remote add origin ...` - Connects your local repo to GitHub
- `git push -u origin main` - Pushes your code to GitHub

### Step 4: Create a Vercel Account (If You Haven't)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign up"**
3. Choose **"Continue with GitHub"** (recommended - makes deployment easier)
4. Authorize Vercel to access your GitHub account

### Step 5: Deploy Your Project to Vercel

1. After signing in to Vercel, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find your project and click **"Import"**
4. Vercel will detect it's a Next.js project automatically
5. Click **"Deploy"** (you can skip the configuration for now)

**Important:** Don't worry if the first deployment fails - you need to add environment variables first!

### Step 6: Add Environment Variables in Vercel

Your app needs the Supabase environment variables to work. Here's how to add them:

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add these two variables (same as your `.env.local` file):

**Variable 1:**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Your Supabase project URL (from your `.env.local` file)
- **Environment**: Select all (Production, Preview, Development)

**Variable 2:**
- **Name**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **Value**: Your Supabase anon/public key (from your `.env.local` file)
- **Environment**: Select all (Production, Preview, Development)

3. Click **"Save"** after adding each variable

**Where to find these values:**
- Go to your Supabase project dashboard
- Navigate to **Settings** → **API**
- Copy the **Project URL** and **anon public** key

### Step 7: Redeploy Your Project

After adding environment variables:

1. Go to the **Deployments** tab in Vercel
2. Click the **"..."** menu on your latest deployment
3. Select **"Redeploy"**
4. Or make a small change and push to GitHub (Vercel will auto-deploy)

### Step 8: Monitor Your Deployment

1. Go to your Vercel project dashboard
2. Click on the **Deployments** tab
3. You'll see your deployment progress:
   - **Building** - Vercel is building your app
   - **Ready** - Your app is live!
   - **Error** - Something went wrong (check the logs)

4. Click on a deployment to see:
   - Build logs (what Vercel is doing)
   - Runtime logs (if your app is running)
   - Any errors that occurred

### Step 9: Access Your Live Website

Once deployment is complete:

1. Vercel will give you a URL like: `https://your-project-name.vercel.app`
2. Click the URL or the **"Visit"** button
3. Your app is now live on the internet! 🎉

### Step 10: Making Future Updates

Whenever you make changes to your code:

1. Make your changes locally
2. Run these commands:

```bash
git add .
git commit -m "Describe your changes"
git push
```

3. Vercel will automatically detect the push and start a new deployment
4. Wait a few minutes, and your changes will be live!

## Understanding the Deployment Process

### What Happens When You Push to GitHub?

1. **Git Push**: Your code is uploaded to GitHub
2. **Vercel Detection**: Vercel detects the new push (via webhook)
3. **Build Process**: Vercel runs `npm install` and `npm run build`
4. **Deployment**: Your built app is deployed to Vercel's servers
5. **Live**: Your app is accessible via the Vercel URL

### Build vs Development

- **Development** (`npm run dev`): Runs on your computer, hot reload, slower
- **Production** (Vercel): Optimized build, fast, accessible to everyone

## Common Git Commands You'll Use

```bash
# Check status of your files
git status

# Stage all changes
git add .

# Commit changes with a message
git commit -m "Your commit message here"

# Push to GitHub
git push

# Pull latest changes (if working on multiple computers)
git pull
```

## Troubleshooting

### Problem: "Repository not found" when pushing

**Solution:**
- Make sure you've created the GitHub repository
- Check that the repository URL is correct
- Verify you're authenticated with GitHub (`git config --global user.name` and `git config --global user.email`)

### Problem: Deployment fails with "Environment variables missing"

**Solution:**
- Go to Vercel → Settings → Environment Variables
- Make sure you've added both Supabase variables
- Redeploy after adding variables

### Problem: Build fails on Vercel

**Solution:**
- Check the build logs in Vercel dashboard
- Common issues:
  - Missing dependencies (check `package.json`)
  - TypeScript errors
  - Missing environment variables
- Fix the errors locally, then push again

### Problem: App works locally but not on Vercel

**Solution:**
- Check that environment variables are set correctly
- Make sure you're using `NEXT_PUBLIC_` prefix for client-side variables
- Check Vercel build logs for specific errors
- Verify your Supabase project is active

## Best Practices

1. **Commit Often**: Commit your changes frequently with descriptive messages
2. **Test Locally First**: Make sure your app works locally before pushing
3. **Check Build Logs**: Always check Vercel build logs if deployment fails
4. **Use Meaningful Commit Messages**: 
   - Good: `git commit -m "Add user profile page"`
   - Bad: `git commit -m "stuff"`

## Next Steps

Now that your app is live:
- Share your Vercel URL with others!
- Set up a custom domain (optional)
- Monitor your app's performance in Vercel dashboard
- Set up preview deployments for pull requests

## See It Working

Check out the example page at `/examples/deploy` to see a visual guide and checklist for deployment!

