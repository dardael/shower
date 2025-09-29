export interface OAuthService {
  getUser(oAuthToken: string): Promise<{ email: string }>;
}
