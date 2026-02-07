# Contributing to WYLM

Thank you for your interest in contributing to WYLM! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## 📜 Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git
- npm or yarn

### Setup Development Environment

1. **Fork the repository**

   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/wylm.git
   cd wylm
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/WeiAugust/wylm.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Initialize database**

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

7. **Start development server**

   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch (if used)
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Test improvements

### Working on a Feature

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   Write code, add tests, update documentation.

3. **Keep your branch updated**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. **Run tests and linting**

   ```bash
   npm run lint
   npm run build
   ```

5. **Commit your changes**

   Follow our [commit guidelines](#commit-guidelines).

6. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**

   Go to the repository and click "New Pull Request".

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types when possible
- Use interfaces for object shapes
- Use type aliases for unions and complex types

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component names
- Extract reusable logic into custom hooks
- Prefer composition over inheritance

### File Organization

```
src/
├── app/              # Next.js pages and routes
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Layout components
│   └── features/    # Feature-specific components
├── lib/             # Utility functions and helpers
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

### Naming Conventions

- **Files**: Use kebab-case for files (e.g., `user-profile.tsx`)
- **Components**: Use PascalCase (e.g., `UserProfile`)
- **Functions**: Use camelCase (e.g., `getUserData`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Types/Interfaces**: Use PascalCase (e.g., `UserProfile`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use trailing commas in multi-line objects/arrays
- Keep lines under 100 characters when possible
- Add comments for complex logic

### API Routes

- Use RESTful conventions
- Return consistent response formats
- Handle errors gracefully
- Validate input data
- Use appropriate HTTP status codes

## 💬 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
feat(auth): add SMS verification for login

Implement SMS verification code sending and validation
for the login flow using Aliyun SMS service.

Closes #123
```

```bash
fix(blog): resolve pagination issue on post listing

The pagination was not working correctly when filtering
by category. Fixed by updating the query logic.
```

```bash
docs(readme): update installation instructions

Add Docker installation steps and clarify database
setup requirements.
```

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tests added/updated and passing
- [ ] Database migrations included (if applicable)

### PR Title

Use the same format as commit messages:

```
feat(auth): add OAuth login support
```

### PR Description

Use the provided PR template and include:

- Description of changes
- Related issues
- Type of change
- Testing performed
- Screenshots (if applicable)

### Review Process

1. At least one maintainer must review and approve
2. All CI checks must pass
3. No merge conflicts
4. All review comments addressed

### After Merge

- Delete your feature branch
- Update your local repository
- Close related issues

## 🐛 Reporting Bugs

### Before Reporting

- Check existing issues to avoid duplicates
- Verify the bug in the latest version
- Collect relevant information

### Bug Report Template

Use the bug report template when creating an issue. Include:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs if applicable

## 💡 Suggesting Features

### Before Suggesting

- Check existing feature requests
- Ensure it aligns with project goals
- Consider if it benefits most users

### Feature Request Template

Use the feature request template. Include:

- Problem statement
- Proposed solution
- Alternatives considered
- Priority level
- Willingness to contribute

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for new features
- Update tests for bug fixes
- Aim for high test coverage
- Test edge cases
- Use descriptive test names

## 📚 Documentation

### When to Update Documentation

- Adding new features
- Changing existing behavior
- Fixing bugs that affect usage
- Improving setup/deployment

### Documentation Locations

- `README.md` - Project overview and quick start
- `docs/` - Detailed documentation
- Code comments - Complex logic explanation
- API documentation - Endpoint descriptions

## 🤝 Getting Help

- **GitHub Discussions**: Ask questions and discuss ideas
- **Issues**: Report bugs and request features
- **Discord/Slack**: Real-time chat (if available)

## 🎉 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project website (if applicable)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to WYLM! 🚀
