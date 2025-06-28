# Contributing to BD VPN Pro

🇧🇩 **বাংলাদেশের জন্য তৈরি VPN প্রজেক্টে অবদান রাখুন**

আমরা আপনার অবদানকে স্বাগত জানাই! এই গাইড আপনাকে প্রজেক্টে কীভাবে অবদান রাখতে হবে তা বলে দেবে।

## 🤝 অবদানের ধরন

### 🐛 Bug Reports
- বাগ রিপোর্ট করার আগে existing issues চেক করুন
- Clear এবং descriptive title ব্যবহার করুন
- Steps to reproduce বিস্তারিত লিখুন
- Expected vs actual behavior উল্লেখ করুন
- Screenshots বা videos যোগ করুন যদি সম্ভব হয়

### ✨ Feature Requests
- Feature এর clear description দিন
- Use case এবং benefits ব্যাখ্যা করুন
- Mockups বা examples যোগ করুন যদি থাকে
- Implementation suggestions দিতে পারেন

### 🔧 Code Contributions
- Bug fixes
- New features
- Performance improvements
- Documentation updates
- Test coverage improvements

## 🚀 Getting Started

### 1. Repository Setup
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/yourusername/bd-vpn-pro.git

# Add upstream remote
git remote add upstream https://github.com/originalowner/bd-vpn-pro.git

# Navigate to project directory
cd bd-vpn-pro

# Install dependencies
npm install
```

### 2. Development Environment
```bash
# Start development server
npm run dev

# Run tests
npm test

# Check code style
npm run lint

# Format code
npm run format
```

### 3. Firebase Setup (for authentication features)
1. Create a Firebase project
2. Enable Authentication with Email/Password
3. Copy your config to `src/js/firebase-config.js`
4. Enable Email verification in Firebase Console

## 📝 Development Guidelines

### 🎯 Code Style

#### JavaScript
- Use ES6+ features
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused

```javascript
/**
 * Validates Gmail address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid Gmail address
 */
