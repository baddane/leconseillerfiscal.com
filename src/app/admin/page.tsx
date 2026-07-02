'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Lock, LogOut, RefreshCw, Trash2, Mail, MailOpen, Inbox, Users,
  KeyRound, AlertCircle, Phone, MapPin, Send, Check, ClipboardList,
} from 'lucide-react'
import { supabase, type LcfContactMessage, type LcfLead } from '@/lib/supabase'

const PW_KEY = 'lcf_admin_pw'
type Tab = 'contacts' | 'leads' | 'bilan' | 'newsletter'
interface AdminData {
  contacts: LcfContactMessage[]
  leads: LcfLead[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [data, setData] = useState<AdminData>({ contacts: [], leads: [] })
  const [tab, setTab] = useState<Tab>('contacts')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  // Récupère le mot de passe courant (state si connecté, sinon sessionStorage)
  const currentPw = useCallback(
    () => (typeof window !== 'undefined' ? sessionStorage.getItem(PW_KEY) ?? password : password),
    [password],
  )

  const loadData = useCallback(async (pw: string): Promise<boolean> => {
    setLoading(true)
    setError('')
    const { data: rpcData, error: rpcError } = await supabase.rpc('lcf_admin_list', { p_password: pw })
    setLoading(false)
    if (rpcError) {
      setError(rpcError.message === 'unauthorized' ? 'Mot de passe incorrect.' : rpcError.message)
      return false
    }
    setData({
      contacts: (rpcData?.contacts ?? []) as LcfContactMessage[],
      leads: (rpcData?.leads ?? []) as LcfLead[],
    })
    return true
  }, [])

  // Auto-connexion si un mot de passe est déjà en session
  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY)
    if (saved) {
      loadData(saved).then((ok) => {
        if (ok) setAuthed(true)
        else sessionStorage.removeItem(PW_KEY)
      })
    }
  }, [loadData])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!password) return
    const ok = await loadData(password)
    if (ok) {
      sessionStorage.setItem(PW_KEY, password)
      setAuthed(true)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(PW_KEY)
    setAuthed(false)
    setPassword('')
    setData({ contacts: [], leads: [] })
  }

  async function toggleRead(kind: 'contact' | 'lead', id: string, isRead: boolean) {
    setBusyId(id)
    const { error: e } = await supabase.rpc('lcf_admin_set_read', {
      p_password: currentPw(), p_kind: kind, p_id: id, p_read: !isRead,
    })
    if (!e) await loadData(currentPw())
    else setError(e.message)
    setBusyId(null)
  }

  async function remove(kind: 'contact' | 'lead', id: string) {
    if (!confirm('Supprimer définitivement cet enregistrement ?')) return
    setBusyId(id)
    const { error: e } = await supabase.rpc('lcf_admin_delete', {
      p_password: currentPw(), p_kind: kind, p_id: id,
    })
    if (!e) await loadData(currentPw())
    else setError(e.message)
    setBusyId(null)
  }

  const bilanLeads = useMemo(() => data.leads.filter((l) => l.source === 'bilan-fiscal'), [data.leads])
  const otherLeads = useMemo(() => data.leads.filter((l) => l.source !== 'bilan-fiscal'), [data.leads])
  const unreadContacts = useMemo(() => data.contacts.filter((c) => !c.is_read).length, [data.contacts])
  const unreadLeads = useMemo(() => otherLeads.filter((l) => !l.is_read).length, [otherLeads])
  const unreadBilan = useMemo(() => bilanLeads.filter((l) => !l.is_read).length, [bilanLeads])

  // ── Écran de connexion ────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-ink text-paper flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-ink" />
            </div>
            <span className="font-serif text-xl font-bold">
              Le Conseiller <em className="text-gold not-italic font-normal">Fiscal</em>
            </span>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label className="font-mono text-[11px] uppercase tracking-widest text-gold">
              Espace administration
            </label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="bg-paper/5 border border-paper/20 px-4 py-3 text-paper placeholder-paper/30 font-sans focus:outline-none focus:border-gold transition-colors"
            />
            {error && (
              <p className="flex items-center gap-2 text-red text-sm font-sans">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-gold text-ink font-mono text-xs font-bold uppercase tracking-widest py-3 hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Tableau de bord ───────────────────────────────────────────────────────
  const leadRows = tab === 'bilan' ? bilanLeads : otherLeads
  const rows = tab === 'contacts' ? data.contacts : leadRows

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Barre supérieure */}
      <header className="bg-ink text-paper">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="font-serif text-lg font-bold">
            Admin · <em className="text-gold not-italic font-normal">Le Conseiller Fiscal</em>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(currentPw())}
              disabled={loading}
              className="flex items-center gap-2 border border-paper/20 px-3 py-2 font-mono text-[11px] uppercase tracking-wider hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualiser
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-paper/20 px-3 py-2 font-mono text-[11px] uppercase tracking-wider hover:border-red hover:text-red transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Onglets */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <TabButton
            active={tab === 'contacts'} onClick={() => setTab('contacts')}
            icon={<Inbox className="w-4 h-4" />} label="Messages" badge={unreadContacts}
          />
          <TabButton
            active={tab === 'leads'} onClick={() => setTab('leads')}
            icon={<Users className="w-4 h-4" />} label="Leads" badge={unreadLeads}
          />
          <TabButton
            active={tab === 'bilan'} onClick={() => setTab('bilan')}
            icon={<ClipboardList className="w-4 h-4" />} label="Bilan fiscal" badge={unreadBilan}
          />
          <TabButton
            active={tab === 'newsletter'} onClick={() => setTab('newsletter')}
            icon={<Send className="w-4 h-4" />} label="Newsletter" badge={0}
          />
        </div>

        {error && (
          <p className="flex items-center gap-2 text-red text-sm font-sans mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </p>
        )}

        {tab === 'newsletter' ? (
          <NewsletterPanel getPw={currentPw} />
        ) : rows.length === 0 ? (
          <div className="text-center py-24 text-grey font-sans">
            <Inbox className="w-10 h-10 mx-auto mb-4 opacity-30" />
            {tab === 'bilan'
              ? 'Aucune demande de bilan fiscal pour le moment.'
              : tab === 'leads'
              ? 'Aucun lead pour le moment.'
              : 'Aucun message pour le moment.'}
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {tab === 'contacts'
              ? (rows as LcfContactMessage[]).map((c) => (
                  <ContactCard
                    key={c.id} item={c} busy={busyId === c.id}
                    onToggleRead={() => toggleRead('contact', c.id, c.is_read)}
                    onDelete={() => remove('contact', c.id)}
                  />
                ))
              : (rows as LcfLead[]).map((l) => (
                  <LeadCard
                    key={l.id} item={l} busy={busyId === l.id}
                    onToggleRead={() => toggleRead('lead', l.id, l.is_read)}
                    onDelete={() => remove('lead', l.id)}
                  />
                ))}
          </ul>
        )}

        {tab !== 'newsletter' && <ChangePasswordSection getPw={currentPw} />}
      </div>
    </div>
  )
}

