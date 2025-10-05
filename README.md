# SociaLens - Social Media Microservice Backend

A production-ready social media platform built with microservice architecture, featuring user management, media uploads, ticketing system, and real-time notifications.

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
├── Site Admin (can create Operator)
└── Operator (limited admin access)

Client Roles:
├── Client Admin (invited by Super Admin)
└── Client User (invited by Client Admin)
```

### 2. **Media Service** (Port 5002)

- **File Upload to AWS S3**
- **Post Creation & Management**
- **Like/Unlike System**
- **Comment System**
- **Feed Generation**

### 3. **Ticketing Service** (Port 5003)

- **Support Ticket Management**
- **Status Tracking**
- **Admin Assignment**
- **Priority Management**

### 4. **Notification Service** (Port 5004)

- **Real-time WebSocket**
- **Email Notifications**
- **Push Notifications**
- **Event Processing**

### 5. **API Gateway** (Port 5000)

- **Request Routing**
- **Load Balancing**
- **Authentication Middleware**
- **Rate Limiting**

## 🛠️ Technology Stack

| Component            | Technology        |
| -------------------- | ----------------- |
| **Runtime**          | Node.js 18+       |
| **Framework**        | Express.js        |
| **Database**         | MySQL 8.0         |
| **Cache**            | Redis 7           |
| **Authentication**   | JWT + TOTP        |
| **Password Hashing** | Argon2id + BCrypt |
| **File Storage**     | AWS S3            |
| **Testing**          | Jest              |
| **Linting**          | ESLint + Prettier |
| **Git Hooks**        | Husky             |

## 📁 Project Structure

```
backend/
├── services/
│   ├── user-service/           # Authentication & User Management
│   ├── media-service/          # File Upload & Posts
│   ├── ticketing-service/      # Support Tickets
│   └── notification-service/   # Real-time Notifications
├── shared/                     # Common utilities & configurations
├── gateway/                    # API Gateway
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0
- Redis 7

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

3. **Start Development Environment**

   ```bash
   # Start individual services
   cd services/user-service
   npm install
   npm run dev
   ```

4. **Access Services**
   - API Gateway: http://localhost:5000
   - User Service: http://localhost:5001
   - Media Service: http://localhost:5002
   - Ticketing Service: http://localhost:5003
   - Notification Service: http://localhost:5004

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

- **Winston** for structured logging
- **Morgan** for HTTP request logging
- **Health checks** for all services
- **Error tracking** and reporting

## 🔄 CI/CD Pipeline

- **Pre-commit hooks** with Husky
- **ESLint** code quality checks
- **Prettier** code formatting
- **Jest** automated testing

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
