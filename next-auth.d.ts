import type { DefaultSession } from "next-auth";
import type { AdminUserRole } from "@/lib/db/schema";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      role?: "admin";
      adminRole?: AdminUserRole;
      adminUserId?: number;
    };
  }

  interface User {
    role?: "admin";
    adminRole?: AdminUserRole;
    adminUserId?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin";
    adminRole?: AdminUserRole;
    adminUserId?: number;
  }
}
