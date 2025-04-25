import { UserRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  rol: UserRole;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
