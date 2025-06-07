import jwt from 'jsonwebtoken';
import path from 'path';
import ms from 'ms';

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  const pathToEnv = path.resolve(__dirname, '..', '..', '..', '..', '.env');
  dotenv.config({ path: pathToEnv });
}

const JWT_PRIV_KEY = process.env.JWT_PRIV_KEY;

interface JwtClaims {
  id: string;
  role: Role;
  tokenType: string;
  exp?: ms.StringValue;
}

/**
 * Generates a JSON Web Token (JWT) using the provided claims.
 *
 * @param {JwtClaims} claims - The claims to include in the JWT.
 * @param {string} claims.id - The unique identifier for the subject of the token.
 * @param {string} claims.role - The role of the subject.
 * @param {string} claims.tokenType - The type of the token.
 * @param {string} [claims.exp] - The expiration time of the token. Defaults to '1h' if not provided.
 * @returns {string} The generated JWT.
 * @throws {Error} If the JWT_PRIV_KEY is not defined.
 */
export const generateJwtToken = ({ id, role, tokenType, exp }: JwtClaims) => {
  if (!JWT_PRIV_KEY) {
    throw new Error('JWT_PRIV_KEY is not defined');
  }

  const expiresIn = exp ?? '1h';
  const now = Date.now();
  const iat = Math.floor(now / 1000);
  const expInSeconds = Math.floor(ms(expiresIn) / 1000);
  const expTimestamp = iat + expInSeconds;

  const jwtPayload: CustomJwtPayload = {
    sub: id,
    role,
    tokenType,
    iat: iat,
  };

  const token = jwt.sign(jwtPayload, JWT_PRIV_KEY, {
    algorithm: 'RS256',
    expiresIn: expiresIn,
  });

  return token;
};
