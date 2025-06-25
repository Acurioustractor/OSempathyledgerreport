import { NextResponse } from 'next/server';

// Import the pre-generated photo index
// This avoids runtime filesystem access which doesn't work in serverless deployments
import photoIndex from '../../../../public/data/photo-index.json';

export async function GET() {
  // Simply return the pre-generated photo index
  return NextResponse.json(photoIndex);
} 