
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

  // Safety guard for empty data registry
  if (!leadPost) {
    return (
      <div className="w-full relative min-h-screen">
        <div className="fixed inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2187&auto=format&fit=crop"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
          <LandingHeader activePage="Blog" />
          <main className="flex-1 py-12 flex items-center justify-center">
            <div className="text-center space-y-4">
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
      {/* Optimized Background Layer */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2187&auto=format&fit=crop"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
        <LandingHeader activePage="Blog" />

        <main className="flex-1 py-6">
          <div className="container px-4">
            
            {/* Page Header - Compacted */}
            <div className="mb-6 text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1 font-headline">
                AeroDesk Intelligence
              </h1>
              <p className="text-base text-white/70 leading-relaxed">
                India's evolving private aviation infrastructure and non-scheduled operations governance.
              </p>
            </div>

            {/* Editorial Hero Area - Tight Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
              
              {/* Featured Large Article (Left) */}
              <div className="lg:col-span-8">
                <Link href={`/blog/${leadPost.id}`}>
                  <Card className="h-full overflow-hidden border-white/10 bg-black/30 backdrop-blur-xl group hover:border-primary/50 transition-all duration-500 cursor-pointer">
                    <div className="relative h-[280px] md:h-[380px]">
                      <Image
                        src={leadPost.imageUrl}
                        alt={leadPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                        priority
                        data-ai-hint="private jet"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <Badge variant="outline" className="mb-2 text-accent border-accent/30 bg-accent/10 text-[10px]">
                          {leadPost.category}
                        </Badge>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-accent transition-colors">
                          {leadPost.title}
                        </h2>
                        <p className="text-white/70 text-sm mb-3 line-clamp-2 max-w-2xl">
                          {leadPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4">
                          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 h-8 text-xs px-4" size="sm">
                            Read Insight
                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                          </Button>
                          <div className="flex items-center gap-2 text-[9px] text-white/40 font-code uppercase tracking-widest">
                            <User className="h-3 w-3" />
                            {leadPost.author}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>

              {/* Trending Stack (Right) */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Trending Now</h3>
                {trendingPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <Card className="border-white/10 bg-black/20 backdrop-blur-md overflow-hidden group hover:border-white/20 transition-all cursor-pointer">
                      <div className="flex gap-3 p-2.5">
                        <div className="relative h-14 w-16 shrink-0 rounded-md overflow-hidden">
                          <Image src={post.imageUrl} alt={post.title} fill className="object-cover opacity-70 transition-opacity group-hover:opacity-100" data-ai-hint="aviation" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-[8px] uppercase tracking-widest text-white/40 mb-0.5">{post.category}</span>
                          <h4 className="text-[11px] font-bold text-white group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                            {post.title}
                          </h4>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Content Utility Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-8 bg-white/5 backdrop-blur-md border border-white/10 p-2.5 rounded-xl">
              <nav className="flex flex-wrap items-center gap-4">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    className="text-[11px] font-medium text-white/60 hover:text-white transition-colors relative"
                  >
                    {cat}
                    {cat === 'All' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent" />}
                  </button>
                ))}
              </nav>
              <div className="relative w-full md:w-56">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" />
                <Input 
                  placeholder="Search intelligence..." 
                  className="bg-black/20 border-white/10 text-white pl-7 focus:ring-accent h-8 text-[11px]"
                />
              </div>
            </div>

            {/* Latest Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {remainingPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="block h-full">
                  <Card className="border-white/10 bg-black/20 backdrop-blur-md overflow-hidden group hover:border-white/20 transition-all flex flex-col h-full cursor-pointer">
                    <div className="relative h-40 w-full">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                        data-ai-hint="flight cockpit"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-black/60 text-[9px] text-white border-transparent backdrop-blur-md h-5">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 flex flex-1 flex-col">
                      <div className="flex items-center gap-2 text-[8px] text-white/40 uppercase tracking-widest mb-2">
                        <div className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> 5 min</div>
                        <div>•</div>
                        <div>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h4>
                      <p className="text-[11px] text-white/60 mb-3 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto pt-2.5 border-t border-white/5 flex items-center justify-between">
                        <Button variant="link" className="p-0 text-accent hover:text-accent/80 h-auto font-bold text-[10px] group/btn">
                          Read Insight
                          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                        <span className="text-[8px] text-white/30 font-code">{post.author}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Newsletter CTA Section */}
            <Card className="border-accent/20 bg-accent/5 backdrop-blur-2xl p-6 text-center max-w-2xl mx-auto overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <BookOpen className="h-32 w-32 -mr-12 -mt-12" />
              </div>
              <div className="relative z-10 space-y-3">
                <div className="inline-flex p-2 bg-accent/10 rounded-full mb-1">
                  <Mail className="h-4 w-4 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white">Institutional Intelligence</h3>
                <p className="text-[11px] text-white/60 max-w-sm mx-auto">
                  Receive weekly operational perspectives and market analysis directly from the charter infrastructure center.
                </p>
                <form className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto pt-1" onSubmit={(e) => e.preventDefault()}>
                  <Input 
                    type="email" 
                    placeholder="Corporate Email" 
                    className="bg-black/40 border-white/10 text-white h-9 text-xs"
                  />
                  <Button className="h-9 px-5 bg-accent text-accent-foreground hover:bg-accent/90 font-bold shrink-0 text-xs">
                    Subscribe
                  </Button>
                </form>
                <p className="text-[8px] text-white/30 uppercase tracking-[0.2em]">AeroDesk Governance Protocol • No Spam Policy</p>
              </div>
            </Card>

          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
