---
title: Content Guide
slug: content-guide
lastModified: '2025-06-25T09:30:00.000Z'
---

:::info[📝 Easy Content Management]
This guide shows you how to add any type of content to your documentation. Simply copy the code examples below!
:::

## 1. Text Content

The simplest content type. Just add paragraphs of text and they'll be automatically formatted.

Here's how to add text content:

```typescript
{
  id: 'my-text',
  title: 'Section Title',
  type: 'text',
  content: {
    paragraphs: [
      'First paragraph here.',
      'Second paragraph here.'
    ]
  }
}
```

## 2. Video Content

Embed videos from YouTube, Vimeo, or any platform. Videos are responsive and look great on all devices.

```typescript
{
  id: 'my-video',
  title: 'Video Title',
  type: 'video',
  content: {
    url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
    title: 'Video Title',
    description: 'Optional description'
  }
}
```

## 3. Callout Boxes

Use callouts to highlight important information. Available in 4 colors:

:::warning[🔥 Orange callout for warnings or important notes]
:::

:::info[💡 Blue callout for tips and information]
:::

:::success[✅ Green callout for success messages]
:::

:::danger[🎯 Purple callout for special notes]
:::

```typescript
{
  id: 'my-callout',
  type: 'callout',
  content: {
    variant: 'blue', // orange, blue, green, purple
    title: 'Optional Title',
    text: 'Your message here'
  }
}
```

## 4. Lists

Create ordered (numbered) or unordered (bullet) lists:

### Ordered List Example

1. **First Step**
   Description of the first step

2. **Second Step**
   Description of the second step

3. **Third Step**
   Description of the third step

```typescript
{
  id: 'my-list',
  title: 'My List Title',
  type: 'list',
  content: {
    ordered: true, // true for numbers, false for bullets
    items: [
      {
        title: 'Item Title',
        description: 'Item description'
      },
      // Or just strings for simple lists:
      'Simple item 1',
      'Simple item 2'
    ]
  }
}
```

## 5. Grid Layouts

Display features or concepts in a responsive grid:

<div className="grid grid-cols-2 gap-4">

### 📚 Documentation
Comprehensive guides for every feature

### ❤️ Support
Get help when you need it

### 💻 Examples
Copy and paste ready code

### 👥 Community
Learn from others

</div>

```typescript
{
  id: 'my-grid',
  title: 'Features',
  type: 'grid',
  content: {
    columns: 2, // 2, 3, or 4
    items: [
      {
        icon: 'Book', // Any Lucide icon name
        iconColor: 'blue', // blue, green, purple, orange
        title: 'Feature Title',
        description: 'Feature description'
      }
    ]
  }
}
```

## 6. Tables

Display data in clean, responsive tables:

| Content Type | Best For | Example Use |
|--------------|----------|-------------|
| Text | Documentation | Explanations, guides |
| Video | Tutorials | How-to demonstrations |
| Callout | Important notes | Warnings, tips |
| List | Steps or features | Instructions, benefits |
| Grid | Feature showcase | Services, concepts |
| Table | Data comparison | Pricing, specifications |

```typescript
{
  id: 'my-table',
  title: 'Comparison Table',
  type: 'table',
  content: {
    headers: ['Column 1', 'Column 2', 'Column 3'],
    rows: [
      ['Row 1 Cell 1', 'Row 1 Cell 2', 'Row 1 Cell 3'],
      ['Row 2 Cell 1', 'Row 2 Cell 2', 'Row 2 Cell 3']
    ]
  }
}
```

:::success[Adding Content in 3 Steps]
1. Create a content file in src/data/docs/
2. Add your content array using the examples above
3. Import it in src/app/docs/[slug]/page.tsx
:::

## File Structure

```
src/
├── data/
│   └── docs/
│       ├── introduction.ts
│       ├── quick-start.ts
│       └── your-new-page.ts  // Add your content here!
└── app/
    └── docs/
        └── [slug]/
            └── page.tsx      // Import your content here
```

## Pro Tips

- Each section needs a unique ID
- Use meaningful IDs for better navigation
- Videos work with any embed URL (YouTube, Vimeo, etc.)
- Icons come from Lucide (see lucide.dev for options)
- Grids are automatically responsive
- Tables scroll horizontally on mobile
- Mix and match content types for engaging docs!