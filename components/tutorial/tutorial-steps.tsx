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
    </ol>
  );
}

