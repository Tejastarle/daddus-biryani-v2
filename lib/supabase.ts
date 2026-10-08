import { createClient } from '@supabase/supabase-js';

/**
 * Supabase connection.
 *
 * The keys come from .env.local (and from your hosting provider's environment
 * variables once deployed). That file is never committed or zipped, so after
 * extracting the project to a new folder you have to create it again — see
 * SETUP_INSTRUCTIONS.md.
 *
 * If the keys are missing we fall back to a harmless placeholder instead of
 * throwing. A missing key should not take the whole website down: the menu,
 * photos and every page still work, and only the database features (saving a
 * lead, loading blog posts) are unavailable.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

/** Catches the case where the example values were pasted without being replaced. */
const PLACEHOLDERS = ['your-anon-key', 'your-project', 'YOUR-PROJECT', 'placeholder', 'dummy', 'xxx'];
const looksLikePlaceholder = (v: string) => PLACEHOLDERS.some((x) => v.toLowerCase().includes(x.toLowerCase()));

const missing = !supabaseUrl || !supabaseAnonKey;
const placeholder = !missing && (looksLikePlaceholder(supabaseUrl) || looksLikePlaceholder(supabaseAnonKey));

export const isSupabaseConfigured = !missing && !placeholder;

if (missing) {
  console.warn(
    '[Supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set.\n' +
      'Create a .env.local file in the project root (next to package.json) and restart with "npm run dev".\n' +
      'The site will run, but enquiries will not be saved and blog posts will not load.',
  );
} else if (placeholder) {
  console.warn(
    '[Supabase] .env.local still contains the EXAMPLE values, not your real keys.\n' +
      'Replace them with the Project URL and anon key from Supabase: Project Settings -> API,\n' +
      'then restart with "npm run dev". Until then, enquiries will not be saved.',
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);

export type Lead = {
  id: string;
  name: string;
  /** Optional: the website's forms ask for a phone number, not an email. */
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified';
  created_at: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
};
