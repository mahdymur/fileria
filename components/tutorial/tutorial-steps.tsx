import Link from "next/link";
import { TutorialStep } from "./tutorial-step";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function TutorialSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="Tutorial 1: Create a Page">
        <div className="space-y-3">
          <p>
            Learn how to create a new page route in Next.js using the App Router. 
            This is the foundation of building your application.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button asChild size="sm" variant="outline">
              <Link href="/examples/create-page">
                View Example <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/1)%20Create%20a%20page/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial
              </a>
            </Button>
          </div>
        </div>
      </TutorialStep>

      <TutorialStep title="Tutorial 2: Create a Component">
        <div className="space-y-3">
          <p>
            Learn how to create reusable React components. Components help you 
            write code once and use it many times throughout your app.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button asChild size="sm" variant="outline">
              <Link href="/examples/create-component">
                View Example <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/2)%20Create%20a%20component/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial
              </a>
            </Button>
          </div>
        </div>
      </TutorialStep>

      <TutorialStep title="Tutorial 3: Render Logged In User">
        <div className="space-y-3">
          <p>
            Learn how to get and display information about the currently logged-in user 
            using Supabase authentication.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button asChild size="sm" variant="outline">
              <Link href="/examples/render-user">
                View Example <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/3)%20Render%20our%20logged%20in%20user/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial
              </a>
            </Button>
          </div>
        </div>
      </TutorialStep>

      <TutorialStep title="Tutorial 4: What is a REST API">
        <div className="space-y-3">
          <p>
            Learn what REST APIs are, how they work, and why they&apos;re essential for 
            building modern web applications.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button asChild size="sm" variant="outline">
              <Link href="/examples/rest-api">
                View Example <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/4)%20What%20is%20a%20REST%20API/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial
              </a>
            </Button>
          </div>
        </div>
      </TutorialStep>

      <TutorialStep title="Tutorial 5: How to Create a Backend Route in Next.js">
        <div className="space-y-3">
          <p>
            Learn how to create API routes (backend endpoints) in Next.js using the App Router. 
            This enables your frontend to communicate with your backend.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button asChild size="sm" variant="outline">
              <Link href="/examples/backend-route">
                View Example <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/5)%20How%20to%20create%20a%20backend%20route%20in%20Next.js/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial
              </a>
            </Button>
          </div>
        </div>
      </TutorialStep>

      <TutorialStep title="Tutorial 6: Creating A Saveable Profile for Each User">
        <div className="space-y-3">
          <p>
            Build a complete CRUD system for user profiles. Learn how to create, read, 
            and update data using forms, API routes, and Supabase.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button asChild size="sm" variant="outline">
              <Link href="/examples/profile">
                View Example <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/6)%20Creating%20A%20Saveable%20Profile%20for%20each%20user/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial
              </a>
            </Button>
          </div>
        </div>
      </TutorialStep>

      <TutorialStep title="Tutorial 7: Push to GitHub and Deploy to Vercel">
        <div className="space-y-3">
          <p>
            Learn how to push your code to GitHub and deploy it to Vercel so your app 
            is live on the internet for everyone to see!
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button asChild size="sm" variant="outline">
              <Link href="/examples/deploy">
                View Example <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/7)%20Push%20to%20GitHub%20and%20Deploy%20to%20Vercel/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial
              </a>
            </Button>
          </div>
        </div>
      </TutorialStep>
    </ol>
  );
}

