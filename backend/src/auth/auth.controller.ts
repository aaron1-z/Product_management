// backend/src/auth/auth.controller.ts
import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request,
    Get,
  } from '@nestjs/common';
// --- CORRECTED IMPORT PATH for AuthService ---
import { AuthService } from './auth.service'; // Use './' for same directory
// --- --- --- --- --- --- --- --- --- --- ---
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth') // Base route '/auth'
export class AuthController {
  // Inject AuthService dependency
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/signup
   */
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    // Ensure 'signUp' method exists on injected authService
    const user = await this.authService.signUp(createUserDto);
    return {
      message: 'Signup successful!',
      userId: user._id,
      email: user.email,
    };
  }

  /**
   * POST /auth/login
   */
  @HttpCode(HttpStatus.OK) // Set status to 200 OK on success
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    // Ensure 'login' method exists on injected authService
    return this.authService.login(loginUserDto);
  }

  /*
  // Example Protected Route: GET /auth/profile
  @UseGuards(AuthGuard('jwt')) // Use JWT Guard
  @Get('profile')
  getProfile(@Request() req) {
    // req.user is populated by JwtStrategy.validate()
    return req.user;
  }
  */
} // End of AuthController class