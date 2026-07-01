# Smart Parking

Complete parking management system — mobile app for drivers/agents, web dashboard for owners.

🔗 Web Admin: https://smart-parking-admin-green.vercel.app/
📱 Mobile app available for download on the web admin page

## Stack

- React Native + Expo (mobile)
- Expo Router
- Supabase (PostgreSQL + Auth + Storage)
- TanStack Query
- Zustand
- Stripe (payments)
- Groq (AI chatbot support)
- i18n / react-i18next
- Expo Location, Camera, QRCode

## Features

- Real-time vehicle and parking lot tracking
- Multiple parking lot types with size limits (width, height, length)
- Reservations with status tracking and QR-based check-in
- Payments via Stripe with transaction and payment status
- Subscription plans for owners with billing cycle
- Multi-agent support per parking lot
- Vehicle maintenance history
- AI chatbot support powered by Groq for booking assistance
- In-app messaging between users
- Push notifications
- Reviews and ratings per parking lot
- Bank account management for owners

## Data Model

- **profiles** — base user, linked to Supabase auth, has roles (driver, owner, agent)
- **vehicles** — owned by a driver, with dimensions for lot matching
- **vehicle_maintenances** — maintenance history per vehicle
- **lot_types** — vehicle type categories with max dimensions
- **parking_lots** — owned by a profile, has type, spots, price, location and agents
- **reservations** — links driver, vehicle and lot with start/end time and status
- **payments** — linked to a reservation, tracks amount, method and status
- **bank_accounts** — payout account per owner
- **subscription_plans** — available plans with features
- **subscriptions** — active plan per owner
- **notifications** — targeted per profile
- **conversations** / **messages** — direct messaging between profiles
- **reviews** — rating and feedback per lot, by a user
