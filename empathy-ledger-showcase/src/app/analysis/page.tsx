import { promises as fs } from 'fs'
import path from 'path'
import AnalysisClient from '@/components/analysis/AnalysisClient'

async function getAnalytics() {
  try {
    const filePath = path.join(process.cwd(), 'public/data/analytics.json')
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading analytics:', error)
    return null
  }
}

export default async function AnalysisPage() {
  const analytics = await getAnalytics()

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics Loading</h1>
          <p className="text-gray-600">Please wait while we process the data...</p>
        </div>
      </div>
    )
  }

  return <AnalysisClient analytics={analytics} />
}