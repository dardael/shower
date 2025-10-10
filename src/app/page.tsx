import React from 'react';
import Link from 'next/link';
import { Button } from '@/presentation/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/shared/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome to Shower
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your modern showcase website builder. Create beautiful, responsive
            websites with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/admin">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚀 Easy to Use
              </CardTitle>
              <CardDescription>
                Intuitive interface that makes website creation a breeze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No coding required. Our drag-and-drop interface lets you build
                professional websites in minutes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 Beautiful Designs
              </CardTitle>
              <CardDescription>
                Modern, responsive templates that look great on any device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Choose from our collection of professionally designed templates
                or create your own unique style.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Lightning Fast
              </CardTitle>
              <CardDescription>
                Optimized performance for the best user experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built with modern web technologies to ensure your website loads
                quickly and runs smoothly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
