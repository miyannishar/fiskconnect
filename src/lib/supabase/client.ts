import { createBrowserClient } from "@supabase/ssr";

// Docs: use PUBLISHABLE_KEY (or anon key) — https://supabase.com/docs/guides/auth/quickstarts/nextjs
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * No-op lock to avoid "Navigator LockManager lock timed out" errors when the
 * browser client and middleware both touch auth (session is server-managed via cookies).
 * See: https://github.com/supabase/supabase-js/issues/1594
 */
const noOpLock = async <R>(
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<R>
): Promise<R> => fn();

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey, {
    auth: { lock: noOpLock },
  });
}
