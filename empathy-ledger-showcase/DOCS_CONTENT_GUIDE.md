# 📚 Documentation Content Guide

## 🎯 Quick Start - Adding Content

### Step 1: Create Your Content File

Create a new file in `src/data/docs/your-page-name.ts`:

```typescript
import { WikiSection } from '@/data/wiki-content'

export const yourPageContent: WikiSection[] = [
  // Your content sections here
]
```

### Step 2: Add Your Content

Copy and paste these examples:

## 📝 Content Types

### 1️⃣ Text Content
```typescript
{
  id: 'unique-id',
  title: 'Section Title',
  type: 'text',
  content: {
    paragraphs: [
      'First paragraph.',
      'Second paragraph.'
    ]
  }
}
```

### 2️⃣ Video Content
```typescript
{
  id: 'video-section',
  title: 'Tutorial Video',
  type: 'video',
  content: {
    url: 'https://www.youtube.com/embed/VIDEO_ID',
    title: 'Video Title',
    description: 'What this video shows'
  }
}
```

### 3️⃣ Callout Boxes
```typescript
{
  id: 'important-note',
  type: 'callout',
  content: {
    variant: 'blue', // orange, blue, green, purple
    title: 'Important!',
    text: 'Your message here'
  }
}
```

### 4️⃣ Lists
```typescript
// Numbered list
{
  id: 'steps',
  title: 'How to Do Something',
  type: 'list',
  content: {
    ordered: true,
    items: [
      {
        title: 'Step 1',
        description: 'Do this first'
      },
      {
        title: 'Step 2', 
        description: 'Then do this'
      }
    ]
  }
}

// Bullet list
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

### 5️⃣ Grid Layout
```typescript
{
  id: 'features-grid',
  title: 'Our Features',
  type: 'grid',
  content: {
    columns: 2, // 2, 3, or 4
    items: [
      {
        icon: 'Book', // Any Lucide icon
        iconColor: 'blue',
        title: 'Documentation',
        description: 'Comprehensive guides'
      },
      {
        icon: 'Heart',
        iconColor: 'green', 
        title: 'Support',
        description: '24/7 help available'
      }
    ]
  }
}
```

### 6️⃣ Tables
```typescript
{
  id: 'comparison',
  title: 'Feature Comparison',
  type: 'table',
  content: {
    headers: ['Feature', 'Basic', 'Pro'],
    rows: [
      ['Storage', '10GB', '100GB'],
      ['Support', 'Email', 'Phone'],
      ['Price', '$10', '$25']
    ]
  }
}
```

### 7️⃣ Code Blocks
```typescript
{
  id: 'code-example',
  title: 'Example Code',
  type: 'codeblock',
  content: {
    code: `function hello() {
  console.log('Hello World!')
}`
  }
}
```

### 8️⃣ Images
```typescript
{
  id: 'screenshot',
  title: 'App Screenshot',
  type: 'image',
  content: {
    src: '/images/screenshot.png',
    alt: 'Screenshot of the app',
    caption: 'The main dashboard'
  }
}
```

## 🔗 Step 3: Connect Your Content

1. Open `src/app/docs/[slug]/page.tsx`
2. Import your content at the top:
   ```typescript
   import { yourPageContent } from '@/data/docs/your-page-name'
   ```
3. Add to the content map:
   ```typescript
   const contentMap: Record<string, WikiSection[]> = {
     // ... existing pages
     'your-page-slug': yourPageContent,
   }
   ```

## 📁 Step 4: Add to Navigation

1. Open `src/data/documentation-structure.ts`
2. Add your page to the appropriate section:
   ```typescript
   {
     title: 'Your Page Title',
     slug: 'your-page-slug',
     description: 'Brief description'
   }
   ```

## 🎨 Visual Examples

### Colors Available
- **Orange**: Warnings, important notes
- **Blue**: Information, tips
- **Green**: Success, confirmation
- **Purple**: Special notes, highlights

### Icons Available
Visit [lucide.dev](https://lucide.dev) to see all available icons.

### Video Sources
- YouTube: `https://www.youtube.com/embed/VIDEO_ID`
- Vimeo: `https://player.vimeo.com/video/VIDEO_ID`
- Any other embed URL

## 💡 Pro Tips

1. **Keep IDs unique** - Each section needs a unique ID
2. **Mix content types** - Combine different types for engaging docs
3. **Use meaningful titles** - Help readers navigate easily
4. **Test responsiveness** - Check how content looks on mobile
5. **Add descriptions** - Help readers understand what's coming

## 🚀 Example: Complete Page

```typescript
import { WikiSection } from '@/data/wiki-content'

export const myAwesomePageContent: WikiSection[] = [
  // Welcome message
  {
    id: 'welcome',
    type: 'callout',
    content: {
      variant: 'blue',
      title: 'Welcome to My Page',
      text: 'This page explains everything about...'
    }
  },
  
  // Introduction
  {
    id: 'intro',
    title: 'Introduction',
    type: 'text',
    content: {
      paragraphs: [
        'First paragraph explaining the topic.',
        'Second paragraph with more details.'
      ]
    }
  },
  
  // Video tutorial
  {
    id: 'tutorial',
    title: 'Video Tutorial',
    type: 'video',
    content: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Learn the basics in this 5-minute video'
    }
  },
  
  // Features grid
  {
    id: 'features',
    title: 'Key Features',
    type: 'grid',
    content: {
      columns: 3,
      items: [
        {
          icon: 'Zap',
          iconColor: 'orange',
          title: 'Fast',
          description: 'Lightning quick'
        },
        {
          icon: 'Shield',
          iconColor: 'blue',
          title: 'Secure',
          description: 'Bank-level security'
        },
        {
          icon: 'Heart',
          iconColor: 'green',
          title: 'Loved',
          description: 'By thousands of users'
        }
      ]
    }
  }
]
```

## ❓ Need Help?

1. Check existing pages in `src/data/docs/` for examples
2. View the live content guide at `/docs/content-guide`
3. All content types are demonstrated with working code!