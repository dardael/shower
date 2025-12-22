# Feature Specification: Order Email Notifications

**Feature Branch**: `046-order-email-notifications`  
**Created**: 2025-12-22  
**Status**: Draft  
**Input**: User description: "As an administrator, when a purchaser validates a command, I want an email to be sent to the administrator with the command details and another email to be sent to the purchaser with the command summary. I want to configure the email templates for both emails in the admin settings. I want to configure the email subject and body for both emails. I want to use placeholders in the email templates to include dynamic data such as purchaser name, command id, command total, etc. I also want to enable or disable the email notifications for both emails separately. I want to configure the sender email address in the admin settings. I want to configure the administrator email address in the admin settings. I want to display the available placeholders to know which of them are available when configuring the template body and subject."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Configure SMTP Server (Priority: P1)

As an administrator, I want to configure the SMTP server settings so that the system can send emails through my email provider.

**Why this priority**: Without SMTP configuration, no emails can be sent. This is the foundational infrastructure required for all email functionality.

**Independent Test**: Can be fully tested by navigating to admin settings, configuring SMTP host, port, username, password, and encryption type, saving, and verifying the settings persist.

**Acceptance Scenarios**:

1. **Given** an authenticated administrator on the admin settings page, **When** they navigate to SMTP configuration, **Then** they see fields for host, port, username, password, and encryption type
2. **Given** an administrator configuring SMTP settings, **When** they enter valid SMTP host and port, **Then** the settings are persisted
3. **Given** an administrator configuring SMTP settings, **When** they enter SMTP credentials (username/password), **Then** the password is stored securely
4. **Given** an administrator configuring SMTP settings, **When** they select an encryption type (SSL/TLS/none), **Then** the selection is persisted
5. **Given** an administrator with completed SMTP settings, **When** they click "Test Connection", **Then** a test email is sent and success/failure feedback is displayed
6. **Given** an administrator with incomplete SMTP configuration, **When** they try to enable email notifications, **Then** a warning is displayed about missing SMTP settings

---

### User Story 2 - Configure Email Addresses (Priority: P1)

As an administrator, I want to configure the basic email addresses (sender address and administrator recipient address) so that the system knows where to send notification emails from and to.

**Why this priority**: Without sender and recipient configuration, no emails can be sent. This is the foundational setup required for all email functionality.

**Independent Test**: Can be fully tested by navigating to admin settings, configuring sender and admin email addresses, saving, and verifying the settings persist.

**Acceptance Scenarios**:

1. **Given** an authenticated administrator on the admin settings page, **When** they navigate to email configuration, **Then** they see fields for sender email address and administrator email address
2. **Given** an administrator configuring email settings, **When** they enter a valid sender email address and save, **Then** the sender address is persisted
3. **Given** an administrator configuring email settings, **When** they enter a valid administrator email address and save, **Then** the administrator address is persisted
4. **Given** an administrator entering an invalid email format, **When** they try to save, **Then** a validation error is displayed

---

### User Story 3 - Configure Administrator Notification Template (Priority: P1)

As an administrator, I want to configure the email template sent to myself when an order is placed, so that I receive relevant order details in a format I choose.

**Why this priority**: Administrator notification is critical for order awareness and business operations. Being able to customize the template ensures the admin receives the information they need.

**Independent Test**: Can be fully tested by configuring the admin email template with subject, body, and placeholders, then placing a test order and verifying the email content.

**Acceptance Scenarios**:

1. **Given** an authenticated administrator in email settings, **When** they view the administrator notification configuration, **Then** they see fields for email subject and email body
2. **Given** an administrator configuring the admin notification template, **When** they view the template editor, **Then** they see a list of available placeholders with descriptions
3. **Given** an administrator, **When** they enter a subject line with placeholders (e.g., "Nouvelle commande {{order_id}}"), **Then** the subject is saved with placeholders intact
4. **Given** an administrator, **When** they enter a body with placeholders and formatting, **Then** the body is saved with all content intact
5. **Given** an administrator, **When** they enable the administrator notification toggle, **Then** admin emails will be sent when orders are placed
6. **Given** an administrator, **When** they disable the administrator notification toggle, **Then** no admin emails will be sent when orders are placed

---

### User Story 4 - Configure Purchaser Notification Template (Priority: P1)

As an administrator, I want to configure the email template sent to customers when they place an order, so that customers receive a professional order confirmation.

**Why this priority**: Customer notification is essential for order confirmation and customer experience. Template customization allows the administrator to maintain brand consistency.

**Independent Test**: Can be fully tested by configuring the purchaser email template, placing a test order, and verifying the customer receives the customized email.

