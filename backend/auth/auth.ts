import { createClient } from "@supabase/supabase-js";
import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";

const supabaseUrl = secret("SupabaseUrl");
const supabaseServiceKey = secret("SupabaseServiceKey");

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface AuthData {
  userID: string;
  email: string;
}

const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    const token = data.authorization?.replace("Bearer ", "") ?? data.session?.value;
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    try {
      const supabase = createClient(supabaseUrl(), supabaseServiceKey());
      const { data: user, error } = await supabase.auth.getUser(token);
      
      if (error || !user.user) {
        throw APIError.unauthenticated("invalid token");
      }

      return {
        userID: user.user.id,
        email: user.user.email || "",
      };
    } catch (err) {
      throw APIError.unauthenticated("invalid token", err);
    }
  }
);

export const gw = new Gateway({ authHandler: auth });
