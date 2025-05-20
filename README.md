# Event Ticket Issuer

_A Firebase-powered service to issue, manage, and update event tickets for Google Wallet and Apple Wallet._

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Email Ticket Endpoint](#email-ticket-endpoint)
  - [Booth Visited Update Endpoint](#booth-visited-update-endpoint)
  - [Apple Wallet Pass Service](#apple-wallet-pass-service)
- [Services](#services)
- [License](#license)

## Features

- **Email Tickets**: Send transactional ticket emails with an HTML template incorporating QR codes and "Add to Google Wallet" / "Add to Apple Wallet" buttons.
- **Google Wallet Integration**: Create or update Google Wallet event ticket passes via Google Wallet Objects API.
- **Apple Wallet Integration**:
  - Generate and sign `.pkpass` passes for Apple Wallet.
  - Implement Apple Wallet Web Service (registration, updates, push notifications) compliant with Apple Developer guidelines.
- **Ticket Management**: Create, update, delete, and retrieve ticket passes stored in Firestore.
- **API-First**: Exposed RESTful endpoints secured by API keys for easy integration with client applications.

## Architecture

```
Client App
   │
   ├─▶ HTTP REST API (Express + Firebase Functions)
   │     ├─ /api/email             # Send ticket email & generate passes
   │     ├─ /api/boothVisited      # Record booth visits & push updates
   │     └─ /api/appleWallet/*     # Apple Wallet Web Service endpoints

Firebase ─▶ Firestore (tickets, passes, registrations, devices)
   │
Wallet Services:
   ├─ Google Wallet Objects API
   └─ Apple Wallet (PassKit + APNs)
```  

## Prerequisites

- Node.js >= 18
- Firebase CLI
- Google Service Account JSON (for Google Wallet)
- Apple Wallet certificates and keys
- SMTP credentials for sending emails

## Installation & Setup

1. **Clone the repository**
   ```bash
   gh repo clone fuisl/cfied25-ticket
   cd cfied25-ticket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize Firebase**
   ```bash
   firebase login
   firebase init functions
   ```

4. **Deploy to Firebase**
   ```bash
   firebase deploy --only functions
   ```

## Configuration

Copy `config/.env.example` to `.env` and fill in the values:

## Usage

### Email Ticket Endpoint

```http
POST /api/email
Host: <your-domain>
x-api-key: <EMAIL_API_KEY>
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "Full Name",
  "code": "ABC123"  // optional, auto-generated if omitted
}
```

- Generates or updates Firestore ticket record.
- Issues or updates Google Wallet & Apple Wallet passes.
- Sends an email with QR code + wallet buttons.

### Booth Visited Update Endpoint

```http
POST /api/boothVisited
Host: <your-domain>
x-api-key: <EMAIL_API_KEY>
Content-Type: application/json

{
  "code": "ABC123",
  "boothVisited": 5
}
```

- Updates `boothVisited` count in Firestore.
- Triggers Google Wallet object update (optional).
- Pushes updates to Apple Wallet via web service & APNs.

### Apple Wallet Pass Service

- **Registration**: `/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber`
- **Unregistration**: same path with `DELETE`.
- **Fetch Registered**: `GET /v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier?passesUpdatedSince=<timestamp>`
- **Fetch Pass**: `GET /v1/passes/:passTypeIdentifier/:serialNumber`
- **Push Update**: `POST /v1/push/:passTypeIdentifier` or `POST /v1/push/:passTypeIdentifier/:serialNumber`

Refer to [Apple Wallet Web Service Reference](https://developer.apple.com/library/archive/documentation/PassKit/Reference/PassKit_WebService/WebService.html).

## Services

- **Mail Service** (`services/mailService.js`): Nodemailer setup & HTML template rendering.
- **Google Wallet Service** (`services/googleWalletService.js`): Create/update Wallet classes & objects.
- **Apple Wallet Service** (`services/appleWalletService.js`): PKPass template initialization & pass generation.
- **Express Routes** (`src/routes/*.js`): Email, boothVisited, Apple Wallet API endpoints.

## License

[MIT License](LICENSE)
