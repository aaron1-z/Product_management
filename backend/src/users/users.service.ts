// backend/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // <-- Import decorator
import { Model } from 'mongoose'; // <-- Import Mongoose Model type
import { User, UserDocument } from './schemas/user.schema'; // <-- Import User schema/document type
// We will create this DTO in the next step (Step 8)
// Make sure the path is correct relative to users.service.ts
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  // Inject the Mongoose Model for the 'User' schema
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Finds a single user by their email address (case-insensitive).
   * @param email - The email address to search for.
   * @returns A promise that resolves to the user document or null if not found.
   */
  async findOneByEmail(email: string): Promise<UserDocument | null> {
    // Mongoose queries are chainable. .exec() executes the query and returns a Promise.
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  /**
   * Creates a new user in the database.
   * The password from the DTO is assigned to the passwordHash field,
   * triggering the pre-save hook in user.schema.ts to hash it.
   * @param createUserDto - Data Transfer Object containing user email and plain password.
   * @returns A promise that resolves to the newly created user document.
   */
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel({
      email: createUserDto.email,
      // Assign the plain password to passwordHash field
      // The actual hashing happens in the pre-save hook defined in user.schema.ts
      passwordHash: createUserDto.password,
    });
    return newUser.save(); // .save() persists the document to MongoDB
  }

  /**
   * Finds a single user by their MongoDB ObjectId.
   * @param id - The user's ObjectId as a string.
   * @returns A promise that resolves to the user document or null if not found.
   */
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}