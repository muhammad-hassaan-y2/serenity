// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-expect-error: We're extending the Session type, even if it's not used directly
import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role: string;
  }
}
