import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SociaLens API',
    version: '1.0.0',
    description:
      'A production-ready social media platform built with microservice architecture',
    contact: {
      name: 'SociaLens Support',
      email: 'support@socialens.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
    {
      url: 'https://api.socialens.com',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error code',
          },
          message: {
            type: 'string',
            description: 'Error message',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'User unique identifier',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
          },
          role: {
            type: 'string',
            enum: [
              'super_admin',
              'site_admin',
              'operator',
              'client_admin',
              'client_user',
            ],
            description: 'User role in the system',
          },
          tenantId: {
            type: 'string',
            description: 'Tenant identifier for multi-tenant setup',
          },
          totpEnabled: {
            type: 'boolean',
            description: 'Whether TOTP is enabled for the user',
          },
          firstName: {
            type: 'string',
            description: 'User first name',
          },
          lastName: {
            type: 'string',
            description: 'User last name',
          },
          status: {
            type: 'string',
            enum: ['active', 'invited', 'disabled'],
            description: 'User account status',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
          },
          password: {
            type: 'string',
            minLength: 8,
            description: 'User password',
          },
          otp: {
            type: 'string',
            description: 'TOTP code (required if TOTP is enabled)',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          user: {
            $ref: '#/components/schemas/User',
          },
          tokens: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                description: 'JWT access token',
              },
              refreshToken: {
                type: 'string',
                description: 'Refresh token',
              },
            },
          },
        },
      },
      RefreshRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: {
            type: 'string',
            description: 'Refresh token obtained from login',
          },
        },
      },
      Invitation: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Invitation unique identifier',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Invited user email',
          },
          role: {
            type: 'string',
            enum: [
              'super_admin',
              'site_admin',
              'operator',
              'client_admin',
              'client_user',
            ],
            description: 'Role to be assigned to the invited user',
          },
          authType: {
            type: 'string',
            enum: ['totp', 'otp'],
            description: 'Authentication type for the invited user',
          },
          expiresAt: {
            type: 'string',
            format: 'date-time',
            description: 'Invitation expiration date',
          },
          status: {
            type: 'string',
            enum: ['pending', 'accepted', 'expired'],
            description: 'Invitation status',
          },
        },
      },
      CreateInvitationRequest: {
        type: 'object',
        required: ['email', 'role', 'authType'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Email address to invite',
          },
          role: {
            type: 'string',
            enum: ['client_admin', 'client_user'],
            description: 'Role for the invited user',
          },
          tenantId: {
            type: 'string',
            description: 'Tenant ID for the invitation',
          },
          authType: {
            type: 'string',
            enum: ['totp', 'otp'],
            description: 'Authentication method',
          },
        },
      },
      AcceptInvitationRequest: {
        type: 'object',
        required: ['token', 'firstName', 'lastName'],
        properties: {
          token: {
            type: 'string',
            description: 'Invitation token from email',
          },
          password: {
            type: 'string',
            minLength: 8,
            description: 'Password for the new account',
          },
          firstName: {
            type: 'string',
            description: 'User first name',
          },
          lastName: {
            type: 'string',
            description: 'User last name',
          },
        },
      },
      CreateAdminRequest: {
        type: 'object',
        required: ['email', 'role', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Admin email address',
          },
          role: {
            type: 'string',
            enum: ['site_admin', 'operator'],
            description: 'Admin role',
          },
          password: {
            type: 'string',
            minLength: 8,
            description: 'Admin password',
          },
        },
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'OK',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
          uptime: {
            type: 'number',
            description: 'Server uptime in seconds',
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
    {
      cookieAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    './src/routes/health-swagger.js',
    './services/user-service/src/routes/auth-swagger.js',
    './services/user-service/src/routes/admin-swagger.js',
    './services/user-service/src/routes/invitations-swagger.js',
  ], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
