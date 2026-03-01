'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockBlogPosts } from '@/lib/data';
import { ArrowLeft, Clock, User, Share2, Calendar } from 'lucide-react';

export default function BlogPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const post = mockBlogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Report Not Found</h1>
          <Button onClick={() => router.push('/blog')}>Return to Feed</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Background Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1627440474139-65a5d1656f7e?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
        <LandingHeader activePage="Blog" />

        <main className="flex-1 py-12">
          <div className="container max-w-4xl px-4">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              className="mb-8 text-white/60 hover:text-white hover:bg-white/10 group px-0"
              onClick={() => router.push('/blog')}
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Intelligence Feed
            </Button>

            <article className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Header */}
              <div className="space-y-4">
                <Badge variant="outline" className="text-accent border-accent/30 bg-accent/5 px-3 py-1 text-[10px] uppercase tracking-widest">
                  {post.category}
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight font-headline">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-[11px] text-white/40 uppercase tracking-widest pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-accent" />
                    <span className="text-white/70">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-accent" />
                    <span>5 Min Read</span>
                  </div>
                </div>
              </div>

              {/* Feature Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image 
                  src={post.imageUrl} 
                  alt={post.title} 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>

              {/* Content */}
              <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-headline prose-headings:text-white prose-p:text-white/70 prose-p:leading-relaxed prose-strong:text-accent">
                <p className="text-xl text-white/90 font-medium italic border-l-4 border-accent pl-6 py-2 bg-white/5 rounded-r-lg">
                  {post.excerpt}
                </p>
                
                <p>
                  As India's private aviation landscape matures, the transition from fragmented regional operations to a unified digital infrastructure is becoming a critical imperative for 2025. The complexity of Non-Scheduled Operator Permit (NSOP) management demands a standard of governance that manual workflows can no longer sustain.
                </p>

                <h3>The Institutional Shift</h3>
                <p>
                  Current market dynamics show a 15% increase in domestic charter inquiries year-on-year. However, the conversion efficiency remains challenged by visibility gaps between operators, corporate travel desks, and high-net-worth clients. AeroDesk's intelligence layer identifies these bottlenecks, offering real-time coordination protocols that bridge the divide.
                </p>

                <blockquote>
                  "The future of aviation infrastructure in India isn't just about more runways; it's about the digital layers that coordinate the assets already in play."
                </blockquote>

                <h3>Empty Leg Optimization</h3>
                <p>
                  One of the most significant yield opportunities identified in our latest audit is the systematic recovery of positioning flights. By listing allocatable jet seats via authorized distributors, operators can recoup significant operational costs while providing a gateway for new institutional clients to experience private aviation at a commercial-plus price point.
                </p>

                <p>
                  In conclusion, the path to a robust aviation ecosystem lies in compliance-first design and strategic demand synchronization. AeroDesk remains committed to leading this charge as the primary digital coordination center for the industry.
                </p>
              </div>

              {/* Social Actions */}
              <div className="flex items-center justify-between py-8 border-t border-white/10 mt-12">
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">AeroDesk Governance Protocol • Ref: INTEL-{post.id.toUpperCase()}</p>
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-[10px] h-8">
                  <Share2 className="mr-2 h-3.5 w-3.5" />
                  Share Insight
                </Button>
              </div>
            </article>
          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
