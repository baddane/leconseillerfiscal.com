import { supabase } from './supabase'

const ZERO_UUID = '00000000-0000-0000-0000-000000000000'

// Vérifie le mot de passe admin via une RPC protégée (ne renvoie aucune donnée).
// Réutilisé par les routes /api/admin/*.
export async function verifyAdminPassword(password: unknown): Promise<boolean> {
  if (typeof password !== 'string' || !password) return false
  const { error } = await supabase.rpc('lcf_admin_set_read', {
    p_password: password,
    p_kind: 'contact',
    p_id: ZERO_UUID,
    p_read: false,
  })
  return !error
}
