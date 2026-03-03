'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockBlogPosts } from '@/lib/data';
import { ArrowRight, Search, Mail, BookOpen, Clock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

const categories = [
  'All',
  'Private Aviation',
  'Empty Leg Insights',
  'Market Trends',
  'Corporate Travel',
  'Operator Perspectives'
];

export default function BlogPage() {
  const leadPost = mockBlogPosts[0];
  const trendingPosts = mockBlogPosts.slice(1, 4);
  const remainingPosts = mockBlogPosts.slice(4);

  if (!leadPost) {
    return (
      <div className="w-full relative min-h-screen">
        <div className="fixed inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
            alt="Background"
            fill
            className="object-cover"
            priority
            data-ai-hint="airplane beach"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
          <LandingHeader activePage="Blog" />
          <main className="flex-1 py-12 flex items-center justify-center">
            <div className="text-center space-y-4 px-4">
              <h1 className="text-2xl font-bold text-white">Institutional Intelligence</h1>
              <p className="text-white/60">No reports are currently available in the public registry.</p>
            </div>
          </main>
          <LandingFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
          alt="Background"
          fill
          className="object-cover"
          priority
          data-ai-hint="airplane beach"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
        <LandingHeader activePage="Blog" />

        <main className="flex-1 py-6 md:py-10">
          <div className="container px-4">
            
            <div className="mb-8 md:mb-12 text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 font-headline">
                AeroDesk Intelligence
              </h1>
              <p className="text-sm md:text-lg text-white/70 leading-relaxed">
                India's evolving private aviation infrastructure and non-scheduled operations governance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 md:mb-12">
              
              <div className="lg:col-span-8">
                <Link href={`/blog/${leadPost.id}`}>
                  <Card className="h-full overflow-hidden border-white/10 bg-black/30 backdrop-blur-xl group hover:border-primary/50 transition-all duration-500 cursor-pointer">
                    <div className="relative h-[300px] sm:h-[400px] md:h-[450px]">
                      <Image
                        src={leadPost.imageUrl}
                        alt={leadPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                        priority
                        data-ai-hint="private jet"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <Badge variant="outline" className="mb-3 text-accent border-accent/30 bg-accent/10 text-[10px] uppercase tracking-widest">
                          {leadPost.category}
                        </Badge>
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-accent transition-colors font-headline">
                          {leadPost.title}
                        </h2>
                        <p className="text-white/70 text-sm md:text-base mb-4 line-clamp-2 max-w-2xl">
                          {leadPost.excerpt}
                        </p>
                        <div className="flex items-center gap-6">
                          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 h-9 text-xs px-6 font-black uppercase tracking-widest" size="sm">
                            Read Insight
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <div className="hidden sm:flex items-center gap-2 text-[10px] text-white/40 font-code uppercase tracking-widest">
                            <User className="h-3.5 w-3.5 text-accent" />
                            {leadPost.author}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-1 ml-1">Trending Reports</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    {trendingPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`}>
                        <Card className="border-white/10 bg-black/20 backdrop-blur-md overflow-hidden group hover:border-white/20 transition-all cursor-pointer">
                        <div className="flex gap-4 p-3">
                            <div className="relative h-16 w-20 shrink-0 rounded-lg overflow-hidden">
                            <Image src={post.imageUrl} alt={post.title} fill className="object-cover opacity-70 transition-opacity group-hover:opacity-100" data-ai-hint="aviation" />
                            </div>
                            <div className="flex flex-col justify-center">
                            <span className="text-[9px] uppercase tracking-widest font-bold text-white/40 mb-1">{post.category}</span>
                            <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-accent transition-colors line-clamp-2 leading-tight font-headline">
                                {post.title}
                            </h4>
                            </div>
                        </div>
                        </Card>
                    </Link>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
              <nav className="flex items-center gap-4 md:gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide px-2">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors relative shrink-0"
                  >
                    {cat}
                    {cat === 'All' && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent" />}
                  </button>
                ))}
              </nav>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input 
                  placeholder="Search intelligence registry..." 
                  className="bg-black/20 border-white/10 text-white pl-10 focus:ring-accent h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {remainingPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="block h-full">
                  <Card className="border-white/10 bg-black/20 backdrop-blur-md overflow-hidden group hover:border-white/20 transition-all flex flex-col h-full cursor-pointer rounded-2xl">
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                        data-ai-hint="flight cockpit"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/60 text-[9px] text-white border-transparent backdrop-blur-md h-6 px-3 uppercase font-black tracking-widest">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-1 flex-col">
                      <div className="flex items-center gap-2 text-[9px] text-white/40 uppercase tracking-widest mb-3">
                        <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> 5 min</div>
                        <div>•</div>
                        <div>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors line-clamp-2 leading-tight font-headline">
                        {post.title}
                      </h4>
                      <p className="text-xs text-white/60 mb-4 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <Button variant="link" className="p-0 text-accent hover:text-accent/80 h-auto font-black text-[10px] uppercase tracking-widest group/btn">
                          Read Full Insight
                          <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                        <span className="text-[9px] text-white/30 font-code font-bold">{post.author}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <Card className="border-accent/20 bg-accent/5 backdrop-blur-3xl p-8 md:p-12 text-center max-w-3xl mx-auto overflow-hidden relative rounded-3xl">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <BookOpen className="h-48 w-48 -mr-16 -mt-16" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="inline-flex p-3 bg-accent/10 rounded-full mb-2">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-headline">Institutional Intelligence Feed</h3>
                <p className="text-xs md:text-sm text-white/60 max-w-md mx-auto leading-relaxed">
                  Receive weekly operational perspectives and market analysis directly from the charter infrastructure center.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4" onSubmit={(e) => e.preventDefault()}>
                  <Input 
                    type="email" 
                    placeholder="Corporate Email Protocol" 
                    className="bg-black/40 border-white/10 text-white h-11 text-xs px-4 rounded-xl"
                  />
                  <Button className="h-11 px-8 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase tracking-widest shrink-0 rounded-xl">
                    Subscribe
                  </Button>
                </form>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] pt-4">AeroDesk Governance Protocol • Zero Spam Policy</p>
              </div>
            </Card>

          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
