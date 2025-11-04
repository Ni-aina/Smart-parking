import { Session, User, WeakPassword } from "@supabase/supabase-js";

export interface AuthenticatedUser {
  user: User;
  session: Session;
  weakPassword?: WeakPassword;
}

export interface UnauthenticatedUser {
  user: null;
  session: null;
  weakPassword?: null;
}