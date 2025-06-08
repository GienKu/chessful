import { Request, Response, NextFunction } from 'express';
import { parse as vParse } from 'valibot';
import { RegisterSchema } from '../../../validation-schemas/validationSchemas';
import { hashPassword } from '../../../utils/passwordUtils';
import { generateJwtToken } from '../../../utils/generateJwtToken';
import { AppError } from '../../../errors/AppError';
import User from '../../../db/models/User';
import { sendEmailConfirmationLink } from '../../../config/nodemailer/nodemailer';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  const pathToEnv = path.resolve(__dirname, '..', '..', '..', '..', '.env');
  dotenv.config({ path: pathToEnv });
}

const BASE_URL = process.env.BASE_URL;

/**
 * Handles user registration.
 *
 * This function performs the following steps:
 * 1. Validates the request body against the `RegisterSchema`.
 * 2. Checks if the email already exists in the database.
 * 3. Creates a new user with the provided username, email, and hashed password.
 * 4. Generates a JWT token for immediate login.
 * 5. Generates a JWT token for email verification.
 * 6. Sends an email confirmation link to the user's email.
 * 7. Sets an HTTP-only cookie with the authentication token.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 *
 * @throws Will throw an error if `BASE_URL` is not defined.
 * @throws Will throw an error if the email already exists.
 */
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!BASE_URL) {
      throw new Error('BASE_URL is not defined');
    }

    const { username, email, password } = vParse(RegisterSchema, req.body);

    const emailOrUsernameExists = !!(await User.findOne({
      $or: [{ email: email }, { username: username }],
    }));

    if (emailOrUsernameExists) {
      throw new AppError('Email or username already exists', 400);
    }

    // create user
    const user = await new User({
      username,
      email,
      password: await hashPassword(password),
    });

    // create token to immediately login user
    const token = generateJwtToken({
      id: user.id,
      role: user.role,
      tokenType: 'user-requests',
    });

    // create jwt token for verification
    const emailToken = generateJwtToken({
      id: user.id,
      role: user.role,
      tokenType: 'email-verification',
    });

    // send verification link
    await sendEmailConfirmationLink(
      user.email,
      `${BASE_URL}/api/verify-email?token=${emailToken}`
    );

    await user.save();
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.status(201).json({
      message:
        'User registered successfully. Please check your email to verify your account.',
    });
  } catch (error: any) {
    next(error);
  }
};
