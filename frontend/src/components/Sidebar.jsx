import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const items = [
  { to: '/', label: 'Dashboard', icon: '📊', roles: ['Staff', 'Admin'] },
  { to: '/flights', label: 'Flights', icon: '✈️', roles: ['Customer', 'Staff', 'Admin'] },
  { to: '/hotels', label: 'Hotels', icon: '🏨', roles: ['Customer', 'Staff', 'Admin'] },
  { to: '/packages', label: 'Packages', icon: '🧳', roles: ['Customer', 'Staff', 'Admin'] },
  { to: '/bookings', label: 'Bookings', icon: '📝', roles: ['Customer', 'Staff', 'Admin'] },
  { to: '/payments', label: 'Payments', icon: '💳', roles: ['Staff', 'Admin'] },
  { to: '/reports', label: 'Reports', icon: '📈', roles: ['Staff', 'Admin'] },
];

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'Customer';

  return (
    <aside className="hidden min-h-screen w-64 flex-shrink-0 border-r border-base-200 bg-base-100 lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-base-200 p-6">
          <p className="text-xs uppercase tracking-wide text-base-content/60">Travel Agency</p>
          <h1 className="text-2xl font-bold">Control Center</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {items
            .filter((item) => item.roles.includes(role))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-base-content/70 hover:bg-base-200'
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div className="p-4 text-xs text-base-content/60">
          Logged in as <span className="font-semibold text-base-content">{role}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
