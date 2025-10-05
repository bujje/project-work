const { QueryDatabase } = require('../config/Database');

class CashRequestModel {
  /**
   * Create a new cash request
   */
  static async CreateCashRequest(CashRequestData) {
    const {
      UserId,
      AmountUsedEncrypted,
      Department,
      DateOfNeeded,
      Description,
      ExpenseType,
    } = CashRequestData;

    const Query = `
      INSERT INTO CashRequests (
        UserId, AmountUsedEncrypted, Department, DateOfNeeded, Description, ExpenseType
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING CashRequestId, UserId, AmountUsedEncrypted, Department, DateOfNeeded, 
                Description, ExpenseType, Status, CreatedAt
    `;

    const Result = await QueryDatabase(Query, [
      UserId,
      AmountUsedEncrypted,
      Department,
      DateOfNeeded,
      Description,
      ExpenseType,
    ]);

    return Result.rows[0];
  }

  /**
   * Get all cash requests for a user
   */
  static async GetCashRequestsByUserId(UserId) {
    const Query = `
      SELECT cr.*, u.Username, u.FullName
      FROM CashRequests cr
      JOIN Users u ON cr.UserId = u.UserId
      WHERE cr.UserId = $1
      ORDER BY cr.CreatedAt DESC
    `;

    const Result = await QueryDatabase(Query, [UserId]);
    return Result.rows;
  }

  /**
   * Get all cash requests (admin view)
   */
  static async GetAllCashRequests() {
    const Query = `
      SELECT cr.*, u.Username, u.FullName
      FROM CashRequests cr
      JOIN Users u ON cr.UserId = u.UserId
      ORDER BY cr.CreatedAt DESC
    `;

    const Result = await QueryDatabase(Query);
    return Result.rows;
  }

  /**
   * Get a single cash request by ID
   */
  static async GetCashRequestById(CashRequestId, UserId = null) {
    let Query = `
      SELECT cr.*, u.Username, u.FullName
      FROM CashRequests cr
      JOIN Users u ON cr.UserId = u.UserId
      WHERE cr.CashRequestId = $1
    `;

    const Params = [CashRequestId];

    if (UserId) {
      Query += ` AND cr.UserId = $2`;
      Params.push(UserId);
    }

    const Result = await QueryDatabase(Query, Params);
    return Result.rows[0];
  }

  /**
   * Update a cash request
   */
  static async UpdateCashRequest(CashRequestId, UserId, UpdateData) {
    const {
      AmountUsedEncrypted,
      Department,
      DateOfNeeded,
      Description,
      ExpenseType,
      Status,
    } = UpdateData;

    const Query = `
      UPDATE CashRequests
      SET AmountUsedEncrypted = COALESCE($1, AmountUsedEncrypted),
          Department = COALESCE($2, Department),
          DateOfNeeded = COALESCE($3, DateOfNeeded),
          Description = COALESCE($4, Description),
          ExpenseType = COALESCE($5, ExpenseType),
          Status = COALESCE($6, Status),
          UpdatedAt = CURRENT_TIMESTAMP
      WHERE CashRequestId = $7 AND UserId = $8
      RETURNING *
    `;

    const Result = await QueryDatabase(Query, [
      AmountUsedEncrypted,
      Department,
      DateOfNeeded,
      Description,
      ExpenseType,
      Status,
      CashRequestId,
      UserId,
    ]);

    return Result.rows[0];
  }

  /**
   * Delete a cash request
   */
  static async DeleteCashRequest(CashRequestId, UserId) {
    const Query = `
      DELETE FROM CashRequests
      WHERE CashRequestId = $1 AND UserId = $2
      RETURNING CashRequestId
    `;

    const Result = await QueryDatabase(Query, [CashRequestId, UserId]);
    return Result.rows[0];
  }

  /**
   * Get cash requests by department
   */
  static async GetCashRequestsByDepartment(Department) {
    const Query = `
      SELECT cr.*, u.Username, u.FullName
      FROM CashRequests cr
      JOIN Users u ON cr.UserId = u.UserId
      WHERE cr.Department = $1
      ORDER BY cr.CreatedAt DESC
    `;

    const Result = await QueryDatabase(Query, [Department]);
    return Result.rows;
  }

  /**
   * Get cash requests by status
   */
  static async GetCashRequestsByStatus(Status, UserId = null) {
    let Query = `
      SELECT cr.*, u.Username, u.FullName
      FROM CashRequests cr
      JOIN Users u ON cr.UserId = u.UserId
      WHERE cr.Status = $1
    `;

    const Params = [Status];

    if (UserId) {
      Query += ` AND cr.UserId = $2`;
      Params.push(UserId);
    }

    Query += ` ORDER BY cr.CreatedAt DESC`;

    const Result = await QueryDatabase(Query, Params);
    return Result.rows;
  }
}

module.exports = CashRequestModel;