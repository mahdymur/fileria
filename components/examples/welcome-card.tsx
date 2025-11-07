import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomeCardProps {
  name: string;
  role: string;
  message: string;
}

export function WelcomeCard({ name, role, message }: WelcomeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {name}!</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

