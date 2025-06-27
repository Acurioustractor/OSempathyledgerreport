import WikiLayout from '@/components/wiki/WikiLayout'
import { ArrowRight, Book, Heart, Shield, Users, Database, Mic, Code, Cloud, Lock, Eye, Zap, Globe } from 'lucide-react'

export default function WikiOverviewPage() {
  const content = (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">What is the Empathy Ledger?</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          The Empathy Ledger is a privacy-first storytelling platform that enables 
          organizations to collect, analyze, and share human stories with dignity and respect.
        </p>
        <p className="text-lg text-gray-600 mt-4">
          Born from Orange Sky's commitment to positive conversations, it demonstrates 
          how technology can amplify human connection while protecting individual privacy.
        </p>
      </div>

      {/* Core Principles */}
      <div className="mb-16" id="core-principles">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Core Principles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Human-Centered Design</h3>
            </div>
            <p className="text-gray-600">
              Every feature prioritizes the storyteller's dignity, comfort, and control over their narrative.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Privacy by Design</h3>
            </div>
            <p className="text-gray-600">
              Built from the ground up with privacy protection, consent management, and data minimization.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Storyteller Agency</h3>
            </div>
            <p className="text-gray-600">
              Storytellers maintain control over their stories, choosing what to share and how it's used.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Transparency</h3>
            </div>
            <p className="text-gray-600">
              Clear communication about data usage, storage, and the impact of sharing stories.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Consent Framework */}
      <div className="mb-16" id="privacy-consent">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Privacy & Consent Framework</h2>
        
        <div className="bg-blue-50 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Three-Tier Consent Model</h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3">1</span>
                Initial Consent
              </h4>
              <p className="text-gray-600 ml-11">
                Verbal agreement to participate in the interview, with clear explanation of the process.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3">2</span>
                Recording Consent
              </h4>
              <p className="text-gray-600 ml-11">
                Explicit permission for audio/video recording, with options for different levels of identification.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3">3</span>
                Usage Consent
              </h4>
              <p className="text-gray-600 ml-11">
                Granular control over how stories are shared - internally, publicly, or for specific purposes.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Data Protection</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Encrypted storage and transmission</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Regular security audits</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Automatic data expiration options</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Right to deletion at any time</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Ethical Guidelines</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>No exploitation of vulnerability</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Trauma-informed approach</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Cultural sensitivity training</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Regular ethics reviews</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="mb-16" id="platform-features">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Platform Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Story Collection</h3>
            <p className="text-gray-600 text-sm">
              Intuitive interview tools with consent tracking, recording capabilities, and real-time transcription.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Organization</h3>
            <p className="text-gray-600 text-sm">
              AI-powered tagging, theme extraction, and searchable database of anonymized insights.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ethical Sharing</h3>
            <p className="text-gray-600 text-sm">
              Consent-based publishing with automatic privacy protection and impact tracking.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Impact Analytics</h3>
            <p className="text-gray-600 text-sm">
              Measure story reach, engagement, and outcomes while maintaining storyteller privacy.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Control</h3>
            <p className="text-gray-600 text-sm">
              Role-based permissions ensuring only authorized staff access sensitive information.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Cloud className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cloud Native</h3>
            <p className="text-gray-600 text-sm">
              Scalable architecture supporting organizations from small nonprofits to large enterprises.
            </p>
          </div>
        </div>
      </div>

      {/* Airtable Setup */}
      <div className="mb-16" id="airtable-setup">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Airtable Setup</h2>
        
        <div className="bg-orange-50 rounded-xl p-8">
          <p className="text-gray-700 mb-6">
            The Empathy Ledger uses Airtable as its backend, providing a flexible, no-code database solution 
            that organizations can customize to their needs.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">Base Structure</h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Stories Base</h4>
              <p className="text-gray-600 text-sm">
                Main table for story content with fields for quotes, themes, and metadata
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Storytellers Base</h4>
              <p className="text-gray-600 text-sm">
                Profile information, consent records, and story relationships
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Media Base</h4>
              <p className="text-gray-600 text-sm">
                Audio recordings, transcripts, photos, and video content
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Analytics Base</h4>
              <p className="text-gray-600 text-sm">
                Impact metrics, engagement data, and outcome tracking
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-100 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Pro Tip:</strong> Use Airtable's automation features to trigger consent reminders, 
              archive old stories, and generate impact reports automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Interview Process */}
      <div className="mb-16" id="interview-process">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Interview Process</h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Pre-Interview Preparation</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Review consent forms and privacy policies</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Prepare open-ended questions focused on experiences</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Test recording equipment and backup systems</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Create a comfortable, private environment</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">2. During the Interview</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Begin with casual conversation to build rapport</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Explain the process and obtain verbal consent</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Use active listening and follow the storyteller's lead</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Respect boundaries and pause if needed</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Post-Interview</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Thank the storyteller and explain next steps</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Complete consent documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Process and tag content while memories are fresh</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                <span>Follow up with any promised resources or support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Stack */}
      <div className="mb-16" id="technical-stack">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Technical Stack</h2>
        
        <div className="bg-gray-50 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frontend</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-gray-400" />
                  <span>Next.js 14 with App Router</span>
                </li>
                <li className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-gray-400" />
                  <span>TypeScript for type safety</span>
                </li>
                <li className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-gray-400" />
                  <span>Tailwind CSS for styling</span>
                </li>
                <li className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-gray-400" />
                  <span>React 18 with Server Components</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Backend & Infrastructure</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-400" />
                  <span>Airtable for data storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-400" />
                  <span>Vercel for hosting and edge functions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-400" />
                  <span>Cloudinary for media optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-400" />
                  <span>OpenAI for content analysis</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Key Technical Features</h4>
            <p className="text-gray-600 text-sm">
              Server-side rendering for SEO, progressive enhancement for accessibility, 
              responsive design for mobile access, and automatic image optimization for performance.
            </p>
          </div>
        </div>
      </div>

      {/* Future Vision */}
      <div className="mb-16" id="future-vision">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Future Vision</h2>
        
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8">
          <p className="text-lg text-gray-700 mb-6">
            The Empathy Ledger is designed to evolve with advancing technology while maintaining 
            its ethical foundation. Here's what's on the horizon:
          </p>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">AI-Powered Insights</h4>
              <p className="text-gray-600 text-sm">
                Advanced theme detection and pattern recognition while preserving individual privacy
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Multi-Language Support</h4>
              <p className="text-gray-600 text-sm">
                Real-time translation and culturally-aware content adaptation
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Blockchain Consent</h4>
              <p className="text-gray-600 text-sm">
                Immutable consent records giving storytellers permanent control
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Impact Marketplace</h4>
              <p className="text-gray-600 text-sm">
                Connect stories with resources, support, and opportunities for change
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-orange-sky text-white rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join the movement to share stories with dignity and create meaningful change.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/docs/quick-start"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-sky rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Quick Start Guide
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
          <a
            href="/wiki/content-guide"
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Content Guide
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </>
  )

  return (
    <WikiLayout currentSlug="overview" pageTitle="What is the Empathy Ledger?">
      {content}
    </WikiLayout>
  )
}