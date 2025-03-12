import * as v from 'valibot';

/**
 * Schema for validating login credentials.
 * 
 * This schema validates the following fields:
 * - `email`: A string that must be a valid email address.
 * - `password`: A string that must be at least 8 characters long.
 */
export const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

/**
 * Schema for validating user registration data.
 * 
 * This schema ensures that the following fields are present and valid:
 * - `username`: A string with a minimum length of 3 characters.
 * - `email`: A valid email address.
 * - `password`: A string with a minimum length of 8 characters.
 */
export const RegisterSchema = v.object({
  username: v.pipe(v.string(), v.minLength(3)),
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

/**
 * Schema for validating the reset password request.
 * 
 * This schema ensures that the provided email is a valid string and follows the email format.
 * 
 * @constant {Object} ResetPasswordSchema - The validation schema for reset password.
 * @property {string} email - The email address of the user requesting the password reset.
 */
export const ResetPasswordSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});

/**
 * Schema for validating a new password.
 * 
 * This schema ensures that the password is a string with a minimum length of 8 characters.
 * 
 * @constant {object} NewPasswordSchema - The schema object for password validation.
 * @property {string} password - The password to be validated.
 */
export const NewPasswordSchema = v.object({
  password: v.pipe(v.string(), v.minLength(8)),
});



/**
 * A validation schema for MongoDB ObjectId.
 * 
 * This schema validates that the input is a string and matches the pattern
 * of a 24-character hexadecimal string, which is the format of a MongoDB ObjectId.
 * 
 * @example
 * // Valid ObjectId
 * const validId = "507f1f77bcf86cd799439011";
 * 
 * // Invalid ObjectId
 * const invalidId = "12345";
 * 
 * @remarks
 * This schema uses a regular expression to ensure the input string is exactly
 * 24 characters long and contains only hexadecimal characters (0-9, a-f, A-F).
 * 
 * @throws {ValidationError}
 * Throws a validation error if the input does not match the required format.
 */
export const ObjectIdSchema = v.pipe(
  v.string(),
  v.regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid 24-character hex string')
);



export type LoginData = v.InferOutput<typeof LoginSchema>;
export type RegisterData = v.InferOutput<typeof RegisterSchema>;
export type ResetPasswordData = v.InferOutput<typeof ResetPasswordSchema>;
export type NewPasswordData = v.InferOutput<typeof NewPasswordSchema>;

