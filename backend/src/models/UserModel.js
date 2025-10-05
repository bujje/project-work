const { QueryDatabase } = require('../config/Database');
const bcrypt = require('bcryptjs');

class UserModel {
  /**
   * Create a new user
   */
  static async CreateUser(UserData) {
    const { Username, Email, Password, FullName, Department } = UserData;

    // Hash password
    const Salt = await bcrypt.genSalt(10);
    const PasswordHash = await bcrypt.hash(Password, Salt);

    const Query = `
      INSERT INTO Users (Username, Email, PasswordHash, FullName, Department)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING UserId AS "UserId", Username, Email, FullName, Department, CreatedAt
    `;

    const Result = await QueryDatabase(Query, [
      Username,
      Email,
      PasswordHash,
      FullName,
      Department,
    ]);

    return Result.rows[0];
  }

  /**
   * Find user by email
   */
  static async FindUserByEmail(Email) {
    const Query = `
      SELECT UserId AS "UserId", Username, Email, PasswordHash AS "PasswordHash", FullName, Department, CreatedAt
      FROM Users
      WHERE LOWER(Email) = LOWER($1)
    `;

    const Result = await QueryDatabase(Query, [Email]);
    return Result.rows[0];
  }

  /**
   * Find user by username
   */
  static async FindUserByUsername(Username) {
    const Query = `
      SELECT UserId AS "UserId", Username, Email, PasswordHash AS "PasswordHash", FullName, Department, CreatedAt
      FROM Users
      WHERE Username = $1
    `;

    const Result = await QueryDatabase(Query, [Username]);
    return Result.rows[0];
  }

  /**
   * Find user by ID
   */
  static async FindUserById(UserId) {
    const Query = `
      SELECT UserId AS "UserId", Username, Email, FullName, Department, CreatedAt
      FROM Users
      WHERE UserId = $1
    `;

    const Result = await QueryDatabase(Query, [UserId]);
    return Result.rows[0];
  }

  /**
   * Verify user password
   */
  static async VerifyPassword(PlainPassword, HashedPassword) {
    return await bcrypt.compare(PlainPassword, HashedPassword);
  }

  /**
   * Update user information
   */
  static async UpdateUser(UserId, UpdateData) {
    const { FullName, Department } = UpdateData;

    const Query = `
      UPDATE Users
      SET FullName = COALESCE($1, FullName),
          Department = COALESCE($2, Department),
          UpdatedAt = CURRENT_TIMESTAMP
      WHERE UserId = $3
      RETURNING UserId AS "UserId", Username, Email, FullName, Department, UpdatedAt
    `;

    const Result = await QueryDatabase(Query, [FullName, Department, UserId]);
    return Result.rows[0];
  }

  /**
   * Get all users (admin function)
   */
  static async GetAllUsers() {
    const Query = `
      SELECT UserId AS "UserId", Username, Email, FullName, Department, CreatedAt
      FROM Users
      ORDER BY CreatedAt DESC
    `;

    const Result = await QueryDatabase(Query);
    return Result.rows;
  }
}

module.exports = UserModel;