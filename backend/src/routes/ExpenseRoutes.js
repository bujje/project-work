const express = require('express');
const { body } = require('express-validator');
const ExpenseController = require('../controllers/ExpenseController');
const { ValidateRequest } = require('../middleware/ValidationMiddleware');
const { AuthenticateRequest } = require('../middleware/AuthMiddleware');

const Router = express.Router();

// All routes require authentication
Router.use(AuthenticateRequest);

/**
 * @route   POST /api/expenses
 * @desc    Create a new expense
 * @access  Private
 */
Router.post(
  '/',
  [
    body('Amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isNumeric()
      .withMessage('Amount must be a number'),
    body('Department')
      .trim()
      .notEmpty()
      .withMessage('Department is required'),
    body('DateConsumed')
      .notEmpty()
      .withMessage('Date consumed is required')
      .isDate()
      .withMessage('Invalid date format'),
    body('Description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),
    body('ExpenseType')
      .trim()
      .notEmpty()
      .withMessage('Expense type is required')
      .isIn(['Travel', 'Supplies', 'Miscellaneous', 'Equipment', 'Training', 'Other'])
      .withMessage('Invalid expense type'),
    body('LinkedCashRequestId')
      .optional({ checkFalsy: true })
      .isInt()
      .withMessage('Linked cash request ID must be an integer'),
    ValidateRequest,
  ],
  ExpenseController.CreateExpense
);

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses for current user
 * @access  Private
 */
Router.get('/', ExpenseController.GetUserExpenses);

/**
 * @route   GET /api/expenses/all
 * @desc    Get all expenses (admin)
 * @access  Private
 */
Router.get('/all', ExpenseController.GetAllExpenses);

/**
 * @route   GET /api/expenses/:Id
 * @desc    Get a single expense by ID
 * @access  Private
 */
Router.get('/:Id', ExpenseController.GetExpenseById);

/**
 * @route   PUT /api/expenses/:Id
 * @desc    Update an expense
 * @access  Private
 */
Router.put(
  '/:Id',
  [
    body('Amount')
      .optional()
      .isNumeric()
      .withMessage('Amount must be a number'),
    body('Department')
      .optional()
      .trim(),
    body('DateConsumed')
      .optional()
      .isDate()
      .withMessage('Invalid date format'),
    body('Description')
      .optional()
      .trim(),
    body('ExpenseType')
      .optional()
      .trim()
      .isIn(['Travel', 'Supplies', 'Miscellaneous', 'Equipment', 'Training', 'Other'])
      .withMessage('Invalid expense type'),
    body('LinkedCashRequestId')
      .optional({ checkFalsy: true })
      .isInt()
      .withMessage('Linked cash request ID must be an integer'),
    ValidateRequest,
  ],
  ExpenseController.UpdateExpense
);

/**
 * @route   DELETE /api/expenses/:Id
 * @desc    Delete an expense
 * @access  Private
 */
Router.delete('/:Id', ExpenseController.DeleteExpense);

module.exports = Router;