
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

  return (
    <div className="w-full">
      {/* Fixed Background Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2187&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
        <LandingHeader activePage="Blog" />

        <main className="flex-1 py-12 md:py-16">
          <div className="container px-4">
            
            {/* Page Header - Refined matching Agorapulse scale */}
            <div className="mb-12 text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 font-headline">
                AeroDesk Intelligence
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                The latest insights into India's evolving private aviation infrastructure and non-scheduled operations governance.
              </p>
            </div>

            {/* Editorial Hero Area - Split between Featured and Small Stack */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              {/* Featured Large Article (Left) */}
              <div className="lg:col-span-8">
                <Card className="h-full overflow-hidden border-white/10 bg-black/30 backdrop-blur-xl group hover:border-primary/50 transition-all duration-500">
                  <div className="relative h-[350px] md:h-[450px]">
                    <Image
                      src={leadPost.imageUrl}
                      alt={leadPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <Badge variant="outline" className="mb-4 text-accent border-accent/30 bg-accent/10">
                        {leadPost.category}
                      </Badge>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-accent transition-colors">
                        {leadPost.title}
                      </h2>
                      <p className="text-white/70 text-lg mb-6 line-clamp-2 max-w-2xl">
                        {leadPost.excerpt}
                      </p>
                      <div className="flex items-center gap-6">
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                          Read Insight
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2 text-xs text-white/40 font-code uppercase tracking-widest">
                          <User className="h-3 w-3" />
                          {leadPost.author}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Trending Stack (Right) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-2">Trending Now</h3>
                {trendingPosts.map((post) => (
                  <Card key={post.id} className="border-white/10 bg-black/20 backdrop-blur-md overflow-hidden group hover:border-white/20 transition-all cursor-pointer">
                    <div className="flex gap-4 p-4">
                      <div className="relative h-20 w-24 shrink-0 rounded-md overflow-hidden">
                        <Image src={post.imageUrl} alt={post.title} fill className="object-cover opacity-70" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{post.category}</span>
                        <h4 className="text-sm font-bold text-white group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h4>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Content Utility Bar - Filter & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
              <nav className="flex flex-wrap items-center gap-6">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    className="text-sm font-medium text-white/60 hover:text-white transition-colors relative"
                  >
                    {cat}
                    {cat === 'All' && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent" />}
                  </button>
                ))}
              </nav>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input 
                  placeholder="Search intelligence..." 
                  className="bg-black/20 border-white/10 text-white pl-10 focus:ring-accent h-10"
                />
              </div>
            </div>

            {/* Latest Articles Grid - 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {remainingPosts.map((post) => (
                <Card key={post.id} className="border-white/10 bg-black/20 backdrop-blur-md overflow-hidden group hover:border-white/20 transition-all flex flex-col h-full">
                  <div className="relative h-56 w-full">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black/60 text-white border-transparent backdrop-blur-md">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-1 flex-col">
                    <div className="flex items-center gap-4 text-[10px] text-white/40 uppercase tracking-widest mb-4">
                      <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> 5 min read</div>
                      <div>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-sm text-white/60 mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                      <Button variant="link" className="p-0 text-accent hover:text-accent/80 h-auto font-bold group/btn">
                        Read Insight
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                      <span className="text-[10px] text-white/30 font-code">{post.author}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Newsletter CTA Section - Wide design matching reference footer area */}
            <Card className="border-accent/20 bg-accent/5 backdrop-blur-2xl p-12 text-center max-w-4xl mx-auto overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <BookOpen className="h-64 w-64 -mr-20 -mt-20" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="inline-flex p-3 bg-accent/10 rounded-full mb-2">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-3xl font-bold text-white">Institutional Intelligence in your Inbox</h3>
                <p className="text-white/60 max-w-xl mx-auto">
                  Receive weekly operational perspectives, market analysis, and ecosystem updates directly from India's charter infrastructure center.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4" onSubmit={(e) => e.preventDefault()}>
                  <Input 
                    type="email" 
                    placeholder="Corporate Email Address" 
                    className="bg-black/40 border-white/10 text-white h-12"
                  />
                  <Button className="h-12 px-8 bg-accent text-accent-foreground hover:bg-accent/90 font-bold shrink-0">
                    Subscribe
                  </Button>
                </form>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">AeroDesk Governance Protocol • No Spam Policy</p>
              </div>
            </Card>

          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
