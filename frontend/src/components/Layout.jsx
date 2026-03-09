import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FlaskConical, TestTube, FileText, LogOut } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/samples', icon: FlaskConical, label: 'Samples' },
  { to: '/experiments', icon: TestTube, label: 'Experiments' },
  { to: '/results', icon: FileText, label: 'Results' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <FlaskConical size={22} color="#2563eb" />
          <span style={styles.brandText}>LabFlow</span>
        </div>

        <nav style={styles.nav}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={styles.userSection}>
          <div>
            <div style={styles.userName}>{user?.name}</div>
            <div style={styles.userRole}>{user?.role}</div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    background: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '20px 20px 16px',
    borderBottom: '1px solid var(--border)',
  },
  brandText: {
    fontWeight: 700,
    fontSize: 18,
    color: 'var(--text)',
  },
  nav: {
    flex: 1,
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 8,
    color: 'var(--text-muted)',
    fontWeight: 500,
    transition: 'background 0.15s',
  },
  navLinkActive: {
    background: '#eff6ff',
    color: 'var(--primary)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderTop: '1px solid var(--border)',
  },
  userName: {
    fontWeight: 600,
    fontSize: 13,
  },
  userRole: {
    fontSize: 11,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    color: 'var(--text-muted)',
    padding: 6,
    borderRadius: 6,
    display: 'flex',
  },
  main: {
    marginLeft: 'var(--sidebar-width)',
    flex: 1,
    padding: 32,
  },
};
