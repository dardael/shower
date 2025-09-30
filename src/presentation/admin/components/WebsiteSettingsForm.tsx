'use client';

import React, { useState, useEffect } from 'react';

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
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Website Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Website Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter website name"
            maxLength={50}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            This name will appear in the browser tab. Max 50 characters.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Website Name'}
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
