
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
import { ArrowRight, Search, Mail, TrendingUp, BookOpen } from 'lucide-react';
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
  const featuredPost = mockBlogPosts.find(p => p.isFeatured) || mockBlogPosts[0];
  const latestPosts = mockBlogPosts.filter(p => p.id !== featuredPost.id);

  return (
    <div className="w-full">
      {/* Fixed Homepage Background for consistency */}
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
            
            {/* 2. Hero / Header Section */}
            <div className="mb-16 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 font-headline">
                Insights from Private Aviation & Travel Intelligence
              </h1>
              <p className="text-lg text-white/70">
                Market perspectives, operational insights, and ecosystem developments from the center of India's charter infrastructure.
              </p>
            </div>

            {/* 🥇 Featured Article Section */}
            <section className="mb-20">
              <Card className="overflow-hidden border-white/10 bg-black/30 backdrop-blur-xl group hover:border-primary/50 transition-all duration-500">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-[300px] md:h-full min-h-[400px]">
                    <Image
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                  </div>
                  <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                    <Badge variant="outline" className="w-fit mb-6 text-accent border-accent/30 bg-accent/10">
                      {featuredPost.category}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight group-hover:text-accent transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/70 text-lg mb-8 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <Button className="bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                        Read Insight
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <span className="text-xs text-white/40 font-code uppercase tracking-widest">
                        {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </section>

            {/* 🥉 Category / Topic Filter Bar */}
            <nav className="flex flex-wrap items-center gap-8 mb-12 border-b border-white/10 pb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group"
                >
                  {cat}
                  {cat === 'All' && <div className="absolute -bottom-6 left-0 right-0 h-0.5 bg-accent" />}
                </button>
              ))}
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* 🥈 Latest Articles Grid */}
              <div className="lg:col-span-8">
                <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-accent" />
                  Latest Intelligence
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {latestPosts.map((post) => (
                    <Card key={post.id} className="border-white/10 bg-black/20 backdrop-blur-md overflow-hidden group hover:border-white/20 transition-all flex flex-col">
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                      <CardContent className="p-6 flex flex-col flex-1">
                        <span className="text-[10px] uppercase tracking-widest text-accent font-bold mb-3">
                          {post.category}
                        </span>
                        <h4 className="text-lg font-bold text-white mb-3 group-hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-sm text-white/60 mb-6 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <Button variant="link" className="p-0 text-white hover:text-accent w-fit mt-auto group/btn">
                          Read Insight
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 5. Sidebar */}
              <aside className="lg:col-span-4 space-y-12">
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input 
                    placeholder="Search intelligence..." 
                    className="bg-white/5 border-white/10 text-white pl-10 focus:ring-accent"
                  />
                </div>

                {/* Popular Reads */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Popular Reads
                  </h3>
                  <div className="space-y-6">
                    {latestPosts.slice(0, 3).map((post, idx) => (
                      <div key={post.id} className="flex gap-4 group cursor-pointer">
                        <span className="text-2xl font-bold text-white/10 group-hover:text-accent/30 transition-colors">
                          0{idx + 1}
                        </span>
                        <div>
                          <h5 className="text-sm font-semibold text-white group-hover:text-accent transition-colors leading-snug">
                            {post.title}
                          </h5>
                          <p className="text-[10px] text-white/40 mt-1 font-code uppercase">
                            {post.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <Card className="border-white/10 bg-accent/5 backdrop-blur-xl p-6">
                  <div className="flex flex-col gap-4">
                    <div className="p-3 bg-accent/10 rounded-full w-fit">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Ecosystem Updates</h4>
                      <p className="text-sm text-white/60 mt-1">
                        Receive operational insights and market updates directly.
                      </p>
                    </div>
                    <form className="space-y-3 mt-2" onSubmit={(e) => e.preventDefault()}>
                      <Input 
                        type="email" 
                        placeholder="Email address" 
                        className="bg-black/20 border-white/10 text-white"
                      />
                      <Button className="w-full bg-accent text-accent-foreground">
                        Subscribe
                      </Button>
                    </form>
                  </div>
                </Card>

                {/* Featured Topics */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">
                    Featured Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['DGCA', 'NSOP', 'Fleet Intelligence', 'Charter Economics', 'Tier-2 Connectivity'].map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/5 text-white/60 hover:bg-white/10 transition-colors cursor-pointer border-transparent">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

              </aside>
            </div>
          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
