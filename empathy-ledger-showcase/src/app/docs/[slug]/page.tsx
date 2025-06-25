import DocsLayout from '@/components/docs/DocsLayout'
import WikiContentRenderer from '@/components/wiki/WikiContentRenderer'
import { MarkdownEditor } from '@/components/docs/MarkdownEditor'
import { getPageBySlug } from '@/data/documentation-structure'
import { WikiSection } from '@/data/wiki-content'
import { notFound } from 'next/navigation'
import React from 'react'
import { DocPageClient } from './client'

// Import all page content
import { introductionContent } from '@/data/docs/introduction'
import { quickStartContent } from '@/data/docs/quick-start'
import { projectOverviewContent } from '@/data/docs/project-overview'
import { ethicalFrameworkContent } from '@/data/docs/ethical-framework'
import { privacyConsentContent } from '@/data/docs/privacy-consent'
import { consentProcessContent } from '@/data/docs/consent-process'
import { consentFormsContent } from '@/data/docs/consent-forms'
import { photographerWorkflowContent } from '@/data/docs/photographer-workflow'
import { airtableSystemContent } from '@/data/docs/airtable-system'
import { contentGuideContent } from '@/data/docs/content-guide'

// Map slugs to content
const contentMap: Record<string, WikiSection[]> = {
  'introduction': introductionContent,
  'quick-start': quickStartContent,
  'project-overview': projectOverviewContent,
  'ethical-framework': ethicalFrameworkContent,
  'privacy-consent': privacyConsentContent,
  'consent-process': consentProcessContent,
  'consent-forms': consentFormsContent,
  'photographer-workflow': photographerWorkflowContent,
  'airtable-system': airtableSystemContent,
  'content-guide': contentGuideContent,
  // Add more mappings as you create content
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const page = getPageBySlug(params.slug)
  if (!page) notFound()
  const content = contentMap[params.slug] || []

  return (
    <DocPageClient 
      slug={params.slug}
      page={page}
      content={content}
    />
  )
}

// Generate static params for all documentation pages
export async function generateStaticParams() {
  const { getAllPages } = await import('@/data/documentation-structure')
  const pages = getAllPages()
  
  return pages.map((page) => ({
    slug: page.slug,
  }))
}