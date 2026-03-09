import { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import { FlaskConical, TestTube, Users, Clock, CheckCircle, Inbox } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.iconBox, background: color + '15' }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={styles.value}>{value}</div>
        <div style={styles.label}>{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardApi.getStats().then((r) => setStats(r.data));
  }, []);

  if (!stats) return <p style={{ color: 'var(--text-muted)' }}>Loading...</p>;

  return (
    <div>
      <h2 style={styles.title}>Dashboard</h2>
      <p style={styles.subtitle}>Lab overview at a glance</p>

      <div style={styles.grid}>
        <StatCard icon={FlaskConical} label="Total Samples" value={stats.totalSamples} color="#2563eb" />
        <StatCard icon={TestTube} label="Total Experiments" value={stats.totalExperiments} color="#7c3aed" />
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="#0891b2" />
        <StatCard icon={Clock} label="Experiments In Progress" value={stats.experimentsInProgress} color="#d97706" />
        <StatCard icon={CheckCircle} label="Experiments Completed" value={stats.experimentsCompleted} color="#16a34a" />
        <StatCard icon={Inbox} label="Samples Pending" value={stats.samplesPending} color="#dc2626" />
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  subtitle: { color: 'var(--text-muted)', marginBottom: 28 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '20px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  value: { fontSize: 26, fontWeight: 700, lineHeight: 1 },
  label: { fontSize: 12, color: 'var(--text-muted)', marginTop: 4 },
};
