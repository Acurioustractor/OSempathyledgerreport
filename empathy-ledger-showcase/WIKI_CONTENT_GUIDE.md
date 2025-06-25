# Wiki Content Management Guide

## Quick Start

The wiki now has an easy content management system that lets you add various types of content without writing complex HTML or React components.

## Adding Content to Wiki Pages

### 1. Basic Text Content

```typescript
{
  id: 'my-text-section',
  title: 'Section Title',
  type: 'text',
  content: {
    paragraphs: [
      'First paragraph of text.',
      'Second paragraph of text.'
    ]
  }
}
```

### 2. Video Content

```typescript
{
  id: 'video-tutorial',
  title: 'Tutorial Video',
  type: 'video',
  content: {
    url: 'https://www.youtube.com/embed/VIDEO_ID',
    title: 'Video Title',
    description: 'Optional description'
  }
}
```

### 3. Callout Boxes

```typescript
{
  id: 'important-note',
  type: 'callout',
  content: {
    variant: 'orange', // options: orange, blue, green, purple
    title: 'Important!',
    description: 'This is an important message.'
  }
}
```

### 4. Lists (Ordered & Unordered)

```typescript
// Ordered list with titles and descriptions
{
  id: 'steps',
  title: 'Implementation Steps',
  type: 'list',
  content: {
    ordered: true,
    items: [
      {
        title: 'Step 1',
        description: 'Description of step 1'
      },
      {
        title: 'Step 2',
        description: 'Description of step 2'
      }
    ]
  }
}

// Simple unordered list
{
  id: 'features',
  title: 'Key Features',
  type: 'list',
  content: {
    ordered: false,
    items: ['Feature 1', 'Feature 2', 'Feature 3']
  }
}
```

### 5. Grid Layouts

```typescript
{
  id: 'features-grid',
  title: 'Our Features',
  type: 'grid',
  content: {
    columns: 2, // or 3, 4
    items: [
      {
        icon: 'Book', // Lucide icon name
        iconColor: 'blue',
        title: 'Documentation',
        description: 'Comprehensive guides'
      },
      {
        icon: 'Heart',
        iconColor: 'green',
        title: 'Support',
        description: '24/7 assistance'
      }
    ]
  }
}
```

### 6. Tables

```typescript
{
  id: 'comparison-table',
  title: 'Feature Comparison',
  type: 'table',
  content: {
    headers: ['Feature', 'Basic', 'Pro'],
    rows: [
      ['Storage', '10GB', '100GB'],
      ['Support', 'Email', '24/7 Phone'],
      ['Users', '5', 'Unlimited']
    ]
  }
}
```

### 7. Code Blocks

```typescript
{
  id: 'code-example',
  title: 'Example Code',
  type: 'codeblock',
  content: {
    code: `function helloWorld() {
  console.log('Hello, World!');
}`
  }
}
```

### 8. Images

```typescript
{
  id: 'architecture-diagram',
  title: 'System Architecture',
  type: 'image',
  content: {
    src: '/images/architecture.png',
    alt: 'System architecture diagram',
    caption: 'Optional caption text'
  }
}
```

## How to Add Content to a Page

1. **Open the wiki page file** (e.g., `src/app/wiki/overview/page.tsx`)

2. **Import the content structure**:
   ```typescript
   import { WikiSection } from '@/data/wiki-content'
   import WikiContentRenderer from '@/components/wiki/WikiContentRenderer'
   ```

3. **Create your content array**:
   ```typescript
   const myPageContent: WikiSection[] = [
     // Add your sections here
   ]
   ```

4. **Use the renderer in your component**:
   ```tsx
   <WikiContentRenderer sections={myPageContent} />
   ```

## Helper Functions

The `wiki-content.ts` file includes helper functions to make content creation even easier:

```typescript
import { 
  createTextSection, 
  createVideoSection, 
  createCalloutSection,
  createListSection 
} from '@/data/wiki-content'

// Examples:
const textSection = createTextSection('intro', 'Introduction', [
  'First paragraph',
  'Second paragraph'
])

const videoSection = createVideoSection(
  'tutorial',
  'Getting Started',
  'https://youtube.com/embed/VIDEO_ID',
  'Learn the basics in 5 minutes'
)
```

## Tips

1. **IDs must be unique** within a page (used for navigation/anchors)
2. **Videos** work with YouTube, Vimeo, or any service that provides embed URLs
3. **Icons** use Lucide React icon names (see lucide.dev for options)
4. **Grids** automatically responsive - use 2-4 columns
5. **Tables** are scrollable on mobile devices
6. **Images** should be placed in the `public` directory

## Example: Adding a New Wiki Page

1. Create a new file: `src/app/wiki/my-page/page.tsx`
2. Copy the structure from `content-guide/page.tsx`
3. Replace the content array with your own sections
4. The sidebar and styling will be automatically applied!

## Need Help?

- View the live example at `/wiki/content-guide`
- Check existing pages for more examples
- All content types are demonstrated with working code