function validateGmailAddress(email) {
  return email.endsWith('@gmail.com') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

#### CSS
- Use CSS custom properties (variables)
- Follow BEM naming convention
- Mobile-first responsive design
- Use semantic class names

```css
/* Good */
.auth-form__input--error {
  border-color: var(--error-color);
}

/* Avoid */
.red-border {
  border-color: red;
}
```

#### HTML
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure accessibility compliance
- Use Bengali text for user-facing content

```html
<!-- Good -->
<button class="btn-primary" aria-label="লগইন করুন">
  <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
  লগইন করুন
</button>
```

### 🌐 Internationalization

#### Bengali Language
- All user-facing text must be in Bengali
- Use proper Bengali typography
- Follow Bengali grammar rules
- Include English comments in code

```javascript
// English comment for developers
const errorMessages = {
  invalidEmail: 'অবৈধ ইমেইল ঠিকানা', // Bengali for users
  weakPassword: 'দুর্বল পাসওয়ার্ড'
};
```

### 🔒 Security Guidelines

#### Authentication
- Never store passwords in plain text
- Use Firebase Auth for user management
- Validate all inputs on both client and server
- Implement proper session management

#### Payment Processing
- Never store payment credentials
- Use bKash official APIs only
- Implement proper error handling
- Log all payment transactions

#### VPN Security
- Verify actual IP changes
- Test for DNS leaks
- Implement kill switch functionality
- Use secure VPN protocols

### 📱 Mobile Development (Flutter)

#### Code Structure
```dart
// Good structure
class VpnProvider extends ChangeNotifier {
  VpnStatus _status = VpnStatus.disconnected;
  
  VpnStatus get status => _status;
  
  Future<void> connect(VpnServer server) async {
    // Implementation
  }
}
```

#### State Management
- Use Provider for state management
- Keep state immutable where possible
- Implement proper error handling
- Use async/await for asynchronous operations

## 🔄 Contribution Workflow

### 1. Create a Branch
```bash
# Create and switch to feature branch
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Changes
- Write clean, documented code
- Follow the style guidelines
- Add tests for new features
- Update documentation if needed

### 3. Test Your Changes
```bash
# Run all tests
npm test

# Test specific features
npm run test:auth
npm run test:payment
npm run test:vpn

# Check code coverage
npm run coverage
```

### 4. Commit Changes
```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add bKash payment integration

- Implement payment gateway connection
- Add payment verification
- Include Bengali payment interface
- Add error handling for failed payments"
```

#### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### 5. Push and Create PR
```bash
# Push to your fork
git push origin feature/amazing-feature

# Create Pull Request on GitHub
# Include detailed description
# Reference related issues
# Add screenshots if UI changes
```

## 🧪 Testing Guidelines

### Unit Tests
```javascript
// Example test
describe('Gmail Validation', () => {
  test('should accept valid Gmail address', () => {
    expect(validateGmailAddress('user@gmail.com')).toBe(true);
  });
  
  test('should reject non-Gmail address', () => {
    expect(validateGmailAddress('user@yahoo.com')).toBe(false);
  });
});
```

### Integration Tests
- Test complete user flows
- Test payment processing
- Test VPN connectivity
- Test authentication flows

### Manual Testing
- Test on multiple browsers
- Test on mobile devices
- Test with different network conditions
- Test payment flows with test accounts

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for all functions
- Document complex algorithms
- Include usage examples
- Keep documentation up to date

### User Documentation
- Write in Bengali for user guides
- Include screenshots and videos
- Provide step-by-step instructions
- Cover common troubleshooting

### API Documentation
- Document all API endpoints
- Include request/response examples
- Document error codes
- Provide authentication details

## 🎯 Feature Development Process

### 1. Planning Phase
- Discuss feature in GitHub Issues
- Get approval from maintainers
- Create detailed implementation plan
- Consider security implications

### 2. Implementation Phase
- Follow coding guidelines
- Write tests alongside code
- Update documentation
- Consider performance impact

### 3. Review Phase
- Self-review your code
- Test thoroughly
- Update CHANGELOG.md
- Request code review

### 4. Deployment Phase
- Merge after approval
- Monitor for issues
- Update version numbers
- Deploy to production

## 🚨 Security Considerations

### Reporting Security Issues
- **DO NOT** create public issues for security vulnerabilities
- Email security issues to: ayounus358cc@gmail.com
- Include detailed description and steps to reproduce
- Allow time for fix before public disclosure

### Security Checklist
- [ ] Input validation implemented
- [ ] Authentication properly secured
- [ ] Payment data encrypted
- [ ] VPN connections verified
- [ ] No sensitive data in logs
- [ ] HTTPS enforced everywhere

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **Email**: ayounus358cc@gmail.com
- **Response Time**: Within 24 hours for urgent issues

### Before Asking for Help
1. Check existing documentation
2. Search through GitHub Issues
3. Try debugging yourself
4. Prepare minimal reproduction case

### When Asking for Help
- Provide clear problem description
- Include relevant code snippets
- Share error messages
- Mention your environment details

## 🏆 Recognition

### Contributors
All contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation
- Invited to maintainer team (for significant contributions)

### Types of Recognition
- **Code Contributors**: Direct code contributions
- **Documentation Contributors**: Improve docs and guides
- **Bug Reporters**: Find and report issues
- **Feature Requesters**: Suggest valuable features
- **Community Helpers**: Help other users

## 📋 Checklist for Pull Requests

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] No merge conflicts
- [ ] Commits are clean and descriptive

### PR Description Should Include
- [ ] Clear description of changes
- [ ] Motivation for the changes
- [ ] Screenshots (for UI changes)
- [ ] Testing instructions
- [ ] Related issue references

### After Submitting
- [ ] Respond to review feedback
- [ ] Make requested changes
- [ ] Keep PR up to date with main branch
- [ ] Be patient during review process

## 🎉 Thank You!

আপনার অবদানের জন্য ধন্যবাদ! আপনার প্রতিটি contribution BD VPN Pro কে আরও ভালো করে তোলে।

**"একসাথে আমরা বাংলাদেশের জন্য সেরা VPN তৈরি করব!"**

---

**Made with ❤️ in Bangladesh 🇧🇩**