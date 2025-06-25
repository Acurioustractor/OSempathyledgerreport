import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request: Request) {
  // Verify this is called by Vercel cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Run the data fetching script
    const { stdout, stderr } = await execAsync('npm run fetch-data')
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      output: stdout,
      error: stderr || null
    })
  } catch (error) {
    console.error('Error refreshing data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}