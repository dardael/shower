import { auth } from '@/infrastructure/auth/BetterAuthInstance';
import { toNextJsHandler } from 'better-auth/next-js';

export const { POST, GET } = toNextJsHandler(auth);
