import { useEffect, useState } from 'react';
import { resultsApi, experimentsApi } from '../services/api';
import { Plus, Trash2 } from 'lucide-react';

const EMPTY_FORM = { experimentId: '', filePath: '', notes: '' };

export default function Results() {
  const [results, setResults] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [selectedExp, setSelectedExp] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    experimentsApi.getAll().then((r) => setExperiments(r.data));
  }, []);

  useEffect(() => {
    if (selectedExp) {
      resultsApi.getByExperiment(selectedExp).then((r) => setResults(r.data));
    } else {
      setResults([]);
    }
  }, [selectedExp]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await resultsApi.create({ ...form, experimentId: Number(form.experimentId) });
      setShowForm(false);
      setForm(EMPTY_FORM);
      if (selectedExp) {
        resultsApi.getByExperiment(selectedExp).then((r) => setResults(r.data));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving result');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this result?')) return;
    await resultsApi.delete(id);
    if (selectedExp) {
      resultsApi.getByExperiment(selectedExp).then((r) => setResults(r.data));
    }
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Results</h2>
          <p style={styles.subtitle}>Experiment results and files</p>
        </div>
        <button style={styles.btnPrimary} onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Result
        </button>
      </div>

      <div style={styles.filterBar}>
        <label style={styles.filterLabel}>Filter by experiment:</label>
        <select style={styles.select} value={selectedExp} onChange={(e) => setSelectedExp(e.target.value)}>
          <option value="">All experiments</option>
          {experiments.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginBottom: 16 }}>Add Result</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Experiment">
              <select style={styles.input} value={form.experimentId}
                onChange={(e) => setForm({ ...form, experimentId: e.target.value })} required>
                <option value="">Select an experiment</option>
                {experiments.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </Field>
            <Field label="File Path / URL">
              <input style={styles.input} value={form.filePath}
                onChange={(e) => setForm({ ...form, filePath: e.target.value })}
                placeholder="/results/output.csv" />
            </Field>
            <Field label="Notes">
              <textarea style={{ ...styles.input, minHeight: 80, resize: 'vertical' }} value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
            {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
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
              {['Experiment', 'File', 'Notes', 'Created At', 'Actions'].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id} style={styles.tr}>
                <td style={styles.td}>{r.experimentName}</td>
                <td style={styles.td}>{r.filePath || '—'}</td>
                <td style={styles.td}>{r.notes || '—'}</td>
                <td style={styles.td}>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <button style={{ ...styles.iconBtn, color: 'var(--danger)' }} onClick={() => handleDelete(r.id)}>
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {results.length === 0 && (
          <p style={styles.empty}>
            {selectedExp ? 'No results for this experiment.' : 'Select an experiment to see results.'}
          </p>
        )}
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
  filterBar: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 },
  filterLabel: { fontSize: 13, fontWeight: 500 },
  select: { padding: '8px 11px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--surface)', minWidth: 220 },
  btnPrimary: { display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'var(--primary)', color: '#fff', borderRadius: 8, fontWeight: 600 },
  btnSecondary: { padding: '9px 16px', border: '1px solid var(--border)', borderRadius: 8, fontWeight: 600, background: 'var(--surface)' },
  formCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 24, maxWidth: 560 },
  input: { padding: '9px 11px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', width: '100%' },
  table: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' },
  thead: { background: 'var(--bg)' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  tr: { borderTop: '1px solid var(--border)' },
  td: { padding: '13px 16px' },
  iconBtn: { padding: 5, borderRadius: 6, color: 'var(--text-muted)', display: 'flex' },
  empty: { textAlign: 'center', padding: 32, color: 'var(--text-muted)' },
};
