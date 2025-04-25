// These routes do not require authentication
// @type {string[]}
export const publicRoutes = ["/"];

/**
 * An array of routes that are used for authentication.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const authRoutes = ["/auth/login", "/auth/register"];

/**
 * The prefix used for authentication-related API routes.
 * This helps in identifying API authentication endpoints.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after a successful login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

/**
 * The default redirect path after a successful registration.
 * @type {string}
 */
export const DEFAULT_REGISTER_REDIRECT = "/login";

/**
 * The default redirect path after logging out.
 * @type {string}
 */
export const DEFAULT_LOGOUT_REDIRECT = "/";

/**
 * The default redirect path after requesting a password reset.
 * @type {string}
 */
export const DEFAULT_FORGOT_PASSWORD_REDIRECT = "/login";

/**
 * The default redirect path after successfully resetting the password.
 * @type {string}
 */
export const DEFAULT_RESET_PASSWORD_REDIRECT = "/login";

/**
 * The default redirect path after confirming an email.
 * @type {string}
 */
export const DEFAULT_CONFIRM_EMAIL_REDIRECT = "/login";

/**
 * The default redirect path after successfully confirming an email.
 * @type {string}
 */
export const DEFAULT_CONFIRM_EMAIL_SUCCESS_REDIRECT = "/login";
