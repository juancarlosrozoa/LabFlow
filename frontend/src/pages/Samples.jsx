import { useEffect, useState } from 'react';
import { samplesApi } from '../services/api';
import { Plus, Trash2, Pencil } from 'lucide-react';

const STATUS_COLORS = {
  RECEIVED: '#2563eb',
  IN_PROCESS: '#d97706',
  COMPLETED: '#16a34a',
  ARCHIVED: '#64748b',
};

const EMPTY_FORM = { sampleCode: '', sampleType: '', collectionDate: '', status: 'RECEIVED' };

export default function Samples() {
  const [samples, setSamples] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await samplesApi.getAll();
    setSamples(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await samplesApi.update(editId, form);
      } else {
        await samplesApi.create(form);
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving sample');
    }
  }

  function startEdit(sample) {
    setForm({
      sampleCode: sample.sampleCode,
      sampleType: sample.sampleType,
      collectionDate: sample.collectionDate || '',
      status: sample.status,
    });
    setEditId(sample.id);
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this sample?')) return;
    await samplesApi.delete(id);
    load();
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Samples</h2>
          <p style={styles.subtitle}>{samples.length} samples registered</p>
        </div>
        <button style={styles.btnPrimary} onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}>
          <Plus size={16} /> New Sample
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginBottom: 16 }}>{editId ? 'Edit Sample' : 'New Sample'}</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <Field label="Sample Code">
              <input style={styles.input} value={form.sampleCode} disabled={!!editId}
                onChange={(e) => setForm({ ...form, sampleCode: e.target.value })} required />
            </Field>
            <Field label="Sample Type">
              <input style={styles.input} value={form.sampleType}
                onChange={(e) => setForm({ ...form, sampleType: e.target.value })} required />
            </Field>
            <Field label="Collection Date">
              <input type="date" style={styles.input} value={form.collectionDate}
                onChange={(e) => setForm({ ...form, collectionDate: e.target.value })} />
            </Field>
            <Field label="Status">
              <select style={styles.input} value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {['RECEIVED', 'IN_PROCESS', 'COMPLETED', 'ARCHIVED'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
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
              {['Code', 'Type', 'Collection Date', 'Status', 'Created By', 'Actions'].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {samples.map((s) => (
              <tr key={s.id} style={styles.tr}>
                <td style={styles.td}><strong>{s.sampleCode}</strong></td>
                <td style={styles.td}>{s.sampleType}</td>
                <td style={styles.td}>{s.collectionDate || '—'}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, color: STATUS_COLORS[s.status], background: STATUS_COLORS[s.status] + '15' }}>
                    {s.status}
                  </span>
                </td>
                <td style={styles.td}>{s.createdByName}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={styles.iconBtn} onClick={() => startEdit(s)}><Pencil size={15} /></button>
                    <button style={{ ...styles.iconBtn, color: 'var(--danger)' }} onClick={() => handleDelete(s.id)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {samples.length === 0 && <p style={styles.empty}>No samples yet. Create one above.</p>}
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
