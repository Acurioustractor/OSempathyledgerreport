import WikiLayout from '@/components/wiki/WikiLayout'
import WikiContentRenderer from '@/components/wiki/WikiContentRenderer'
import { WikiSection } from '@/data/wiki-content'

// Example of how to easily add content to wiki pages
const contentGuideContent: WikiSection[] = [
  {
    id: 'intro',
    type: 'callout',
    content: {
      variant: 'blue',
      title: 'Wiki Content Guide',
      description: 'This page demonstrates all the different content types you can use in the wiki. Simply copy these examples to add your own content!'
    }
  },
  {
    id: 'text-content',
    title: 'Text Content',
    type: 'text',
    content: {
      paragraphs: [
        'This is a simple text section. You can add multiple paragraphs easily.',
        'Each paragraph is automatically styled with proper spacing and typography. This makes it easy to write long-form content without worrying about formatting.'
      ]
    }
  },
  {
    id: 'video-example',
    title: 'Video Content',
    type: 'video',
    content: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Example Video',
      description: 'Videos are embedded responsively and work with YouTube, Vimeo, or any embed URL.'
    }
  },
  {
    id: 'callout-examples',
    title: 'Callout Boxes',
    type: 'text',
    content: {
      paragraphs: ['Callouts help highlight important information:']
    }
  },
  {
    id: 'callout-orange',
    type: 'callout',
    content: {
      variant: 'orange',
      text: 'This is an orange callout - great for warnings or important notes!'
    }
  },
  {
    id: 'callout-green',
    type: 'callout',
    content: {
      variant: 'green',
      text: 'This is a green callout - perfect for success messages or tips!'
    }
  },
  {
    id: 'list-examples',
    title: 'Lists',
    type: 'text',
    content: {
      paragraphs: ['You can create both ordered and unordered lists:']
    }
  },
  {
    id: 'ordered-list',
    title: 'Steps to Add Content',
    type: 'list',
    content: {
      ordered: true,
      items: [
        {
          title: 'Open the wiki content file',
          description: 'Navigate to src/data/wiki-content.ts'
        },
        {
          title: 'Add your section',
          description: 'Use the helper functions or create a new section object'
        },
        {
          title: 'Import and use',
          description: 'Import your content into the page component'
        },
        {
          title: 'Preview your changes',
          description: 'The content will automatically render with proper styling'
        }
      ]
    }
  },
  {
    id: 'grid-example',
    title: 'Grid Layouts',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Book',
          iconColor: 'blue',
          title: 'Documentation',
          description: 'Create beautiful documentation with icons and descriptions'
        },
        {
          icon: 'Heart',
          iconColor: 'green',
          title: 'User Friendly',
          description: 'Easy to understand and implement'
        }
      ]
    }
  },
  {
    id: 'code-example',
    title: 'Code Blocks',
    type: 'codeblock',
    content: {
      code: `// Example of adding a new section
const mySection: WikiSection = {
  id: 'my-section',
  title: 'My New Section',
  type: 'text',
  content: {
    paragraphs: ['This is my content!']
  }
}`
    }
  },
  {
    id: 'table-example',
    title: 'Tables',
    type: 'table',
    content: {
      headers: ['Content Type', 'Best Used For', 'Example'],
      rows: [
        ['Text', 'Regular paragraphs', 'Documentation, explanations'],
        ['Video', 'Tutorials, demos', 'How-to guides'],
        ['Callout', 'Important notes', 'Warnings, tips'],
        ['List', 'Step-by-step guides', 'Instructions, features'],
        ['Grid', 'Feature showcases', 'Benefits, services'],
        ['Table', 'Comparisons', 'Data, specifications']
      ]
    }
  },
  {
    id: 'adding-content',
    title: 'How to Add Your Own Content',
    type: 'text',
    content: {
      paragraphs: [
        'To add content to any wiki page, simply edit the content array in the corresponding file. You can use the helper functions in wiki-content.ts or create section objects directly.',
        'The WikiContentRenderer component will automatically handle the rendering and styling of all content types.'
      ]
    }
  }
]

export default function ContentGuidePage() {
  const content = (
    <>
      {/* Page Introduction */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Wiki Content Guide</h1>
        <p className="text-xl text-gray-600">
          This page demonstrates all the different content types you can use in the wiki. 
          Simply copy these examples to add your own content!
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-gray-50 rounded-xl p-6 mb-12">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="#text-content" className="text-sm text-gray-600 hover:text-orange-sky">Text Content</a>
          <a href="#video-example" className="text-sm text-gray-600 hover:text-orange-sky">Videos</a>
          <a href="#callout-examples" className="text-sm text-gray-600 hover:text-orange-sky">Callouts</a>
          <a href="#list-examples" className="text-sm text-gray-600 hover:text-orange-sky">Lists</a>
          <a href="#grid-example" className="text-sm text-gray-600 hover:text-orange-sky">Grids</a>
          <a href="#code-example" className="text-sm text-gray-600 hover:text-orange-sky">Code Blocks</a>
          <a href="#table-example" className="text-sm text-gray-600 hover:text-orange-sky">Tables</a>
          <a href="#adding-content" className="text-sm text-gray-600 hover:text-orange-sky">How to Add Content</a>
        </div>
      </div>

      {/* Render all content sections */}
      <WikiContentRenderer sections={contentGuideContent} />
    </>
  )

  return (
    <WikiLayout currentSlug="content-guide" pageTitle="Wiki Content Guide">
      {content}
    </WikiLayout>
  )
}