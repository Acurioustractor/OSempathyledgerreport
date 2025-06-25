# Contributing to Empathy Ledger Showcase

Thank you for your interest in contributing! This guide will help you get started.

## 🎯 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Remember the human stories at the heart of this project

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/empathy-ledger-showcase.git
   cd empathy-ledger-showcase
   ```

3. **Set up your environment:**
   ```bash
   cp .env.example .env
   # Add your Airtable credentials
   npm install
   ```

4. **Start development:**
   ```bash
   docker-compose -f docker-compose.dev.yml up
   # OR
   npm run dev
   ```

## 📝 Pre-Commit Checklist

Before submitting a PR, ensure:

### Code Quality
- [ ] All TypeScript compiles without errors: `npm run typecheck`
- [ ] ESLint passes: `npm run lint`
- [ ] No console.logs in production code
- [ ] No commented-out code blocks

### Security
- [ ] No hardcoded API keys or secrets
- [ ] No sensitive data in commits
- [ ] All user input is validated
- [ ] CORS is properly configured

### Performance
- [ ] Images are optimized (use Next.js Image component)
- [ ] No unnecessary re-renders (use React.memo where appropriate)
- [ ] API calls are cached appropriately
- [ ] Bundle size hasn't increased significantly

### Testing
- [ ] All pages load without errors
- [ ] Forms submit correctly
- [ ] Error states are handled gracefully
- [ ] Mobile responsive design works

### Documentation
- [ ] README is updated if needed
- [ ] Complex functions have comments
- [ ] New environment variables are documented
- [ ] API changes are documented

## 🏗️ Development Guidelines

### File Structure
```
src/
├── app/          # Page routes (Next.js App Router)
├── components/   # Reusable React components
│   ├── common/   # Shared components
│   ├── layout/   # Layout components
│   └── [feature]/ # Feature-specific components
├── lib/          # Utility functions
├── styles/       # Global styles and CSS modules
└── types/        # TypeScript type definitions
```

### Component Guidelines

1. **Use functional components with hooks**
   ```typescript
   export default function MyComponent({ prop }: Props) {
     // Component logic
   }
   ```

2. **TypeScript is required**
   ```typescript
   interface Props {
     title: string
     count?: number
   }
   ```

3. **Use Tailwind for styling**
   ```tsx
   <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
   ```

### Git Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make atomic commits:**
   ```bash
   git add .
   git commit -m "feat: add story filtering by theme"
   ```

3. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code changes that neither fix bugs nor add features
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Description** of the problem
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Screenshots** if applicable
6. **Environment** (OS, browser, etc)

## 🔍 Code Review Process

All PRs will be reviewed for:

1. **Code quality** - Clean, readable, maintainable
2. **Performance** - No unnecessary operations
3. **Security** - No vulnerabilities introduced
4. **Design** - Consistent with existing patterns
5. **Documentation** - Changes are documented

## 📦 Adding Dependencies

Before adding new dependencies:

1. **Check if existing packages can solve the problem**
2. **Evaluate bundle size impact**
3. **Ensure license compatibility (MIT preferred)**
4. **Document why it's needed in PR**

## 🎨 Design Guidelines

- **Mobile-first** responsive design
- **Accessibility** is non-negotiable (WCAG 2.1 AA)
- **Orange Sky brand colors** should be used consistently
- **Loading states** for all async operations
- **Error boundaries** for graceful failures

## 📞 Getting Help

- **Documentation:** Check `/wiki` in the app
- **Issues:** Search existing issues first
- **Discussions:** Use GitHub Discussions for questions
- **Email:** dev@your-org.com

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Annual community report

Thank you for helping make ethical storytelling accessible to all!