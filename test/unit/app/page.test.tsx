import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';

// Mock the HomePageClient component
jest.mock('@/app/HomePageClient', () => ({
  HomePageClient: jest.fn(() =>
    React.createElement(
      'div',
      { 'data-testid': 'home-page-client' },
      'Home Page Client Component'
    )
  ),
}));

describe('Home Page (Root URL)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render HomePageClient component', async () => {
    const page = Home();
    render(page);

    await waitFor(() => {
      expect(screen.getByTestId('home-page-client')).toBeInTheDocument();
    });
  });

  it('should display HomePageClient content', async () => {
    const page = Home();
    render(page);

    await waitFor(() => {
      expect(
        screen.getByText('Home Page Client Component')
      ).toBeInTheDocument();
    });
  });
});
