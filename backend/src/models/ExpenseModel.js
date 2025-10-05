const { QueryDatabase } = require('../config/Database');

class ExpenseModel {
  /**
   * Create a new expense
   */
  static async CreateExpense(ExpenseData) {
    const {
      UserId,
      LinkedCashRequestId,
      AmountEncrypted,
      Department,
      DateConsumed,
      Description,
      ExpenseType,
    } = ExpenseData;

    const Query = `
      INSERT INTO Expenses (
        UserId, LinkedCashRequestId, AmountEncrypted, Department, 
        DateConsumed, Description, ExpenseType
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING ExpenseId, UserId, LinkedCashRequestId, AmountEncrypted, 
                Department, DateConsumed, Description, ExpenseType, CreatedAt
    `;

    const Result = await QueryDatabase(Query, [
      UserId,
      LinkedCashRequestId || null,
      AmountEncrypted,
      Department,
      DateConsumed,
      Description,
      ExpenseType,
    ]);

    return Result.rows[0];
  }

  /**
   * Get all expenses for a user
   */
  static async GetExpensesByUserId(UserId) {
    const Query = `
      SELECT e.*, u.Username, u.FullName,
             cr.CashRequestId, cr.Description as CashRequestDescription
      FROM Expenses e
      JOIN Users u ON e.UserId = u.UserId
      LEFT JOIN CashRequests cr ON e.LinkedCashRequestId = cr.CashRequestId
      WHERE e.UserId = $1
      ORDER BY e.CreatedAt DESC
    `;

    const Result = await QueryDatabase(Query, [UserId]);
    return Result.rows;
  }

  /**
   * Get all expenses (admin view)
   */
  static async GetAllExpenses() {
    const Query = `
      SELECT e.*, u.Username, u.FullName,
             cr.CashRequestId, cr.Description as CashRequestDescription
      FROM Expenses e
      JOIN Users u ON e.UserId = u.UserId
      LEFT JOIN CashRequests cr ON e.LinkedCashRequestId = cr.CashRequestId
      ORDER BY e.CreatedAt DESC
    `;

    const Result = await QueryDatabase(Query);
    return Result.rows;
  }

  /**
   * Get a single expense by ID
   */
  static async GetExpenseById(ExpenseId, UserId = null) {
    let Query = `
      SELECT e.*, u.Username, u.FullName,
             cr.CashRequestId, cr.Description as CashRequestDescription
      FROM Expenses e
      JOIN Users u ON e.UserId = u.UserId
      LEFT JOIN CashRequests cr ON e.LinkedCashRequestId = cr.CashRequestId
      WHERE e.ExpenseId = $1
    `;

    const Params = [ExpenseId];

    if (UserId) {
      Query += ` AND e.UserId = $2`;
      Params.push(UserId);
    }

    const Result = await QueryDatabase(Query, Params);
    return Result.rows[0];
  }

  /**
   * Update an expense
   */
  static async UpdateExpense(ExpenseId, UserId, UpdateData) {
    const {
      LinkedCashRequestId,
      AmountEncrypted,
      Department,
      DateConsumed,
      Description,
      ExpenseType,
    } = UpdateData;

    const Query = `
      UPDATE Expenses
      SET LinkedCashRequestId = COALESCE($1, LinkedCashRequestId),
          AmountEncrypted = COALESCE($2, AmountEncrypted),
          Department = COALESCE($3, Department),
          DateConsumed = COALESCE($4, DateConsumed),
          Description = COALESCE($5, Description),
          ExpenseType = COALESCE($6, ExpenseType),
          UpdatedAt = CURRENT_TIMESTAMP
      WHERE ExpenseId = $7 AND UserId = $8
      RETURNING *
    `;

    const Result = await QueryDatabase(Query, [
      LinkedCashRequestId,
      AmountEncrypted,
      Department,
      DateConsumed,
      Description,
      ExpenseType,
      ExpenseId,
      UserId,
    ]);

    return Result.rows[0];
  }

  /**
   * Delete an expense
   */
  static async DeleteExpense(ExpenseId, UserId) {
    const Query = `
      DELETE FROM Expenses
      WHERE ExpenseId = $1 AND UserId = $2
      RETURNING ExpenseId
    `;

    const Result = await QueryDatabase(Query, [ExpenseId, UserId]);
    return Result.rows[0];
  }

  /**
   * Get expenses by cash request ID
   */
  static async GetExpensesByCashRequestId(CashRequestId) {
    const Query = `
      SELECT e.*, u.Username, u.FullName
      FROM Expenses e
      JOIN Users u ON e.UserId = u.UserId
      WHERE e.LinkedCashRequestId = $1
      ORDER BY e.CreatedAt DESC
    `;

    const Result = await QueryDatabase(Query, [CashRequestId]);
    return Result.rows;
  }

  /**
   * Get expenses by department
   */
  static async GetExpensesByDepartment(Department) {
    const Query = `
      SELECT e.*, u.Username, u.FullName,
             cr.CashRequestId, cr.Description as CashRequestDescription
      FROM Expenses e
      JOIN Users u ON e.UserId = u.UserId
      LEFT JOIN CashRequests cr ON e.LinkedCashRequestId = cr.CashRequestId
      WHERE e.Department = $1
      ORDER BY e.CreatedAt DESC
    `;

    const Result = await QueryDatabase(Query, [Department]);
    return Result.rows;
  }
}

module.exports = ExpenseModel;