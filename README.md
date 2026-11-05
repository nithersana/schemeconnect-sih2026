# 🇮🇳 JanSetu AI — SchemeConnect DPI Engine (SIH 2026)

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel)](https://schemeconnect-sih2026.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%206-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

An AI-driven Digital Public Infrastructure (DPI) platform built for **Smart India Hackathon (SIH 2026)** to streamline discoverability, automated verification, and frictionless disbursement of government welfare schemes for Indian citizens.

---

## 🌐 Live Deployments

| Portal | URL | Description |
|---|---|---|
| **JanSetu Citizen Portal** | [schemeconnect-sih2026.vercel.app](https://schemeconnect-sih2026.vercel.app/) | Citizen-facing AI counselor, dynamic scheme recommendations, OCR document verification, and digital application pass. |
| **Beta Banking Portal** | [schemeconnect-sih2026.vercel.app/beta.html](https://schemeconnect-sih2026.vercel.app/beta.html) | Secure banking interface for real-time beneficiary token validation and direct benefit transfer (DBT) verification. |
| **Alpha Gazette & Console** | [schemeconnect-sih2026.vercel.app/alpha.html](https://schemeconnect-sih2026.vercel.app/alpha.html) | Official gazette publisher console, policy ingestion, scheme lifecycle management, and analytics dashboard. |

---

## ✨ Key Features

- 🎙️ **Multilingual Voice Intake & AI Counselor**: Conversational intake supporting vernacular languages with speech recognition and contextual query parsing.
- 📄 **On-Device Document OCR**: Instant parsing and client-side extraction of Aadhaar, PAN, and Income Certificates using Tesseract.js.
- 🎯 **Algorithmic Eligibility Matcher**: Evaluates demographic, socioeconomic, and occupation criteria to surface relevant central and state schemes.
- 🔐 **Cryptographic Digital Application Pass**: Generates verifiable tokens and QR codes for seamless offline/online counter verification.
- 🏦 **Triple-Portal Architecture**: Seamless real-time state synchronization across Citizen, Banking (Beta), and Administrative (Alpha) workflows.
- 📊 **Interactive Financial Calculator**: Dynamic subsidy estimations, interest subvention forecasts, and credit calculation tools.

---

## 🛠️ Tech Stack

- **Framework**: React 18, Vite 6
- **Styling**: Tailwind CSS, PostCSS, Framer Motion
- **Icons & UI Utilities**: Lucide React, Canvas Confetti
- **Document Processing**: Tesseract.js (Client-side OCR)
- **State & Real-time**: Supabase Realtime / LocalStore Sync, JWT Decode
- **Hosting & CI/CD**: Vercel

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nithersana/schemeconnect-sih2026.git
   cd schemeconnect-sih2026
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   - Main Citizen Portal: `http://localhost:5173/`
   - Beta Banking Portal: `http://localhost:5173/beta.html`
   - Alpha Console: `http://localhost:5173/alpha.html`

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
├── index.html               # Main Citizen Portal Entry
├── beta.html                # Beta Banking Portal Entry
├── alpha.html               # Alpha Admin/Gazette Portal Entry
├── vercel.json              # Vercel Routing Configuration
├── vite.config.js           # Multi-page Vite Build Configuration
├── tailwind.config.js       # Custom Design System & Theme
├── src/
│   ├── components/          # Reusable UI & Business Logic Components
│   │   ├── AiCounselorChat.jsx
│   │   ├── AlphaPortalConsole.jsx
│   │   ├── BetaPortalBank.jsx
│   │   ├── DocumentOCR.jsx
│   │   ├── FinancialCalculator.jsx
│   │   ├── LandingPage.jsx
│   │   ├── RecommendationsGridPage.jsx
│   │   └── VoiceIntake.jsx
│   ├── config/              # Portal configurations
│   ├── data/                # Scheme catalogs, gazettes, and translations
│   └── utils/               # Matching algorithms, OCR, and JWT utilities
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
