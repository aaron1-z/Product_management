// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service'; // Keep AppService\
import { AuthModule } from './auth/auth.module'; // Import Feature Module
import { UsersModule } from './users/users.module'; // Import Feature Module
import { ProductsModule } from './products/products.module'; // Import Feature Module

// --- REMOVED 불필요한 IMPORTS ---
// import { AuthController } from './auth.controller'; // Controller should be in AuthModule
// import { AuthService } from './auth.service';       // Service should be in AuthModule
// import { UsersService } from './users/users.service'; // Service should be in UsersModule
// import { ProductsController } from './products.controller'; // Controller should be in ProductsModule
// import { ProductsService } from './products.service'; // Service should be in ProductsModule
// --- --- --- --- --- --- --- ---

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DATABASE_URL');
        // Optional Debugging: console.log('Connecting to MongoDB with URI:', uri);
        if (!uri) {
          throw new Error('DATABASE_URL environment variable is not set!');
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
    // --- Import Feature Modules ---
    AuthModule,
    UsersModule,
    ProductsModule,
    // --- --- --- --- --- --- ---
  ],
  // --- Only list controllers belonging DIRECTLY to AppModule ---
  controllers: [AppController], // Usually just AppController
  // --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
  // --- Only list providers belonging DIRECTLY to AppModule ---
  providers: [AppService], // Usually just AppService
  // --- --- --- --- --- --- --- --- --- --- --- --- --- ---
})
export class AppModule {}