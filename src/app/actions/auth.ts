"use server";

import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/types";

/**
 * Sign up with email and password using the server Supabase client.
 * Session is stored in cookies by the server client (per Supabase Next.js docs).
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 * @see https://supabase.com/docs/guides/auth/passwords
 */
export async function signUp(formData: {
  email: string;
  password: string;
  full_name: string;
  role: Role;
}): Promise<
  | { success: true; path: string }
  | { success: false; error: string; needsConfirmation?: boolean }
> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.email.trim(),
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name.trim(),
        role: formData.role,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: "Sign up failed. Please try again." };
  }

  if (!data.session) {
    return {
      success: false,
      error:
        "Please check your email and click the confirmation link to finish signing up. Then log in.",
      needsConfirmation: true,
    };
  }

  const dashboard: Record<Role, string> = {
    student: "/student",
    alumni: "/alumni",
    admin: "/admin",
  };

  return { success: true, path: dashboard[formData.role] };
}
