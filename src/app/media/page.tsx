
'use client';

import React from 'react';
import Image from 'next/image';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPressReleases, mockMediaMentions, mockBrandAssets } from '@/lib/data';
import { Download, ExternalLink, FileText, Share2, Mail, Newspaper, Image as ImageIcon } from 'lucide-react';

export default function MediaPage() {
  return (
    <div className="w-full">
      {/* Fixed Background - Consistent with Homepage */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2187&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
        <LandingHeader activePage="Media" />

        <main className="flex-1 py-12 md:py-16">
          <div className="container px-4">
            
            {/* 1. Media Page Header / Hero Section */}
            <div className="mb-16 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 font-headline">
                Media & Announcements
              </h1>
              <p className="text-lg text-white/70">
                Platform updates, industry engagements, press resources, and brand communications from the center of India's charter infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Announcements & Coverage */}
              <div className="lg:col-span-8 space-y-16">
                
                {/* 🥇 Press Releases / Announcements Section */}
                <section>
                  <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-accent" />
                    Press Releases
                  </h2>
                  <div className="space-y-6">
                    {mockPressReleases.map((pr) => (
                      <Card key={pr.id} className="border-white/10 bg-black/20 backdrop-blur-md hover:border-white/20 transition-all group">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-accent border-accent/30">
                                  {pr.category}
                                </Badge>
                                <span className="text-xs text-white/40 font-code">
                                  {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
                                {pr.title}
                              </h3>
                              <p className="text-sm text-white/60 line-clamp-2">
                                {pr.description}
                              </p>
                            </div>
                            <Button variant="outline" className="shrink-0 bg-white/5 border-white/10 text-white hover:bg-white/10">
                              View Release
                              <FileText className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* 🥈 Brand & Platform Coverage Section */}
                <section>
                  <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-accent" />
                    Institutional Visibility
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {mockMediaMentions.map((mention) => (
                      <Card key={mention.id} className="border-white/10 bg-white/5 backdrop-blur-sm p-6 flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">
                          {mention.publication}
                        </span>
                        <h4 className="text-base font-semibold text-white mb-3">
                          {mention.title}
                        </h4>
                        <p className="text-sm text-white/60 italic mb-6">
                          {mention.snippet}
                        </p>
                        <Button variant="link" className="p-0 text-accent hover:text-accent/80 w-fit mt-auto">
                          View Details
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* 🥉 Visual Media / Brand Assets Section */}
                <section>
                  <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-accent" />
                    Visual Assets
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mockBrandAssets.map((asset) => (
                      <div key={asset.id} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer border border-white/10">
                        <Image
                          src={asset.imageUrl}
                          alt={asset.title}
                          fill
                          className="object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                          <p className="text-xs font-bold text-white">{asset.title}</p>
                          <span className="text-[10px] text-white/60">View Media</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </div>

              {/* Right Column: Resource Kit & Contact */}
              <aside className="lg:col-span-4 space-y-8">
                
                {/* Media Resource Kit */}
                <Card className="border-accent/20 bg-accent/5 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Resource Kit</CardTitle>
                    <CardDescription className="text-white/60">
                      Standard brand assets and guidelines for press and partners.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 justify-between">
                      Download Brand Assets
                      <Download className="h-4 w-4" />
                    </Button>
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>Corporate Profile</span>
                        <span className="font-code">PDF • 2MB</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>Fleet Specifications</span>
                        <span className="font-code">XLS • 1MB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Press Contact */}
                <Card className="border-white/10 bg-black/30 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Press Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white/5 rounded-md">
                        <Mail className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Media Relations</p>
                        <p className="text-xs text-white/60 mt-1">press@aerodesk.com</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full border-white/10 text-white">
                      Media Contact
                    </Button>
                  </CardContent>
                </Card>

              </aside>
            </div>
          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
