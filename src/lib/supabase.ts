import { createClient } from '@supabase/supabase-js'

// URL + clé publishable du projet Supabase (partagé avec guide-taechir, tables préfixées lcf_).
// Ces valeurs sont publiques : la clé publishable ne peut QU'INSÉRER dans les tables
// lcf_* (RLS insert-only) et appeler les RPC admin protégées par mot de passe.
// La lecture des données n'est possible que via les fonctions serveur (mot de passe requis).
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://yjxuutdnhsvrbbgcqltw.supabase.co'
const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  'sb_publishable_x4ehI4AgVADT4U190djnGg_eXRCPd9c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false },
})

// ── Types des enregistrements (tels qu'exposés par lcf_admin_list) ──────────
export interface LcfContactMessage {
  id: string
  name: string | null
  email: string
  subject: string | null
  message: string | null
  is_read: boolean
  created_at: string
}

export interface LcfLead {
  id: string
  name: string | null
  email: string
  phone: string | null
  country: string | null
  source: string
  message: string | null
  is_read: boolean
  created_at: string
}
