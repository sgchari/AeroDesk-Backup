
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';

export default function RegisterPage() {

  return (
    <div className="w-full">
        <div
            className="fixed inset-0 z-0 bg-cover bg-center"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2187&auto=format&fit=crop')",
            }}
        >
            <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-transparent p-4">
            <Card className="w-full max-w-md border-white/10 bg-black/15 text-white backdrop-blur-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Link href="/">
                            <Logo />
                        </Link>
                    </div>
                    <CardTitle className="text-white">Registration Disabled</CardTitle>
                    <CardDescription className="text-white/80">
                        This is a read-only demo version of AeroDesk.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-white/90">
                        To explore the application, please return to the login page and select a demo user role.
                    </p>
                    <div className="mt-4 text-center text-sm text-white/80">
                        <Link href="/login" className="font-semibold text-accent underline-offset-4 hover:underline">
                            Return to Demo Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
