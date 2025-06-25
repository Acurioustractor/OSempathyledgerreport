# Quick Guide: Fetching Empathy Ledger Data

## Step 1: Run in Cursor with Airtable MCP

```javascript
// Fetch all data at once
const empathyData = {
  storytellers: await mcp.airtable.getRecords({
    baseId: "app7G3Ae65pBblJke",
    tableName: "Storytellers",
    filterByFormula: "OR({Project} = 'Orange Sky', {Project} = 'Orange Sky Projects')"
  }),
  stories: await mcp.airtable.getRecords({
    baseId: "app7G3Ae65pBblJke",
    tableName: "Stories"
  }),
  media: await mcp.airtable.getRecords({
    baseId: "app7G3Ae65pBblJke",
    tableName: "Media"
  }),
  themes: await mcp.airtable.getRecords({
    baseId: "app7G3Ae65pBblJke",
    tableName: "Themes"
  })
};
```

## Step 2: Process the Data

```javascript
// Load the processing script
const { processEmpathyLedgerData } = require('./scripts/process-empathy-ledger-data.js');

// Process and save all data
await processEmpathyLedgerData(empathyData);
```

## What This Creates

The script will generate an optimized file structure:

```
public/data/
├── manifest.json         # Metadata and counts
├── stories.json         # All stories (for backward compatibility)
├── storytellers.json    # All Orange Sky storytellers
├── themes.json          # All themes
├── media.json           # Media records
├── analytics.json       # Comprehensive analytics
├── filters.json         # Available filter options
├── stories/
│   ├── index.json      # Lightweight story index
│   ├── by-theme/       # Stories grouped by theme
│   └── full/           # Individual story files
└── storytellers/
    └── profiles/       # Individual storyteller profiles
```

## Key Features

✅ **Only Orange Sky** - Filters for Project = "Orange Sky" or "Orange Sky Projects"
✅ **Linked Data** - Properly connects Stories ↔ Storytellers ↔ Media ↔ Themes
✅ **Fast Loading** - Index files for quick initial load
✅ **Theme Extraction** - Themes pulled from linked Media records
✅ **Rich Media** - Includes images, videos, and audio links
✅ **No Privacy Filtering** - All Orange Sky content is included

## Frontend Benefits

1. **Fast Initial Load** - Use `stories/index.json` for listing
2. **Efficient Filtering** - Pre-built theme indexes
3. **Rich Content** - Access to videos, images, transcripts
4. **Lazy Loading** - Load full story details on demand
5. **Analytics Ready** - Pre-computed metrics

## Next Steps

After running the fetch:
1. Check `public/data/manifest.json` for counts
2. Review `public/data/analytics.json` for insights
3. Test the website with real data
4. Deploy to production