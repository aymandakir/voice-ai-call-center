# Voice AI Call Center SaaS

A full-stack SaaS application for building and managing AI-powered voice call centers. Built with Next.js, Supabase, Stripe, and a flexible voice provider abstraction layer.

## 🚀 Features

- **Multi-tenant Architecture**: Organizations and workspaces with row-level security and perfect data isolation via `ORG_ID` filtering
- **AI Voice Agents**: Create and configure intelligent voice agents with custom personalities and instructions
- **Call Management**: Handle inbound and outbound calls with real-time logging and transcripts
- **Analytics Dashboard**: Track call volume, duration, outcomes, and agent performance
- **Stripe Integration**: Subscription management with usage-based billing
- **Voice Provider Abstraction**: Easy to integrate with any voice provider (Vapi, Retell, etc.)
- **Apple-inspired UI**: Beautiful, responsive design with smooth animations and micro-interactions

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **UI**: React 19, Tailwind CSS 4
- **Charts**: Recharts
- **Validation**: Zod
- **TypeScript**: Strict mode

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Stripe account (for payments)
- (Optional) Voice provider account (Vapi, Retell, etc.)

## 🏗️ Architecture

### Database Schema

The application uses the following main tables:

- `organizations` - Multi-tenant workspaces
- `profiles` - User profiles (extends Supabase auth.users)
- `organization_members` - Many-to-many relationship between users and organizations
- `agents` - AI voice agent configurations
- `phone_numbers` - Connected phone numbers
- `calls` - Call records with transcripts and summaries
- `call_events` - Detailed call event timeline
- `subscriptions` - Stripe subscription records
- `usage_records` - Usage tracking for metered billing

All tables have Row Level Security (RLS) policies for multi-tenant isolation.

### Voice Provider Abstraction

The application includes a flexible abstraction layer for voice providers:

- `src/lib/voice/provider.ts` - Provider factory
- `src/lib/voice/mock-provider.ts` - Mock provider for development
- `src/lib/voice/types.ts` - Type definitions

To add a new provider, implement the `VoiceProvider` interface and update the factory.

## 🚦 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd voice-ai-call-center
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Get your project URL and anon key from Project Settings > API

### 3. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create products and prices for Starter and Pro plans
3. Set up a webhook endpoint: `https://your-domain.com/api/stripe/webhook`
4. Get your webhook secret from the Stripe dashboard

### 4. Configure Environment Variables

Create `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dekupatxeglqacsrqlew.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRla3VwYXR4ZWdscWFjc3JxbGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNDMwNDMsImV4cCI6MjA4MTYxOTA0M30.7y0y08CwKq4kGyBTRqK7g2m-bMFr2zzIhuLU7lCbAdI
SUPABASE_ORG_ID=voice-demo
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_STARTER_PRICE_ID=your_starter_price_id
STRIPE_PRO_PRICE_ID=your_pro_price_id
```

**Important**: For multi-tenant isolation, all queries and inserts use `SUPABASE_ORG_ID=voice-demo` to ensure perfect data isolation in the shared Supabase instance.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   │   ├── stripe/         # Stripe webhooks and checkout
│   │   ├── webhooks/       # Voice provider webhooks
│   │   └── calls/          # Call management APIs
│   ├── dashboard/          # Dashboard pages
│   │   ├── agents/         # Agent management
│   │   ├── calls/          # Call logs and details
│   │   ├── analytics/      # Analytics dashboard
│   │   └── settings/      # Settings and billing
│   ├── login/              # Auth pages
│   ├── signup/
│   └── reset-password/
├── components/             # React components
│   ├── ui/                 # Reusable UI components
│   └── dashboard/          # Dashboard-specific components
├── lib/                    # Utility libraries
│   ├── supabase/           # Supabase client and auth
│   ├── stripe/              # Stripe integration
│   ├── voice/               # Voice provider abstraction
│   ├── types/               # TypeScript types
│   └── schemas/             # Zod validation schemas
└── supabase/               # Database schema SQL
```

## 🔐 Authentication & Authorization

- Users sign up and create an organization automatically
- Organization members have roles: `owner`, `admin`, or `member`
- RLS policies enforce multi-tenant isolation
- All database queries are scoped to the user's organizations

## 💳 Stripe Integration

### Plans

- **Starter**: $29/month - 500 calls, 1,000 minutes, 3 agents
- **Pro**: $99/month - 5,000 calls, 10,000 minutes, 20 agents

### Webhook Events Handled

- `checkout.session.completed` - Create subscription
- `customer.subscription.updated` - Update subscription
- `customer.subscription.deleted` - Cancel subscription
- `invoice.payment_succeeded` - Handle successful payment
- `invoice.payment_failed` - Handle failed payment

## 📞 Voice Provider Integration

### Mock Provider (Development)

The mock provider simulates call events for development. No real calls are made.

### Adding a Real Provider

1. Create a new provider class implementing `VoiceProvider` interface
2. Update `src/lib/voice/provider.ts` to include your provider
3. Set `VOICE_PROVIDER` environment variable
4. Configure webhook endpoint in provider dashboard

### Webhook Endpoint

Voice providers should send events to:
```
POST /api/webhooks/voice
```

Supported events:
- `call-started` / `call.initiated`
- `call-ringing` / `call.ringing`
- `call-connected` / `call.connected`
- `call-ended` / `call.ended`
- `transcript` / `call.transcript`
- `call-summary` / `call.summary`

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase Setup

1. Run migrations in Supabase SQL editor
2. Configure RLS policies
3. Set up database functions and triggers

### Stripe Webhook Setup

1. Create webhook endpoint in Stripe dashboard
2. Point to: `https://your-domain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
4. Copy webhook secret to environment variables

## 📊 Usage Tracking

The application tracks usage for:
- Calls (per call)
- Minutes (per minute)

Usage records are created automatically when calls end and can be synced to Stripe for metered billing.

## 🔒 Security

- Row Level Security (RLS) on all tables
- Multi-tenant data isolation
- Secure API routes with authentication checks
- Environment variables for sensitive data
- Stripe webhook signature verification

## 🧪 Development

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License

## 🆘 Support

For issues and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

## 🎯 Roadmap

- [ ] Real-time call monitoring
- [ ] Advanced analytics and reporting
- [ ] Custom voice models
- [ ] Multi-language support improvements
- [ ] API for third-party integrations
- [ ] Mobile app
- [ ] Call recording playback
- [ ] Sentiment analysis

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Stripe](https://stripe.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
