# Empathy Ledger Data Structure

## Airtable Schema Overview

### Core Tables

#### Storytellers Table (Primary)
The heart of the system with 102 records.

**Key Fields:**
- `Name` - Full name (privacy controlled)
- `Project` - "Orange Sky" tag
- `Location` - City where story collected
- `Role` - Friend/Volunteer/Staff
- `Unique Storyteller ID` - Auto-generated
- `Consent Status` - Internal/Public/Commercial
- `Preferred Anonymity Level` - Full Name/Initials/Anonymous
- `Video draft link` - Descript project link
- `Shifts` - Linked to service locations

**Privacy Levels:**
1. **Public** - Full story sharing allowed
2. **Internal** - Orange Sky use only
3. **Private** - No sharing without explicit permission

#### Stories Table
Processed narratives ready for display.

**Fields:**
- `Story ID` - Unique identifier
- `Storyteller` - Linked record
- `Transcript` - Full text
- `Themes` - Multi-select tags
- `Location` - Where collected
- `Media Type` - Audio/Video/Text
- `Consent Level` - Inherited from storyteller

#### Themes Table
Patterns identified across all stories.

**Common Themes:**
- Human Connection
- Dignity Through Service
- Mental Health & Wellbeing
- Overcoming Adversity
- Community Support
- Breaking Stereotypes
- Finding Purpose
- Gratitude & Giving Back

#### Shifts Table
Orange Sky service locations.

**Key Locations:**
- Brisbane shifts
- Melbourne services
- Adelaide (Vinnies, Puddle Jumpers)
- Hobart (Mission Day Space, Salvos)
- Canberra (Communities at Work)
- Newcastle/Central Coast
- Perth services

## Data Relationships
Storytellers ←→ Stories (1:many)
Stories ←→ Themes (many:many)
Storytellers ←→ Shifts (many:many)
Shifts ←→ Locations (1:1)

## Privacy Implementation
- Field-level permissions
- View-based access control
- Consent status cascading
- Anonymization options
- Audit trail maintenance