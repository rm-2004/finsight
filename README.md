# FinSight India — Personal Finance Tracker

A full-stack personal finance app for Indian users. Tracks income, expenses, credit, savings, investments, goals and budgets with AI-powered insights.

## Tech Stack

**Server:** Node.js (ESM), Express, MongoDB (Mongoose), JWT auth, OTP via email, Groq AI  
**Client:** React 18, Vite, Recharts, React Router v6, plain CSS

## Features

- OTP-based login (email verification on every login)
- Auto salary income insertion on 1st of each month
- Pause/resume/delete salary per month
- Transaction types: Expense, Income, Credit, Savings
- Running monthly balance with carry-forward savings pool
- Budget tracking per category with overspend alerts
- Investment portfolio (mutual funds, stocks, FD, PPF, NPS, gold)
- Savings goals with progress and contributions
- Analytics with Power BI-style cross-filtering
- AI financial advisor with full transaction context
- Weekly AI-generated spending report
- Bank statement import (PDF, Excel, CSV)
- Dark / light theme

## Environment Variables

### Server (`server/.env`)

```
PORT=3001
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/finsight
JWT_SECRET=your-very-long-random-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=gsk_...
```

### Client (`client/.env`)

```
VITE_API_URL=http://localhost:5001
```

No client env is needed if using Vite proxy (default dev setup).

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with App Password enabled for OTP emails
- Groq API key (free at console.groq.com) for AI features

### Setup

```bash
# 1. Install dependencies
cd fs
npm run setup

# 2. Configure server environment
cp server/.env.example server/.env
# Edit server/.env with your values

# 3. Start development servers (both client and server)
npm run dev
```

The server runs on `http://localhost:5001` and the client on `http://localhost:5173`.


## Project Structure

```
fs/
├── server/                  Express API
│   ├── controllers/         Route handlers
│   │   ├── auth.js          Signup, login, OTP, profile
│   │   ├── tx.js            Transactions, overview, charts
│   │   ├── budget.js        Budget CRUD
│   │   ├── investment.js    Investment CRUD + portfolio
│   │   ├── goal.js          Goal CRUD + contributions
│   │   ├── ai.js            Chat + tips + AI context
│   │   ├── reports.js       Weekly AI report
│   │   └── imp.js           Bank statement import
│   ├── models/              Mongoose schemas
│   │   ├── User.js
│   │   ├── Tx.js
│   │   ├── Budget.js
│   │   ├── Investment.js
│   │   └── Goal.js
│   ├── routes/              Express routers
│   ├── middleware/          JWT guard
│   ├── utils/               JWT, mailer, Groq, salary logic, category auto-detect
│   ├── app.js               Express app setup
│   ├── index.js             Server entry point
│   └── package.json
│
├── client/                  React frontend
│   ├── src/
│   │   ├── pages/           Dashboard, Tx, Add, Charts, Budgets, Investments, Goals, Advisor, Reports, Profile, Auth
│   │   ├── components/      Shell (layout), Toast
│   │   ├── context/         Auth context (user, theme, logout)
│   │   ├── services/        Axios API client
│   │   ├── utils/           Formatters, categories, colour maps
│   │   ├── App.jsx          Router
│   │   ├── main.jsx         Entry point
│   │   └── app.css          Global styles + CSS variables
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens expire in 7 days
- OTP required on every login (10-minute expiry, 5-attempt lockout)
- Rate limiting on all API routes (30/15min on auth, 20/min on AI)
- MongoDB injection protection via express-mongo-sanitize
- Helmet.js security headers
- Future dates blocked on all transactions (server-side)
- All localStorage keys are user-scoped to prevent cross-account data leakage
