# Empathy Ledger Showcase

A privacy-first storytelling platform that showcases 102 stories of human connection collected across 8 Australian cities. Built with Next.js, TypeScript, and Airtable.

## 🌟 Features

- **Privacy-First Design**: Multi-tier consent system ensuring storyteller control
- **Responsive UI**: Beautiful, accessible interface that works on all devices
- **Real-time Data**: Syncs with Airtable for live content updates
- **Advanced Search**: Filter stories by themes, locations, and storytellers
- **Interactive Visualizations**: Data-driven insights and impact metrics
- **Docker Support**: Easy deployment with containerization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Docker
- Airtable account with API access
- Git

### Option 1: Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/your-org/empathy-ledger-showcase.git
cd empathy-ledger-showcase
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Add your Airtable credentials to `.env`:
```
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=your_base_id_here
```

4. Run with Docker:
```bash
docker-compose up
```

Visit http://localhost:3000

### Option 2: Local Development

1. Clone and install dependencies:
```bash
git clone https://github.com/your-org/empathy-ledger-showcase.git
cd empathy-ledger-showcase
npm install
```

2. Set up environment variables (same as above)

3. Fetch initial data:
```bash
npm run fetch-data
```

4. Start development server:
```bash
npm run dev
```

## 📊 Data Structure

The platform uses Airtable as its backend with the following tables:

- **Stories**: Main content with quotes, themes, and consent levels
- **Storytellers**: People who shared their stories
- **Friends**: Service users who contributed stories
- **Volunteers**: Team members with their own experiences

## 🔒 Privacy & Security

- All API keys stored in environment variables
- Multi-tier consent system (Internal, Anonymous, Full Attribution)
- No personal data exposed without explicit consent
- Secure data fetching with server-side processing

## 🏗️ Architecture

```
empathy-ledger-showcase/
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   ├── data/         # Static data and content
│   ├── lib/          # Utility functions
│   └── styles/       # CSS and styling
├── public/
│   └── data/         # Fetched Airtable data (gitignored)
├── scripts/          # Data fetching and processing
└── docker/           # Docker configuration
```

## 📦 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/empathy-ledger-showcase)

### Docker Production

```bash
docker-compose -f docker-compose.yml up -d
```

### Environment Variables

Required:
- `AIRTABLE_API_KEY`: Your Airtable personal access token
- `AIRTABLE_BASE_ID`: Your Airtable base identifier

Optional:
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID
- `NODE_ENV`: Environment (development/production)

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript
- `npm run fetch-data` - Fetch latest from Airtable

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following existing patterns
3. Test thoroughly
4. Submit pull request

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- React hooks for state management
- Server-side rendering where possible

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Orange Sky for pioneering ethical storytelling
- All storytellers who trusted us with their experiences
- Contributors and maintainers

## 📞 Support

- Documentation: [/wiki](http://localhost:3000/wiki)
- Issues: [GitHub Issues](https://github.com/your-org/empathy-ledger-showcase/issues)
- Email: support@your-org.com

---

Built with ❤️ for communities everywhere