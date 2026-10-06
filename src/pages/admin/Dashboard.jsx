import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  LogOut, Search, X, Mail, Phone, Building2, Calendar,
  Loader2, AlertCircle, RefreshCw, Inbox,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'
import { brand, inquiryStatuses } from '../../config/site.js'
import BrandLogo from '../../components/BrandLogo.jsx'
import './Admin.css'

const statusLabel = (value) =>
  inquiryStatuses.find((s) => s.value === value)?.label ?? value

export default function AdminDashboard() {
  const { user, signOut } = useAuth()

  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(false)

  const loadInquiries = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: fetchError } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Could not load inquiries. Please try refreshing.')
    } else {
      setInquiries(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadInquiries()
  }, [loadInquiries])

  const counts = useMemo(() => {
    const base = { new: 0, contacted: 0, in_progress: 0, closed: 0 }
    for (const inq of inquiries) {
      if (base[inq.status] !== undefined) base[inq.status] += 1
    }
    return base
  }, [inquiries])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return inquiries.filter((inq) => {
      const matchesStatus = statusFilter === 'all' || inq.status === statusFilter
      if (!matchesStatus) return false
      if (!q) return true
      return (
        inq.full_name?.toLowerCase().includes(q) ||
        inq.email?.toLowerCase().includes(q) ||
        inq.business_name?.toLowerCase().includes(q)
      )
    })
  }, [inquiries, search, statusFilter])

  const handleStatusChange = async (inquiry, newStatus) => {
    setUpdating(true)
    const { error: updateError } = await supabase
      .from('inquiries')
      .update({ status: newStatus })
      .eq('id', inquiry.id)

    if (!updateError) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiry.id ? { ...i, status: newStatus } : i))
      )
      setSelected((prev) => (prev && prev.id === inquiry.id ? { ...prev, status: newStatus } : prev))
    }
    setUpdating(false)
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="container admin-header__inner">
          <div className="admin-header__brand">
            <BrandLogo variant="mark" />
            <div>
              <strong>{brand.name} Admin</strong>
              <span className="admin-header__user">{user?.email}</span>
            </div>
          </div>
          <button className="btn btn--secondary admin-header__logout" onClick={signOut}>
            <LogOut size={16} aria-hidden="true" /> Log out
          </button>
        </div>
      </header>

      <div className="container admin-content">
        <div className="admin-stats">
          {inquiryStatuses.map((s) => (
            <button
              key={s.value}
              type="button"
              className={'admin-stat-card' + (statusFilter === s.value ? ' is-active' : '')}
              onClick={() => setStatusFilter(statusFilter === s.value ? 'all' : s.value)}
            >
              <span className="admin-stat-card__count">{counts[s.value] ?? 0}</span>
              <span className="admin-stat-card__label">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search by name, email, or business…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search inquiries"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="admin-filter"
          >
            <option value="all">All statuses</option>
            {inquiryStatuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <button className="btn btn--secondary admin-refresh" onClick={loadInquiries} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} aria-hidden="true" /> Refresh
          </button>
        </div>

        {error && (
          <p className="admin-error" role="alert">
            <AlertCircle size={16} aria-hidden="true" /> {error}
          </p>
        )}

        {loading ? (
          <div className="admin-empty">
            <Loader2 size={22} className="spin" aria-hidden="true" />
            <p>Loading inquiries…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <Inbox size={22} aria-hidden="true" />
            <p>{inquiries.length === 0 ? 'No inquiries yet.' : 'No inquiries match your search or filter.'}</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Business</th>
                  <th scope="col">Service</th>
                  <th scope="col">Status</th>
                  <th scope="col">Received</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => (
                  <tr key={inq.id} onClick={() => setSelected(inq)} tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') setSelected(inq) }}>
                    <td>
                      <span className="admin-table__primary">{inq.full_name}</span>
                      <span className="admin-table__secondary">{inq.email}</span>
                    </td>
                    <td>{inq.business_name || '—'}</td>
                    <td>{inq.service_needed}</td>
                    <td>
                      <span className={`status-pill status-pill--${inq.status}`}>
                        {statusLabel(inq.status)}
                      </span>
                    </td>
                    <td>{new Date(inq.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <InquiryDetail
          inquiry={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  )
}

function InquiryDetail({ inquiry, onClose, onStatusChange, updating }) {
  return (
    <div className="admin-drawer-overlay" onClick={onClose}>
      <aside
        className="admin-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Inquiry from ${inquiry.full_name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-drawer__head">
          <h2>{inquiry.full_name}</h2>
          <button className="admin-drawer__close" onClick={onClose} aria-label="Close inquiry detail">
            <X size={20} />
          </button>
        </div>

        <div className="admin-drawer__meta">
          <span className="admin-drawer__meta-item"><Mail size={15} aria-hidden="true" /> {inquiry.email}</span>
          {inquiry.phone && (
            <span className="admin-drawer__meta-item"><Phone size={15} aria-hidden="true" /> {inquiry.phone}</span>
          )}
          {inquiry.business_name && (
            <span className="admin-drawer__meta-item"><Building2 size={15} aria-hidden="true" /> {inquiry.business_name}</span>
          )}
          <span className="admin-drawer__meta-item">
            <Calendar size={15} aria-hidden="true" /> {new Date(inquiry.created_at).toLocaleString()}
          </span>
        </div>

        <div className="admin-drawer__field">
          <span className="admin-drawer__field-label">Service needed</span>
          <p>{inquiry.service_needed}</p>
        </div>

        {inquiry.budget_range && (
          <div className="admin-drawer__field">
            <span className="admin-drawer__field-label">Budget range</span>
            <p>{inquiry.budget_range}</p>
          </div>
        )}

        <div className="admin-drawer__field">
          <span className="admin-drawer__field-label">Project details</span>
          <p className="admin-drawer__details">{inquiry.project_details}</p>
        </div>

        <div className="admin-drawer__field">
          <label className="admin-drawer__field-label" htmlFor="status-select">Status</label>
          <select
            id="status-select"
            value={inquiry.status}
            disabled={updating}
            onChange={(e) => onStatusChange(inquiry, e.target.value)}
          >
            {inquiryStatuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </aside>
    </div>
  )
}
