# BD VPN Pro - Professional VPN Application

🇧🇩 **বাংলাদেশের জন্য তৈরি প্রিমিয়াম VPN অ্যাপ্লিকেশন**

## 🌟 নতুন ফিচারসমূহ (Latest Updates)

### 🔐 **Firebase Gmail Authentication**
- Gmail-only registration এবং login
- Email verification system
- Real-time validation
- Bengali language support
- Password strength meter

### 💳 **bKash Payment Integration**
- Premium subscription upgrade
- Secure bKash payment gateway
- Real-time payment verification
- Transaction history
- Bengali payment interface

### 🆘 **Enhanced Help & Support**
- Comprehensive Bengali support system
- FAQ section with common issues
- Direct email contact integration
- Support ticket system
- Real-time assistance

### 🔧 **Advanced VPN Features**
- Enhanced connectivity testing
- Real-time server monitoring
- IP change verification
- DNS leak protection
- Connection speed testing

## 🚀 **Key Features**

### **Authentication System**
- ✅ Gmail-only registration
- ✅ Email verification with Firebase
- ✅ Secure password requirements
- ✅ Bengali interface
- ✅ Auto-verification checking

### **VPN Connectivity**
- ✅ Free & Premium servers
- ✅ Bangladesh, Singapore, India, US, UK, Japan
- ✅ Real-time connectivity testing
- ✅ Server load monitoring
- ✅ Ping testing
- ✅ Auto-server selection

### **Premium Features**
- ✅ bKash payment integration
- ✅ 10x faster speeds
- ✅ Premium server access
- ✅ Enhanced security protocols
- ✅ Priority support
- ✅ Ad-free experience

### **User Experience**
- ✅ Responsive design
- ✅ Dark/Light theme
- ✅ Bengali language support
- ✅ Real-time notifications
- ✅ Connection statistics
- ✅ User-friendly interface

## 🛠️ **Technology Stack**

### **Frontend**
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design with CSS Grid/Flexbox
- Font Awesome icons
- Google Fonts (Poppins)

### **Backend Services**
- Firebase Authentication
- Firebase Hosting
- bKash Payment Gateway
- Real-time connectivity testing

### **Mobile Development**
- Flutter framework
- Provider state management
- Material Design
- Cross-platform compatibility

## 📱 **Installation & Setup**

### **Web Application**
```bash
# Clone the repository
git clone https://github.com/yourusername/bd-vpn-pro.git

# Navigate to project directory
cd bd-vpn-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Firebase Setup**
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password
3. Update `src/js/firebase-config.js` with your config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### **bKash Integration**
1. Contact bKash for merchant account
2. Update merchant number in `src/js/bkash-payment.js`
3. Configure payment endpoints for production

### **Flutter Mobile App**
```bash
# Install Flutter dependencies
flutter pub get

# Run on Android
flutter run android

# Run on iOS
flutter run ios

# Build APK
flutter build apk --release
```

## 🔧 **Configuration**

### **Environment Variables**
Create a `.env` file in the root directory:
```env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
BKASH_MERCHANT_NUMBER=01924206385
SUPPORT_EMAIL=ayounus358cc@gmail.com
```

### **Server Configuration**
Update server endpoints in `src/js/connectivity-tester.js`:
```javascript
this.realIPEndpoints = [
  'https://api.ipify.org?format=json',
  'https://ipapi.co/json/',
  'https://httpbin.org/ip'
];
```

## 📖 **Usage Guide**

### **For Users**
1. **Registration**: Visit `firebase-auth.html` and sign up with Gmail
2. **Email Verification**: Check Gmail inbox and verify email
3. **Login**: Use verified Gmail credentials to login
4. **VPN Connection**: Select server and connect
5. **Premium Upgrade**: Use bKash payment for premium features

### **For Developers**
1. **Authentication**: Use Firebase Auth for user management
2. **Payment Processing**: Integrate bKash for premium subscriptions
3. **VPN Logic**: Implement OpenVPN or WireGuard protocols
4. **Server Management**: Monitor and maintain VPN servers

## 🔒 **Security Features**

- ✅ Firebase Authentication security
- ✅ Email verification required
- ✅ Secure password requirements
- ✅ bKash payment encryption
- ✅ VPN connection verification
- ✅ DNS leak protection
- ✅ IP masking verification

## 🌐 **Supported Platforms**

### **Web Browsers**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### **Mobile Platforms**
- Android 6.0+ (API 23+)
- iOS 11.0+

## 📞 **Support & Contact**

### **Technical Support**
- **Email**: ayounus358cc@gmail.com
- **Developer**: Younus Ali
- **Location**: Bangladesh
- **Service**: Free VPN App Developer & Support Provider

### **Response Time**
- Emergency issues: Within 24 hours
- General inquiries: 1-3 business days
- Feature requests: 1 week

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow Bengali language standards for UI text
- Maintain responsive design principles
- Test on multiple devices and browsers
- Document all new features
- Follow security best practices

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Firebase for authentication services
- bKash for payment gateway
- Font Awesome for icons
- Google Fonts for typography
- Flutter team for mobile framework

## 📊 **Project Statistics**

- **Total Files**: 25+
- **Lines of Code**: 5000+
- **Languages**: JavaScript, Dart, HTML, CSS
- **Frameworks**: Firebase, Flutter, bKash API
- **Supported Languages**: Bengali, English

## 🔄 **Version History**

### **v2.0.0** (Latest)
- ✅ Firebase Gmail authentication
- ✅ bKash payment integration
- ✅ Enhanced help & support system
- ✅ Advanced connectivity testing
- ✅ Bengali language support

### **v1.0.0**
- ✅ Basic VPN functionality
- ✅ Server selection
- ✅ Connection statistics
- ✅ Theme switching

## 🚀 **Deployment**

### **Web Deployment**
```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

### **Mobile App Release**
```bash
# Build Android APK
flutter build apk --release

# Build iOS IPA
flutter build ios --release
```

---

**Made with ❤️ in Bangladesh 🇧🇩**

**"আপনি আছেন, আমরা পাশে আছি।"**