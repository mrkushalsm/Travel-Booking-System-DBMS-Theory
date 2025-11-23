import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api';
import LoadingScreen from '../components/LoadingScreen';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const PaymentsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const prefill = location.state?.prefillPayment;
  const [form, setForm] = useState(() => ({
    bookingId: prefill?.bookingId !== undefined ? String(prefill.bookingId) : '',
    amount: prefill?.amount !== undefined ? String(prefill.amount) : '',
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Card',
    status: 'Completed',
  }));
  const restricted = !['Staff', 'Admin'].includes(user?.role);

  useEffect(() => {
    if (!prefill) return;
    // Clear navigation state so repeat visits do not reuse stale prefill data.
    navigate(location.pathname, { replace: true, state: {} });
  }, [prefill, navigate, location.pathname]);

  const paymentsQuery = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentApi.list(),
    enabled: !restricted,
  });

  const mutation = useMutation({
    mutationFn: (payload) => paymentApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setForm((prev) => ({ ...prev, bookingId: '', amount: '' }));
    },
  });

  const completeMutation = useMutation({
    mutationFn: (paymentId) => paymentApi.complete(paymentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({
      ...form,
      bookingId: Number(form.bookingId),
      amount: Number(form.amount),
    });
  };

  const columns = [
    { key: 'PaymentId', label: 'ID' },
    { key: 'BookingId', label: 'Booking' },
    { key: 'Amount', label: 'Amount' },
    { key: 'PaymentMethod', label: 'Method' },
    { key: 'Status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value, row) => (
        row.Status === 'Pending' ? (
          <button
            type="button"
            className="btn btn-success btn-xs"
            onClick={() => completeMutation.mutate(row.PaymentId)}
            disabled={completeMutation.isLoading}
          >
            Mark Completed
          </button>
        ) : (
          <span className="text-sm text-base-content/60">—</span>
        )
      ),
    },
  ];

  if (restricted) {
    return <EmptyState title="Restricted" message="Payments are managed by staff." />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
      <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Payments</h2>
        {paymentsQuery.isLoading && <LoadingScreen message="Loading payments" />}
        {!paymentsQuery.isLoading && !paymentsQuery.data?.length && <EmptyState title="No payments recorded" />}
        {paymentsQuery.data?.length && <DataTable columns={columns} data={paymentsQuery.data} />}
      </section>
      <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Record payment</h3>
        <form className="space-y-4 pt-4" onSubmit={handleSubmit}>
          {[
            { name: 'bookingId', label: 'Booking ID', type: 'number' },
            { name: 'amount', label: 'Amount', type: 'number' },
          ].map((field) => (
            <label key={field.name} className="form-control">
              <span className="label-text">{field.label}</span>
              <input
                type={field.type}
                className="input input-bordered"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
              />
            </label>
          ))}
          <label className="form-control">
            <span className="label-text">Payment date</span>
            <input type="date" className="input input-bordered" name="paymentDate" value={form.paymentDate} onChange={handleChange} />
          </label>
          <label className="form-control">
            <span className="label-text">Method</span>
            <select className="select select-bordered" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              {['Card', 'NetBanking', 'UPI', 'Wallet'].map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text">Status</span>
            <select className="select select-bordered" name="status" value={form.status} onChange={handleChange}>
              {['Pending', 'Completed', 'Failed'].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary w-full" type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Saving...' : 'Save payment'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default PaymentsPage;
