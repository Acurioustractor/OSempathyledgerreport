# Deployment Guide

This guide covers multiple deployment options for the Empathy Ledger Showcase, optimized for performance and Airtable data access.

## 🚀 Deployment Options

### 1. Vercel (Recommended for Speed & Simplicity)

**Pros:** Automatic deployments, global CDN, serverless functions, excellent Next.js support
**Best for:** Production deployments with high traffic

#### Steps:

1. **Fork & Connect**
   ```bash
   # Fork this repository on GitHub
   # Then connect to Vercel: https://vercel.com/new
   ```

2. **Environment Variables**
   Add in Vercel Dashboard:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `BUILD_ID` (optional, for cache busting)

3. **Build Settings**
   - Build Command: `npm run build-production`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   Vercel will automatically deploy on push to main branch

#### Performance Optimizations:
- Enable Edge Network
- Set up ISR (Incremental Static Regeneration):
  ```javascript
  // In your pages
  export const revalidate = 3600 // Revalidate every hour
  ```

### 2. Netlify

**Pros:** Great build pipeline, form handling, split testing
**Best for:** Static sites with periodic rebuilds

#### Setup:

1. **netlify.toml**
   ```toml
   [build]
     command = "npm run build-production"
     publish = ".next"

   [build.environment]
     NEXT_PRIVATE_TARGET = "server"

   [[plugins]]
     package = "@netlify/plugin-nextjs"

   [[headers]]
     for = "/data/*"
     [headers.values]
       Cache-Control = "public, max-age=3600"
   ```

2. **Deploy**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod
   ```

### 3. AWS Amplify

**Pros:** Full AWS integration, great for enterprise
**Best for:** Organizations already using AWS

#### Configuration:

1. **amplify.yml**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build-production
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

### 4. Docker + Cloud Run/ECS

**Pros:** Full control, consistent environments
**Best for:** Organizations with container infrastructure

#### Production Dockerfile:

```dockerfile
# Dockerfile.production
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

## 📊 Optimizing Airtable Performance

### 1. Implement Caching Strategy

**Redis Cache Layer:**
```javascript
// lib/cache.js
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCachedData(key, fetcher, ttl = 3600) {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)
  
  const fresh = await fetcher()
  await redis.setex(key, ttl, JSON.stringify(fresh))
  return fresh
}
```

### 2. Use CDN for Static Data

**Cloudflare Workers:**
```javascript
// cloudflare-worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const cache = caches.default
  const cached = await cache.match(request)
  
  if (cached) return cached
  
  const response = await fetch(request)
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', 'public, max-age=3600')
  
  const cachedResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
  
  event.waitUntil(cache.put(request, cachedResponse.clone()))
  return cachedResponse
}
```

### 3. Background Data Refresh

**GitHub Actions:**
```yaml
# .github/workflows/refresh-data.yml
name: Refresh Airtable Data
on:
  schedule:
    - cron: '0 */6 * * *' # Every 6 hours
  workflow_dispatch:

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npm run fetch-data
        env:
          AIRTABLE_API_KEY: ${{ secrets.AIRTABLE_API_KEY }}
          AIRTABLE_BASE_ID: ${{ secrets.AIRTABLE_BASE_ID }}
      
      - name: Deploy to CDN
        run: |
          # Upload to S3/CloudFlare/etc
          aws s3 sync public/data s3://your-bucket/data
```

## 🔒 Security Best Practices

1. **API Key Management**
   - Never commit API keys
   - Use environment variables
   - Rotate keys regularly
   - Use read-only keys in production

2. **Rate Limiting**
   ```javascript
   // middleware.ts
   import { Ratelimit } from '@upstash/ratelimit'
   import { Redis } from '@upstash/redis'

   const ratelimit = new Ratelimit({
     redis: Redis.fromEnv(),
     limiter: Ratelimit.slidingWindow(100, '1 h'),
   })
   ```

3. **CORS Configuration**
   ```javascript
   // next.config.js
   async headers() {
     return [{
       source: '/api/:path*',
       headers: [
         { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
       ],
     }]
   }
   ```

## 📈 Monitoring & Analytics

### 1. Performance Monitoring

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Error Tracking

**Sentry Setup:**
```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
})
```

## 🚄 Performance Checklist

- [ ] Enable gzip compression
- [ ] Implement image optimization
- [ ] Use CDN for static assets
- [ ] Enable HTTP/2
- [ ] Implement service worker for offline support
- [ ] Use lazy loading for images
- [ ] Minimize JavaScript bundle size
- [ ] Enable ISR for dynamic pages
- [ ] Implement proper caching headers
- [ ] Use edge functions for API routes

## 📞 Support

For deployment issues:
- Vercel: https://vercel.com/support
- Netlify: https://www.netlify.com/support/
- AWS: https://aws.amazon.com/support/

For application issues:
- GitHub Issues: https://github.com/your-org/empathy-ledger-showcase/issues