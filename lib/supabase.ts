"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const defaultSupabaseUrl = "https://kqggtikhgzvzreiraosi.supabase.co";
const defaultPublishableKey = "sb_publishable_jgtQ0j-VX1TCSKy_SgrxsA_jMbxo-hN";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || defaultSupabaseUrl;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || defaultPublishableKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

let browserClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}
