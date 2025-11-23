import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { reportApi } from '../api';
import LoadingScreen from '../components/LoadingScreen';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  const overviewQuery = useQuery({ queryKey: ['reports', 'overview'], queryFn: reportApi.overview });
  const trendsQuery = useQuery({ queryKey: ['reports', 'trends'], queryFn: reportApi.trends });
  const salesQuery = useQuery({ queryKey: ['reports', 'sales'], queryFn: reportApi.sales });

  if (overviewQuery.isLoading || trendsQuery.isLoading || salesQuery.isLoading) {
    return <LoadingScreen message="Fetching analytics" />;
  }

  if (overviewQuery.isError) {
    return <EmptyState title="Unable to fetch stats" message="Check your API connection." />;
  }

  const overview = overviewQuery.data || {};
  const trends = trendsQuery.data || [];
  const sales = salesQuery.data || [];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl bg-base-100 p-6 shadow-sm">
        <div>
          <p className="text-sm text-base-content/70">Hi {user?.name},</p>
          <h2 className="text-3xl font-bold">Here's your control center</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value={overview.totalUsers || 0} icon="👥" />
          <StatCard
            label="Bookings"
            value={overview.totalBookings || 0}
            icon="🧾"
            trend={`${overview.confirmed || 0} confirmed`}
          />
          <StatCard label="Revenue" value={`₹${(overview.revenue || 0).toLocaleString('en-IN')}`} icon="💰" />
          <StatCard label="Cancelled" value={overview.cancelled || 0} icon="⚠️" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-base-100 p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Booking trends</h3>
              <p className="text-sm text-base-content/70">Monthly performance overview</p>
            </div>
          </div>
          {trends.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bc) / 0.1)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="bookings" stroke="#2563eb" fillOpacity={1} fill="url(#colorBookings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="No trend data" />
          )}
        </div>
        <div className="rounded-2xl bg-base-100 p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Sales mix</h3>
          <p className="text-sm text-base-content/70">Contribution by booking type</p>
          <div className="mt-6 space-y-4">
            {sales.map((item) => (
              <div key={item.BookingType} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.BookingType}</p>
                  <p className="text-sm text-base-content/70">{item.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    ₹{Number(item.revenue || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
            {!sales.length && <EmptyState title="No sales data" />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
