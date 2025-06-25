import { WikiSection } from '@/data/wiki-content'
import { Shield, Heart, Users, Book, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Icon mapping
const iconMap: Record<string, any> = {
  Shield,
  Heart,
  Users,
  Book,
  ArrowRight
}

interface WikiContentRendererProps {
  sections: WikiSection[]
}

export default function WikiContentRenderer({ sections }: WikiContentRendererProps) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.id} id={section.id} className="wiki-section">
          {section.title && (
            <h2 className="wiki-section-title">{section.title}</h2>
          )}
          {renderSection(section)}
        </div>
      ))}
    </>
  )
}

function renderSection(section: WikiSection) {
  switch (section.type) {
    case 'text':
      return (
        <div className="wiki-article">
          {section.content.paragraphs.map((paragraph: string, index: number) => (
            <p key={index} className="text-gray-700 mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      )

    case 'video':
      return (
        <div className="wiki-video-wrapper">
          {section.content.description && (
            <p className="wiki-video-description">{section.content.description}</p>
          )}
          <div className="wiki-video-container">
            <iframe
              src={section.content.url}
              title={section.content.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="wiki-video-iframe"
            />
          </div>
        </div>
      )

    case 'callout':
      const variantClasses = {
        orange: 'wiki-callout-orange',
        blue: 'wiki-callout-blue',
        green: 'wiki-callout-green',
        purple: 'wiki-callout-purple'
      }
      return (
        <div className={`wiki-callout ${variantClasses[section.content.variant || 'orange']}`}>
          {section.content.title && (
            <p className="wiki-callout-title">{section.content.title}</p>
          )}
          {section.content.description && (
            <p className="wiki-callout-description">{section.content.description}</p>
          )}
          {section.content.text && (
            <p className="text-lg">{section.content.text}</p>
          )}
        </div>
      )

    case 'list':
      return (
        <div>
          {section.content.ordered ? (
            <ol className="wiki-list-ordered">
              {section.content.items.map((item: any, index: number) => (
                <li key={index} className="wiki-list-item">
                  <span className="wiki-list-number">
                    {index + 1}
                  </span>
                  <div className="wiki-list-content">
                    <h4 className="wiki-list-title">{item.title}</h4>
                    <p className="wiki-list-description">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="wiki-ul">
              {section.content.items.map((item: any, index: number) => (
                <li key={index} className="wiki-ul-item">
                  <span className="wiki-ul-bullet">•</span>
                  <div>
                    {item.title && <strong>{item.title}:</strong>} {item.description || item}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )

    case 'grid':
      const gridColumns = `wiki-grid wiki-grid-${section.content.columns || 2}`
      return (
        <div className={gridColumns}>
          {section.content.items.map((item: any, index: number) => {
            const Icon = iconMap[item.icon] || Shield
            const iconColorClass = `wiki-card-icon-${item.iconColor || 'blue'}`
            return (
              <div key={index} className="wiki-card">
                <div className="wiki-card-header">
                  <div className={`wiki-card-icon ${iconColorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="wiki-card-title">{item.title}</h3>
                </div>
                <p className="wiki-card-description">{item.description}</p>
              </div>
            )
          })}
        </div>
      )

    case 'table':
      return (
        <div className="wiki-table-wrapper">
          <table className="wiki-table">
            <thead className="wiki-table-header">
              <tr>
                {section.content.headers.map((header: string, index: number) => (
                  <th key={index} className="wiki-table-header-cell">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="wiki-table-body">
              {section.content.rows.map((row: string[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: string, cellIndex: number) => (
                    <td key={cellIndex} className="wiki-table-cell">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'codeblock':
      return (
        <pre className="wiki-code">
          <code>{section.content.code}</code>
        </pre>
      )

    case 'image':
      return (
        <figure className="wiki-figure">
          <img
            src={section.content.src}
            alt={section.content.alt}
            className="wiki-image"
          />
          {section.content.caption && (
            <figcaption className="wiki-caption">
              {section.content.caption}
            </figcaption>
          )}
        </figure>
      )

    default:
      return null
  }
}