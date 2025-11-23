import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../api';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import DataTable from '../components/DataTable';
import { useAuth } from '../context/AuthContext';

const ReportsPage = () => {
  const { user } = useAuth();
  const restricted = !['Staff', 'Admin'].includes(user?.role);

  const overviewQuery = useQuery({
    queryKey: ['reports', 'overview'],
    queryFn: reportApi.overview,
    enabled: !restricted,
  });
  const customersQuery = useQuery({
    queryKey: ['reports', 'customers'],
    queryFn: reportApi.customers,
    enabled: !restricted,
  });

  if (restricted) {
    return <EmptyState title="Restricted" message="Reports are available to staff only." />;
  }

  if (overviewQuery.isLoading || customersQuery.isLoading) {
    return <LoadingScreen message="Building reports" />;
  }

  const overview = overviewQuery.data || {};
  const customers = customersQuery.data || [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Business summary</h2>
        <div className="grid gap-4 pt-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-base-content/70">Active bookings</p>
            <p className="text-3xl font-bold">{overview.confirmed || 0}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/70">Revenue</p>
            <p className="text-3xl font-bold">₹{(overview.revenue || 0).toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/70">Cancelled</p>
            <p className="text-3xl font-bold text-error">{overview.cancelled || 0}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Top customers</h3>
        {!customers.length && <EmptyState title="No customer data" />}
        {customers.length > 0 && (
          <DataTable
            columns={[
              { key: 'Name', label: 'Name' },
              { key: 'Email', label: 'Email' },
              { key: 'bookings', label: 'Bookings' },
              {
                key: 'spend',
                label: 'Spend',
                render: (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`,
              },
            ]}
            data={customers}
          />
        )}
      </section>
    </div>
  );
};

export default ReportsPage;
