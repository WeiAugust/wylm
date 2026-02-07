# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of WYLM seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not

- **Do not** open a public GitHub issue for security vulnerabilities
- **Do not** disclose the vulnerability publicly until it has been addressed
- **Do not** exploit the vulnerability beyond what is necessary to demonstrate it

### Please Do

1. **Email us directly** at [INSERT SECURITY EMAIL]
   - Use a descriptive subject line (e.g., "Security: SQL Injection in User Login")
   - Include detailed steps to reproduce the vulnerability
   - Provide any relevant proof-of-concept code or screenshots
   - Suggest a fix if you have one

2. **Provide the following information:**
   - Type of vulnerability (e.g., XSS, SQL injection, authentication bypass)
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected source code (tag/branch/commit or direct URL)
   - Any special configuration required to reproduce the issue
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Communication**: We will keep you informed about our progress in addressing the vulnerability
- **Timeline**: We aim to address critical vulnerabilities within 7 days and other vulnerabilities within 30 days
- **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Update Process

1. **Vulnerability Reported**: Security issue is reported privately
2. **Validation**: We validate and reproduce the vulnerability
3. **Fix Development**: We develop and test a fix
4. **Security Advisory**: We prepare a security advisory
5. **Release**: We release a patched version
6. **Disclosure**: We publicly disclose the vulnerability after the patch is available

## Security Best Practices

### For Users

- **Keep Updated**: Always use the latest version of WYLM
- **Secure Configuration**: Follow security best practices in configuration
- **Environment Variables**: Never commit `.env` files or expose secrets
- **Database Security**: Use strong passwords and restrict database access
- **HTTPS**: Always use HTTPS in production
- **Regular Backups**: Maintain regular backups of your data

### For Developers

- **Code Review**: All code changes should be reviewed
- **Dependency Updates**: Keep dependencies up to date
- **Input Validation**: Always validate and sanitize user input
- **Authentication**: Use strong authentication mechanisms
- **Authorization**: Implement proper access controls
- **Secrets Management**: Never hardcode secrets in code
- **SQL Injection**: Use parameterized queries (Prisma handles this)
- **XSS Prevention**: Sanitize output and use Content Security Policy
- **CSRF Protection**: Implement CSRF tokens for state-changing operations

## Known Security Considerations

### Authentication

- JWT tokens are used for authentication
- Tokens expire after 7 days by default
- Passwords are hashed using bcrypt with 10 salt rounds
- SMS verification codes are used for additional security

### Database

- Prisma ORM is used to prevent SQL injection
- Database credentials should be stored in environment variables
- Use connection pooling in production

### API Security

- Rate limiting should be implemented in production
- API endpoints validate JWT tokens
- Role-based access control (RBAC) is implemented
- Input validation is performed on all endpoints

### File Uploads

- File uploads should be validated for type and size
- Files should be scanned for malware
- Use object storage (e.g., Aliyun OSS) instead of local storage

### Third-Party Services

- Aliyun SMS for verification codes
- Aliyun OSS for file storage
- WeChat Pay / Alipay for payments

## Security Checklist for Deployment

- [ ] Change default JWT_SECRET and NEXTAUTH_SECRET
- [ ] Use strong database passwords
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerting
- [ ] Enable database backups
- [ ] Configure firewall rules
- [ ] Use environment-specific configurations
- [ ] Implement logging and audit trails
- [ ] Set up intrusion detection
- [ ] Regular security audits

## Vulnerability Disclosure Policy

We follow a coordinated disclosure policy:

1. **Private Disclosure**: Report vulnerabilities privately
2. **Fix Development**: We develop and test a fix
3. **Coordinated Release**: We release the fix and advisory together
4. **Public Disclosure**: After 90 days or when a fix is available

## Security Tools

We use the following tools to maintain security:

- **Dependabot**: Automated dependency updates
- **ESLint**: Static code analysis
- **TypeScript**: Type safety
- **Prisma**: SQL injection prevention
- **bcrypt**: Password hashing
- **JWT**: Secure authentication

## Bug Bounty Program

We currently do not have a bug bounty program, but we greatly appreciate security researchers who responsibly disclose vulnerabilities. We will:

- Acknowledge your contribution
- Credit you in our security advisories (if desired)
- Keep you informed of our progress

## Contact

For security-related inquiries, please contact:

- **Email**: [INSERT SECURITY EMAIL]
- **PGP Key**: [INSERT PGP KEY FINGERPRINT] (optional)

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/security)

---

Thank you for helping keep WYLM and our users safe!
