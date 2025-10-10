'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/presentation/shared/components/ui/button';
import { Input } from '@/presentation/shared/components/ui/input';
import { Label } from '@/presentation/shared/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/shared/components/ui/card';
import {
  Alert,
  AlertDescription,
} from '@/presentation/shared/components/ui/alert';

interface WebsiteSettingsFormProps {
  initialName: string;
}

export default function WebsiteSettingsForm({
  initialName,
}: WebsiteSettingsFormProps) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchWebsiteName = async () => {
    try {
      const response = await fetch('/api/settings/name');
      const data = await response.json();
      if (response.ok) {
        setName(data.name);
      } else {
        console.error('Failed to fetch website name:', data.error);
      }
    } catch (error) {
      console.error('Error fetching website name:', error);
    }
  };

  useEffect(() => {
    fetchWebsiteName();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Website name updated successfully!');
        await fetchWebsiteName();
      } else {
        setMessage(data.error || 'Failed to update website name');
      }
    } catch {
      setMessage('An error occurred while updating the website name');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Website Settings</CardTitle>
        <CardDescription>
          Manage your website&apos;s basic configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Website Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter website name"
              maxLength={50}
              required
            />
            <p className="text-sm text-muted-foreground">
              This name will appear in the browser tab. Max 50 characters.
            </p>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating...' : 'Update Website Name'}
          </Button>
        </form>
        {message && (
          <Alert
            className={`mt-4 ${message.includes('successfully') ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
