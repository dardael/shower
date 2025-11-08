# Instruction: Implement Collapsible Admin Menu Navigation

> Please follow this plan using proper rules.

## Goal

Create a collapsible sidebar navigation system for the admin dashboard that allows administrators to navigate between different sections using URL-based routing, with mobile responsiveness and form state preservation.

## Current task

Starting step 7: Integrate WebsiteSettingsForm into new structure

## Grouped tasks

### Group 1: Routing and Navigation Structure

> Create URL-based routing system for admin sections with proper authentication and navigation state management

- [x]Create new admin route structure using Next.js App Router
  - [x]Create `/admin/website-settings` route with page component
  - [x]Create `/admin/social-networks` route with page component
  - [x]Create `/admin/layout.tsx` to handle admin-specific layout
  - [x]Update existing `/admin/page.tsx` to redirect to first section
  - [x]Add route protection middleware for all admin routes

- [x]Implement navigation state management
  - [x]Create useAdminNavigation hook for active section tracking
  - [x]Add URL synchronization for active section state
  - [x]Implement navigation helper functions
  - [x]Add TypeScript interfaces for navigation types

- [x]Set up route protection and authentication
  - [x]Update authentication middleware for new routes
  - [x]Add admin access verification to all admin routes
  - [x]Implement proper redirect logic for unauthorized access
  - [x]Add loading states during authentication checks

### Group 2: Sidebar Component Development

> Create responsive collapsible sidebar with hamburger menu for mobile and localStorage persistence

- [x]Create AdminSidebar component
  - [x]Implement collapsible sidebar with toggle functionality
  - [x]Add responsive design with mobile hamburger menu
  - [x]Implement localStorage persistence for sidebar state
  - [x]Add smooth transitions and proper animations
  - [x]Use Chakra UI v3 components for consistent styling

- [x]Create AdminMenuItem component
  - [x]Implement individual menu item with active state highlighting
  - [x]Add proper icons using react-icons library
  - [x]Implement hover and focus states for accessibility
  - [x]Add data-testid attributes for testing
  - [x]Support nested menu items for future extensibility

- [x]Implement mobile navigation
  - [x]Create hamburger menu button for mobile devices
  - [x]Add overlay backdrop for mobile menu
  - [x]Implement swipe gestures for mobile interaction
  - [x]Add proper focus management for mobile navigation

### Group 3: Content Area and Layout

> Refactor admin dashboard to use dynamic routing with proper content area and section switching

- [x]Refactor AdminDashboard component
  - [x]Remove existing form components from main dashboard
  - [x]Create content area that displays active section
  - [x]Implement proper layout structure with sidebar and content
  - [x]Add responsive breakpoints for mobile and desktop
  - [x]Maintain existing styling consistency

- [x]Create AdminLayout component
  - [x]Implement layout wrapper with sidebar and content areas
  - [x]Add proper spacing and responsive design
  - [x]Implement loading states for section transitions
  - [x]Add error boundaries for section loading failures

- [x]Implement section switching logic
  - [x]Add smooth transitions between sections
  - [x]Implement proper focus management during section changes
  - [x]Add loading indicators during section switches
  - [x]Handle browser back/forward navigation properly

### Group 4: Form Integration and State Management

> Integrate existing forms into new routing structure with state preservation and user prompts

- []Integrate WebsiteSettingsForm into new structure
  - []Move form to `/admin/website-settings` route
  - []Implement form state preservation across navigation
  - []Add user prompts for unsaved changes
  - []Maintain all existing functionality and API calls

- []Integrate SocialNetworksForm into new structure
  - []Move form to `/admin/social-networks` route
  - []Implement form state preservation across navigation
  - []Add user prompts for unsaved changes
  - []Maintain all existing functionality and API calls

- []Implement form state management
  - []Create useFormState hook for form change tracking
  - []Add unsaved changes detection logic
  - []Implement user confirmation dialogs
  - []Add proper cleanup and reset functionality

### Group 5: Testing Implementation

> Create comprehensive unit and e2e tests for navigation functionality and mobile responsiveness

- []Create unit tests for new components
  - []Test AdminSidebar component functionality
  - []Test AdminMenuItem component behavior
  - []Test useAdminNavigation hook
  - []Test form state preservation logic
  - []Test localStorage persistence functionality

- []Create e2e tests for navigation
  - []Test sidebar collapse/expand functionality
  - []Test mobile hamburger menu behavior
  - []Test section switching with URL changes
  - []Test form state preservation prompts
  - []Test browser back/forward navigation

- []Test accessibility and responsiveness
  - []Test keyboard navigation patterns
  - []Test focus management during section changes
  - []Test mobile responsive design
  - []Test screen reader compatibility

### Group 6: Documentation and Updates

> Update project documentation and file structure to reflect new navigation system

- []Update AGENTS.md file structure
  - []Add new component files to directory structure
  - []Update admin component listings
  - []Add new hook files to structure
  - []Update test file listings

- []Update technical documentation
  - []Document new routing architecture
  - []Add navigation system technical details
  - []Document mobile responsiveness implementation
  - []Add form state preservation technical notes

- []Update functional documentation
  - []Document new navigation user experience
  - []Add mobile navigation instructions
  - []Document form state preservation behavior
  - []Add accessibility features documentation

- []Update existing tests and configurations
  - []Update existing e2e tests for new routes
  - []Modify authentication tests for new structure
  - []Update test fixtures and helpers
  - []Add new test data and scenarios
