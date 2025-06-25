import Link from 'next/link'
import { ArrowLeft, ArrowRight, Book, Heart, Shield, Users } from 'lucide-react'
import TableOfContents from '@/components/wiki/TableOfContents'

export default function WikiOverviewPage() {
  return (
    <div className="wiki-container">
      {/* Header */}
      <section className="wiki-header">
        <div className="wiki-header-content">
          <Link
            href="/wiki"
            className="wiki-back-link"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Documentation
          </Link>
          <h1 className="wiki-title">
            What is the Empathy Ledger?
          </h1>
        </div>
      </section>

      {/* Content with sidebar */}
      <section className="wiki-content">
        <div className="wiki-content-wrapper">
          <div className="wiki-layout">
            {/* Fixed Sidebar */}
            <aside className="wiki-sidebar">
              <div className="wiki-sidebar-sticky">
                <TableOfContents />
              </div>
            </aside>
            
            {/* Main content */}
            <article className="wiki-article">
            <div className="wiki-callout wiki-callout-orange">
              <p className="wiki-callout-title">
                The Empathy Ledger is a privacy-first storytelling platform that enables 
                organizations to collect, analyze, and share human stories with dignity and respect.
              </p>
              <p className="wiki-callout-description">
                Born from Orange Sky's commitment to positive conversations, it demonstrates 
                how technology can amplify human connection while protecting individual privacy.
              </p>
            </div>

            <h2 className="wiki-section-title">Core Principles</h2>
            
            <div className="wiki-grid wiki-grid-2">
              <div className="wiki-card">
                <div className="wiki-card-header">
                  <div className="wiki-card-icon wiki-card-icon-blue">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="wiki-card-title">Privacy First</h3>
                </div>
                <p className="wiki-card-description">
                  Every story is collected with explicit consent, stored securely, 
                  and shared only according to the storyteller's wishes.
                </p>
              </div>

              <div className="wiki-card">
                <div className="wiki-card-header">
                  <div className="wiki-card-icon wiki-card-icon-green">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="wiki-card-title">Dignity & Respect</h3>
                </div>
                <p className="wiki-card-description">
                  Stories are treated as precious gifts, with storytellers maintaining 
                  control over how their experiences are shared.
                </p>
              </div>

              <div className="wiki-card">
                <div className="wiki-card-header">
                  <div className="wiki-card-icon wiki-card-icon-purple">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="wiki-card-title">Community Driven</h3>
                </div>
                <p className="wiki-card-description">
                  Built by and for communities, ensuring the platform serves the 
                  needs of both storytellers and organizations.
                </p>
              </div>

              <div className="wiki-card">
                <div className="wiki-card-header">
                  <div className="wiki-card-icon wiki-card-icon-orange">
                    <Book className="w-5 h-5" />
                  </div>
                  <h3 className="wiki-card-title">Open & Replicable</h3>
                </div>
                <p className="wiki-card-description">
                  All code, methodologies, and learnings are shared openly to 
                  enable ethical storytelling everywhere.
                </p>
              </div>
            </div>

            <h2 className="wiki-section-title">How It Works</h2>
            
            <ol className="wiki-list-ordered">
              <li className="wiki-list-item">
                <span className="wiki-list-number">
                  1
                </span>
                <div className="wiki-list-content">
                  <h4 className="wiki-list-title">Story Collection</h4>
                  <p className="wiki-list-description">
                    Trained volunteers or staff members collect stories using ethical 
                    interview techniques, always with explicit consent.
                  </p>
                </div>
              </li>
              <li className="wiki-list-item">
                <span className="wiki-list-number">
                  2
                </span>
                <div className="wiki-list-content">
                  <h4 className="wiki-list-title">Privacy Processing</h4>
                  <p className="wiki-list-description">
                    Stories are processed according to the consent level provided, 
                    with options for full, partial, or anonymous sharing.
                  </p>
                </div>
              </li>
              <li className="wiki-list-item">
                <span className="wiki-list-number">
                  3
                </span>
                <div className="wiki-list-content">
                  <h4 className="wiki-list-title">Insight Generation</h4>
                  <p className="wiki-list-description">
                    Anonymous, aggregated data reveals patterns and insights while 
                    individual stories maintain their human context.
                  </p>
                </div>
              </li>
              <li className="wiki-list-item">
                <span className="wiki-list-number">
                  4
                </span>
                <div className="wiki-list-content">
                  <h4 className="wiki-list-title">Dignified Sharing</h4>
                  <p className="wiki-list-description">
                    Stories are shared in ways that honor the storyteller, build 
                    empathy, and drive positive change in communities.
                  </p>
                </div>
              </li>
            </ol>

            <h2 className="wiki-section-title">Why It Matters</h2>
            
            <div className="wiki-callout bg-gray-50 border-gray-200">
              <p className="text-gray-700 mb-4">
                In a world where data is often extracted without consent and stories 
                are commodified, the Empathy Ledger offers a different path. It proves 
                that we can leverage technology to understand and serve our communities 
                better while treating every person with the dignity they deserve.
              </p>
              <p className="text-gray-700">
                By making these tools and methodologies freely available, we hope to 
                inspire a new standard for how organizations collect and share human 
                stories—one that puts people first, always.
              </p>
            </div>

            <h2 className="wiki-section-title">Get Started</h2>
            
            <div className="wiki-grid wiki-grid-3">
              <Link
                href="/wiki/ethics"
                className="wiki-link-card"
              >
                <h4 className="wiki-link-card-title">Ethical Framework</h4>
                <p className="wiki-link-card-description">
                  Learn about our approach to ethical storytelling
                </p>
                <span className="wiki-link-card-action">
                  Read more <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                href="/wiki/setup"
                className="wiki-link-card"
              >
                <h4 className="wiki-link-card-title">Technical Setup</h4>
                <p className="wiki-link-card-description">
                  Set up your own Empathy Ledger platform
                </p>
                <span className="wiki-link-card-action">
                  Get started <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                href="/wiki/case-studies"
                className="wiki-link-card"
              >
                <h4 className="wiki-link-card-title">Success Stories</h4>
                <p className="wiki-link-card-description">
                  See how others have implemented ethical storytelling
                </p>
                <span className="wiki-link-card-action">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {/* Ethical Principles Section */}
            <h2 id="ethical-principles" className="wiki-section-title mt-12">Ethical Storytelling Principles</h2>
            <div className="wiki-card">
              <p className="text-gray-700 mb-4">
                Our ethical framework is built on respect, consent, and dignity. Every interaction is guided by these principles:
              </p>
              <ul className="wiki-ul">
                <li className="wiki-ul-item">
                  <span className="wiki-ul-bullet">•</span>
                  <div>
                    <strong>Informed Consent:</strong> Storytellers understand exactly how their stories will be used and have complete control over sharing permissions.
                  </div>
                </li>
                <li className="wiki-ul-item">
                  <span className="wiki-ul-bullet">•</span>
                  <div>
                    <strong>Ongoing Agency:</strong> Consent can be modified or withdrawn at any time, with immediate effect across all systems.
                  </div>
                </li>
                <li className="wiki-ul-item">
                  <span className="wiki-ul-bullet">•</span>
                  <div>
                    <strong>Transparency:</strong> Clear communication about data handling, storage, and usage at every step.
                  </div>
                </li>
                <li className="wiki-ul-item">
                  <span className="wiki-ul-bullet">•</span>
                  <div>
                    <strong>Benefit Sharing:</strong> Stories create value for the community, not just the organization collecting them.
                  </div>
                </li>
              </ul>
            </div>

            {/* Privacy & Consent Framework */}
            <h2 id="privacy-consent" className="wiki-section-title mt-12">Privacy & Consent Framework</h2>
            <div className="wiki-callout bg-gray-50 border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Three-Tier Consent Model</h3>
              <div className="space-y-4">
                <div className="wiki-card">
                  <h4 className="font-semibold text-green-700 mb-2">Level 1: Internal Use Only</h4>
                  <p className="wiki-card-description">Stories used for internal reflection, training, and service improvement. No external sharing.</p>
                </div>
                <div className="wiki-card">
                  <h4 className="font-semibold text-blue-700 mb-2">Level 2: Anonymous Sharing</h4>
                  <p className="wiki-card-description">Stories can be shared externally with all identifying information removed. Focus on themes and insights.</p>
                </div>
                <div className="wiki-card">
                  <h4 className="font-semibold text-purple-700 mb-2">Level 3: Full Attribution</h4>
                  <p className="wiki-card-description">Stories shared with full attribution as chosen by the storyteller. Celebrates individual experiences.</p>
                </div>
              </div>
            </div>

            {/* Airtable Setup */}
            <h2 id="airtable-setup" className="wiki-section-title mt-12">Airtable Setup & Management</h2>
            <div className="wiki-card">
              <p className="text-gray-700 mb-4">
                Airtable serves as the central repository for all stories and consent records. Our setup includes:
              </p>
              <ol className="space-y-3 list-decimal list-inside">
                <li><strong>Stories Base:</strong> Main table for story content with fields for quotes, themes, and metadata</li>
                <li><strong>Consent Tracking:</strong> Linked table tracking consent levels and modification history</li>
                <li><strong>Friend & Volunteer Records:</strong> Separate tables for different participant types</li>
                <li><strong>Automated Workflows:</strong> Zapier/Make.com integrations for consent updates and notifications</li>
              </ol>
              <div className="mt-4 wiki-callout wiki-callout-blue">
                <p className="text-sm">
                  <strong>Pro Tip:</strong> Use Airtable's API to sync consent changes in real-time with your public-facing systems.
                </p>
              </div>
            </div>

            {/* Descript Workflow */}
            <h2 id="descript-workflow" className="wiki-section-title mt-12">Descript Workflow</h2>
            <div className="wiki-card">
              <h3 className="font-semibold text-lg mb-3">Audio Story Processing</h3>
              <ol className="space-y-3 list-decimal list-inside">
                <li><strong>Recording:</strong> Use quality audio equipment, preferably in quiet environments</li>
                <li><strong>Upload:</strong> Import audio files to Descript with clear naming conventions</li>
                <li><strong>Transcription:</strong> Let Descript auto-transcribe, then review for accuracy</li>
                <li><strong>Editing:</strong> Remove filler words, protect privacy by editing out identifying details</li>
                <li><strong>Export:</strong> Generate clean audio and accurate transcripts for the platform</li>
              </ol>
              <div className="mt-4 wiki-callout wiki-callout-orange">
                <p className="text-sm">
                  <strong>Remember:</strong> Always review transcripts for unintended personal information before publishing.
                </p>
              </div>
            </div>

            {/* Consent App */}
            <h2 id="consent-app" className="text-2xl font-bold text-gray-900 mt-12 mb-4">Consent App & Process</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <p className="text-gray-700 mb-4">
                Our digital consent app makes it easy to collect and manage permissions:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Mobile-friendly interface</li>
                    <li>• Clear consent level explanations</li>
                    <li>• Digital signature capture</li>
                    <li>• Instant sync with Airtable</li>
                    <li>• Offline mode for field work</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Best Practices</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Walk through options together</li>
                    <li>• Provide printed summaries</li>
                    <li>• Allow time for questions</li>
                    <li>• Follow up within 24 hours</li>
                    <li>• Regular consent reviews</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Interview Techniques */}
            <h2 id="interview-techniques" className="text-2xl font-bold text-gray-900 mt-12 mb-4">Interview Techniques</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="font-semibold text-lg mb-3">Creating Safe Spaces for Storytelling</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Before the Interview</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Choose a comfortable, private location</li>
                    <li>• Test all recording equipment</li>
                    <li>• Review consent process</li>
                    <li>• Prepare open-ended questions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">During the Interview</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Start with easy, warming questions</li>
                    <li>• Listen more than you speak</li>
                    <li>• Show genuine interest and empathy</li>
                    <li>• Allow for pauses and silence</li>
                    <li>• Follow the storyteller's lead</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">After the Interview</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Thank the storyteller sincerely</li>
                    <li>• Confirm consent understanding</li>
                    <li>• Provide contact information</li>
                    <li>• Follow up with any promises made</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Building Trust */}
            <h2 id="building-trust" className="text-2xl font-bold text-gray-900 mt-12 mb-4">Building Trust & Rapport</h2>
            <div className="bg-purple-50 rounded-lg p-6 mb-8">
              <p className="text-purple-900 font-medium mb-4">
                Trust is the foundation of ethical storytelling. It cannot be rushed or manufactured.
              </p>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Be Present</h4>
                  <p className="text-gray-600">Put away distractions. Make eye contact. Show through body language that this conversation matters.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Be Consistent</h4>
                  <p className="text-gray-600">Show up when you say you will. Follow through on commitments. Build reliability over time.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Be Humble</h4>
                  <p className="text-gray-600">Recognize the gift of someone's story. Approach with curiosity, not judgment. Learn from every interaction.</p>
                </div>
              </div>
            </div>

            {/* Technical Stack */}
            <h2 id="technical-stack" className="text-2xl font-bold text-gray-900 mt-12 mb-4">Technical Stack</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="font-semibold text-lg mb-3">Core Technologies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Frontend</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Next.js 14 (App Router)</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Framer Motion</li>
                    <li>• React Query</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Backend & Services</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Airtable (Database)</li>
                    <li>• Vercel (Hosting)</li>
                    <li>• Anthropic Claude (AI)</li>
                    <li>• Descript (Audio)</li>
                    <li>• GitHub (Version Control)</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> This stack is optimized for rapid development and easy maintenance by small teams.
                </p>
              </div>
            </div>

            {/* Shift Reflections System */}
            <h2 id="shift-reflections" className="text-2xl font-bold text-gray-900 mt-12 mb-4">Shift Reflections System</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <p className="text-gray-700 mb-4">
                Capture valuable insights from every shift through structured reflection:
              </p>
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-2">Quick Reflection Template</h4>
                <ol className="text-sm text-gray-700 space-y-2">
                  <li><strong>1. Highlight:</strong> What was the best moment of your shift?</li>
                  <li><strong>2. Challenge:</strong> What was difficult today?</li>
                  <li><strong>3. Learning:</strong> What did you discover about yourself or others?</li>
                  <li><strong>4. Connection:</strong> Describe a meaningful interaction you had.</li>
                  <li><strong>5. Gratitude:</strong> What are you thankful for from today?</li>
                </ol>
              </div>
              <p className="text-sm text-gray-600">
                These reflections help volunteers process their experiences and provide valuable insights for service improvement.
              </p>
            </div>

            {/* Consent Templates */}
            <h2 id="consent-templates" className="text-2xl font-bold text-gray-900 mt-12 mb-4">Consent Forms & Templates</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <p className="text-gray-700 mb-4">
                Ready-to-use consent form templates for different scenarios:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">📝 Basic Story Consent</h4>
                  <p className="text-sm text-gray-600 mb-2">For one-time story collection during service delivery</p>
                  <a href="/templates/basic-consent.pdf" className="text-orange-sky text-sm hover:underline">Download Template</a>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🎥 Media Consent</h4>
                  <p className="text-sm text-gray-600 mb-2">For photo, video, or audio recording permissions</p>
                  <a href="/templates/media-consent.pdf" className="text-orange-sky text-sm hover:underline">Download Template</a>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">👥 Group Consent</h4>
                  <p className="text-sm text-gray-600 mb-2">For collecting stories in group settings</p>
                  <a href="/templates/group-consent.pdf" className="text-orange-sky text-sm hover:underline">Download Template</a>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🔄 Ongoing Consent</h4>
                  <p className="text-sm text-gray-600 mb-2">For long-term story collection relationships</p>
                  <a href="/templates/ongoing-consent.pdf" className="text-orange-sky text-sm hover:underline">Download Template</a>
                </div>
              </div>
            </div>

            {/* Interview Templates */}
            <h2 id="interview-templates" className="text-2xl font-bold text-gray-900 mt-12 mb-4">Interview Templates</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="font-semibold text-lg mb-3">Conversation Starters by Context</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">First-Time Service Users</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• "What brought you to Orange Sky today?"</li>
                    <li>• "How has your day been so far?"</li>
                    <li>• "Is there anything you'd like to share about your experience?"</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Regular Friends</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• "What's new since we last saw you?"</li>
                    <li>• "How have things been going with [previous topic]?"</li>
                    <li>• "What's been on your mind lately?"</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Volunteers</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• "What inspired you to volunteer with Orange Sky?"</li>
                    <li>• "What's been the most meaningful moment for you?"</li>
                    <li>• "How has volunteering changed your perspective?"</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <h2 id="quick-reference" className="wiki-section-title mt-12">Quick Reference Guides</h2>
            <div className="wiki-reference-grid">
              <div className="wiki-reference-card">
                <h3 className="wiki-reference-title">Consent Levels at a Glance</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Level</th>
                      <th className="text-left py-2">Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Internal</td>
                      <td className="py-2">Team only</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Anonymous</td>
                      <td className="py-2">Public, no names</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Full</td>
                      <td className="py-2">Public with attribution</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="wiki-reference-card">
                <h3 className="wiki-reference-title">Emergency Contacts</h3>
                <ul className="text-sm space-y-2">
                  <li><strong>Privacy Officer:</strong> privacy@orangesky.org.au</li>
                  <li><strong>Tech Support:</strong> tech@orangesky.org.au</li>
                  <li><strong>Shift Coordinator:</strong> 1800 ORANGE</li>
                  <li><strong>Ethics Hotline:</strong> ethics@orangesky.org.au</li>
                </ul>
              </div>
            </div>

            {/* Shift Management */}
            <h2 id="shift-management" className="text-2xl font-bold text-gray-900 mt-12 mb-4">Shift Management</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="font-semibold text-lg mb-3">Story Collection During Shifts</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Pre-Shift Preparation</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ Charge recording devices</li>
                    <li>✓ Print consent forms</li>
                    <li>✓ Review recent stories for context</li>
                    <li>✓ Brief team on story collection goals</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">During Shift</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ Identify natural conversation moments</li>
                    <li>✓ Ask permission before recording</li>
                    <li>✓ Focus on service first, stories second</li>
                    <li>✓ Document consent immediately</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Post-Shift</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ Upload recordings securely</li>
                    <li>✓ Complete shift reflection</li>
                    <li>✓ Tag stories with themes</li>
                    <li>✓ Schedule follow-ups if needed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Volunteer Support */}
            <h2 id="volunteer-support" className="text-2xl font-bold text-gray-900 mt-12 mb-4">Volunteer Support</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <p className="text-gray-700 mb-4">
                Supporting volunteers in ethical story collection:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Training Resources</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 2-hour online training module</li>
                    <li>• Practice interview sessions</li>
                    <li>• Monthly skill workshops</li>
                    <li>• Peer mentoring program</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ongoing Support</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Debrief after difficult conversations</li>
                    <li>• Access to counseling services</li>
                    <li>• Regular team check-ins</li>
                    <li>• Recognition and appreciation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Impact Measurement */}
            <h2 id="impact-measurement" className="text-2xl font-bold text-gray-900 mt-12 mb-4">Impact Measurement</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="font-semibold text-lg mb-3">Measuring the Value of Stories</h3>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Quantitative Metrics</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Number of stories collected</li>
                    <li>• Consent levels distribution</li>
                    <li>• Story engagement rates</li>
                    <li>• Theme frequency analysis</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Qualitative Indicators</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Depth of connections formed</li>
                    <li>• Volunteer satisfaction scores</li>
                    <li>• Storyteller feedback</li>
                    <li>• Community response</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Impact Stories</h4>
                  <p className="text-sm text-purple-800">
                    Track how individual stories lead to policy changes, increased donations, 
                    volunteer recruitment, and community awareness.
                  </p>
                </div>
              </div>
            </div>

            {/* API Integrations */}
            <h2 id="api-integrations" className="text-2xl font-bold text-gray-900 mt-12 mb-4">API Integrations</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="font-semibold text-lg mb-3">Current & Planned Integrations</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">✅ Active Integrations</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Airtable API:</strong> Real-time data sync for stories and consent</li>
                    <li><strong>Anthropic Claude:</strong> AI-powered theme extraction and analysis</li>
                    <li><strong>Vercel:</strong> Deployment and edge functions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🔄 In Development</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Descript API:</strong> Automated transcription pipeline</li>
                    <li><strong>Zapier:</strong> Workflow automation for consent updates</li>
                    <li><strong>Twilio:</strong> SMS notifications for consent changes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📅 Planned</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Salesforce:</strong> CRM integration for donor stories</li>
                    <li><strong>Mailchimp:</strong> Newsletter story distribution</li>
                    <li><strong>Google Analytics:</strong> Story engagement tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Future Roadmap */}
            <h2 id="future-roadmap" className="text-2xl font-bold text-gray-900 mt-12 mb-4">Future Roadmap</h2>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-lg mb-3">Planned Enhancements</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Phase 1: Enhanced Analytics</h4>
                  <p className="text-gray-600">AI-powered theme extraction, sentiment analysis, and impact measurement dashboards.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Phase 2: Multi-Organization Support</h4>
                  <p className="text-gray-600">Enable multiple organizations to run independent instances while sharing learnings.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Phase 3: Story Networks</h4>
                  <p className="text-gray-600">Connect related stories across communities to reveal broader patterns and insights.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Phase 4: API Ecosystem</h4>
                  <p className="text-gray-600">Open APIs for researchers and developers to build on the platform's ethical foundation.</p>
                </div>
              </div>
            </div>

            {/* Footer Resources */}
            <div className="wiki-footer">
              <h3 className="wiki-footer-title">Additional Resources</h3>
              <div className="wiki-footer-grid">
                <div className="wiki-footer-card">
                  <h4 className="font-semibold mb-2">📖 Full Documentation</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Comprehensive guides and API references
                  </p>
                  <a 
                    href="https://github.com/orange-sky/empathy-ledger/wiki" 
                    className="wiki-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub →
                  </a>
                </div>
                <div className="wiki-footer-card">
                  <h4 className="font-semibold mb-2">💬 Community Support</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Get help and share experiences
                  </p>
                  <Link href="/wiki/community" className="wiki-link">
                    Join the Community →
                  </Link>
                </div>
                <div className="wiki-footer-card">
                  <h4 className="font-semibold mb-2">🚀 Quick Deploy</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Deploy your own instance in minutes
                  </p>
                  <a 
                    href="https://vercel.com/new/clone?repository-url=https://github.com/orange-sky/empathy-ledger"
                    className="wiki-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Deploy to Vercel →
                  </a>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="wiki-help">
              <h3 className="wiki-help-title">Need Help?</h3>
              <p className="wiki-help-description">
                Our team is here to support your ethical storytelling journey.
              </p>
              <div className="wiki-help-actions">
                <Link 
                  href="/wiki/contact" 
                  className="wiki-help-button-primary"
                >
                  Contact Support
                </Link>
                <Link 
                  href="/wiki/faq" 
                  className="wiki-help-button-secondary"
                >
                  View FAQs
                </Link>
              </div>
            </div>

          </article>
          </div>
        </div>
      </section>
    </div>
  )
}