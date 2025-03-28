// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { parse as vParse } from 'valibot';
import { LoginSchema } from '../../../validation-schemas/validationSchemas';
import { verifyPassword } from '../../../utils/passwordUtils';
import { generateJwtToken } from '../../../utils/generateJwtToken';
import { AppError } from '../../../errors/AppError';
import User from '../../../db/models/User';
import { UserLoginResponse } from '../../../../../interfaces/ApiResponses';
/**
 * Controller for handling user login requests.
 *
 * @param req - The request object containing user login details.
 * @param res - The response object used to send back the appropriate response.
 * @param next - The next middleware function in the stack.
 *
 * @throws {Error} If required environment variables are missing.
 * @throws {AppError} If the email or password is not valid.
 * @throws {AppError} If the user role is not valid.
 *
 * @returns A response with a success message and the user details.
 */
export const userLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = vParse(LoginSchema, req.body);

    // find user in db
    const user = await User.findOne({
      email: email,
    }).exec();

    // if user not found or password is not valid
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new AppError('Email or password is not valid', 401);
    }

    // create access token
    const token = generateJwtToken({
      id: user.id,
      role: user.role,
      tokenType: 'user-requests',
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    res.status(200).json({
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          rating: {
            bullet: user.rating.bullet,
            blitz: user.rating.blitz,
            rapid: user.rating.rapid,
            classical: user.rating.classical,
          },
          totalGames: user.totalGames,
          winCount: user.winCount,
          lossCount: user.lossCount,
          drawCount: user.drawCount,
          friends: user.friends.map((friend) => friend.toString()),
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};
