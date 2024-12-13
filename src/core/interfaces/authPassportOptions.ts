import {AuthenticateOptions} from "passport";

export interface IAuthPassportOptions extends AuthenticateOptions {
    authInfo?: boolean | undefined;
    /**
     * Assign the object provided by the verify callback to given property.
     */
    assignProperty?: string | undefined;
    /**
     * True to flash failure messages
     * or a string to use as a flash message for failures
     * (overrides any from the strategy itself).
     */
    failureFlash?: string | boolean | undefined;
    /**
     * True to store failure message in `req.session.messages`,
     * or a string to use as override message for failure.
     */
    failureMessage?: boolean | string | undefined;
    /**
     * After failed login, redirect to given URL.
     */
    failureRedirect?: string | undefined;
    failWithError?: boolean | undefined;
    keepSessionInfo?: boolean | undefined;
    /**
     * Save login state in session, defaults to `true`.
     */
    session?: boolean | undefined;
    scope?: string | string[] | undefined;
    /**
     * True to flash success messages
     * or a string to use as a flash message for success
     * (overrides any from the strategy itself).
     */
    successFlash?: string | boolean | undefined;
    /**
     * True to store success message in `req.session.messages`,
     * or a string to use as override message for success.
     */
    successMessage?: boolean | string | undefined;
    /**
     * After successful login, redirect to given URL.
     */
    successRedirect?: string | undefined;
    successReturnToOrRedirect?: string | undefined;
    state?: string | undefined;
    /**
     * Pause the request stream before deserializing the user
     * object from the session.  Defaults to `false`.  Should
     * be set to `true` in cases where middleware consuming the
     * request body is configured after passport and the
     * deserializeUser method is asynchronous.
     */
    pauseStream?: boolean | undefined;
    /**
     * Determines what property on `req`
     * will be set to the authenticated user object.
     * Default `'user'`.
     */
    userProperty?: string | undefined;
    passReqToCallback?: boolean | undefined;
    prompt?: string | undefined;
}