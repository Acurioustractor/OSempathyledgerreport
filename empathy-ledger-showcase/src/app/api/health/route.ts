import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      service: 'empathy-ledger',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}