const express = require('express');
const { body } = require('express-validator');
const CashRequestController = require('../controllers/CashRequestController');
const { ValidateRequest } = require('../middleware/ValidationMiddleware');
const { AuthenticateRequest } = require('../middleware/AuthMiddleware');

const Router = express.Router();

// All routes require authentication
Router.use(AuthenticateRequest);

/**
 * @route   POST /api/cash-requests
 * @desc    Create a new cash request
 * @access  Private
 */
Router.post(
  '/',
  [
    body('AmountUsed')
      .notEmpty()
      .withMessage('Amount is required')
      .isNumeric()
      .withMessage('Amount must be a number'),
    body('Department')
      .trim()
      .notEmpty()
      .withMessage('Department is required'),
    body('DateOfNeeded')
      .notEmpty()
      .withMessage('Date of needed is required')
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
    ValidateRequest,
  ],
  CashRequestController.CreateCashRequest
);

/**
 * @route   GET /api/cash-requests
 * @desc    Get all cash requests for current user
 * @access  Private
 */
Router.get('/', CashRequestController.GetUserCashRequests);

/**
 * @route   GET /api/cash-requests/all
 * @desc    Get all cash requests (admin)
 * @access  Private
 */
Router.get('/all', CashRequestController.GetAllCashRequests);

/**
 * @route   GET /api/cash-requests/:Id
 * @desc    Get a single cash request by ID
 * @access  Private
 */
Router.get('/:Id', CashRequestController.GetCashRequestById);

/**
 * @route   PUT /api/cash-requests/:Id
 * @desc    Update a cash request
 * @access  Private
 */
Router.put(
  '/:Id',
  [
    body('AmountUsed')
      .optional()
      .isNumeric()
      .withMessage('Amount must be a number'),
    body('Department')
      .optional()
      .trim(),
    body('DateOfNeeded')
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
    body('Status')
      .optional()
      .trim()
      .isIn(['Pending', 'Approved', 'Rejected', 'Completed'])
      .withMessage('Invalid status'),
    ValidateRequest,
  ],
  CashRequestController.UpdateCashRequest
);

/**
 * @route   DELETE /api/cash-requests/:Id
 * @desc    Delete a cash request
 * @access  Private
 */
Router.delete('/:Id', CashRequestController.DeleteCashRequest);

module.exports = Router;