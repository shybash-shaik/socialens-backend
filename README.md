# SociaLens - Social Media Microservice Backend

A production-ready social media platform built with microservice architecture, featuring user management, media uploads, ticketing system, and real-time notifications.

## 🌟 Features

- **Microservice Architecture**: Scalable and maintainable service separation
- **Advanced Authentication**: JWT + TOTP (Google Authenticator) support
- **Role-Based Access Control**: Hierarchical permission system
- **Real-time Notifications**: WebSocket-based instant messaging
- **Media Management
  **: AWS S3 integration for file uploads
- **Ticketing System**: Built-in support ticket management
- **API Gateway**: Centralized request routing and load balancing
- **Comprehensive Testing**: Jest test suites with coverage reporting
- **Security First**: Rate limiting, input validation, and secure headers

## 🚀 Services

### 1. **User Service** (Port 5001)

- **Authentication & Authorization**
- **JWT + TOTP Implementation**
- **Role Hierarchy Management**
- **User Profile Management**
- **Invitation System**

**Role Hierarchy:**

```
Admin Roles:
├── Super Admin (can create Site Admin & Operator)
│   ├── Site Admin (can create Operator)
│   │   └── Operator (limited admin access)
│   └── Operator (limited admin access)
└── Operator (limited admin access)

Client Roles:
├── Client Admin (invited by Super Admin)
│   └── Client User (invited by Client Admin)
└── Client User (invited by Client Admin)
```

### 2. **Notification Service** (Port 5004)

- **Email Notifications** (SMTP integration)
- **Event Processing** (RabbitMQ/Redis pub-sub)
- **Invitation Email Templates**
- **Delivery Status Tracking**

### 3. **API Gateway** (Port 5000)

- **Request Routing**
- **Load Balancing**
- **Authentication Middleware**
- **Request Logging**
- **CORS Configuration**
- **Health Checks**

## 🛠️ Technology Stack

| Component            | Technology        |
| -------------------- | ----------------- |
| **Runtime**          | Node.js 18+       |
| **Framework**        | Express.js        |
| **Database**         | MySQL 8.0         |
| **ORM**              | Prisma            |
| **Authentication**   | JWT + TOTP        |
| **Password Hashing** | Argon2id + BCrypt |
| **Message Queue**    | RabbitMQ          |
| **Logging**          | Pino              |
| **Validation**       | Zod               |
| **Security**         | Helmet + CORS     |

## 📁 Project Structure

```
backend/
├── services/
│   ├── user-service/           # Authentication & User Management
│   │   ├── prisma/             # Database schema & migrations
│   │   ├── src/
│   │   │   ├── adapters/       # Repository implementations
│   │   │   ├── controllers/    # Route handlers
│   │   │   ├── domain/         # Business logic & entities
│   │   │   ├── middleware/     # Express middleware
│   │   │   ├── routes/         # API routes
│   │   │   ├── services/       # Application services
│   │   │   ├── queues/         # Background job queues
│   │   │   └── utils/          # Utility functions
│   │   └── generated/          # Prisma client
│   ├── media-service/          # File Upload & Posts
│   ├── ticketing-service/      # Support Tickets
│   └── notification-service/   # Real-time Notifications
├── shared/                     # Common utilities & configurations
│   ├── utils/                  # Shared utilities
│   └── middleware/             # Shared middleware
├── gateway/                    # API Gateway
│   ├── src/
│   │   ├── routes/             # Gateway routes
│   │   └── middleware/         # Gateway middleware
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0
- Redis 7
- Git

### Development Setup

1. **Clone and Setup**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Environment Configuration**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**

   ```bash
   # Navigate to user service
   cd services/user-service

   # Install dependencies
   npm install

   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Seed database
   npx prisma db seed
   ```

4. **Start Development Environment**

   ```bash
   # Start all services with PM2 (recommended)
   npm install -g pm2
   pm2 start ecosystem.config.js

   # Or start individual services manually
   cd services/user-service && npm run dev &
   cd ../media-service && npm run dev &
   cd ../ticketing-service && npm run dev &
   cd ../notification-service && npm run dev &
   cd ../../gateway && npm run dev &
   ```

5. **Access Services**
   - **API Gateway**: http://localhost:5000
   - **Swagger Docs**: http://localhost:5000/api-docs
   - **User Service**: http://localhost:5001
   - **Media Service**: http://localhost:5002
   - **Ticketing Service**: http://localhost:5003
   - **Notification Service**: http://localhost:5004

## 🔧 Development Commands

### Root Level Commands

```bash
npm run lint          # Lint all services
npm run format        # Format code with Prettier
npm run test          # Run all tests
npm run test:coverage # Run tests with coverage
```

### Service Level Commands

```bash
cd services/user-service
npm run dev           # Start development server
npm run test          # Run service tests
npm run test:watch    # Run tests in watch mode
```

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **TOTP (Google Authenticator)** support
- **Password Hashing** with Argon2id
- **Rate Limiting** on all endpoints
- **Input Validation** with Joi
- **CORS Protection**
- **Helmet Security Headers**
- **SQL Injection Prevention**

## 📊 API Documentation

- **Swagger UI**: http://localhost:5000/api-docs
- **Postman Collection**: Available in `/docs` folder

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific service
cd services/user-service
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Monitoring & Logging

- **Winston** for structured logging across all services
- **Morgan** for HTTP request logging with Pino integration
- **Health checks** for all services (`/health` endpoints)
- **Error tracking** with detailed stack traces
- **Performance monitoring** with response time tracking
- **Log aggregation** for centralized monitoring

## 🔄 CI/CD Pipeline

- **Pre-commit hooks** with Husky for code quality
- **ESLint** for JavaScript code linting
- **Prettier** for consistent code formatting
- **Jest** automated testing with coverage reporting
- **GitHub Actions** for automated testing and deployment
- **Docker** containerization for all services
- **Kubernetes** orchestration for production deployment

## 🐳 Docker Deployment

### Development with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

```bash
# Build production images
docker build -t socialens-user-service ./services/user-service
docker build -t socialens-gateway ./gateway

