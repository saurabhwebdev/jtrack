# JTrack - Job Application Tracking System

![JTrack Logo](public/jtrack-logo.png)

## 🚀 Overview

JTrack is a modern, feature-rich job application tracking system built with React, TypeScript, and Chakra UI. It helps job seekers efficiently manage their job search process by tracking applications, interviews, referrals, and providing insightful analytics.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white)](https://chakra-ui.com/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)

## ✨ Features

### 📝 Application Management
- Track job applications with detailed information
- Monitor application status and progress
- Store job descriptions, salary information, and company details
- Add notes and next steps for each application

### 📅 Interview Tracking
- Schedule and manage interviews
- Track different interview rounds
- Record interviewer details and feedback
- Set reminders for upcoming interviews

### 👥 Referral Management
- Manage professional referrals
- Track referral status
- Store referrer contact information
- Add notes about referral conversations

### 📊 Analytics Dashboard
- Visual representation of application statistics
- Track success rates and application sources
- Analyze salary ranges and trends
- Monitor interview performance

### 🔔 Notifications
- Get alerts for upcoming interviews
- Receive reminders for follow-ups
- Stay updated on application status changes

### ⚙️ User Settings
- Customize profile information
- Set notification preferences
- Manage display settings
- Configure privacy options

## 🛠️ Technology Stack

- **Frontend Framework**: React with TypeScript
- **UI Library**: Chakra UI
- **State Management**: Zustand
- **Backend & Auth**: Supabase
- **Charts**: Recharts
- **Routing**: React Router
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/saurabhwebdev/jtrack.git
cd jtrack
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication related components
│   ├── dashboard/      # Dashboard components
│   ├── applications/   # Job application components
│   ├── interviews/     # Interview tracking components
│   └── common/         # Shared components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── services/           # API and external services
│   └── supabase/       # Supabase related services
├── store/              # Zustand store definitions
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── constants/          # Application constants
```

## 🔐 Authentication

JTrack uses Supabase for authentication and data storage. The following features are implemented:

- Email/Password authentication
- Protected routes
- Session management
- Row Level Security (RLS)

## 📊 Database Schema

The application uses the following main tables:

- `applications` - Stores job application details
- `interviews` - Tracks interview information
- `referrals` - Manages referral data
- `profiles` - User profile information

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Dark/Light mode support
- Customizable font sizes
- Intuitive navigation
- Modern and clean interface
- Consistent styling using Chakra UI

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Saurabh Kumar**
- GitHub: [@saurabhwebdev](https://github.com/saurabhwebdev)

## 🙏 Acknowledgments

- [Chakra UI](https://chakra-ui.com/) for the amazing component library
- [Supabase](https://supabase.io/) for the backend infrastructure
- [Recharts](https://recharts.org/) for the charting library
- All contributors and supporters of the project
