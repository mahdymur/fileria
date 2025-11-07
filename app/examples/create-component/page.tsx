import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { WelcomeCard } from "@/components/examples/welcome-card";

export default function CreateComponentExample() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/examples">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold mb-2">Example: Create a Component</h1>
            <p className="text-muted-foreground">
              This example demonstrates creating and using a reusable component
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-accent/50">
            <h2 className="text-2xl font-semibold mb-4">About This Example</h2>
            <p className="text-muted-foreground mb-4">
              Below, you can see the <code className="bg-muted px-1 py-0.5 rounded">WelcomeCard</code> component being used multiple times with different props:
            </p>
          </div>

          <div className="space-y-4">
            <WelcomeCard 
              name="Sarah" 
              role="Developer" 
              message="Welcome to our app! We're excited to have you here."
            />
            <WelcomeCard 
              name="Alex" 
              role="Designer" 
              message="Thanks for joining us. Let's build something amazing together!"
            />
            <WelcomeCard 
              name="Jordan" 
              role="Product Manager" 
              message="Glad you're here! Feel free to explore and ask questions."
            />
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <p className="text-muted-foreground mb-4">
              The <code className="bg-muted px-1 py-0.5 rounded">WelcomeCard</code> component:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Is defined once in <code className="bg-muted px-1 py-0.5 rounded">components/examples/welcome-card.tsx</code></li>
              <li>Accepts props: <code className="bg-muted px-1 py-0.5 rounded">name</code>, <code className="bg-muted px-1 py-0.5 rounded">role</code>, and <code className="bg-muted px-1 py-0.5 rounded">message</code></li>
              <li>Can be reused multiple times with different data</li>
              <li>Keeps the code DRY (Don't Repeat Yourself)</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Try It Yourself</h2>
            <p className="text-muted-foreground mb-4">
              Follow the tutorial to create your own component:
            </p>
            <Button asChild>
              <a href="https://github.com/kyritzb/lp-template/blob/main/tutorials/2)%20Create%20a%20component/README.md" target="_blank" rel="noopener noreferrer">
                Read Tutorial 2
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

