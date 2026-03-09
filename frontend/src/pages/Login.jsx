import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FlaskConical } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@labflow.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <FlaskConical size={36} color="#2563eb" />
          <h1 style={styles.title}>LabFlow</h1>
          <p style={styles.subtitle}>Laboratory Information Management System</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
  },
  card: {
    background: 'var(--surface)',
    borderRadius: 16,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    border: '1px solid var(--border)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    marginTop: 10,
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: 13,
    marginTop: 4,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontWeight: 500,
    fontSize: 13,
  },
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    outline: 'none',
    background: 'var(--bg)',
  },
  error: {
    color: 'var(--danger)',
    fontSize: 13,
    textAlign: 'center',
  },
  btn: {
    padding: '11px',
    background: 'var(--primary)',
    color: '#fff',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    marginTop: 4,
  },
};
