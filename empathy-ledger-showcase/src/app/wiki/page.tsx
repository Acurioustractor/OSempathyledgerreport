import WikiLayout from '@/components/wiki/WikiLayout'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Book, FileText, Users, Heart, Shield, Lightbulb } from 'lucide-react'
import { promises as fs } from 'fs'
import path from 'path'

// Fetch featured stories
async function getStoriesData() {
  try {
    const storiesPath = path.join(process.cwd(), 'public/data/stories.json')
    const storiesData = await fs.readFile(storiesPath, 'utf8').then(data => JSON.parse(data))
    
    // Get featured stories (first 3 with featured flag or video)
    const featuredStories = storiesData
      .filter((story: any) => story.featured || story.hasVideo)
      .slice(0, 3)
      
    return featuredStories
  } catch (error) {
    console.error('Error fetching stories:', error)
    return []
  }
}

export default async function WikiLandingPage() {
  const stories = await getStoriesData()

  const wikiAreas = [
    {
      title: 'Platform Overview',
      description: 'Complete guide to the Empathy Ledger platform, including core principles, technical implementation, and ethical frameworks.',
      href: '/wiki/overview',
      icon: Book,
      color: 'orange',
      features: ['Core principles', 'Privacy framework', 'Platform features', 'Technical architecture']
    },
    {
      title: 'Content Guide',
      description: 'Best practices for creating, editing, and managing storyteller content with respect and dignity.',
      href: '/wiki/content-guide',
      icon: FileText,
      color: 'blue',
      features: ['Story management', 'Interview techniques', 'Media guidelines', 'Ethical considerations']
    },
    {
      title: 'Technical Docs',
      description: 'Detailed technical documentation, setup guides, and system architecture information.',
      href: '/docs/introduction',
      icon: Users,
      color: 'green',
      features: ['Setup guides', 'API reference', 'Development workflow', 'Deployment guides']
    }
  ]

  const content = (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-sky rounded-xl flex items-center justify-center">
            <Book className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Empathy Ledger Wiki</h1>
        </div>
        
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          Welcome to the comprehensive knowledge base for the Empathy Ledger platform — a privacy-first 
          storytelling system that enables organizations to collect, analyze, and share human stories 
          with dignity and respect.
        </p>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            How to Use This Wiki
          </h2>
          <p className="text-gray-600 mb-4">
            This wiki is organized into three main areas to help you understand, implement, and maintain 
            the Empathy Ledger platform:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Book className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Platform Overview</h3>
                <p className="text-sm text-gray-600">Start here to understand the core concepts and principles</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Content Guide</h3>
                <p className="text-sm text-gray-600">Learn best practices for managing stories ethically</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Technical Docs</h3>
                <p className="text-sm text-gray-600">Dive into implementation details and code</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wiki Areas */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Explore the Wiki</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {wikiAreas.map((area) => {
            const IconComponent = area.icon
            return (
              <Link
                key={area.href}
                href={area.href}
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-200 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 bg-${area.color}-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-6 h-6 text-${area.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-sky transition-colors">
                      {area.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {area.description}
                </p>

                <div className="space-y-2 mb-4">
                  {area.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center text-orange-sky opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Explore {area.title}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Built on Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Human Dignity</h3>
            <p className="text-sm text-gray-600">
              Every story is shared with respect, preserving the dignity and humanity of each storyteller.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-sm text-gray-600">
              Built with privacy by design, ensuring storyteller consent and data protection at every step.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Community Impact</h3>
            <p className="text-sm text-gray-600">
              Amplifying voices and fostering understanding to create positive social change.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Stories */}
      {stories.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Stories</h2>
              <p className="text-gray-600 mt-1">See the Empathy Ledger in action through these powerful stories</p>
            </div>
            <Link 
              href="/stories" 
              className="text-orange-sky hover:text-orange-600 font-medium flex items-center gap-1"
            >
              View all stories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all"
              >
                {story.fields['Profile Image'] && story.fields['Profile Image'][0] && (
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={story.fields['Profile Image'][0].url}
                      alt={story.fields['First Name'] || 'Storyteller'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-sky transition-colors">
                    {story.fields['First Name']}'s Story
                  </h3>
                  {story.fields['Story Summary'] && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {story.fields['Story Summary']}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-orange-sky opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Read story</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )

  return (
    <WikiLayout currentSlug="" pageTitle="Wiki Home">
      {content}
    </WikiLayout>
  )
}