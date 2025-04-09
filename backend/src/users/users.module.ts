// backend/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema'; // Correct path to schema
import { UsersService } from './users.service';          // Correct path to service

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  exports: [UsersService], // <--- IS THIS LINE DEFINITELY HERE AND SAVED?
})
export class UsersModule {}