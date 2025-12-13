/**
 * Register User Use Case
 * Application layer orchestrates user registration workflow
 */
const User = require('../../../domain/entities/User');

class RegisterUserUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(userData) {
    try {
      const { name, email, password, phone, address, role = 'customer' } = userData;

      // Validate input
      User.validate({ name, email, password });

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const passwordHash = await this.passwordHasher.hash(password);

      // Create user
      const newUser = await this.userRepository.create({
        name,
        email,
        password_hash: passwordHash,
        phone,
        address,
        role,
      });

      return {
        success: true,
        data: newUser.toJSON(),
      };
    } catch (error) {
      throw new Error(`Failed to register user: ${error.message}`);
    }
  }
}

module.exports = RegisterUserUseCase;

