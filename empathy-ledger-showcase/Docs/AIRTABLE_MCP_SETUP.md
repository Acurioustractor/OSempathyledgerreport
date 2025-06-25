# Airtable MCP Integration Guide

## Overview

This guide explains how to connect the Empathy Ledger Showcase to your Airtable base using Model Context Protocol (MCP) to fetch storyteller data with privacy filtering.

## Prerequisites

1. **Airtable API Key**: Get your API key from [Airtable Account Settings](https://airtable.com/account)
2. **Airtable Base ID**: Found in your Airtable base URL (e.g., `https://airtable.com/appXXXXXXXXXXXXXX`)
3. **Claude Code with MCP support**: Latest version of Claude Code

## Setup Steps

### 1. Configure Environment Variables

Add your Airtable API key to the `.env` file:

```bash
AIRTABLE_API_KEY="your_actual_airtable_api_key_here"
```

### 2. Update MCP Configuration

The `.mcp.json` file is already configured with the Airtable MCP server. Ensure it contains:

```json
{
  "mcpServers": {
    "airtable": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-airtable"],
      "env": {
        "AIRTABLE_API_KEY": "your_airtable_api_key_here"
      }
    }
  }
}
```

### 3. Airtable Base Structure

Your Airtable base should have the following structure:

#### Storytellers Table
- **Name** (Single line text)
- **Project** (Single select) - Must include "Orange Sky Projects" option
- **Location** (Single line text) - City name
- **Role** (Single select) - Options: Friend, Volunteer, Staff
- **Unique Storyteller ID** (Formula/Autonumber)
- **Consent Status** (Single select) - Options: Internal, Public, Commercial
- **Preferred Anonymity Level** (Single select) - Options: Full Name, Initials, Anonymous
- **Shifts** (Link to Shifts table)

#### Stories Table
- **Story ID** (Formula/Autonumber)
- **Storyteller** (Link to Storytellers)
- **Transcript** (Long text)
- **Themes** (Multiple select)
- **Location** (Single line text)
- **Media Type** (Single select) - Audio/Video/Text
- **Consent Level** (Lookup from Storyteller)

### 4. Running Data Fetch with MCP

When you have Claude Code with MCP enabled:

1. Start Claude Code in the project directory
2. The MCP connection will be automatically established
3. Run the fetch script: `npm run fetch-data`

The script will:
- Connect to your Airtable base via MCP
- Filter for records with "Orange Sky Projects" tag
- Apply privacy filters based on consent levels
- Generate static JSON files in `public/data/`

### 5. Privacy Filtering Rules

The system applies these privacy rules automatically:

1. **Public Consent**: Full story and profile displayed
2. **Internal Consent**: Story displayed anonymously, no profile
3. **No Consent**: Excluded from public display

### 6. Manual MCP Commands (for testing)

When using Claude Code with MCP, you can test the connection:

```javascript
// List available tables
mcp.airtable.list_bases()

// Get records from Storytellers table
mcp.airtable.get_records({
  baseId: "your_base_id",
  tableName: "Storytellers",
  filter: "{Project} = 'Orange Sky Projects'"
})
```

## Troubleshooting

### MCP Connection Issues
- Ensure API key is correctly set in environment
- Check that Claude Code has MCP support enabled
- Verify Airtable base permissions

### Data Not Appearing
- Confirm records have "Orange Sky Projects" tag
- Check consent status fields are properly set
- Verify table and field names match exactly

### Privacy Concerns
- Review filtered data in `public/data/` before deployment
- Ensure no personally identifiable information is exposed
- Test with various consent levels

## Development Mode

For development without Airtable access, the fetch script generates mock data that matches the expected structure. This allows frontend development to proceed while awaiting real data integration.

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Review generated JSON files before deployment
- Implement server-side filtering as an additional layer

## Next Steps

After successful data fetch:
1. Review generated files in `public/data/`
2. Run `npm run dev` to see data in the application
3. Test privacy filters are working correctly
4. Deploy to production with `npm run build`