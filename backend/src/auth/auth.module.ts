// backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
// --- Use './' for files in the SAME directory ---
import { AuthService } from './auth.service';      // CORRECTED PATH
import { AuthController } from './auth.controller';  // CORRECTED PATH
// --- --- --- --- --- --- --- --- --- --- --- ---
import { UsersModule } from '../users/users.module'; // Path up to src, then into users (Correct)
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';      // Path relative to this file (Correct)

@Module({
  imports: [
    UsersModule,
    ConfigModule, // Ensure ConfigService is available
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      // imports: [ConfigModule], // ConfigModule already imported above
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController], // Register the controller
  providers: [AuthService, JwtStrategy], // Register service & strategy
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}