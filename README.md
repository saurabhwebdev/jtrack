# JTrackk - Job Application Tracker

![JTrackk Logo](public/logo.png)

## 📌 Overview

JTrackk is a modern web application designed to help job seekers efficiently track and manage their job applications. Built with React and Firebase, it provides a user-friendly interface to organize job applications, track their status, and manage the overall job search process.

## ✨ Features

- **User Authentication**: Secure login and registration using Firebase Authentication
- **Job Application Management**: Add, edit, and delete job applications
- **Status Tracking**: Track the status of each application (Applied, Interviewing, Offered, Rejected, Accepted)
- **Dashboard Views**: Toggle between list and card views for your job applications
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices
- **Search & Filter**: Easily find specific job applications
- **Data Visualization**: View statistics about your job search progress
- **Custom Modals**: User-friendly confirmation dialogs for important actions

## 🚀 Technologies Used

- **Frontend**: React, Vite, Ant Design, CSS
- **Backend**: Firebase (Authentication, Firestore)
- **State Management**: React Context API
- **Routing**: React Router
- **Deployment**: Firebase Hosting

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Firebase account

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/saurabhwebdev/jtrackk.git
   cd jtrackk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Usage

1. **Register/Login**: Create an account or log in with existing credentials
2. **Add Job Applications**: Click "Add New Job" to create a new job application entry
3. **Track Status**: Update the status of your applications as you progress through the hiring process
4. **View Statistics**: Check your dashboard for an overview of your job search progress
5. **Manage Applications**: Edit or delete applications as needed

## 📊 Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up security rules for your Firestore database
5. Register your web app and get your Firebase configuration
6. Add the configuration to your environment variables

## 🔒 Security

- Authentication is handled securely through Firebase
- Firestore security rules ensure users can only access their own data
- Sensitive information is never exposed in the client-side code

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

- **Saurabh** - [saurabhwebdev](https://github.com/saurabhwebdev)

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [Ant Design](https://ant.design/)
- [React Router](https://reactrouter.com/)
