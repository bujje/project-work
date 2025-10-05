const ExpenseModel = require('../models/ExpenseModel');
const { ValidateAndEncryptAmount, DecryptAndParseAmount } = require('../utils/EncryptionUtil');

class ExpenseController {
  /**
   * Create a new expense
   */
  static async CreateExpense(Request, Response) {
    try {
      const UserId = Request.User.UserId;
      const {
        Amount,
        Department,
        DateConsumed,
        Description,
        ExpenseType,
        LinkedCashRequestId,
      } = Request.body;

      // Validate and encrypt the amount
      const AmountEncrypted = ValidateAndEncryptAmount(Amount);

      const NewExpense = await ExpenseModel.CreateExpense({
        UserId,
        LinkedCashRequestId,
        AmountEncrypted,
        Department,
        DateConsumed,
        Description,
        ExpenseType,
      });

      // Decrypt amount for response
      let DecryptedAmount;
      try {
        const AmountEncryptedFromDb = NewExpense.AmountEncrypted ?? NewExpense.amountencrypted;
        DecryptedAmount = DecryptAndParseAmount(AmountEncryptedFromDb);
      } catch (err) {
        console.error('Decryption failed in create:', err.message);
        DecryptedAmount = parseFloat(Amount); // Fallback to input amount
      }

      Response.status(201).json({
        Success: true,
        Message: 'Expense created successfully',
        Data: {
          Expense: {
            ...NewExpense,
            Amount: DecryptedAmount,
            AmountEncrypted: undefined, // Remove encrypted field from response
          },
        },
      });
    } catch (Err) {
      console.error('Create expense error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to create expense',
        Error: Err.message,
      });
    }
  }

  /**
   * Get all expenses for the current user
   */
  static async GetUserExpenses(Request, Response) {
    try {
      const UserId = Request.User.UserId;

      const Expenses = await ExpenseModel.GetExpensesByUserId(UserId);

      // Decrypt amounts
      const DecryptedExpenses = Expenses.map(Expense => {
        try {
          return {
            ...Expense,
            Amount: DecryptAndParseAmount(Expense.AmountEncrypted ?? Expense.amountencrypted),
            AmountEncrypted: undefined,
          };
        } catch (err) {
          console.error(`Failed to decrypt expense ${Expense.ExpenseId ?? Expense.expenseid}:`, err.message);
          return {
            ...Expense,
            Amount: 0, // Set to 0 if decryption fails
            AmountEncrypted: undefined,
          };
        }
      });

      Response.status(200).json({
        Success: true,
        Data: {
          Expenses: DecryptedExpenses,
          Count: DecryptedExpenses.length,
        },
      });
    } catch (Err) {
      console.error('Get user expenses error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to retrieve expenses',
        Error: Err.message,
      });
    }
  }

  /**
   * Get a single expense by ID
   */
  static async GetExpenseById(Request, Response) {
    try {
      const UserId = Request.User.UserId;
      const { Id } = Request.params;

      const Expense = await ExpenseModel.GetExpenseById(Id, UserId);

      if (!Expense) {
        return Response.status(404).json({
          Success: false,
          Message: 'Expense not found',
        });
      }

      // Decrypt amount
      let DecryptedAmount;
      try {
        DecryptedAmount = DecryptAndParseAmount(Expense.AmountEncrypted ?? Expense.amountencrypted);
      } catch (err) {
        console.error(`Failed to decrypt expense ${Expense.ExpenseId ?? Expense.expenseid}:`, err.message);
        DecryptedAmount = 0; // Set to 0 if decryption fails
      }

      Response.status(200).json({
        Success: true,
        Data: {
          Expense: {
            ...Expense,
            Amount: DecryptedAmount,
            AmountEncrypted: undefined,
          },
        },
      });
    } catch (Err) {
      console.error('Get expense error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to retrieve expense',
        Error: Err.message,
      });
    }
  }

  /**
   * Update an expense
   */
  static async UpdateExpense(Request, Response) {
    try {
      const UserId = Request.User.UserId;
      const { Id } = Request.params;
      const {
        Amount,
        Department,
        DateConsumed,
        Description,
        ExpenseType,
        LinkedCashRequestId,
      } = Request.body;

      const UpdateData = {
        Department,
        DateConsumed,
        Description,
        ExpenseType,
        LinkedCashRequestId,
      };

      // Encrypt amount if provided
      if (Amount !== undefined) {
        UpdateData.AmountEncrypted = ValidateAndEncryptAmount(Amount);
      }

      const UpdatedExpense = await ExpenseModel.UpdateExpense(Id, UserId, UpdateData);

      if (!UpdatedExpense) {
        return Response.status(404).json({
          Success: false,
          Message: 'Expense not found or unauthorized',
        });
      }

      // Decrypt amount
      let DecryptedAmount;
      try {
        DecryptedAmount = DecryptAndParseAmount(UpdatedExpense.AmountEncrypted ?? UpdatedExpense.amountencrypted);
      } catch (err) {
        console.error(`Failed to decrypt updated expense ${UpdatedExpense.ExpenseId ?? UpdatedExpense.expenseid}:`, err.message);
        DecryptedAmount = parseFloat(Amount) || 0; // Fallback to input amount
      }

      Response.status(200).json({
        Success: true,
        Message: 'Expense updated successfully',
        Data: {
          Expense: {
            ...UpdatedExpense,
            Amount: DecryptedAmount,
            AmountEncrypted: undefined,
          },
        },
      });
    } catch (Err) {
      console.error('Update expense error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to update expense',
        Error: Err.message,
      });
    }
  }

  /**
   * Delete an expense
   */
  static async DeleteExpense(Request, Response) {
    try {
      const UserId = Request.User.UserId;
      const { Id } = Request.params;

      const DeletedExpense = await ExpenseModel.DeleteExpense(Id, UserId);

      if (!DeletedExpense) {
        return Response.status(404).json({
          Success: false,
          Message: 'Expense not found or unauthorized',
        });
      }

      Response.status(200).json({
        Success: true,
        Message: 'Expense deleted successfully',
      });
    } catch (Err) {
      console.error('Delete expense error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to delete expense',
        Error: Err.message,
      });
    }
  }

  /**
   * Get all expenses (admin view)
   */
  static async GetAllExpenses(Request, Response) {
    try {
      const Expenses = await ExpenseModel.GetAllExpenses();

      // Decrypt amounts
      const DecryptedExpenses = Expenses.map(Expense => {
        try {
          return {
            ...Expense,
            Amount: DecryptAndParseAmount(Expense.AmountEncrypted ?? Expense.amountencrypted),
            AmountEncrypted: undefined,
          };
        } catch (err) {
          console.error(`Failed to decrypt expense ${Expense.ExpenseId ?? Expense.expenseid}:`, err.message);
          return {
            ...Expense,
            Amount: 0, // Set to 0 if decryption fails
            AmountEncrypted: undefined,
          };
        }
      });

      Response.status(200).json({
        Success: true,
        Data: {
          Expenses: DecryptedExpenses,
          Count: DecryptedExpenses.length,
        },
      });
    } catch (Err) {
      console.error('Get all expenses error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to retrieve expenses',
        Error: Err.message,
      });
    }
  }
}

module.exports = ExpenseController;