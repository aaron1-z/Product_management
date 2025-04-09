// backend/src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Add createdAt and updatedAt timestamps
export class User {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string; // Store the hashed password

  // Optional: Add other fields like name, roles etc. later if needed
}

export const UserSchema = SchemaFactory.createForClass(User);

// Mongoose middleware to hash password before saving
UserSchema.pre<UserDocument>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('passwordHash')) return next();

  // Hash the password with a salt round of 10
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

// Optional: Method to compare passwords (can also be done in service)
// UserSchema.methods.comparePassword = function (candidatePassword): Promise<boolean> {
//   return bcrypt.compare(candidatePassword, this.passwordHash);
// };