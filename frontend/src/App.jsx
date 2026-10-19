import { useEffect, useMemo, useState } from 'react'
import { Activity, BookOpen, CalendarDays, Check, ChevronDown, CircleHelp, Clock3, LayoutDashboard, LogOut, Mail, Menu, MessageCircle, Phone, Plus, Search, Settings, Stethoscope, Trash2, User, Users, X, RefreshCw, Pencil, HeartPulse, LifeBuoy, Shield } from 'lucide-react'

const emptyDoctor = { dname: '', dphno: '', demail: '', dspec: '', davail: true }
const emptyPatient = { pname: '', pphno: '', pemail: '', page: '' }
const emptyAppointment = { doctor: '', patient: '', appoint_date: '', appoint_time: '' }
const sections = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays },
]

async function api(path, options = {}) {
  const response = await fetch(`/api/${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
  if (response.status === 204) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const details = Object.entries(data).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? JSON.stringify(value) : value}`).join('\n')
    throw new Error(details || `Request failed (${response.status})`)
  }
  return data
}

export default function App() {
  const [section, setSection] = useState('dashboard')
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [helpTab, setHelpTab] = useState('guide')
  const [supportForm, setSupportForm] = useState({ name: '', email: '', message: '' })
  const [supportSent, setSupportSent] = useState(false)

  // Demo hospital admin profile (shown in top-right avatar menu)
  const adminProfile = {
    name: 'Dr. Admin',
    role: 'Hospital Administrator',
    email: 'admin@carepoint.hospital',
    phone: '+91 98765 43210',
    hospital: 'CarePoint Multi-Specialty Hospital',
  }

  function submitSupport(e) {
    e.preventDefault()
    if (!supportForm.name.trim() || !supportForm.email.trim() || !supportForm.message.trim()) return
    setSupportSent(true)
    setNotice('Support request submitted. Our team will respond shortly.')
    window.setTimeout(() => setNotice(''), 3500)
    setSupportForm({ name: '', email: '', message: '' })
    window.setTimeout(() => setSupportSent(false), 4000)
  }

  async function refresh() {
    setLoading(true); setError('')
    try {
      const [d, p, a] = await Promise.all([api('doctors/'), api('patients/'), api('appointments/')])
      setDoctors(d); setPatients(p); setAppointments(a)
    } catch (e) { setError(e.message || 'Could not connect to the Django API.') }
    finally { setLoading(false) }
  }
  useEffect(() => { refresh() }, [])

  const activeItems = section === 'doctors' ? doctors : section === 'patients' ? patients : appointments
  const filteredItems = useMemo(() => activeItems.filter(item => JSON.stringify(item).toLowerCase().includes(query.toLowerCase())), [activeItems, query])
  const pageTitle = sections.find(item => item.id === section)?.label || 'Overview'

  async function saveRecord(event) {
    event.preventDefault(); setSaving(true); setError('')
    const { type, record } = modal
    const path = type === 'doctor' ? 'doctors/' : type === 'patient' ? 'patients/' : 'appointments/'
    const payload = { ...record }
    if (type === 'doctor') { payload.dphno = Number(payload.dphno); payload.davail = Boolean(payload.davail) }
    if (type === 'patient') { payload.pphno = Number(payload.pphno); payload.page = Number(payload.page) }
    if (type === 'appointment') { payload.doctor = Number(payload.doctor); payload.patient = Number(payload.patient) }
    try {
      await api(path + (record.id ? `${record.id}/` : ''), { method: record.id ? 'PUT' : 'POST', body: JSON.stringify(payload) })
      setModal(null); setNotice(`${type[0].toUpperCase() + type.slice(1)} ${record.id ? 'updated' : 'added'} successfully.`); await refresh()
      window.setTimeout(() => setNotice(''), 3500)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function deleteRecord(type, item) {
    if (!window.confirm(`Delete this ${type}? This action cannot be undone.`)) return
    const path = type === 'doctor' ? 'doctors/' : type === 'patient' ? 'patients/' : 'appointments/'
    try { await api(`${path}${item.id}/`, { method: 'DELETE' }); setNotice(`${type[0].toUpperCase() + type.slice(1)} deleted.`); await refresh() }
    catch (e) { setError(e.message) }
  }

  function openCreate(type) {
    const data = type === 'doctor' ? emptyDoctor : type === 'patient' ? emptyPatient : emptyAppointment
    setError(''); setModal({ type, record: { ...data } })
  }
  function openEdit(type, record) { setError(''); setModal({ type, record: { ...record } }) }
  const titleCase = value => value ? value[0].toUpperCase() + value.slice(1) : ''

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><HeartPulse size={23}/></div><div><strong>CarePoint</strong><span>HOSPITAL SYSTEM</span></div></div>
      <div className="side-caption">WORKSPACE</div>
      <nav>{sections.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${section === id ? 'selected' : ''}`} onClick={() => { setSection(id); setQuery('') }}><Icon size={18}/><span>{label}</span>{id === 'appointments' && <span className="nav-count">{appointments.length}</span>}</button>)}</nav>
      <button type="button" className="sidebar-bottom help-trigger" onClick={() => { setHelpOpen(true); setHelpTab('guide') }}>
        <div className="help-icon"><CircleHelp size={18}/></div>
        <div><b>Need a hand?</b><p>Guides, FAQs & support</p></div>
      </button>
      <div className="sidebar-foot"><span className="online-dot"/> API workspace <span className="version">v1.0</span></div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <div className="mobile-brand"><HeartPulse size={22}/> CarePoint</div>
        <div className="breadcrumb">Workspace <span>/</span> <b>{pageTitle}</b></div>
        <div className="topbar-right">
          <span className="today-label"><Clock3 size={15}/> Hospital operations</span>
          <div className="profile-menu-wrap">
            <button type="button" className={`avatar profile-avatar-btn ${profileOpen ? 'open' : ''}`} onClick={() => setProfileOpen(v => !v)} title="Open profile" aria-label="Open profile menu">
              {adminProfile.name.split(' ').map(w => w[0]).slice(0,2).join('')}
            </button>
            {profileOpen && (
              <>
                <div className="profile-backdrop" onClick={() => setProfileOpen(false)} />
                <div className="profile-dropdown">
                  <div className="profile-dropdown-head">
                    <div className="profile-avatar-lg">{adminProfile.name.split(' ').map(w => w[0]).slice(0,2).join('')}</div>
                    <div>
                      <b>{adminProfile.name}</b>
                      <small>{adminProfile.role}</small>
                    </div>
                  </div>
                  <div className="profile-meta">
                    <div><Mail size={14}/><span>{adminProfile.email}</span></div>
                    <div><Phone size={14}/><span>{adminProfile.phone}</span></div>
                    <div><Shield size={14}/><span>{adminProfile.hospital}</span></div>
                  </div>
                  <div className="profile-stats-mini">
                    <div><b>{doctors.length}</b><span>Doctors</span></div>
                    <div><b>{patients.length}</b><span>Patients</span></div>
                    <div><b>{appointments.length}</b><span>Appts</span></div>
                  </div>
                  <div className="profile-actions-list">
                    <button type="button" onClick={() => { setSection('dashboard'); setProfileOpen(false) }}><LayoutDashboard size={15}/> Overview dashboard</button>
                    <button type="button" onClick={() => { setSection('doctors'); setProfileOpen(false) }}><Stethoscope size={15}/> Manage doctors</button>
                    <button type="button" onClick={() => { setSection('patients'); setProfileOpen(false) }}><Users size={15}/> Manage patients</button>
                    <button type="button" onClick={() => { setHelpOpen(true); setHelpTab('guide'); setProfileOpen(false) }}><Settings size={15}/> Help & settings</button>
                  </div>
                  <button type="button" className="profile-signout" onClick={() => { setProfileOpen(false); setNotice('Signed out of admin workspace (demo). Refresh to continue.'); window.setTimeout(() => setNotice(''), 4000) }}>
                    <LogOut size={15}/> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="content">
        <div className="page-heading"><div><div className="eyebrow">HOSPITAL MANAGEMENT</div><h1>{section === 'dashboard' ? 'Good day, team' : pageTitle}</h1><p>{section === 'dashboard' ? 'Here is what is happening at your hospital today.' : `Manage your ${pageTitle.toLowerCase()} records in one place.`}</p></div>{section !== 'dashboard' && <button className="primary-btn" onClick={() => openCreate(section === 'doctors' ? 'doctor' : section === 'patients' ? 'patient' : 'appointment')}><Plus size={17}/> Add {section === 'appointments' ? 'appointment' : section.slice(0, -1)}</button>}</div>

        {notice && <div className="notice"><Check size={17}/>{notice}<button onClick={() => setNotice('')}><X size={15}/></button></div>}
        {error && <div className="error-banner"><div><b>Something needs attention</b><p>{error}</p>{error.includes('fetch') || error.includes('connect') ? <small>Start the Django server on port 8000, then refresh.</small> : null}</div><button className="icon-btn" onClick={() => setError('')}><X size={17}/></button></div>}

        {section === 'dashboard' ? <>
          <div className="welcome-card"><div className="welcome-copy"><span className="welcome-tag"><Activity size={14}/> YOUR CARE, CONNECTED</span><h2>Better care starts with<br/>better coordination.</h2><p>Keep your doctors, patients and appointments organized from a single workspace.</p><button className="welcome-btn" onClick={() => setSection('appointments')}>View appointments <span>→</span></button></div><div className="welcome-art"><div className="art-circle"><HeartPulse size={82} strokeWidth={1.2}/></div><div className="floating-card float-one"><Users size={17}/><span><b>{patients.length}</b><small>Patients</small></span></div><div className="floating-card float-two"><CalendarDays size={17}/><span><b>{appointments.length}</b><small>Appointments</small></span></div></div></div>
          <div className="section-title-row"><div><h2>Hospital overview</h2><p>A quick snapshot of your records</p></div><button className="refresh-btn" onClick={refresh}><RefreshCw size={15}/> Refresh data</button></div>
          <div className="stats-grid"><StatCard icon={Stethoscope} color="teal" label="Total doctors" value={doctors.length} sub={`${doctors.filter(d => d.davail).length} marked available`}/><StatCard icon={Users} color="blue" label="Registered patients" value={patients.length} sub="Patient records in system"/><StatCard icon={CalendarDays} color="purple" label="Appointments" value={appointments.length} sub="Scheduled records"/><StatCard icon={Activity} color="orange" label="Available doctors" value={doctors.filter(d => d.davail).length} sub="Ready to take appointments"/></div>
          <div className="dashboard-lower"><div className="panel recent-panel"><div className="panel-heading"><div><h3>Recent appointments</h3><p>Latest scheduled visits</p></div><button className="text-btn" onClick={() => setSection('appointments')}>View all →</button></div>{loading ? <Loading/> : appointments.length ? <div className="mini-list">{appointments.slice(-5).reverse().map(a => <div className="mini-row" key={a.id}><div className="mini-avatar">{(a.patient_name || 'P').charAt(0)}</div><div className="mini-main"><b>{a.patient_name || `Patient #${a.patient}`}</b><span>Dr. {a.doctor_name || `#${a.doctor}`}</span></div><div className="mini-date">{a.appoint_date}<small>{a.appoint_time}</small></div></div>)}</div> : <Empty text="No appointments yet. Add an appointment to get started."/>}</div><div className="panel quick-panel"><div className="panel-heading"><div><h3>Quick actions</h3><p>Common tasks at a glance</p></div></div><QuickAction icon={Stethoscope} title="Register a doctor" text="Add a new medical professional" onClick={() => openCreate('doctor')}/><QuickAction icon={Users} title="Add a patient" text="Create a patient record" onClick={() => openCreate('patient')}/><QuickAction icon={CalendarDays} title="Schedule appointment" text="Plan a patient visit" onClick={() => openCreate('appointment')}/></div></div>
        </> : <div className="panel data-panel"><div className="table-toolbar"><div><h2>{pageTitle} directory</h2><p>{filteredItems.length} record{filteredItems.length === 1 ? '' : 's'} found</p></div><div className="table-tools"><div className="search-box"><Search size={16}/><input placeholder={`Search ${pageTitle.toLowerCase()}...`} value={query} onChange={e => setQuery(e.target.value)}/>{query && <button onClick={() => setQuery('')}><X size={14}/></button>}</div><button className="icon-btn" title="Refresh" onClick={refresh}><RefreshCw size={16}/></button></div></div>
          {loading ? <Loading/> : <div className="table-wrap"><table><thead><tr>{section === 'doctors' ? <><th>DOCTOR</th><th>CONTACT</th><th>SPECIALIZATION</th><th>STATUS</th><th className="actions-head">ACTIONS</th></> : section === 'patients' ? <><th>PATIENT</th><th>CONTACT</th><th>EMAIL</th><th>AGE</th><th className="actions-head">ACTIONS</th></> : <><th>APPOINTMENT</th><th>PATIENT</th><th>DOCTOR</th><th>DATE</th><th>TIME</th><th className="actions-head">ACTIONS</th></>}</tr></thead><tbody>{filteredItems.map(item => <tr key={item.id}>{section === 'doctors' ? <><td><div className="person-cell"><div className="table-avatar teal-avatar">{(item.dname || 'D').charAt(0)}</div><div><b>{item.dname}</b><small>Doctor ID #{item.id}</small></div></div></td><td>{item.dphno}</td><td>{item.dspec}</td><td><span className={`status ${item.davail ? 'available' : 'unavailable'}`}><span/>{item.davail ? 'Available' : 'Unavailable'}</span></td><td><Actions onEdit={() => openEdit('doctor', item)} onDelete={() => deleteRecord('doctor', item)}/></td></> : section === 'patients' ? <><td><div className="person-cell"><div className="table-avatar blue-avatar">{(item.pname || 'P').charAt(0)}</div><div><b>{item.pname}</b><small>Patient ID #{item.id}</small></div></div></td><td>{item.pphno}</td><td>{item.pemail}</td><td>{item.page} years</td><td><Actions onEdit={() => openEdit('patient', item)} onDelete={() => deleteRecord('patient', item)}/></td></> : <><td><b className="appointment-id">APT-{String(item.id).padStart(4, '0')}</b></td><td>{item.patient_name || `Patient #${item.patient}`}</td><td>{item.doctor_name || `Doctor #${item.doctor}`}</td><td>{item.appoint_date}</td><td>{item.appoint_time}</td><td><Actions onEdit={() => openEdit('appointment', item)} onDelete={() => deleteRecord('appointment', item)}/></td></>}</tr>)}</tbody></table>{filteredItems.length === 0 && <Empty text={query ? 'No matching records. Try another search.' : `No ${pageTitle.toLowerCase()} records yet. Add your first record to begin.`}/>}</div>}
        </div>}
        <footer className="footer"><span>© 2026 CarePoint Hospital Management</span><span>React frontend <i/> Django REST backend</span></footer>
      </div>
    </main>
    
      {helpOpen && (
        <div className="help-overlay" onClick={() => setHelpOpen(false)}>
          <aside className="help-drawer" onClick={e => e.stopPropagation()}>
            <div className="help-drawer-head">
              <div className="help-drawer-title"><LifeBuoy size={20}/><div><b>Need a hand?</b><small>CarePoint support center</small></div></div>
              <button type="button" className="icon-btn" onClick={() => setHelpOpen(false)} aria-label="Close help"><X size={16}/></button>
            </div>
            <div className="help-tabs">
              <button type="button" className={helpTab === 'guide' ? 'active' : ''} onClick={() => setHelpTab('guide')}><BookOpen size={14}/> Guide</button>
              <button type="button" className={helpTab === 'faq' ? 'active' : ''} onClick={() => setHelpTab('faq')}><CircleHelp size={14}/> FAQ</button>
              <button type="button" className={helpTab === 'support' ? 'active' : ''} onClick={() => setHelpTab('support')}><MessageCircle size={14}/> Support</button>
            </div>
            <div className="help-body">
              {helpTab === 'guide' && (
                <div className="help-section">
                  <h4>Quick start</h4>
                  <ol className="help-steps">
                    <li><b>Doctors</b> — Add specialists with phone, email, specialty and availability.</li>
                    <li><b>Patients</b> — Register patients with contact details and age.</li>
                    <li><b>Appointments</b> — Link a patient to a doctor with date and time.</li>
                    <li><b>Overview</b> — Monitor counts and jump to daily tasks.</li>
                  </ol>
                  <h4>Tips for recruiters / demos</h4>
                  <ul className="help-list">
                    <li>Use search on each list to filter records instantly.</li>
                    <li>Edit or delete any row with the action buttons.</li>
                    <li>Availability flag on doctors helps schedule only free staff.</li>
                    <li>All data is served from the Django REST API.</li>
                  </ul>
                  <div className="help-quick-links">
                    <button type="button" onClick={() => { setSection('doctors'); setHelpOpen(false); openCreate('doctor') }}>＋ Add doctor</button>
                    <button type="button" onClick={() => { setSection('patients'); setHelpOpen(false); openCreate('patient') }}>＋ Add patient</button>
                    <button type="button" onClick={() => { setSection('appointments'); setHelpOpen(false); openCreate('appointment') }}>＋ Book appointment</button>
                  </div>
                </div>
              )}
              {helpTab === 'faq' && (
                <div className="help-section">
                  <details open><summary>How do I create an appointment?</summary><p>Open Appointments → Add appointment → select patient, doctor, date and time → Save.</p></details>
                  <details><summary>Why is a doctor unavailable?</summary><p>Open Doctors → Edit → uncheck “Available for appointments” if the doctor is on leave.</p></details>
                  <details><summary>Can I search records?</summary><p>Yes. Use the search bar above each table. It matches name, phone, email, specialty and IDs.</p></details>
                  <details><summary>Is this connected to a real backend?</summary><p>Yes. React talks to Django REST endpoints under <code>/api/doctors/</code>, <code>/api/patients/</code> and <code>/api/appointments/</code>.</p></details>
                  <details><summary>Who is the profile user?</summary><p>The top-right avatar is the hospital administrator workspace profile used for this demo system.</p></details>
                </div>
              )}
              {helpTab === 'support' && (
                <div className="help-section">
                  <p className="help-support-intro">Send a message to the hospital IT / support desk. For demos this is stored in the session UI only.</p>
                  {supportSent ? (
                    <div className="help-success"><Check size={18}/> Request sent. Thank you!</div>
                  ) : (
                    <form className="help-support-form" onSubmit={submitSupport}>
                      <label>Your name<input required value={supportForm.name} onChange={e => setSupportForm(s => ({ ...s, name: e.target.value }))} placeholder="Full name"/></label>
                      <label>Email<input required type="email" value={supportForm.email} onChange={e => setSupportForm(s => ({ ...s, email: e.target.value }))} placeholder="you@email.com"/></label>
                      <label>Message<textarea required rows={4} value={supportForm.message} onChange={e => setSupportForm(s => ({ ...s, message: e.target.value }))} placeholder="Describe the issue or question..."/></label>
                      <button type="submit" className="primary-btn"><MessageCircle size={16}/> Submit request</button>
                    </form>
                  )}
                  <div className="help-contact-card">
                    <div><Phone size={15}/> +91 1800-CARE-HELP</div>
                    <div><Mail size={15}/> support@carepoint.hospital</div>
                    <div><Clock3 size={15}/> Mon–Sat · 9:00 AM – 6:00 PM</div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {modal && <RecordModal modal={modal} setModal={setModal} doctors={doctors} patients={patients} onSubmit={saveRecord} saving={saving} />}
  </div>
}

function StatCard({ icon: Icon, color, label, value, sub }) { return <div className="stat-card"><div className={`stat-icon ${color}`}><Icon size={20}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-sub">{sub}</div></div> }
function QuickAction({ icon: Icon, title, text, onClick }) { return <button className="quick-action" onClick={onClick}><div className="quick-icon"><Icon size={18}/></div><div><b>{title}</b><span>{text}</span></div><span className="quick-arrow">↗</span></button> }
function Actions({ onEdit, onDelete }) { return <div className="actions"><button className="icon-btn edit-btn" title="Edit" onClick={onEdit}><Pencil size={15}/></button><button className="icon-btn delete-btn" title="Delete" onClick={onDelete}><Trash2 size={15}/></button></div> }
function Loading() { return <div className="loading"><span className="spinner"/> Loading records...</div> }
function Empty({ text }) { return <div className="empty-state"><div className="empty-symbol"><Activity size={23}/></div><p>{text}</p></div> }

function RecordModal({ modal, setModal, doctors, patients, onSubmit, saving }) {
  const { type } = modal
  const record = modal.record
  const isEdit = Boolean(record.id)
  const label = type === 'doctor' ? 'Doctor' : type === 'patient' ? 'Patient' : 'Appointment'
  function change(key, value) { setModal(old => ({ ...old, record: { ...old.record, [key]: value } })) }
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null) }}><div className="modal"><div className="modal-head"><div><div className="eyebrow">RECORD MANAGEMENT</div><h2>{isEdit ? 'Update' : 'Add'} {label}</h2><p>Enter the details below and save your changes.</p></div><button className="icon-btn" onClick={() => setModal(null)}><X size={18}/></button></div><form onSubmit={onSubmit} className="record-form">
    {type === 'doctor' && <><Field label="Full name" required><input required maxLength="30" value={record.dname || ''} onChange={e => change('dname', e.target.value)} placeholder="Dr. Jane Smith"/></Field><Field label="Phone number" required><input required type="number" value={record.dphno ?? ''} onChange={e => change('dphno', e.target.value)} placeholder="Phone number"/></Field><Field label="Email address" required><input required type="email" value={record.demail || ''} onChange={e => change('demail', e.target.value)} placeholder="doctor@hospital.com"/></Field><Field label="Specialization" required><input required value={record.dspec || ''} onChange={e => change('dspec', e.target.value)} placeholder="e.g. Cardiology"/></Field><label className="toggle-field"><span><b>Available for appointments</b><small>Show this doctor as available</small></span><input type="checkbox" checked={Boolean(record.davail)} onChange={e => change('davail', e.target.checked)}/></label></>}
    {type === 'patient' && <><Field label="Full name" required><input required value={record.pname || ''} onChange={e => change('pname', e.target.value)} placeholder="Patient full name"/></Field><Field label="Phone number" required><input required type="number" value={record.pphno ?? ''} onChange={e => change('pphno', e.target.value)} placeholder="Phone number"/></Field><Field label="Email address" required><input required type="email" value={record.pemail || ''} onChange={e => change('pemail', e.target.value)} placeholder="patient@email.com"/></Field><Field label="Age" required><input required min="0" max="125" type="number" value={record.page ?? ''} onChange={e => change('page', e.target.value)} placeholder="Age in years"/></Field></>}
    {type === 'appointment' && <><Field label="Patient" required><select required value={record.patient || ''} onChange={e => change('patient', e.target.value)}><option value="">Select a patient</option>{patients.map(p => <option key={p.id} value={p.id}>{p.pname} (#{p.id})</option>)}</select></Field><Field label="Doctor" required><select required value={record.doctor || ''} onChange={e => change('doctor', e.target.value)}><option value="">Select a doctor</option>{doctors.map(d => <option key={d.id} value={d.id}>{d.dname} — {d.dspec}</option>)}</select></Field><Field label="Appointment date" required><input required type="date" value={record.appoint_date || ''} onChange={e => change('appoint_date', e.target.value)}/></Field><Field label="Appointment time" required><input required type="time" value={(record.appoint_time || '').slice(0, 5)} onChange={e => change('appoint_time', e.target.value)}/></Field></>}
    <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="primary-btn" disabled={saving}>{saving ? 'Saving...' : <><Check size={16}/> {isEdit ? 'Save changes' : `Create ${label.toLowerCase()}`}</>}</button></div>
  </form></div></div>
}
function Field({ label, required, children }) { return <label className="form-field"><span>{label}{required && <i> *</i>}</span>{children}</label> }
