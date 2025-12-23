# GNIS Enterprise Infrastructure - Contributing Guide

Thank you for your interest in contributing to the GNIS Enterprise Infrastructure project!

## 🎯 Mission-Critical Standards

This is an **enterprise-grade, truth-governed** system with **zero tolerance** for quality issues. All contributions must meet the highest standards.

---

## 📋 Before You Start

### Required Reading
1. [README.md](README.md) - Project overview
2. [Ethics Policy](gnis/governance/ethics_policy.md) - Ethical guidelines
3. [Truth Governor](gnis/governance/truth_governor.json) - Governance rules
4. [SECURITY.md](SECURITY.md) - Security policies

### Prerequisites
- Node.js 18+ installed
- TypeScript knowledge
- Understanding of GIS/geospatial concepts
- Git proficiency
- Security awareness

---

## 🔄 Contribution Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/copilot-cli.git
cd copilot-cli

# Add upstream remote
git remote add upstream https://github.com/coloredinnovator-ai/copilot-cli.git
```

### 2. Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `security/` - Security improvements
- `refactor/` - Code refactoring

### 3. Make Changes

#### Code Standards
- **TypeScript**: All code must be strongly typed
- **ESLint**: Must pass linting (`npm run lint`)
- **Formatting**: Follow existing code style
- **Comments**: Document complex logic
- **Tests**: Include unit and integration tests

#### Schema Changes
- Update JSON schemas in `/gnis/core/`
- Validate with `npm run validate-schema`
- Update documentation
- Add migration guide if breaking changes

#### Governance Changes
- Changes to `/gnis/governance/` require senior review
- Must document rationale and impact
- Compliance team approval required

### 4. Test Your Changes

```bash
# Install dependencies
npm ci

# Run linters
npm run lint

# Type check
npm run type-check

# Run tests
npm test

# Run integration tests (requires API keys)
npm run test:integration

# Security scan
npm run security-scan
```

### 5. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Good commit messages
git commit -m "feat: add housing affordability analysis module"
git commit -m "fix: correct coordinate validation in geo-object schema"
git commit -m "docs: update deployment guide for Azure"
git commit -m "security: patch XSS vulnerability in map component"

# Bad commit messages
git commit -m "updated stuff"
git commit -m "fix"
git commit -m "WIP"
```

Commit message format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `security`

### 6. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create PR on GitHub
```

---

## 📝 Pull Request Guidelines

### PR Template

Your PR must include:

**Description**
- What does this PR do?
- Why is this change needed?
- What issue does it address?

**Changes Made**
- List of specific changes
- Files modified
- New files added

**Testing**
- How was this tested?
- Test coverage added
- Manual testing performed

**Truth Governor Compliance**
- [ ] No forbidden actions violated
- [ ] Required validations passed
- [ ] Compliance rules followed
- [ ] Security reviewed

**Checklist**
- [ ] Code passes all tests
- [ ] Documentation updated
- [ ] Schema validation passes
- [ ] Security scan clean
- [ ] Follows code style
- [ ] Commit messages follow convention

### Review Process

1. **Automated Checks**: CI/CD pipeline must pass
2. **Code Review**: At least 1 approval from maintainer
3. **Security Review**: Security team review for sensitive changes
4. **Governance Review**: Required for governance policy changes
5. **Final Approval**: Merge by maintainer

### Review Criteria

Reviewers will check:
- ✅ Meets acceptance criteria
- ✅ Code quality and maintainability
- ✅ Test coverage adequate
- ✅ Documentation complete
- ✅ No security vulnerabilities
- ✅ Follows architectural principles
- ✅ Truth Governor compliant

---

## 🧪 Testing Requirements

### Unit Tests
- Minimum 90% code coverage
- Test all public functions
- Mock external dependencies
- Fast execution (< 10 seconds total)

### Integration Tests
- Test API connectors
- Test validation pipelines
- Test Truth Governor enforcement
- Use test fixtures, not production data

### E2E Tests
- Test critical user flows
- Test UI components
- Test deployment scenarios
- Run in staging environment

---

## 📚 Documentation Requirements

### Code Documentation
- TSDoc comments for all public APIs
- Inline comments for complex logic
- README for each module
- Examples and usage guides

### Architecture Documentation
- Decision records (ADR) for major changes
- Sequence diagrams for complex flows
- Data flow diagrams
- Deployment diagrams

### User Documentation
- User guides for new features
- API documentation updates
- Troubleshooting guides
- Migration guides for breaking changes

---

## 🔒 Security Requirements

### Secure Coding
- Input validation for all user inputs
- Output encoding to prevent XSS
- Parameterized queries to prevent injection
- Proper error handling (no sensitive data in errors)

### Secret Management
- Never commit secrets to git
- Use environment variables
- Use secret managers in production
- Rotate secrets regularly

### Dependency Management
- Keep dependencies up to date
- Audit dependencies regularly
- Pin versions in package.json
- Review dependency licenses

---

## 🚫 What NOT to Do

### Forbidden Actions
- ❌ Bypass schema validation
- ❌ Hardcode secrets or credentials
- ❌ Commit sensitive data
- ❌ Remove or weaken security controls
- ❌ Modify governance policies without approval
- ❌ Deploy to production without approval
- ❌ Delete audit logs
- ❌ Introduce known vulnerabilities

### Code Anti-Patterns
- ❌ God objects (classes that do too much)
- ❌ Tight coupling
- ❌ Magic numbers and strings
- ❌ Copy-paste code duplication
- ❌ Ignoring errors
- ❌ Synchronous blocking operations

---

## 💬 Communication

### Getting Help
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Email**: engineering@gnis.enterprise.gov
- **Slack**: #gnis-dev (internal)

### Issue Reporting
When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs if applicable

### Feature Requests
When requesting features, include:
- Problem statement
- Proposed solution
- Alternative solutions considered
- Impact and benefits
- Acceptance criteria

---

## 🏆 Recognition

Outstanding contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Eligible for contributor badge
- Invited to contributor meetings

---

## 📜 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on constructive feedback
- Assume good intentions
- Prioritize project goals

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Unprofessional conduct

### Enforcement
Violations will result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report violations to: conduct@gnis.enterprise.gov

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

See [LICENSE.md](LICENSE.md) for details.

---

## 🙏 Thank You

Your contributions make this project better. Thank you for helping us build a world-class enterprise geospatial infrastructure!

---

**Questions?** Open a [GitHub Discussion](https://github.com/coloredinnovator-ai/copilot-cli/discussions) or email engineering@gnis.enterprise.gov
