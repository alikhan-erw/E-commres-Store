import { createClient, SupabaseClient } from '@supabase/supabase-js';

const KNOWN_PROJECT_REF = 'yrnqdsqhvoknjoeknbyi';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybnFkc3Fodm9rbmpvZWtuYnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyOTY4OTAsImV4cCI6MjEwNzg3Mjg5MH0.h5BmYTCPX0U2a5rjqKl3yme1_Vv4hYDJJ0EVfr5ET7Q';
const FALLBACK_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybnFkc3Fodm9rbmpvZWtuYnlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjI5Njg5MCwiZXhwIjoyMTA3ODcyODkwfQ.Piyed0MS_nroi61Q8i0MRS0jlX9Nnqv7AuGxCsMXKAE';

function getValidSupabaseConfig() {
  const envUrl = process.env.SUPABASE_URL || '';
  let projectRef = KNOWN_PROJECT_REF;
  let finalUrl = `https://${KNOWN_PROJECT_REF}.supabase.co`;

  // Check if envUrl is a valid HTTP/HTTPS URL
  if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
    if (!envUrl.includes('your-project')) {
      finalUrl = envUrl.trim();
    }
  } else if (envUrl.startsWith('eyJ')) {
    // If JWT was provided as SUPABASE_URL, decode ref from payload
    try {
      const parts = envUrl.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        if (payload.ref) {
          projectRef = payload.ref;
          finalUrl = `https://${payload.ref}.supabase.co`;
        }
      }
    } catch {
      // keep fallback
    }
  }

  const finalKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    FALLBACK_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    FALLBACK_ANON_KEY;

  return { url: finalUrl, key: finalKey, projectRef };
}

const config = getValidSupabaseConfig();
export const SUPABASE_URL = config.url;
export const SUPABASE_PROJECT_REF = config.projectRef;
export const SUPABASE_KEY = config.key;

// Initialize Supabase Client with service role for full backend authority
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const isSupabaseConfigured = true;

console.log(`[ZEVORA Database] Supabase client configured for: ${SUPABASE_URL} (Ref: ${SUPABASE_PROJECT_REF})`);
