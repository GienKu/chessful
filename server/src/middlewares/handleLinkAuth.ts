import { Request, Response, NextFunction } from 'express';
import passport, { AuthenticateCallback } from 'passport';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  const pathToEnv = path.resolve(__dirname, '..', '..', '..', '.env');
  dotenv.config({ path: pathToEnv });
}

const BASE_URL = process.env.BASE_URL;
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;

/**
 * Middleware to handle link authentication using JWT.
 *
 * This middleware uses Passport to authenticate requests based on a JWT
 * provided in the URL. If authentication fails, the user is redirected
 * to a "not verified" page. If authentication succeeds, the request is
 * passed to the next middleware.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
export const linkAuth = (req: Request, res: Response, next: NextFunction) => {
  const authenticateCallback: AuthenticateCallback = (
    err,
    data,
    info,
    status
  ) => {
    if (err) {
      return next(err);
    }
    if (!data) {
      return res
        .status(401)
        .redirect(`${CLIENT_BASE_URL}/verification-failure`);
    }
    next();
  };

  const cb = passport.authenticate(
    'jwt-url',
    { session: false },
    authenticateCallback
  );

  cb(req, res, next);
};