**Acceptance Scenarios**:

1. **Given** an authenticated administrator in email settings, **When** they view the purchaser notification configuration, **Then** they see fields for email subject and email body
2. **Given** an administrator configuring the purchaser notification template, **When** they view the template editor, **Then** they see a list of available placeholders with descriptions
3. **Given** an administrator, **When** they enter a subject line with placeholders (e.g., "Confirmation de votre commande {{order_id}}"), **Then** the subject is saved with placeholders intact
4. **Given** an administrator, **When** they enter a body with placeholders and formatting, **Then** the body is saved with all content intact
5. **Given** an administrator, **When** they enable the purchaser notification toggle, **Then** customer emails will be sent when orders are placed
6. **Given** an administrator, **When** they disable the purchaser notification toggle, **Then** no customer emails will be sent when orders are placed

---

### User Story 5 - Send Emails on Order Placement (Priority: P2)

As a system, when a customer validates an order, I want to automatically send configured notification emails so that both the administrator and customer are informed.

**Why this priority**: This is the core email sending functionality. Depends on email configuration being set up first (P1 stories).

**Independent Test**: Can be fully tested by configuring email settings, placing an order, and verifying both admin and customer emails are sent with correct content.

**Acceptance Scenarios**:

1. **Given** email settings are configured with admin notifications enabled, **When** a customer places an order, **Then** an email is sent to the configured administrator address
2. **Given** email settings are configured with purchaser notifications enabled, **When** a customer places an order, **Then** an email is sent to the customer's email address
3. **Given** both notification types are enabled, **When** a customer places an order, **Then** both emails are sent with placeholders replaced by actual order data
4. **Given** admin notification is disabled but purchaser notification is enabled, **When** a customer places an order, **Then** only the purchaser email is sent
5. **Given** purchaser notification is disabled but admin notification is enabled, **When** a customer places an order, **Then** only the admin email is sent
6. **Given** both notifications are disabled, **When** a customer places an order, **Then** no emails are sent
7. **Given** email templates contain placeholders, **When** an email is sent, **Then** all placeholders are replaced with actual order data (e.g., {{customer_name}} becomes "Jean Dupont")

---

### User Story 6 - View Available Placeholders (Priority: P2)

As an administrator, I want to see a list of all available placeholders when configuring email templates so that I know what dynamic data I can include.

**Why this priority**: Essential for usability - administrators need guidance on what placeholders are available to create effective templates.

**Independent Test**: Can be fully tested by navigating to email template configuration and verifying the placeholder list is visible and accurate.

**Acceptance Scenarios**:

1. **Given** an administrator viewing the email template configuration, **When** they look for placeholder help, **Then** they see a clearly visible list of available placeholders
2. **Given** an administrator viewing the placeholder list, **When** they review it, **Then** each placeholder shows its syntax (e.g., {{customer_name}}) and a description of what it represents
3. **Given** an administrator, **When** they use a placeholder from the list in their template, **Then** that placeholder is correctly replaced when emails are sent

---

### Edge Cases

- What happens when the sender email address is not configured but notifications are enabled? System should warn the administrator and prevent sending or use a default behavior.
- What happens when the administrator email address is not configured but admin notifications are enabled? System should warn the administrator and skip admin email sending.
- What happens when a placeholder is misspelled in a template (e.g., {{custmer_name}})? The placeholder should remain as-is in the sent email (not crash or fail silently).
- What happens when email sending fails (SMTP error, network issue)? Order placement should still succeed, and the error should be logged for administrator review.
- What happens when a customer provides an invalid email address? Order placement should succeed, but the customer email will fail (logged for review).
- What happens when templates are empty? System should use sensible default content or warn the administrator.

## Requirements _(mandatory)_

### Functional Requirements

#### SMTP Server Configuration

- **FR-001**: System MUST provide an SMTP configuration screen in admin settings
- **FR-002**: System MUST allow configuration of SMTP host (server address)
- **FR-003**: System MUST allow configuration of SMTP port
- **FR-004**: System MUST allow configuration of SMTP username
- **FR-005**: System MUST allow configuration of SMTP password (stored securely)
- **FR-006**: System MUST allow selection of encryption type (SSL/TLS/none)
- **FR-007**: System MUST provide a "Test Connection" button to verify SMTP settings by sending a test email
- **FR-008**: System MUST persist SMTP configuration settings securely

#### Email Address Configuration

- **FR-009**: System MUST allow configuration of a sender email address
- **FR-010**: System MUST allow configuration of an administrator recipient email address
- **FR-011**: System MUST validate email address formats before saving
- **FR-012**: System MUST persist email address configuration settings