# Run with Kubernetes
kubectl apply -f k8s/
```

## 🔍 API Endpoints Overview

### Authentication Endpoints

- `POST /api/auth/login` - User login with email/password and optional TOTP
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user-details` - Get current user details
- `POST /api/auth/totp/setup` - Setup TOTP for user
- `POST /api/auth/totp/verify` - Verify and enable TOTP

### Admin Endpoints

- `POST /api/admin/users` - Create admin user (site_admin or operator)

### Invitation Endpoints

- `POST /api/invitations` - Create user invitation
- `GET /api/invitations/:token` - Get invitation details
- `POST /api/invitations/accept` - Accept invitation

### Gateway Endpoints

- `GET /health` - Health check
- `GET /` - Root endpoint
- `GET /api-docs` - Swagger API documentation

## 🗄️ Database Schema

The application uses **Prisma ORM** with **MySQL 8.0** for data persistence. Key entities include:

### User Model

- **Authentication**: Email/password with Argon2id hashing, optional TOTP 2FA
- **Roles**: Hierarchical role system (super_admin → site_admin → operator → client_admin → client_user)
- **Multi-tenancy**: Tenant-based isolation for client users
- **Status**: Active, invited, or disabled states

### Invitation Model

- **Token-based invites**: Secure invitation system with expiration (48 hours default)
- **Role assignment**: Inviters can only create users with lower privilege roles
- **Auth types**: Support for both TOTP and OTP authentication methods
- **Email integration**: Automatic invitation emails via RabbitMQ events

### Refresh Token Model

- **Token rotation**: Secure refresh token management with expiration
- **Metadata tracking**: User agent and IP address logging
- **Revocation**: Ability to revoke tokens for security

## 🔐 Authentication & Authorization

### JWT Token Flow

- **Access Tokens**: Short-lived (15 minutes) for API access
- **Refresh Tokens**: Long-lived (7 days) for token renewal
- **Token Rotation**: Automatic refresh token rotation on use
- **Cookie Support**: HTTP-only cookies for web clients

### Two-Factor Authentication (TOTP)

- **Google Authenticator**: QR code generation for setup
- **Base32 secrets**: Secure secret storage with encryption
- **Verification**: Time-window based OTP validation

### Role-Based Access Control

```javascript
// Platform roles (highest to lowest)
super_admin > site_admin > operator;

// Client roles (highest to lowest)
client_admin > client_user;
```

### Middleware Stack

- **Authentication**: JWT verification from headers or cookies
- **Authorization**: Role-based route protection
- **Validation**: Input sanitization with Zod schemas
- **Rate Limiting**: IP-based request throttling

## 🏗️ API Architecture

### Clean Architecture Pattern

```
src/
├── adapters/          # Repository implementations (Prisma)
├── controllers/       # HTTP request handlers
├── domain/           # Business logic & entities
│   ├── services/     # Application services
│   └── repositories/ # Repository interfaces
├── middleware/       # Express middleware
├── routes/          # API route definitions
├── services/        # Domain services
├── queues/          # Message queue handlers
└── utils/           # Utility functions
```

### Service Communication

- **API Gateway**: Centralized request routing and load balancing
- **Message Queue**: RabbitMQ for asynchronous event-driven communication
- **Event Publishing**: Domain events published to `user.events` exchange

### Error Handling

- **Structured Errors**: Consistent error response format
- **Logging**: Comprehensive error logging with stack traces
- **Validation**: Input validation with detailed error messages

## 📧 Email & Notification System

### Invitation Emails

- **Template Engine**: HTML email templates with responsive design
- **SMTP Configuration**: Support for custom SMTP or Ethereal (development)
- **Event-Driven**: Asynchronous email sending via RabbitMQ
- **Preview URLs**: Development email previews for testing

### Notification Service

- **Message Queue Consumer**: Listens to `invitation.created` events
- **Error Handling**: Robust error handling with dead letter queues
- **Logging**: Comprehensive email delivery logging

## 🔒 Security Features

### Password Security

- **Argon2id Hashing**: Memory-hard function for password hashing
- **BCrypt Fallback**: Legacy password support
- **Salt Generation**: Automatic salt generation per user

### API Security

- **Helmet**: Security headers and CSP policies
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Distributed rate limiting with Redis
- **Input Validation**: Comprehensive input sanitization

### Session Management

- **Token Expiration**: Configurable token lifetimes
- **Secure Cookies**: HTTP-only, secure cookie options
- **IP Tracking**: Optional IP address logging for security

## 📝 Environment Variables

See `.env.example` for all required environment variables:

- Database configuration
- JWT secrets
- AWS credentials
- Email settings
- Redis configuration
- Security settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact: support@socialens.com

---

**Built with ❤️ by Minfy Technologies**
