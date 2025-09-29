export interface AdminAccessPolicyService {
  isAuthorized(userEmail: string): boolean;
}
