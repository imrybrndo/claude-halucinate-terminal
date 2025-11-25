import { ENV } from "./_core/env";

export type UserRole = "user" | "admin";

export type User = {
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: UserRole;
  lastSignedIn: Date;
};

type UpsertInput = Partial<User> & { openId: string };

const userStore = new Map<string, User>();

const deriveRole = (openId: string, requested?: UserRole): UserRole => {
  if (requested) return requested;
  if (ENV.ownerOpenId && ENV.ownerOpenId === openId) {
    return "admin";
  }
  return "user";
};

export async function getUserByOpenId(
  openId: string
): Promise<User | undefined> {
  return userStore.get(openId);
}

export async function upsertUser(input: UpsertInput): Promise<User> {
  if (!input.openId) {
    throw new Error("openId is required");
  }

  const existing = userStore.get(input.openId);
  const next: User = {
    openId: input.openId,
    name: input.name ?? existing?.name ?? null,
    email: input.email ?? existing?.email ?? null,
    loginMethod: input.loginMethod ?? existing?.loginMethod ?? null,
    role: deriveRole(input.openId, input.role ?? existing?.role),
    lastSignedIn: input.lastSignedIn ?? existing?.lastSignedIn ?? new Date(),
  };

  userStore.set(next.openId, next);
  return next;
}

