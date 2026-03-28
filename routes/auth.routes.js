import express from "express";
import { validation } from "../middlewares/validation.js";
import { register, activateAccount, login, forgetCode, restPassword } from "../controllers/auth.controller.js";
import {
  validateRegisterUser,
  validateLogin,
  validateActivateAccount,
  ValidateForgetCode,
  ValidateresetPassword,
} from "../validators/authSchema.js";

const route = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registration, login, and password management
 */

// ─────────────────────────────────────────────────────────────────────────────
// POST /Auth/register
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /Auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new account and sends a confirmation email. The account must be activated before login.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Registration successful — confirmation email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               success: true
 *               message: "Check your email to activate your account"
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Email already exists"
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
route.post("/register", validation(validateRegisterUser), register);

// ─────────────────────────────────────────────────────────────────────────────
// GET /Auth/activate_account/:token
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /Auth/activate_account/{token}:
 *   get:
 *     summary: Activate account via email link
 *     description: Confirms the user's email and activates the account. The token is sent in the confirmation email.
 *     tags: [Auth]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: JWT token received in the activation email
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Account activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               success: true
 *               message: "Account activated successfully"
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Token is invalid or expired"
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
route.get("/activate_account/:token", validation(validateActivateAccount), activateAccount);

// ─────────────────────────────────────────────────────────────────────────────
// POST /Auth/login
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /Auth/login:
 *   post:
 *     summary: Login
 *     description: |
 *       Authenticates the user and sets an HTTP-only `token` cookie.
 *       All subsequent protected requests will use this cookie automatically.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful — `token` cookie is set
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only JWT cookie
 *             schema:
 *               type: string
 *               example: "token=eyJhbG...; HttpOnly; Path=/"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Wrong password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Invalid credentials"
 *       403:
 *         description: Account not activated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Please activate your account first"
 *       404:
 *         description: Email not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Email not found"
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
route.post("/login", validation(validateLogin), login);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /Auth/forget-code
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /Auth/forget-code:
 *   patch:
 *     summary: Request a password reset code
 *     description: Sends a 6-digit reset code to the provided email address.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetCodeRequest'
 *     responses:
 *       200:
 *         description: Reset code sent to email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               success: true
 *               message: "Reset code sent to your email"
 *       404:
 *         description: Email not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Email not found"
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
route.patch("/forget-code", validation(ValidateForgetCode), forgetCode);

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /Auth/reset-password
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /Auth/reset-password:
 *   patch:
 *     summary: Reset password using the code
 *     description: Verifies the reset code and updates the user's password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               success: true
 *               message: "Password reset successfully"
 *       400:
 *         description: Invalid or expired reset code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Invalid or expired reset code"
 *       404:
 *         description: Email not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Email not found"
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
route.patch("/reset-password", validation(ValidateresetPassword), restPassword);

export default route;