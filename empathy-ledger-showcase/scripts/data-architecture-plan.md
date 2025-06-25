# Empathy Ledger Data Architecture Plan

## Challenge
- Complex cross-linked Airtable data (Storytellers ↔ Stories ↔ Themes ↔ Shifts)
- Need fast frontend performance
- Must maintain privacy filters
- Handle large dataset efficiently

## Recommended Solution: Build-Time Static Generation with Indexed Data

### 1. Data Fetching Strategy (Build Time)

```javascript
// Fetch ALL related tables once during build
const data = {
  storytellers: await mcp.airtable.getRecords({ baseId, tableName: "Storytellers", filterByFormula: "{Project} = 'Orange Sky'" }),
  stories: await mcp.airtable.getRecords({ baseId, tableName: "Stories" }),
  themes: await mcp.airtable.getRecords({ baseId, tableName: "Themes" }),
  shifts: await mcp.airtable.getRecords({ baseId, tableName: "Shifts" })
};
```

### 2. Data Processing & Normalization

Create normalized, indexed data structures for fast lookups:

```javascript
// 1. Create lookup maps for O(1) access
const storytellerMap = new Map(storytellers.map(s => [s.id, s]));
const storyMap = new Map(stories.map(s => [s.id, s]));
const themeMap = new Map(themes.map(t => [t.id, t]));
const shiftMap = new Map(shifts.map(s => [s.id, s]));

// 2. Resolve all relationships and denormalize for frontend
const processedData = {
  // Denormalized stories with embedded data
  stories: stories.map(story => ({
    ...story,
    storyteller: storytellerMap.get(story.storytellerId),
    themes: story.themeIds.map(id => themeMap.get(id)),
    shift: shiftMap.get(story.shiftId)
  })),
  
  // Index structures for fast filtering
  storiesByLocation: {}, // { "Brisbane": [storyIds...] }
  storiesByTheme: {},    // { "connection": [storyIds...] }
  storiesByRole: {},     // { "friend": [storyIds...] }
  
  // Pre-computed analytics
  analytics: {
    totalStories: 102,
    themeDistribution: {},
    locationDistribution: {},
    // ... other metrics
  }
};
```

### 3. File Structure for Optimal Performance

```
public/data/
├── manifest.json          # Metadata about the data (version, last updated, counts)
├── stories/
│   ├── index.json        # List of all story IDs with basic info
│   ├── by-location/      # Pre-filtered story lists
│   │   ├── brisbane.json
│   │   └── melbourne.json
│   └── full/            # Full story data (lazy loaded)
│       ├── story-1.json
│       └── story-2.json
├── storytellers/
│   ├── index.json       # Privacy-filtered storyteller list
│   └── profiles/        # Individual profiles (if consented)
├── analytics/
│   ├── overview.json    # High-level metrics
│   ├── themes.json      # Theme analysis data
│   └── locations.json   # Geographic data
└── filters.json         # All available filter options
```

### 4. Frontend Data Loading Strategy

```typescript
// 1. Load minimal data on page load
const manifest = await fetch('/data/manifest.json');
const storyIndex = await fetch('/data/stories/index.json');

// 2. Progressive loading based on user interaction
const loadStoryDetails = async (storyId: string) => {
  const cached = cache.get(storyId);
  if (cached) return cached;
  
  const story = await fetch(`/data/stories/full/${storyId}.json`);
  cache.set(storyId, story);
  return story;
};

// 3. Pre-filtered data for common queries
const getBrisbaneStories = async () => {
  return fetch('/data/stories/by-location/brisbane.json');
};
```

### 5. Implementation Steps

1. **Create comprehensive fetch script**
2. **Build data processing pipeline**
3. **Generate optimized JSON files**
4. **Implement frontend caching**
5. **Add incremental updates**

## Benefits

✅ **Fast Initial Load** - Only load index files
✅ **Efficient Filtering** - Pre-computed filter results
✅ **Privacy Built-in** - Data filtered at build time
✅ **Scalable** - Works with large datasets
✅ **Offline Capable** - All data is static
✅ **SEO Friendly** - Data available at build time

## Next Steps

1. Map exact Airtable field relationships
2. Create data processing script
3. Generate optimized file structure
4. Update frontend to use new data format