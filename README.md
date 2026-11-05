# PrepD2D (PrepDSE) 🎓🚀

> **Empowering Diploma Engineering Students to Conquer Direct Second Year (DSE) Admissions and Academics.**

[![Expo](https://img.shields.io/badge/Expo-v54.0-000020.svg?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-v0.81-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](#license)

---

## 📖 About PrepD2D

**PrepD2D** (also known as **PrepDSE**) is a dedicated, comprehensive mobile platform built specifically for Polytechnic Diploma engineering students transitioning to B.E. / B.Tech degree programs via lateral entry (Direct Second Year — DSE). 

Securing a seat in top engineering colleges through the Centralized Admission Process (CAP) can be overwhelming due to complex cutoff percentiles, category quotas, branch shifts, and scattered resources. **PrepD2D** bridges this information and preparation gap by equipping students with smart data-driven tools, transparent cutoff analytics, a personalized CAP Option Form builder, and curated academic preparation materials—all in one unified mobile app.

Whether you are estimating your chances of landing a dream college, formulating an optimal CAP option form, practicing previous year questions with mathematical notation, or seeking instant guidance through an AI assistant, PrepD2D streamlines the entire diploma-to-degree transition.

---

## ✨ Key Features

### 🏛️ College & Branch Discovery
- **Comprehensive Institute Directory:** Explore top engineering institutes with up-to-date information on intake capacity, tuition fees, branch offerings, and campus details.
- **Historical Cutoff Trends:** Search and filter historical cutoff percentiles across diverse reservation categories (GOPENS, GOBCO, GSCS, GSTS, TFWS, EWS, etc.).
- **Side-by-Side College Comparison:** Compare multiple colleges and branches simultaneously to evaluate cutoffs, facilities, and placements before locking preferences.

### 📋 Smart CAP Option Form Generator
- **Personalized List Builder:** Generate customized, risk-balanced college option lists tailored to your diploma percentage and category.
- **Preference Optimization:** Categorize colleges into Dream, Realistic, and Safe choices to maximize your chances of allotment in CAP Rounds 1, 2, and 3.
- **Export & Saved Lists:** Save, manage, reorder, and export your preference lists for easy reference during the official DTE/CET Cell option form filling.

### 📊 Predictors & Estimators
- **Rank from Percentage Estimator:** Estimate your probable state general merit rank based on diploma marks and previous years' merit patterns.
- **Dream College Predictor:** Assess your probability of admission into top target colleges with intuitive analytics.

### 🧭 Admission Process Guide & Timelines
- **Step-by-Step CAP Guidance:** Detailed walkthroughs explaining registration, document verification at Scrutiny/FC Centers, grievance submission, seat acceptance, and Freeze/Float strategies.
- **Live Timelines & Alerts:** Stay synchronized with official DTE Maharashtra / CET Cell announcements, deadlines, circulars, and merit list releases.

### 📚 Exam Preparation & Study Bank
- **Previous Year Questions (PYQs):** Access subject-wise and chapter-wise question banks with difficulty tagging and frequently repeated questions.
- **Math Formula & LaTeX Rendering:** Powered by KaTeX and MathJax SVG engines to render engineering equations and mathematical formulas with high precision.
- **Interactive Mock Tests:** Practice with timed assessments, detailed solution sets, and comprehensive performance analysis.
- **Revision Notes & Syllabus:** High-yield notes, formula sheets, and updated syllabus breakdowns.

### 🤖 AI-Powered Assistant & Real-Time Support
- **AI Chatbot:** Receive answers to admission queries, eligibility questions, and study doubts.
- **In-App Help & FAQs:** Quick answers to frequent questions about document requirements, reservations, and fee concessions.

---

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo SDK 54](https://expo.dev/)
- **Routing:** [Expo Router v6](https://docs.expo.dev/router/introduction/) (file-based navigation with typed routes)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling:** Expo Linear Gradient, React Native Paper, React Native Reanimated, Heroicons, Solar Icon Set
- **Backend & Authentication:** Supabase JS Client, REST API backend
- **Math Rendering:** KaTeX, React Native Math View, React Native MathJax SVG, Markdown-it
- **Payments:** Razorpay React Native SDK
- **Storage & Security:** Expo SecureStore, AsyncStorage, Expo Screen Capture protection

---

## 📁 Project Structure

```text
prepdse/
├── app/                          # Expo Router file-based route definitions
│   ├── (auth)/                   # Authentication routes (login, register, forgot password)
│   ├── (colleges)/               # College directory, branch details, comparisons
│   ├── (create-college-list)/    # College list maker and selection screens
│   ├── (estimator)/              # Rank and cutoff estimators
│   ├── (preparation)/            # Notes, syllabus, chapters, PYQ viewers
│   ├── (start-mock-test)/        # Mock test exam interface and guidelines
│   ├── (result)/                 # Test evaluation and result screens
│   ├── (ai-chat)/                # AI assistant chat interface
│   ├── _layout.tsx               # Root application layout and providers
│   └── index.tsx                 # Entry and onboarding splash screen
├── features/                     # Feature modules with business logic and UI
│   ├── OptionForm/               # CAP option form generation and saved lists
│   ├── colleges/                 # College search, branch details, comparisons
│   ├── preparation/              # PYQs, notes, syllabus, and PDF viewer
│   ├── mocktest/                 # Test engine, timer, and question evaluation
│   ├── admissionProcess/         # CAP timeline, step-by-step admission guide
│   ├── estimator/                # Percentage-to-rank estimator
│   ├── DreamCollege/             # College probability predictor
│   ├── aiChat/                   # AI chat interface
│   ├── auth/                     # Authentication screens
│   └── home/                     # Home dashboard with news feed & quick access
├── components/                   # Reusable UI components (headers, cards, buttons)
├── context/                      # React contexts (AuthContext, PYQContext)
├── hooks/                        # Custom hooks (screen capture, news, navigation)
├── constants/                    # Theme colors, styling constants, configurations
├── assets/                       # Fonts, icons, and image assets
├── app.config.js                 # Dynamic Expo configuration and build settings
└── package.json                  # Dependencies and build scripts
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your mobile device (Android/iOS) or an emulator / simulator
- [EAS CLI](https://docs.expo.dev/build/introduction/) (optional, for standalone native builds)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ojasz-borse/prepd2D.git
   cd prepd2D
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SERVER_URL=https://prep-academy-api.vercel.app
   SERVER_URL=https://prep-academy-api.vercel.app
   RAZORPAY_KEY=your_razorpay_key_here
   ```

4. **Start the development server:**
   ```bash
   npx expo start
   ```

5. **Run on a device or emulator:**
   - Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).
   - Press `a` in the terminal to run on an Android emulator.
   - Press `i` in the terminal to run on an iOS simulator.
   - Press `w` in the terminal to run in the web browser.

---

## 📦 Building Standalone Binaries (EAS Build)

To build native Android (`.apk` or `.aab`) and iOS (`.ipa`) packages using Expo Application Services (EAS):

1. **Install EAS CLI and log in:**
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Configure project:**
   ```bash
   eas build:configure
   ```

3. **Build Android APK (Preview/Testing):**
   ```bash
   eas build -p android --profile preview
   ```

4. **Build Android Production App Bundle (Play Store):**
   ```bash
   eas build -p android --profile production
   ```

---

## 🛡️ License

This project is licensed under the ISC License. See the [package.json](package.json) file for details.
