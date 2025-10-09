export interface IBetterAuthService {
  getSession(headers: Headers): Promise<unknown>;
  signInSocial(provider: string, options?: SocialSignInOptions): Promise<void>;
  signOut(): Promise<void>;
}

export interface SocialSignInOptions {
  callbackURL?: string;
  errorCallbackURL?: string;
  newUserCallbackURL?: string;
  disableRedirect?: boolean;
}
