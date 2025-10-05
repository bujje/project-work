const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const { ValidateRequest } = require('../middleware/ValidationMiddleware');
const { AuthenticateRequest } = require('../middleware/AuthMiddleware');

const Router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
Router.post(
  '/register',
  [
    body('Username')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Username must be between 3 and 100 characters'),
    body('Email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('Password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('FullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required'),
    body('Department')
      .optional()
      .trim(),
    ValidateRequest,
  ],
  AuthController.RegisterUser
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
Router.post(
  '/login',
  [
    body('Email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('Password')
      .notEmpty()
      .withMessage('Password is required'),
    ValidateRequest,
  ],
  AuthController.LoginUser
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
Router.post('/logout', AuthenticateRequest, AuthController.LogoutUser);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
Router.get('/me', AuthenticateRequest, AuthController.GetCurrentUser);

module.exports = Router;