#### Template Configuration

- **FR-013**: System MUST allow configuration of administrator notification email subject
- **FR-014**: System MUST allow configuration of administrator notification email body
- **FR-015**: System MUST allow configuration of purchaser notification email subject
- **FR-016**: System MUST allow configuration of purchaser notification email body
- **FR-017**: System MUST support placeholders in both subject and body fields using {{placeholder_name}} syntax
- **FR-018**: System MUST display available placeholders with descriptions when editing templates

#### Available Placeholders

- **FR-019**: System MUST support at minimum the following placeholders:
  - {{order_id}} - Unique order identifier
  - {{order_date}} - Date and time of order placement
  - {{order_total}} - Total order amount
  - {{customer_firstname}} - Customer's first name (prénom)
  - {{customer_lastname}} - Customer's last name (nom)
  - {{customer_email}} - Customer's email address
  - {{customer_phone}} - Customer's phone number
  - {{products_list}} - Formatted list of ordered products with quantities and prices

#### Notification Toggles

- **FR-020**: System MUST provide a toggle to enable/disable administrator email notifications
- **FR-021**: System MUST provide a toggle to enable/disable purchaser email notifications
- **FR-022**: Each toggle MUST be independently configurable
- **FR-023**: Toggle states MUST be persisted

#### Email Sending

- **FR-024**: System MUST send administrator notification email when an order is placed (if enabled)
- **FR-025**: System MUST send purchaser notification email when an order is placed (if enabled)
- **FR-026**: System MUST replace all placeholders with actual order data before sending
- **FR-027**: System MUST use the configured sender email address as the "From" address
- **FR-028**: System MUST use the configured SMTP settings to send emails
- **FR-029**: Email sending failures MUST NOT prevent order placement from completing
- **FR-030**: Email sending failures MUST be logged for administrator review
- **FR-031**: System MUST display failed email notifications in the admin dashboard (indicator on orders or dedicated section)
- **FR-032**: System MUST handle unrecognized placeholders gracefully (leave as-is or remove, do not crash)

#### UI/UX Standards

- **FR-033**: System MUST ensure proper contrast ratios for text and UI elements in both light and dark modes
- **FR-034**: UI components MUST be tested for readability across all supported themes
- **FR-035**: Theme color specified in admin dashboard MUST be used consistently throughout frontend

#### Code Quality

- **FR-036**: Code MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-037**: Code MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-038**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle)
- **FR-039**: Configuration changes MUST be synchronized with export/import system and increment export file version (Configuration Portability principle)

### Key Entities

- **SmtpSettings**: SMTP server configuration containing: host, port, username, password (encrypted), encryption type (SSL/TLS/none)
- **EmailSettings**: Configuration for email addresses containing: sender email address, administrator recipient email address
- **EmailTemplate**: Template definition containing: type (admin/purchaser), subject template, body template, enabled flag
- **Placeholder**: Definition of available placeholders containing: syntax (e.g., {{order_id}}), description, data source

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can configure complete email settings (sender, recipient, templates, toggles) in under 5 minutes
- **SC-002**: 100% of orders placed with notifications enabled result in emails being sent (or logged on failure)
- **SC-003**: All placeholders are correctly replaced in sent emails with 100% accuracy
- **SC-004**: Placeholder list displays all available placeholders with clear descriptions
- **SC-005**: Email sending failures do not impact order placement success rate
- **SC-006**: Email configuration changes take effect immediately for subsequent orders
- **SC-007**: Toggle changes (enable/disable) are reflected in email behavior without system restart

## Clarifications

### Session 2025-12-22

- Q: What credentials/settings should the SMTP configuration screen include? → A: Standard: Host, port, username, password, encryption type (SSL/TLS/none)
- Q: Should administrators be able to test the SMTP connection before saving? → A: Yes, provide a "Test Connection" button that sends a test email
- Q: Should the email body support rich text/HTML formatting? → A: Plain text only (simpler, reliable across all email clients)
- Q: How should administrators be notified when email sending fails? → A: Viewable in admin dashboard (failed emails section or indicator on orders)

## Assumptions

- Order management system already exists (spec 045-order-management) and provides order data
- Order entity contains all data needed for placeholders (customer info, products, totals, dates)
- SMTP password is stored securely (encrypted at rest)
- Email templates support plain text; HTML formatting may be considered a future enhancement
- Default templates will be provided for initial setup (administrator can modify)
- All admin-facing labels and messages will be displayed in French to match existing admin interface
- Email body supports multi-line text input
