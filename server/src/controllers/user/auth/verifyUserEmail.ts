import { Request, Response, NextFunction } from 'express';
import User from '../../../db/models/User';
import { generateJwtToken } from '../../../utils/generateJwtToken';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  const pathToEnv = path.resolve(__dirname, '..', '..', '..', '..', '.env');
  dotenv.config({ path: pathToEnv });
}

const BASE_URL = process.env.BASE_URL;
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;
/**
 * Verifies the user's email by updating the `verifiedAt` field in the user's record.
 *
 * @param req - The request object, which should contain a valid JWT payload.
 * @param res - The response object used to send the response back to the client.
 * @param next - The next middleware function in the stack.
 *
 * @throws Will throw an error if the JWT payload is not attached to the request.
 *
 * @returns Redirects the user to the appropriate URL based on the verification status.
 *
 * - If the user is successfully verified, a new JWT token is generated and set as a cookie,
 *   and the user is redirected to the cloud page.
 * - If the user is not verified, the user is redirected to the not-verified page.
 */

export const verifyUserEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // after jwt token is valid its payload is added to request
    if (!req.jwtPayload) {
      throw new Error('jwtPayload not attached to request');
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.jwtPayload.sub, isVerified: false },
      { isVerified: true },
      { new: true }
    ).exec();

    if (!updatedUser) {
      res.status(401).json({ message: 'User not found or already verified' });
      return;
    }

    const token = generateJwtToken({
      id: updatedUser.id,
      role: updatedUser.role,
      tokenType: 'user-requests',
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.status(200).redirect(`${CLIENT_BASE_URL}/verification-success`);
  } catch (error: any) {
    next(error);
  }
};
