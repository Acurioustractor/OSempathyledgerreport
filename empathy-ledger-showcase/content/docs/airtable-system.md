---
title: Airtable System
slug: airtable-system
lastModified: '2025-06-25T09:30:00.000Z'
---

:::info[🗄️ Airtable: The Heart of Story Management]
Airtable serves as the central database for all story data, consent tracking, and workflow automation in the Empathy Ledger system.
:::

## System Overview

The Empathy Ledger uses Airtable as its primary database due to its flexibility, user-friendly interface, and powerful automation capabilities. The system manages everything from story collection to consent tracking, media storage, and analytics.

Our Airtable base is structured to maintain data integrity while providing easy access for different user roles - from photographers in the field to administrators managing content.

## Base Structure

<div className="grid grid-cols-2 gap-4">

### 👥 Storytellers Table
Core profiles with consent preferences, contact info, and story count

### 📄 Stories Table
Individual stories linked to storytellers with full content and metadata

### 📷 Media Table
Photos, videos, and audio files with processing status and links

### 📅 Shifts Table
Scheduled story collection shifts with assignments and locations

### 🛡️ Consent Log
Audit trail of all consent changes with timestamps and reasons

### 📊 Analytics Views
Pre-built views for theme analysis and impact measurement

</div>

## Story Tables

The Stories table is the core of our system, containing:

• **Story Content**: Full text, quotes, and key moments
• **Metadata**: Date, location, collector, themes
• **Consent Level**: Current sharing permissions
• **Processing Status**: Draft, review, approved, published
• **Impact Metrics**: Views, shares, engagement

:::success[🔗 Table Relationships]
Stories link to Storytellers (many-to-one) • Media links to Stories (many-to-one) • Shifts link to multiple Stories • Consent Log tracks all changes
:::

## Automation

- **Consent Updates**
  Automatically log consent changes and notify relevant team members

- **Media Processing**
  Trigger Descript workflows when new video/audio is uploaded

- **Status Workflows**
  Move stories through review stages with automated notifications

- **Theme Detection**
  Use AI to suggest themes based on story content

- **Publishing Pipeline**
  Sync approved stories to website and social platforms

## Custom Scripting

Airtable's scripting block enables advanced functionality:

• **Bulk Operations**: Update multiple records based on complex criteria
• **Data Validation**: Ensure consent forms are complete before publishing
• **Report Generation**: Create custom analytics and summaries
• **API Integration**: Connect with external services like Make.com
• **Privacy Checks**: Automated scanning for identifying information

## Views & Filters

<div className="grid grid-cols-2 gap-4">

### 👁️ Photographer View
Shows only assigned shifts and incomplete stories

### ✏️ Editor View
Stories pending review with editing tools

### 🌐 Publisher View
Approved stories ready for sharing

### 📊 Analytics View
Aggregated data for insights and reporting

</div>

:::warning[🔒 Data Protection]
Role-based permissions • Field-level security • Encrypted attachments • Regular backups • Audit logging • GDPR compliance
:::

## Best Practices

1. Regular backups of the entire base
2. Use views instead of filters for consistent access
3. Document all automations and scripts
4. Test changes in a duplicate base first
5. Maintain clear naming conventions
6. Regular audit of user permissions
7. Archive old records rather than delete

## Integration Points

Airtable connects with other tools in our ecosystem:

• **Make.com**: Automated workflows and data processing
• **Descript**: Video/audio file processing triggers
• **Website**: API calls for story display
• **Softr**: Mobile app data source
• **AI Services**: Theme and sentiment analysis

:::info[🚀 Getting Started]
Request access to the Airtable base from your administrator. New users should complete the Airtable training module before gaining edit access.
:::