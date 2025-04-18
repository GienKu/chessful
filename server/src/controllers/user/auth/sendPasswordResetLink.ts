import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { parse as vParse } from 'valibot';
import { ResetPasswordSchema } from '../../../validation-schemas/validationSchemas';
import { generateJwtToken } from '../../../utils/generateJwtToken';
import User from '../../../db/models/User';
import { AppError } from '../../../errors/AppError';
import { sendResetPasswordLink } from '../../../config/nodemailer/nodemailer';

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  const pathToEnv = path.resolve(__dirname, '..', '..', '..', '..', '.env');
  dotenv.config({ path: pathToEnv });
}

const BASE_URL = process.env.BASE_URL;

if (!BASE_URL) {
  throw new Error('BASE_URL is not defined');
}

/**
 * Sends a password reset link to the user's email.
 *
 * @param req - The request object containing the user's email in the body.
 * @param res - The response object used to send the status and message.
 * @param next - The next middleware function in the stack.
 *
 * @throws {AppError} If the user with the provided email does not exist.
 *
 * @returns {Promise<void>} A promise that resolves when the password reset link is sent.
 */
export const sendPasswordResetLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = vParse(ResetPasswordSchema, req.body);

    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new AppError('User with this email does not exist', 404);
    }

    const token = generateJwtToken({
      id: user.id,
      role: user.role,
      tokenType: 'password-reset',
      exp: '1h',
    });

    const verificationLink = `${BASE_URL}/api/verify-password-reset-link?token=${token}`;
    
    await sendResetPasswordLink(user.email, verificationLink);

    res.status(200).redirect('/');
  } catch (error: any) {
    next(error);
  }
};
