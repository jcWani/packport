import Socials from "@/components/auth/socials";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  return (
    <div className="min-h-50vh flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome Back!
          </CardTitle>
          <CardDescription>
            Log in and start exploring latest bags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Socials />
        </CardContent>
      </Card>
    </div>
  );
}
