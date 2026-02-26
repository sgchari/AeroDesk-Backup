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
      {/* Background Layer */}
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

        <main className="flex-1 py-8 md:py-10">
          <div className="container px-4">
            
            {/* Corporate Header - Compacted */}
            <div className="mb-10 max-w-2xl text-left">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 font-headline">
                Media & Announcements
              </h1>
              <p className="text-base text-white/70">
                Platform updates, industry engagements, press resources, and brand communications.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Primary Content Column - Tighter spacing */}
              <div className="lg:col-span-8 space-y-10">
                
                {/* Press Releases Section */}
                <section>
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-accent" />
                    Press Releases
                  </h2>
                  <div className="space-y-4">
                    {mockPressReleases.map((pr) => (
                      <Card key={pr.id} className="border-white/10 bg-black/20 backdrop-blur-md hover:border-white/20 transition-all group">
                        <CardContent className="p-5">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-accent border-accent/30 h-5">
                                  {pr.category}
                                </Badge>
                                <span className="text-[10px] text-white/40 font-code">
                                  {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors">
                                {pr.title}
                              </h3>
                              <p className="text-xs text-white/60 line-clamp-2">
                                {pr.description}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" className="shrink-0 bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs">
                              View Release
                              <FileText className="ml-2 h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Institutional Visibility Section */}
                <section>
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-accent" />
                    Institutional Visibility
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {mockMediaMentions.map((mention) => (
                      <Card key={mention.id} className="border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-3">
                          {mention.publication}
                        </span>
                        <h4 className="text-sm font-semibold text-white mb-2">
                          {mention.title}
                        </h4>
                        <p className="text-xs text-white/60 italic mb-4">
                          {mention.snippet}
                        </p>
                        <Button variant="link" className="p-0 text-accent hover:text-accent/80 w-fit mt-auto text-xs h-auto">
                          View Details
                          <ExternalLink className="ml-1.5 h-3 w-3" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Curated Visual Assets Section */}
                <section>
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-accent" />
                    Visual Assets
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mockBrandAssets.map((asset) => (
                      <div key={asset.id} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer border border-white/10">
                        <Image
                          src={asset.imageUrl}
                          alt={asset.title}
                          fill
                          className="object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                          <p className="text-[10px] font-bold text-white">{asset.title}</p>
                          <span className="text-[9px] text-white/60">View Media</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </div>

              {/* Resource & Contact Sidebar - Re-aligned and compacted */}
              <aside className="lg:col-span-4 space-y-6">
                
                <Card className="border-accent/20 bg-accent/5 backdrop-blur-xl">
                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-base text-white">Resource Kit</CardTitle>
                    <CardDescription className="text-xs text-white/60">
                      Standard brand assets and guidelines.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 space-y-3">
                    <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 justify-between text-xs">
                      Download Brand Assets
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <div className="space-y-2 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-[10px] text-white/60">
                        <span>Corporate Profile</span>
                        <span className="font-code text-[9px]">PDF • 2MB</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/60">
                        <span>Fleet Specifications</span>
                        <span className="font-code text-[9px]">XLS • 1MB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/30 backdrop-blur-md">
                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-base text-white">Press Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white/5 rounded-md">
                        <Mail className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">Media Relations</p>
                        <p className="text-[10px] text-white/60 mt-0.5">press@aerodesk.com</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full border-white/10 text-white text-xs h-9">
                      Contact Press Office
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
