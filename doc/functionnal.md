# Admin Page Access and Protection

## Overview

The admin page in this project is a protected route that requires authentication to access. It is designed to ensure that only authorized users can manage and configure the application. This document explains how to connect to the admin page and the rationale behind its protection.

---

## Steps to Connect to the Admin Page

1. **Navigate to the Admin Page**
   - Open your browser and go to the `/admin` route of the application (e.g., `http://localhost:3000/admin`).

2. **Sign In with Google**
   - If you are not signed in, you will be redirected to the Google login page.
   - Click the "Sign in with Google" button and select your Google account.

3. **Authorization Check**
   - After signing in, the application checks if your email matches authorized email.
   - If your email is authorized, you will be granted access to the admin page.
   - If your email is not authorized, you will see a "Not Authorized" message.

---

## Why the Admin Page is Protected

### 1. **Security**

The admin page allows users to manage sensitive configurations and settings of the application. Unauthorized access could compromise the integrity and functionality of the application.

### 2. **Role-Based Access Control**

Only specific users (e.g., administrators) should have the ability to modify critical aspects of the application. By restricting access to some the email, we ensure that only authorized personnel can access the admin page.

### 3. **Compliance**

Protecting the admin page ensures compliance with best practices for web application security, such as:

- Authentication: Verifying the identity of the user.
- Authorization: Ensuring the user has permission to access the page.

---

# Website Settings Management

## Overview

The admin page provides comprehensive website settings management, allowing administrators to configure the website name and icon (favicon). These settings are essential for branding and user experience across all pages of the application.

---

## Website Name Management

### Functionality

Administrators can update the website name that appears in the browser tab and throughout the application interface. The website name is a key branding element that helps users identify the website.

### Features

- **Real-time Updates**: Changes to the website name are immediately reflected across all pages
- **Persistent Storage**: The website name is saved and persists after page refreshes
- **Input Validation**: Ensures the website name meets required format and length constraints

---

## Website Icon (Favicon) Management

### Functionality

Administrators can upload and manage a website icon (favicon) that displays in the browser tab next to the website name. This feature provides professional branding and helps users easily identify the website in their browser tabs.

### Features

1. **Icon Upload**
   - File explorer interface to select icon files from local storage
   - Support for standard image formats (PNG, JPG, ICO)
   - File size limitations to ensure optimal performance
   - Automatic validation of uploaded files

2. **Icon Preview**
   - Real-time preview of the uploaded icon before saving
   - Visual representation of the current icon when loading the page
   - Preview displayed in a compact format alongside the upload interface

3. **Icon Management**
   - Replace existing icon by uploading a new one (automatically deletes previous icon)
   - Delete current icon to revert to default icon
   - Only one active icon allowed at any time
   - Default icon displayed when no custom icon is uploaded

4. **User Interface**
   - Icon upload field grouped with website name setting for better organization
   - Compact input design (not more than twice the size of website name input)
   - Clear label and structured layout with preview area below the input
   - Single save button for both website name and icon changes

### Workflow

1. **Upload New Icon**
   - Click the icon upload field to open file explorer
   - Select desired icon file from local storage
   - Preview the uploaded icon in the interface
   - Click save to apply changes (saves both name and icon)

2. **Replace Existing Icon**
   - Upload a new icon file
   - System automatically deletes the previous icon
   - Preview shows the new icon
   - Save to apply the replacement

3. **Delete Current Icon**
   - Click the delete button next to the current icon preview
   - Icon is removed and reverts to default icon
   - Save to confirm the deletion

### Technical Implementation

- **Single Icon Policy**: Only one icon file is stored at any time
- **Automatic Cleanup**: Previous icons are automatically deleted when new ones are uploaded
- **Browser Integration**: Icon automatically appears in browser tab across all pages
- **Persistent Storage**: Icon settings remain active after page refreshes
- **Default Fallback**: System uses default icon when no custom icon is uploaded

---

## User Interface Design

### Layout Structure

The website settings interface is organized with:

- **Website Name Input**: Text field for entering the website name
- **Icon Upload Section**: Compact file upload area with preview functionality
- **Save Button**: Single button to save both website name and icon changes
- **Visual Hierarchy**: Clear labeling and intuitive grouping of related settings

### Responsive Design

- **Compact Layout**: Icon upload input sized appropriately relative to website name input
- **Mobile Friendly**: Interface adapts to different screen sizes
- **Accessibility**: Proper labeling and keyboard navigation support

---

## Summary

The admin page provides a secure and intuitive interface for managing website settings. Administrators can easily update the website name and upload a custom icon to enhance branding across the application. The icon management system ensures efficient file handling with automatic cleanup and preview functionality, while maintaining a clean and organized user experience.

The admin page remains protected through Google OAuth authentication and email-based authorization, ensuring that only authorized personnel can access and modify these critical website settings.
