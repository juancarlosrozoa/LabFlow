import { useEffect, useState } from 'react';
import { experimentsApi, samplesApi } from '../services/api';
import { Plus, Trash2, Pencil } from 'lucide-react';

const STATUS_COLORS = {
  PENDING: '#64748b',
  IN_PROGRESS: '#d97706',
  COMPLETED: '#16a34a',
  FAILED: '#dc2626',
};

const EMPTY_FORM = { name: '', type: '', date: '', researcherId: '', sampleId: '', status: 'PENDING' };

export default function Experiments() {
  const [experiments, setExperiments] = useState([]);
  const [samples, setSamples] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
    samplesApi.getAll().then((r) => setSamples(r.data));
  }, []);

  async function load() {
    const { data } = await experimentsApi.getAll();
    setExperiments(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, researcherId: Number(form.researcherId), sampleId: Number(form.sampleId) };
      if (editId) {
        await experimentsApi.update(editId, payload);
      } else {
        await experimentsApi.create(payload);
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving experiment');
    }
  }

  function startEdit(exp) {
    setForm({
      name: exp.name,
      type: exp.type,
      date: exp.date,
      researcherId: '',
      sampleId: '',
      status: exp.status,
    });
    setEditId(exp.id);
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this experiment?')) return;
    await experimentsApi.delete(id);
    load();
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Experiments</h2>
          <p style={styles.subtitle}>{experiments.length} experiments registered</p>
        </div>
        <button style={styles.btnPrimary} onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}>
          <Plus size={16} /> New Experiment
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginBottom: 16 }}>{editId ? 'Edit Experiment' : 'New Experiment'}</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <Field label="Name">
              <input style={styles.input} value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Field>
            <Field label="Type">
              <input style={styles.input} value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })} required />
            </Field>
            <Field label="Date">
              <input type="date" style={styles.input} value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </Field>
            <Field label="Status">
              <select style={styles.input} value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Researcher ID">
              <input type="number" style={styles.input} value={form.researcherId}
                onChange={(e) => setForm({ ...form, researcherId: e.target.value })} required />
            </Field>
            <Field label="Sample">
              <select style={styles.input} value={form.sampleId}
                onChange={(e) => setForm({ ...form, sampleId: e.target.value })} required>
                <option value="">Select a sample</option>
                {samples.map((s) => <option key={s.id} value={s.id}>{s.sampleCode} — {s.sampleType}</option>)}
              </select>
            </Field>
            {error && <p style={{ color: 'var(--danger)', gridColumn: '1/-1' }}>{error}</p>}
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" style={styles.btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" style={styles.btnPrimary}>Save</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={styles.thead}>
              {['Name', 'Type', 'Date', 'Researcher', 'Sample', 'Status', 'Actions'].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {experiments.map((e) => (
              <tr key={e.id} style={styles.tr}>
                <td style={styles.td}><strong>{e.name}</strong></td>
                <td style={styles.td}>{e.type}</td>
                <td style={styles.td}>{e.date}</td>
                <td style={styles.td}>{e.researcherName}</td>
                <td style={styles.td}>{e.sampleCode}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, color: STATUS_COLORS[e.status], background: STATUS_COLORS[e.status] + '15' }}>
                    {e.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={styles.iconBtn} onClick={() => startEdit(e)}><Pencil size={15} /></button>
                    <button style={{ ...styles.iconBtn, color: 'var(--danger)' }} onClick={() => handleDelete(e.id)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {experiments.length === 0 && <p style={styles.empty}>No experiments yet. Create one above.</p>}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{label}</label>
      {children}
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  subtitle: { color: 'var(--text-muted)' },
  btnPrimary: { display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'var(--primary)', color: '#fff', borderRadius: 8, fontWeight: 600 },
  btnSecondary: { padding: '9px 16px', border: '1px solid var(--border)', borderRadius: 8, fontWeight: 600, background: 'var(--surface)' },
  formCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 24 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  input: { padding: '9px 11px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', width: '100%' },
  table: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' },
  thead: { background: 'var(--bg)' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  tr: { borderTop: '1px solid var(--border)' },
  td: { padding: '13px 16px' },
  badge: { display: 'inline-block', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  iconBtn: { padding: 5, borderRadius: 6, color: 'var(--text-muted)', display: 'flex' },
  empty: { textAlign: 'center', padding: 32, color: 'var(--text-muted)' },
};
