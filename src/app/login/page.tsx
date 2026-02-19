'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users } from 'lucide-react';
import type { UserRole } from '@/lib/types';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const { availableUsers, switchUserRole } = useUser();
  const router = useRouter();

  const handleLogin = (role: UserRole) => {
    switchUserRole(role);
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Logo />
            </div>
          <CardTitle>Login to AeroDesk</CardTitle>
          <CardDescription>
            This is a demonstration environment. Select a user persona to log in and access the corresponding role-based console.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            {availableUsers.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="w-full justify-start py-6"
                onClick={() => handleLogin(user.role)}
              >
                <div className="flex items-center gap-4">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                        <p className="font-semibold">{user.role}</p>
                        <p className="text-xs text-muted-foreground">{user.company}</p>
                    </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
