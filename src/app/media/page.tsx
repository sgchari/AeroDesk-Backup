
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';

export default function MediaPage() {
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
      <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
        <LandingHeader activePage="Media"/>
        <main className="flex-1 py-12 md:py-16 flex items-center justify-center">
          <div className="container flex items-center justify-center">
            <Card className="border-white/10 bg-black/15 backdrop-blur-md text-white w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline text-center">Media</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-white/80">Media assets and press information will be available here soon.</p>
                </CardContent>
            </Card>
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
