# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Payment integration (WeChat Pay, Alipay)
- Third-party authentication (WeChat, GitHub)
- Real-time notifications (WebSocket)
- Mobile app support
- Performance optimizations
- Enhanced analytics dashboard

## [0.1.0] - 2026-02-07

### Added
- Initial project setup with Next.js 14+ and TypeScript
- PostgreSQL database with Prisma ORM
- Complete authentication system with JWT and SMS verification
- Blog system with categories, tags, and comments
- Photography gallery with EXIF metadata support
- Product showcase with pricing plans
- Admin dashboard with RBAC (Role-Based Access Control)
- Docker deployment configuration
- Comprehensive API routes with standardized responses
- Responsive UI components with Tailwind CSS
- Database seeding with sample data
- Development and production Docker configurations
- Nginx reverse proxy configuration
- Automated backup and monitoring scripts
- Complete project documentation
- CI/CD workflows with GitHub Actions
- Community guidelines (Code of Conduct, Contributing)
- Security policy and vulnerability reporting process
- Automated dependency updates with Dependabot

### Security
- JWT token-based authentication
- bcrypt password hashing (10 salt rounds)
- SQL injection prevention via Prisma
- Input validation on all API endpoints
- Role-based access control

### Documentation
- Comprehensive README with quick start guide
- API documentation
- Development guide
- Docker deployment guide
- Project initialization guide
- Claude AI development guide (CLAUDE.md)

### Infrastructure
- Docker multi-stage builds
- Docker Compose for development and production
- Nginx configuration for production
- Database backup scripts
- Health check endpoints
- Monitoring and logging scripts

[Unreleased]: https://github.com/WeiAugust/wylm/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/WeiAugust/wylm/releases/tag/v0.1.0
