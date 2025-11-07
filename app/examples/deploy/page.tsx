import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeployExample() {
  const steps = [
    {
      title: "Initialize Git Repository",
      commands: ["git init", "git add .", 'git commit -m "Initial commit"'],
      description: "Set up Git in your project folder",
    },
    {
      title: "Create GitHub Repository",
      description: "Create a new repository on GitHub.com",
      note: "Don't initialize with README - you already have one!",
    },
    {
      title: "Connect to GitHub",
      commands: [
        "git branch -M main",
        "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git",
        "git push -u origin main",
      ],
      description: "Link your local repository to GitHub",
    },
    {
      title: "Deploy to Vercel",
      description: "Import your GitHub repository in Vercel",
      note: "Vercel will auto-detect Next.js",
    },
    {
      title: "Add Environment Variables",
      description: "Add your Supabase keys in Vercel Settings",
      variables: [
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      ],
    },
    {
      title: "Redeploy",
      description: "Redeploy your project after adding environment variables",
    },
    {
      title: "Monitor Deployment",
      description: "Watch your build progress in Vercel dashboard",
    },
    {
      title: "Access Your Live Site",
      description: "Visit your Vercel URL - your app is live!",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/examples">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold mb-2">Example: Deploy to Vercel</h1>
            <p className="text-muted-foreground">
              Step-by-step guide to push to GitHub and deploy
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Checklist</CardTitle>
              <CardDescription>
                Follow these steps to get your app live on the internet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0 pt-1">
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Step {index + 1}: {step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    {step.commands && (
                      <div className="mt-2 space-y-1">
                        {step.commands.map((cmd, cmdIndex) => (
                          <code
                            key={cmdIndex}
                            className="block text-xs bg-muted p-2 rounded"
                          >
                            {cmd}
                          </code>
                        ))}
                      </div>
                    )}
                    {step.variables && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold mb-1">Environment Variables:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {step.variables.map((variable, varIndex) => (
                            <li key={varIndex}>
                              <code className="bg-muted px-1 py-0.5 rounded">{variable}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {step.note && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 italic">
                        ⚠️ {step.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Essential Git Commands</CardTitle>
              <CardDescription>
                These are the exact commands you'll use repeatedly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm font-mono font-semibold">git add .</code>
                    <span className="text-xs text-muted-foreground">Stage all changes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prepares all your changed files to be committed
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm font-mono font-semibold">
                      git commit -m "Your message"
                    </code>
                    <span className="text-xs text-muted-foreground">Save changes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Saves your changes with a descriptive message
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Example: git commit -m "Add user profile page"
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm font-mono font-semibold">git push</code>
                    <span className="text-xs text-muted-foreground">Upload to GitHub</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uploads your committed changes to GitHub, which triggers Vercel deployment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment Variables Setup</CardTitle>
              <CardDescription>
                Critical step: Add these in Vercel Settings → Environment Variables
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
                  ⚠️ Important: Your app won't work without these!
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Copy these from your <code className="bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">.env.local</code> file
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Variable 1:</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <code className="ml-2 text-sm bg-muted px-2 py-1 rounded">
                        NEXT_PUBLIC_SUPABASE_URL
                      </code>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Value:</span>
                      <span className="ml-2 text-sm">Your Supabase Project URL</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Environment:</span>
                      <span className="ml-2 text-sm">All (Production, Preview, Development)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Variable 2:</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <code className="ml-2 text-sm bg-muted px-2 py-1 rounded">
                        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
                      </code>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Value:</span>
                      <span className="ml-2 text-sm">Your Supabase anon/public key</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Environment:</span>
                      <span className="ml-2 text-sm">All (Production, Preview, Development)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What Happens After You Push?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Git Push:</strong> Your code is uploaded to GitHub
                </li>
                <li>
                  <strong className="text-foreground">Vercel Detection:</strong> Vercel detects the new push automatically
                </li>
                <li>
                  <strong className="text-foreground">Build Process:</strong> Vercel runs <code className="bg-muted px-1 py-0.5 rounded">npm install</code> and <code className="bg-muted px-1 py-0.5 rounded">npm run build</code>
                </li>
                <li>
                  <strong className="text-foreground">Deployment:</strong> Your built app is deployed to Vercel's servers
                </li>
                <li>
                  <strong className="text-foreground">Live:</strong> Your app is accessible via the Vercel URL! 🎉
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monitoring Your Deployment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Go to your Vercel project dashboard to see:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Building:</strong> Vercel is building your app</li>
                <li><strong className="text-foreground">Ready:</strong> Your app is live!</li>
                <li><strong className="text-foreground">Error:</strong> Something went wrong (check the logs)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Click on any deployment to see build logs, runtime logs, and any errors.
              </p>
            </CardContent>
          </Card>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Try It Yourself</h2>
            <p className="text-muted-foreground mb-4">
              Follow the complete tutorial to deploy your app:
            </p>
            <Button asChild>
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/7)%20Push%20to%20GitHub%20and%20Deploy%20to%20Vercel/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial 7
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

