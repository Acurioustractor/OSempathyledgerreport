---
title: Quick Start Guide
slug: quick-start
lastModified: '2025-06-25T10:00:00.000Z'
---

# Quick Start Guide

Get the Empathy Ledger platform running in your organization in under 30 minutes.

:::info[🚀 Ready in 5 Steps]
This guide walks you through everything from setup to your first story collection.
:::

## Prerequisites

### Required Tools
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Airtable account** - [Sign up free](https://airtable.com/signup)
- **Text editor** - We recommend [VS Code](https://code.visualstudio.com/)

### Required Accounts
- GitHub account for code access
- Vercel account for deployment (optional)
- Anthropic API key for AI features (optional)

## Step 1: Initial Setup

### Clone the Repository
```bash
# Clone the repository
git clone https://github.com/orange-sky/empathy-ledger.git

# Navigate to the project
cd empathy-ledger

# Install dependencies
npm install
```

### Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Open .env in your editor and add your keys:
# AIRTABLE_API_KEY=your_key_here
# AIRTABLE_BASE_ID=your_base_id
# ANTHROPIC_API_KEY=your_key_here (optional)
```

## Step 2: Airtable Setup

### Create Your Base
1. **Sign in to Airtable** and create a new base
2. **Name it** "Empathy Ledger Data"
3. **Create these tables:**

#### Stories Table
| Field Name | Field Type | Notes |
|------------|------------|-------|
| Story ID | Autonumber | Primary key |
| Storyteller | Link to Storytellers | Required |
| Story Content | Long text | Main story |
| Consent Level | Single select | Internal/Anonymous/Full |
| Date Collected | Date | Collection date |
| Themes | Multiple select | Story themes |
| Status | Single select | Draft/Approved/Published |

#### Storytellers Table
| Field Name | Field Type | Notes |
|------------|------------|-------|
| ID | Autonumber | Primary key |
| Display Name | Single line text | How they want to be known |
| Contact Method | Single select | Email/Phone/In-person |
| First Shared | Date | When they first shared |
| Total Stories | Count | Linked from Stories |

#### Consent Records Table
| Field Name | Field Type | Notes |
|------------|------------|-------|
| Record ID | Autonumber | Primary key |
| Storyteller | Link to Storytellers | Required |
| Consent Level | Single select | Current consent |
| Date Updated | Date | Last change |
| Verified By | Single line text | Staff member |

### Get Your API Credentials
1. Go to [Airtable Account](https://airtable.com/account)
2. Generate a new API key
3. Copy your Base ID from the URL: `airtable.com/appXXXXXXXXXXXXXX`
4. Add both to your `.env` file

## Step 3: Run the Platform

### Start Development Server
```bash
# Start the development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Verify Setup
1. Navigate to http://localhost:3000
2. Check that the homepage loads
3. Click "Stories" - should show empty state
4. Click "Analysis" - should show dashboard

## Step 4: Configure Consent App

### Set Up Digital Consent
1. **Navigate to** `/admin/consent-settings`
2. **Configure consent levels:**
   - Level 1: Internal Use Only
   - Level 2: Anonymous Sharing
   - Level 3: Full Attribution

### Create Consent Form Template
```javascript
// Example consent configuration
const consentConfig = {
  levels: [
    {
      id: 'internal',
      name: 'Internal Use Only',
      description: 'Your story helps us improve our services',
      color: 'blue'
    },
    {
      id: 'anonymous',
      name: 'Anonymous Sharing',
      description: 'Share your experience without your name',
      color: 'green'
    },
    {
      id: 'full',
      name: 'Full Attribution',
      description: 'Share your story with your chosen name',
      color: 'purple'
    }
  ]
}
```

## Step 5: Collect Your First Story

### Prepare for Collection
1. **Train your team** on ethical storytelling
2. **Test the consent form** on a tablet or phone
3. **Practice with a colleague** first

### During Collection
```markdown
## Story Collection Checklist
- [ ] Introduce yourself and the Empathy Ledger
- [ ] Explain consent options clearly
- [ ] Let them choose their comfort level
- [ ] Record the story (if permitted)
- [ ] Confirm consent choices
- [ ] Thank them for sharing
```

### After Collection
1. **Upload to Airtable** via the admin panel
2. **Tag with themes** for analysis
3. **Set appropriate status** (Draft → Review → Approved)

## Common Setup Issues

### Airtable Connection Failed
```bash
# Check your credentials
echo $AIRTABLE_API_KEY
echo $AIRTABLE_BASE_ID

# Test the connection
npm run test:airtable
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Missing Environment Variables
```bash
# Verify all required variables
npm run check-env
```

## Next Steps

### Essential Reading
- 📖 [Ethical Framework](/docs/ethical-framework) - Understand our principles
- 🔒 [Privacy & Consent](/docs/privacy-consent) - Deep dive into consent management
- 📊 [Airtable System](/docs/airtable-system) - Advanced configuration

### Quick Actions
1. **Invite team members** to your Airtable base
2. **Schedule training** for story collectors
3. **Create your first** consent form template
4. **Test the full workflow** end-to-end

### Get Support
- 💬 [Community Forum](https://community.orangesky.org.au)
- 📧 Email: support@orangesky.org.au
- 📞 Call: 1800 ORANGE (1800 672 643)

## Deployment Options

### Quick Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/orange-sky/empathy-ledger&env=AIRTABLE_API_KEY,AIRTABLE_BASE_ID)

### Manual Deployment
```bash
# Build for production
npm run build

# Test production build
npm start

# Deploy to your platform
# Follow your platform's deployment guide
```

---

:::success[You're Ready!]
You now have a working Empathy Ledger platform. Start collecting stories and building empathy in your community.
:::