const UserModel = require('../models/UserModel');
const { GenerateToken } = require('../utils/TokenUtil');

class AuthController {
  /**
   * Register a new user
   */
  static async RegisterUser(Request, Response) {
    try {
      const { Username, Email, Password, FullName, Department } = Request.body;

      // Check if user already exists
      const ExistingUserByEmail = await UserModel.FindUserByEmail(Email);
      if (ExistingUserByEmail) {
        return Response.status(400).json({
          Success: false,
          Message: 'User with this email already exists',
        });
      }

      const ExistingUserByUsername = await UserModel.FindUserByUsername(Username);
      if (ExistingUserByUsername) {
        return Response.status(400).json({
          Success: false,
          Message: 'Username is already taken',
        });
      }

      // Create new user
      const NewUser = await UserModel.CreateUser({
        Username,
        Email,
        Password,
        FullName,
        Department,
      });

      // Generate token
      const Token = GenerateToken(NewUser);

      Response.status(201).json({
        Success: true,
        Message: 'User registered successfully',
        Data: {
          User: {
            UserId: NewUser.UserId,
            Username: NewUser.Username,
            Email: NewUser.Email,
            FullName: NewUser.FullName,
            Department: NewUser.Department,
          },
          Token,
        },
      });
    } catch (Err) {
      console.error('Registration error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to register user',
        Error: Err.message,
      });
    }
  }

  /**
   * Login user
   */
  static async LoginUser(Request, Response) {
    try {
      const { Email, Password } = Request.body;

      // Find user by email
      const User = await UserModel.FindUserByEmail(Email);
      if (!User) {
        return Response.status(401).json({
          Success: false,
          Message: 'Invalid email or password',
        });
      }

      // Verify password
      const IsPasswordValid = await UserModel.VerifyPassword(Password, User.PasswordHash);
      if (!IsPasswordValid) {
        return Response.status(401).json({
          Success: false,
          Message: 'Invalid email or password',
        });
      }

      // Generate token
      const Token = GenerateToken(User);

      Response.status(200).json({
        Success: true,
        Message: 'Login successful',
        Data: {
          User: {
            UserId: User.UserId,
            Username: User.Username,
            Email: User.Email,
            FullName: User.FullName,
            Department: User.Department,
          },
          Token,
        },
      });
    } catch (Err) {
      console.error('Login error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to login',
        Error: Err.message,
      });
    }
  }

  /**
   * Logout user (client-side token removal)
   */
  static async LogoutUser(Request, Response) {
    try {
      // In JWT-based auth, logout is handled client-side by removing the token
      // This endpoint is mainly for logging purposes
      Response.status(200).json({
        Success: true,
        Message: 'Logout successful',
      });
    } catch (Err) {
      console.error('Logout error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to logout',
        Error: Err.message,
      });
    }
  }

  /**
   * Get current user profile
   */
  static async GetCurrentUser(Request, Response) {
    try {
      const UserId = Request.User.UserId;

      const User = await UserModel.FindUserById(UserId);
      if (!User) {
        return Response.status(404).json({
          Success: false,
          Message: 'User not found',
        });
      }

      Response.status(200).json({
        Success: true,
        Data: {
          User,
        },
      });
    } catch (Err) {
      console.error('Get current user error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to get user profile',
        Error: Err.message,
      });
    }
  }
}

module.exports = AuthController;