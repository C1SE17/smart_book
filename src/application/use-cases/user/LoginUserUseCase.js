/**
 * Login User Use Case
 * Application layer orchestrates user authentication workflow
 */
class LoginUserUseCase {
  constructor(userRepository, passwordHasher, tokenGenerator) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenGenerator = tokenGenerator;
  }

  async execute(credentials) {
    try {
      const { email, password } = credentials;

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isValidPassword = await this.passwordHasher.compare(
        password,
        user.password_hash
      );

      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Generate token
      const token = this.tokenGenerator.generate({
        userId: user.user_id,
        email: user.email,
        role: user.role,
      });

      return {
        success: true,
        data: {
          user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        },
      };
    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }
}

module.exports = LoginUserUseCase;

