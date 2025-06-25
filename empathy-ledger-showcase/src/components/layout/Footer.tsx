import Link from 'next/link'
import { Heart, ExternalLink, Github, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    project: [
      { name: 'About the Project', href: '/wiki/overview' },
      { name: 'Methodology', href: '/wiki/methodology' },
      { name: 'Ethical Framework', href: '/wiki/ethics' },
      { name: 'Privacy Policy', href: '/wiki/privacy' },
    ],
    resources: [
      { name: 'How-To Guides', href: '/wiki/guides' },
      { name: 'Templates', href: '/wiki/resources' },
      { name: 'Training Materials', href: '/wiki/training' },
      { name: 'Code Repository', href: '#', external: true },
    ],
    connect: [
      { name: 'Orange Sky Website', href: 'https://orangesky.org.au', external: true },
      { name: 'Contact Us', href: 'mailto:hello@orangesky.org.au', external: true },
      { name: 'Follow Our Work', href: 'https://orangesky.org.au/news', external: true },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-sky rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Empathy Ledger</h3>
                <p className="text-sm text-gray-400">102 Stories of Connection</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Showcasing the power of ethical storytelling through dignified collection 
              and analysis of human experiences across Orange Sky's community.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://github.com"
                className="text-gray-400 hover:text-orange-sky transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@orangesky.org.au"
                className="text-gray-400 hover:text-orange-sky transition-colors"
                aria-label="Email Contact"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Project Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
              Project
            </h4>
            <ul className="space-y-2">
              {footerLinks.project.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-orange-sky text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-orange-sky text-sm transition-colors duration-200 flex items-center"
                    {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {link.name}
                    {link.external && <ExternalLink className="w-3 h-3 ml-1" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-orange-sky text-sm transition-colors duration-200 flex items-center"
                    {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {link.name}
                    {link.external && <ExternalLink className="w-3 h-3 ml-1" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>
                © {currentYear} Orange Sky Australia. Built with dignity and respect for all storytellers.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                <Heart className="w-4 h-4 text-orange-sky mr-1" />
                Made with care
              </span>
              <Link href="/wiki/privacy" className="hover:text-orange-sky transition-colors">
                Privacy
              </Link>
              <Link href="/wiki/ethics" className="hover:text-orange-sky transition-colors">
                Ethics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer