# ProposifyAI

A production-ready SaaS application for AI-powered proposal and contract generation.

## Features

- **User Authentication**: Secure signup/login with JWT
- **Project Management**: Create and manage client projects
- **AI Proposal Generator**: Generate professional proposals using OpenAI
- **AI Contract Generator**: Create contracts with country-specific clauses
- **PDF Export**: Download proposals and contracts as PDF
- **Subscription Plans**: Free trial + Premium/Enterprise plans with Stripe
- **Responsive UI**: Clean, modern design suitable for global users

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- OpenAI API
- Stripe Payments
- PDFKit for PDF generation

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- OpenAI API key
- Stripe account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd proposifyai
```

2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/proposifyai
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=your_openai_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
STRIPE_PREMIUM_PRICE_ID=your_premium_price_id_here
STRIPE_ENTERPRISE_PRICE_ID=your_enterprise_price_id_here
FRONTEND_URL=http://localhost:3000
PORT=5000
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Proposals
- `POST /api/proposals/generate` - Generate AI proposal
- `GET /api/proposals/:id` - Get proposal
- `PUT /api/proposals/:id` - Update proposal
- `GET /api/proposals/:id/download` - Download PDF

### Contracts
- `POST /api/contracts/generate` - Generate AI contract
- `GET /api/contracts/:id` - Get contract
- `PUT /api/contracts/:id` - Update contract
- `GET /api/contracts/:id/download` - Download PDF

### Payments
- `POST /api/payments/create-subscription` - Create Stripe subscription
- `POST /api/payments/webhook` - Stripe webhook

## Project Structure

```
proposifyai/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
