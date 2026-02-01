# Deployment Guide

This guide will help you deploy MathTutorAI to various hosting platforms.

## Vercel (Recommended - Easiest)

Vercel is the recommended platform for deploying Next.js applications.

### Steps:

1. **Push your code to GitHub** (already done)

2. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

3. **Import your repository**
   - Click "New Project"
   - Select your `mathtutorai` repository
   - Vercel will auto-detect Next.js settings

4. **Add environment variables**
   - In the project settings, go to "Environment Variables"
   - Add your `OPENAI_API_KEY` (and optionally `OPENAI_API_URL` and `OPENAI_MODEL`)
   - These will be used in production

5. **Deploy**
   - Click "Deploy"
   - Your app will be live in minutes!

### Custom Domain (Optional)
- Add your custom domain in Vercel project settings
- Follow the DNS configuration instructions

## Netlify

### Steps:

1. **Sign up for Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub account

2. **Create new site**
   - Click "Add new site" → "Import an existing project"
   - Select your repository

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Add environment variables**
   - Go to Site settings → Environment variables
   - Add `OPENAI_API_KEY` and other variables

5. **Deploy**

## Docker Deployment

### Create a Dockerfile:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Update next.config.js:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
```

### Build and run:

```bash
docker build -t mathtutorai .
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key mathtutorai
```

## AWS / DigitalOcean / Any VPS

### Requirements:
- Node.js 18+ installed
- PM2 (process manager)

### Steps:

1. **Clone repository on server**
   ```bash
   git clone https://github.com/Jakobbb08/mathtutorai.git
   cd mathtutorai
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Create .env.local**
   ```bash
   echo "OPENAI_API_KEY=your_key_here" > .env.local
   ```

4. **Build application**
   ```bash
   npm run build
   ```

5. **Install PM2 (if not installed)**
   ```bash
   npm install -g pm2
   ```

6. **Start with PM2**
   ```bash
   pm2 start npm --name "mathtutorai" -- start
   pm2 save
   pm2 startup
   ```

7. **Set up reverse proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Environment Variables

For all deployment platforms, set these environment variables:

### Required:
- `OPENAI_API_KEY`: Your API key

### Optional:
- `OPENAI_API_URL`: Custom API endpoint (default: OpenAI)
- `OPENAI_MODEL`: Model name (default: gpt-3.5-turbo)

## Free AI Provider Options

### Groq (Recommended for Free Tier)
```
OPENAI_API_KEY=your_groq_api_key
OPENAI_API_URL=https://api.groq.com/openai/v1/chat/completions
OPENAI_MODEL=llama-3.1-70b-versatile
```

### Local Ollama (Completely Free)
```
OPENAI_API_KEY=ollama
OPENAI_API_URL=http://your-server:11434/v1/chat/completions
OPENAI_MODEL=llama2
```

## Troubleshooting

### Build fails
- Ensure Node.js version is 18 or higher
- Clear cache: `rm -rf .next node_modules && npm install`

### API errors in production
- Verify environment variables are set correctly
- Check API key is valid
- Ensure API endpoint is accessible from your server

### Port already in use
- Change port: `PORT=3001 npm start`
- Or kill the process using port 3000

## Monitoring

For production deployments, consider:
- Setting up error tracking (Sentry)
- Monitoring uptime (UptimeRobot)
- Analyzing performance (Vercel Analytics)
- Tracking costs (API usage monitoring)

## Security Best Practices

1. Never commit `.env.local` or API keys
2. Use environment variables for all secrets
3. Enable HTTPS (comes free with Vercel/Netlify)
4. Rate limit API endpoints if needed
5. Monitor API usage to prevent abuse
6. Keep dependencies updated

## Scaling

For high traffic:
1. Enable caching (CDN)
2. Use serverless functions (automatic with Vercel)
3. Rate limit users
4. Consider using multiple API providers
5. Implement request queuing

---

Need help? Check the [README](README.md) or open an issue on GitHub!