// ── Sous-composants ───────────────────────────────────────────────────────
function TabButton({
  active, onClick, icon, label, badge,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge: number
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider border-b-2 -mb-px transition-colors ${
        active ? 'border-gold text-ink' : 'border-transparent text-grey hover:text-ink'
      }`}
    >
      {icon} {label}
      {badge > 0 && (
        <span className="ml-1 bg-gold text-ink text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  )
}

function CardShell({
  isRead, busy, createdAt, onToggleRead, onDelete, children,
}: {
  isRead: boolean; busy: boolean; createdAt: string
  onToggleRead: () => void; onDelete: () => void; children: React.ReactNode
}) {
  return (
    <li
      className={`border p-5 transition-colors ${
        isRead ? 'border-border bg-transparent' : 'border-gold/40 bg-gold/5'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">{children}</div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="font-mono text-[10px] uppercase tracking-wider text-grey">
            {formatDate(createdAt)}
          </span>
          <div className="flex gap-1">
            <button
              onClick={onToggleRead} disabled={busy} title={isRead ? 'Marquer non lu' : 'Marquer lu'}
              className="p-2 border border-border text-grey hover:text-gold hover:border-gold transition-colors disabled:opacity-40"
            >
              {isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
            </button>
            <button
              onClick={onDelete} disabled={busy} title="Supprimer"
              className="p-2 border border-border text-grey hover:text-red hover:border-red transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

function ContactCard({
  item, busy, onToggleRead, onDelete,
}: {
  item: LcfContactMessage; busy: boolean; onToggleRead: () => void; onDelete: () => void
}) {
  return (
    <CardShell isRead={item.is_read} busy={busy} createdAt={item.created_at} onToggleRead={onToggleRead} onDelete={onDelete}>
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="font-serif text-lg font-bold">{item.name || 'Sans nom'}</span>
        {!item.is_read && <span className="font-mono text-[10px] uppercase tracking-wider text-gold">Nouveau</span>}
      </div>
      <a href={`mailto:${item.email}`} className="font-sans text-sm text-grey hover:text-gold break-all">{item.email}</a>
      {item.subject && (
        <p className="font-mono text-[11px] uppercase tracking-wider text-grey mt-2">Sujet : {item.subject}</p>
      )}
      {item.message && <p className="font-sans text-sm mt-3 whitespace-pre-wrap leading-relaxed">{item.message}</p>}
    </CardShell>
  )
}

function LeadCard({
  item, busy, onToggleRead, onDelete,
}: {
  item: LcfLead; busy: boolean; onToggleRead: () => void; onDelete: () => void
}) {
  return (
    <CardShell isRead={item.is_read} busy={busy} createdAt={item.created_at} onToggleRead={onToggleRead} onDelete={onDelete}>
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="font-serif text-lg font-bold">{item.name || 'Lead'}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider bg-ink text-paper px-2 py-0.5">{item.source}</span>
        {!item.is_read && <span className="font-mono text-[10px] uppercase tracking-wider text-gold">Nouveau</span>}
      </div>
      <a href={`mailto:${item.email}`} className="font-sans text-sm text-grey hover:text-gold break-all">{item.email}</a>
      <div className="flex flex-wrap gap-4 mt-2">
        {item.phone && (
          <span className="flex items-center gap-1.5 font-sans text-sm text-grey">
            <Phone className="w-3.5 h-3.5" /> {item.phone}
          </span>
        )}
        {item.country && (
          <span className="flex items-center gap-1.5 font-sans text-sm text-grey">
            <MapPin className="w-3.5 h-3.5" /> {item.country}
          </span>
        )}
      </div>
      {item.message && <p className="font-sans text-sm mt-3 whitespace-pre-wrap leading-relaxed">{item.message}</p>}
    </CardShell>
  )
}

function ChangePasswordSection({ getPw }: { getPw: () => string }) {
  const [open, setOpen] = useState(false)
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    if (newPw.length < 8) {
      setMsg('Le nouveau mot de passe doit faire au moins 8 caractères.')
      return
    }
    const { error } = await supabase.rpc('lcf_admin_change_password', { p_old: oldPw, p_new: newPw })
    if (error) {
      setMsg(error.message === 'unauthorized' ? 'Ancien mot de passe incorrect.' : error.message)
      return
    }
    sessionStorage.setItem(PW_KEY, newPw)
    setMsg('Mot de passe mis à jour.')
    setOldPw(''); setNewPw('')
  }

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-grey hover:text-gold transition-colors"
      >
        <KeyRound className="w-3.5 h-3.5" /> Changer le mot de passe
      </button>
      {open && (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3 max-w-sm">
          <input
            type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)}
            placeholder="Mot de passe actuel" autoComplete="current-password"
            className="border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-gold"
          />
          <input
            type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
            placeholder="Nouveau mot de passe" autoComplete="new-password"
            className="border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-gold"
          />
          {msg && <p className="font-sans text-sm text-grey">{msg}</p>}
          <button
            type="submit"
            className="bg-ink text-paper font-mono text-[11px] uppercase tracking-wider py-2.5 hover:bg-gold hover:text-ink transition-colors"
          >
            Mettre à jour
          </button>
        </form>
      )}
    </div>
  )
}

