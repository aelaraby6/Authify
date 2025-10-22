# 🔐 Authify

A comprehensive authentication module built with Express.js, TypeScript, and React, providing secure user authentication with multiple features including OAuth integration, 2FA, and password management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication Flow](#authentication-flow)
- [Security Features](#security-features)

## ✨ Features

### Core Authentication
- **User Registration & Login** - Secure signup and login with email/password
- **Session Management** - JWT-based authentication with refresh tokens
- **OAuth Integration** - Sign in with GitHub and Google
- **Role-Based Access Control** - User roles and permissions management

### Security Features
- **Two-Factor Authentication (2FA)** - TOTP-based 2FA with QR code generation
- **Password Management**
  - Forgot password with OTP verification
  - Password reset functionality
  - Update password for authenticated users
- **Rate Limiting** - Protection against brute force attacks
- **Secure Cookies** - HttpOnly, Secure, and SameSite cookie configurations
- **Password Hashing** - Bcrypt-based password encryption
- **Input Validation** - Request validation using schemas

### Additional Features
- **API Documentation** - Swagger/OpenAPI documentation at `/docs`
- **Error Handling** - Comprehensive global error handling
- **CORS Configuration** - Secure cross-origin resource sharing
- **Helmet Integration** - Enhanced API security headers

## 🛠 Technology Stack

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Authentication:** Passport.js (Local, GitHub, Google strategies)
- **Session Management:** express-session
- **Token Management:** jsonwebtoken
- **2FA:** speakeasy, qrcode
- **Validation:** Custom validation middleware
- **Security:** helmet, bcrypt, rate-limiter
- **Database:** MongoDB (assumed from User model)

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **Language:** TypeScript
- **UI Components:** Custom components

## 🏗 Architecture

The project follows a modular, layered architecture with clear separation of concerns:

## 📁 Project Structure

```
authify/
├── Server/                              # Backend Application
│   ├── src/
│   │   ├── controllers/                 # Request handlers
│   │   │   └── Auth/
│   │   │       └── auth.controller.ts
│   │   ├── routers/                     # API routes
│   │   │   └── auth.router.ts
│   │   ├── middlewares/                 # Custom middleware
│   │   │   ├── authenticate_session.middleware.ts
│   │   │   ├── authenticate_token.middleware.ts
│   │   │   ├── rate_limiter.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   └── global_error_handler.middleware.ts
│   │   ├── models/                      # Database models
│   │   │   └── User/
│   │   │       └── user.model.ts
│   │   ├── services/                    # Business logic services
│   │   │   ├── jwt.service.ts
│   │   │   ├── otp.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── password.service.ts
│   │   ├── validations/                 # Request validation schemas
│   │   │   └── Auth/
│   │   │       └── auth.validation.ts
│   │   ├── config/                      # Configuration files
│   │   │   ├── corsOptions.ts
│   │   │   └── passportConfig.ts
│   │   ├── Errors/                      # Custom error classes
│   │   │   └── error.ts
│   │   ├── helper/                      # Helper utilities
│   │   │   ├── calcTime.ts
│   │   │   └── sessionhelper.ts
│   │   ├── types/                       # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/                       # Utility functions
│   │   │   └── swagger.ts
│   │   ├── docs/                        # API documentation
│   │   ├── app.ts                       # Express app configuration
│   │   └── server.ts                    # Server entry point
│   ├── scripts/                         # Build/deployment scripts
│   ├── .gitignore
│   ├── tsconfig.json
│   ├── package.json
│   └── package-lock.json
│
├── Client/                              # Frontend Application
│   ├── src/
│   │   ├── Pages/                       # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── OTP.tsx
│   │   │   ├── ResetPassword.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── components/                  # Reusable components
│   │   ├── assets/                      # Static assets
│   │   ├── core/                        # Core application logic
│   │   │   ├── Storage/
│   │   │   ├── api/
│   │   │   ├── constants/
│   │   │   ├── context/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── repository/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── router/                      # Application routing
│   │   │   └── AppRouter.tsx
│   │   ├── App.tsx                      # Root component
│   │   ├── App.css                      # Global styles
│   │   ├── main.tsx                     # Application entry point
│   │   └── index.css                    # Base styles
│   ├── public/                          # Public assets
│   ├── .gitignore
│   ├── components.json                  # Component configuration
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
└── README.md                            # Project documentation
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

```bash
# Navigate to server directory
cd Server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Frontend Setup

```bash
# Navigate to client directory
cd Client

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔐 Environment Variables

Create a `.env` file in the **Server** directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/authify

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Session
SESSION_SECRET=your_session_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Email Service (for OTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## 📚 API Documentation

API documentation is available at `/docs` endpoint using Swagger UI.

### Main Endpoints

#### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | No |
| POST | `/login` | User login | No |
| GET | `/status` | Check auth status | Session |
| POST | `/logout` | User logout | No |

#### Password Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/forgot-password` | Request password reset OTP | No |
| POST | `/verify-reset-otp` | Verify OTP code | No |
| POST | `/reset-password` | Reset password with OTP | No |
| POST | `/update-password` | Update password | Token |

#### Two-Factor Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/2FA/setup` | Setup 2FA | Session |
| POST | `/2FA/verify` | Verify 2FA token | Session |
| POST | `/2FA/reset` | Reset 2FA | Session |

#### OAuth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/github` | Initiate GitHub OAuth |
| GET | `/github/callback` | GitHub OAuth callback |
| POST | `/github/revoke` | Revoke GitHub authorization |
| GET | `/google` | Initiate Google OAuth |
| GET | `/google/callback` | Google OAuth callback |

## 🔄 Authentication Flow

### 1. Standard Email/Password Flow

```
User Registration:
1. User submits signup form (name, email, password)
2. Server validates input and checks for existing user
3. Password is hashed using bcrypt
4. User document is created in database
5. JWT tokens (access & refresh) are generated
6. Refresh token stored in httpOnly cookie
7. Access token returned in response

User Login:
1. User submits login credentials
2. Passport local strategy validates credentials
3. Session is established via req.login()
4. JWT tokens generated
5. Tokens sent to client
```

### 2. OAuth Flow (GitHub/Google)

```
1. User clicks "Sign in with GitHub/Google"
2. User redirected to OAuth provider
3. User authorizes application
4. Provider redirects to callback URL with code
5. Server exchanges code for access token
6. User profile fetched from provider
7. User created/updated in database
8. JWT tokens generated
9. User redirected to frontend dashboard with token
```

### 3. Password Reset Flow

```
1. User requests password reset (forgot-password)
2. OTP generated and sent via email
3. User submits OTP for verification
4. If valid, user can set new password
5. Password updated and OTP cleared
```

### 4. Two-Factor Authentication Flow

```
Setup:
1. User enables 2FA from dashboard
2. Server generates TOTP secret
3. QR code generated for authenticator app
4. User scans QR code
5. Secret saved to user profile

Login with 2FA:
1. User completes standard login
2. System prompts for 2FA token
3. User enters token from authenticator app
4. Server verifies token using speakeasy
5. Access granted if valid
```

## 🔒 Security Features

### Password Security
- Passwords hashed with bcrypt (10 salt rounds)
- Minimum password length enforcement
- Password strength validation
- Secure password reset with OTP

### Token Security
- JWT with short expiration (1 hour for access tokens)
- Refresh tokens with 7-day expiration
- HttpOnly cookies for refresh tokens
- Secure flag enabled in production

### Rate Limiting
- Signup endpoint: Limited requests per IP
- Login endpoint: Brute force protection
- Configurable rate limits per endpoint

### Session Security
- Secure session configuration
- Session timeout
- Session regeneration on login
- CSRF protection

### 2FA Security
- TOTP-based authentication
- 30-second time window
- 2-step tolerance for clock skew
- Secure secret storage

### Additional Security
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (via MongoDB)
- XSS protection

## 📱 Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LoginPage | Landing page (redirects to login) |
| `/login` | LoginPage | User login |
| `/signup` | SignupPage | User registration |
| `/forgot-password` | ForgotPasswordPage | Password reset request |
| `/otp` | OTPPage | OTP verification |
| `/reset-password` | ResetPasswordPage | New password entry |
| `/dashboard` | DashboardPage | Protected user dashboard |

## 🧪 Testing

The React application serves as a testing environment for the authentication module. It includes forms for all authentication features with proper error handling and user feedback.

## 📝 Best Practices Implemented

1. **Separation of Concerns** - Controllers, services, and routes are separated
2. **Error Handling** - Centralized error handling with custom error classes
3. **Validation** - Input validation using schemas
4. **Type Safety** - Full TypeScript implementation
5. **Security First** - Multiple layers of security measures
6. **Scalability** - Modular architecture for easy expansion
7. **Documentation** - Swagger API documentation
8. **Code Quality** - Consistent coding standards

## 👥 Contributors

Thanks goes to these wonderful people in the frontend team:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/aelaraby6">
        <img src="https://avatars.githubusercontent.com/u/154278999?v=4" width="100px;" alt=""/>
        <br /><sub><b>Abdelrahman Elaraby</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ahmedali109">
        <img src="https://avatars.githubusercontent.com/u/64106924?v=4" width="100px;" alt=""/>
        <br /><sub><b>Ahmed Ali</b></sub>
      </a>
    </td>
  </tr>
</table>
