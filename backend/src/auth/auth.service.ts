// backend/src/auth/auth.service.ts
import {
    Injectable,
    UnauthorizedException, // For login errors
    ConflictException,     // For signup errors (e.g., email exists)
  } from '@nestjs/common';
  import { UsersService } from '../users/users.service'; // To interact with user data
  import { JwtService } from '@nestjs/jwt'; // To create JWT tokens
  import * as bcrypt from 'bcrypt'; // For comparing passwords
  import { CreateUserDto } from './dto/create-user.dto'; // Input DTO for signup
  import { LoginUserDto } from './dto/login-user.dto';   // Input DTO for login
  import { UserDocument } from '../users/schemas/user.schema'; // User type from Mongoose
  
  @Injectable()
  export class AuthService {
    // Inject dependencies needed by the service
    constructor(
      private usersService: UsersService, // Service to manage user data
      private jwtService: JwtService,     // Service to handle JWT operations
    ) {}
  
    /**
     * Validates user credentials against the database.
     * @param email - User's email from login attempt.
     * @param pass - Plain text password from login attempt.
     * @returns The user object (without password hash) if valid, otherwise null.
     */
    async validateUser(email: string, pass: string): Promise<any> {
      const user = await this.usersService.findOneByEmail(email);
      // Check if user exists and if the provided password matches the stored hash
      if (user && (await bcrypt.compare(pass, user.passwordHash))) {
        // Return user object excluding the password hash
        const { passwordHash, ...result } = user.toObject();
        return result;
      }
      // Invalid credentials or user not found
      return null;
    }
  
    /**
     * Processes login requests. Validates user and generates a JWT.
     * @param loginUserDto - Contains email and password.
     * @returns An object with the access token and basic user info.
     * @throws UnauthorizedException if validation fails.
     */
    async login(loginUserDto: LoginUserDto): Promise<{ access_token: string; user: any }> {
      // Validate credentials using the helper method
      const user = await this.validateUser(
        loginUserDto.email,
        loginUserDto.password,
      );
      // If validation failed (user is null)
      if (!user) {
        throw new UnauthorizedException('Invalid credentials. Please try again.');
      }
  
      // Prepare the payload for the JWT (must not contain sensitive info)
      const payload = { email: user.email, sub: user._id }; // 'sub' holds the user ID
  
      // Generate the JWT access token
      const accessToken = this.jwtService.sign(payload);
  
      // Return the generated token and some user details
      return {
        access_token: accessToken,
        user: {
          id: user._id,
          email: user.email,
        },
      };
    }
  
    /**
     * Processes signup requests. Checks for existing email and creates a new user.
     * @param createUserDto - Contains email and password for the new user.
     * @returns The newly created user object (without password hash).
     * @throws ConflictException if email is already in use.
     */
    async signUp(createUserDto: CreateUserDto): Promise<UserDocument> {
      // Check if email is already registered
      const existingUser = await this.usersService.findOneByEmail(
        createUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('Email address is already registered.');
      }
  
      // Attempt to create the user (password hashing is handled by pre-save hook)
      try {
        const newUser = await this.usersService.create(createUserDto);
        // Exclude password hash from the returned object
        const userObject = newUser.toObject();
        delete userObject.passwordHash;
        return userObject as UserDocument; // Return the sanitized user object
      } catch (error) {
        // Catch potential errors during user creation (e.g., database issues)
        // Log the internal error for debugging: console.error('Signup Error:', error);
        throw new ConflictException('Could not create user. Please try again later.');
      }
    }
  } // End of AuthService class