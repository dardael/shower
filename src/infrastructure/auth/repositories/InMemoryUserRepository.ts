import { injectable } from 'tsyringe';
import { User } from '@/domain/auth/entities/User';
import { UserRepository } from '@/domain/auth/repositories/UserRepository';

@injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | null> {
    return this.users.get(email) || null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.email, user);
  }
}
