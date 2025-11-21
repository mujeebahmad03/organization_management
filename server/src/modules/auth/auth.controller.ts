import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { LoginInput } from './dto/login.dto';
import { AuthResponse } from './dto/auth-response.dto';
import { AuthService } from './services';
import { RegisterInput } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'User registration',
    description: 'Register a new user with username and password.',
  })
  @ApiBody({
    type: RegisterInput,
    description: 'User registration data',
    examples: {
      default: {
        summary: 'Default registration',
        description: 'Register with admin credentials',
        value: {
          username: 'admin',
          password: 'admin123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponse,
    examples: {
      default: {
        summary: 'User registered successfully',
        value: {
          username: 'admin',
          password: 'admin123',
        },
      },
    },
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJpYXQiOjE2OTk5OTk5OTl9.example',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'admin' },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
      },
    },
  })
  async register(@Body() registerInput: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate a user with username and password. Returns a JWT access token and user information.',
  })
  @ApiBody({
    type: LoginInput,
    description: 'User credentials',
    examples: {
      default: {
        summary: 'Default login',
        description: 'Login with admin credentials',
        value: {
          username: 'admin',
          password: 'admin123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Login successful. Returns JWT access token and user information.',
    type: AuthResponse,
    example: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJpYXQiOjE2OTk5OTk5OTl9.example',
      user: {
        id: 1,
        username: 'admin',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid credentials' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['password must be longer than or equal to 6 characters'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async login(@Body() loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'User logout',
    description:
      'Logout the current user by invalidating their JWT token. The token will be added to a blacklist and cannot be used again.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful. Token has been invalidated.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No token provided',
  })
  async logout(@Req() req: Request): Promise<{ success: boolean }> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');
    await this.authService.logout(token);

    return { success: true };
  }
}