// ── Panneau Newsletter ─────────────────────────────────────────────────────
interface NewsletterArticle { slug: string; title: string; pays: string }

function NewsletterPanel({ getPw }: { getPw: () => string }) {
  const [articles, setArticles] = useState<NewsletterArticle[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [testEmail, setTestEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<'test' | 'send' | null>(null)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: getPw(), action: 'list' }),
        })
        const data = await res.json()
        if (!alive) return
        if (res.ok) setArticles(data.articles || [])
        else setMsg({ type: 'err', text: data.error || 'Erreur de chargement' })
      } catch {
        if (alive) setMsg({ type: 'err', text: 'Erreur réseau' })
      }
      if (alive) setLoading(false)
    })()
    return () => { alive = false }
  }, [getPw])

  function toggle(slug: string) {
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(slug)) n.delete(slug)
      else n.add(slug)
      return n
    })
  }

  async function call(action: 'test' | 'send') {
    setMsg(null)
    if (selected.size === 0) { setMsg({ type: 'err', text: 'Sélectionnez au moins un article.' }); return }
    if (action === 'test' && !testEmail) { setMsg({ type: 'err', text: 'Renseignez une adresse de test.' }); return }
    if (action === 'send' && !confirm('Envoyer la newsletter à TOUTE la liste d’abonnés ?')) return
    setBusy(action)
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: getPw(), action, slugs: [...selected], testEmail }),
      })
      const data = await res.json()
      if (res.ok) {
        setMsg({ type: 'ok', text: action === 'test' ? `Test envoyé à ${data.to}. Vérifiez votre boîte (et les spams).` : 'Newsletter envoyée à toute la liste ✓' })
      } else {
        setMsg({ type: 'err', text: data.error || 'Erreur lors de l’envoi' })
      }
    } catch {
      setMsg({ type: 'err', text: 'Erreur réseau' })
    }
    setBusy(null)
  }

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">Newsletter</p>
      <h2 className="font-serif text-2xl font-bold mb-2 text-ink">Envoyer une newsletter</h2>
      <p className="text-grey font-sans text-sm mb-6">
        Sélectionnez le ou les articles à mettre en avant. Les dernières actualités fiscales sont
        ajoutées automatiquement en « à ne pas manquer ». Faites un test avant d’envoyer à toute la liste.
      </p>

      {msg && (
        <p className={`flex items-center gap-2 text-sm font-sans mb-4 ${msg.type === 'ok' ? 'text-gold' : 'text-red'}`}>
          <AlertCircle className="w-4 h-4 shrink-0" /> {msg.text}
        </p>
      )}

      <div className="border border-border bg-white mb-6">
        <div className="px-4 py-2 border-b border-border font-mono text-[11px] uppercase tracking-wider text-grey">
          Articles — {selected.size} sélectionné{selected.size > 1 ? 's' : ''}
        </div>
        {loading ? (
          <div className="p-6 text-grey text-sm font-sans">Chargement…</div>
        ) : (
          <ul className="max-h-80 overflow-y-auto divide-y divide-border">
            {articles.map((a) => (
              <li key={a.slug}>
                <button
                  onClick={() => toggle(a.slug)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-paper transition-colors"
                >
                  <span className={`w-4 h-4 border flex items-center justify-center shrink-0 ${selected.has(a.slug) ? 'bg-gold border-gold' : 'border-border'}`}>
                    {selected.has(a.slug) && <Check className="w-3 h-3 text-ink" />}
                  </span>
                  <span className="flex-1 font-sans text-sm text-ink truncate">{a.title}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-grey shrink-0">{a.pays}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)}
          placeholder="votre@email.com (test)"
          className="flex-1 border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold"
        />
        <button
          onClick={() => call('test')} disabled={busy !== null}
          className="flex items-center justify-center gap-2 border border-ink px-5 py-3 font-mono text-[11px] uppercase tracking-wider hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
        >
          <Mail className="w-4 h-4" /> {busy === 'test' ? 'Envoi…' : 'Envoyer un test'}
        </button>
      </div>

      <button
        onClick={() => call('send')} disabled={busy !== null || selected.size === 0}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gold text-ink px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        <Send className="w-4 h-4" /> {busy === 'send' ? 'Envoi…' : 'Envoyer à toute la liste'}
      </button>
    </div>
  )
}
