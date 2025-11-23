import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import BookingForm from '../components/BookingForm';
import DataTable from '../components/DataTable';
import { useAuth } from '../context/AuthContext';

const BookingsPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state?.prefillBooking;
  const formKey = prefill ? `${prefill.bookingType}-${prefill.serviceId}` : 'booking-form';
  const isStaff = ['Staff', 'Admin'].includes(user?.role);

  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const invalidateServiceQueries = (bookingType) => {
    const map = {
      Flight: 'flights',
      Hotel: 'hotels',
      Package: 'packages',
    };
    const key = map[bookingType];
    if (!key) return;
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) => Array.isArray(queryKey) && queryKey[0] === key,
    });
  };
  const bookingsQuery = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => bookingApi.create(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      invalidateServiceQueries(variables?.bookingType);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id }) => bookingApi.cancel(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      const bookingType = data?.booking?.BookingType || variables?.bookingType;
      invalidateServiceQueries(bookingType);
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => bookingApi.approve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  const handleCreate = (form) =>
    createMutation.mutateAsync({
      ...form,
      serviceId: Number(form.serviceId),
      userId: form.userId ? Number(form.userId) : undefined,
    });

  const columns = useMemo(
    () => [
      { key: 'BookingId', label: 'ID' },
      { key: 'BookingType', label: 'Type' },
      { key: 'ServiceName', label: 'Service Name' },
      { key: 'ServiceId', label: 'Service ID' },
      {
        key: 'BookingDate',
        label: 'Booking Date',
        render: (_value, row) => formatDate(row.BookingDate),
      },
      { key: 'Status', label: 'Status' },
      {
        key: 'TravelDatePretty',
        label: 'Travel Date',
        render: (_value, row) => {
          const isFallback = !row.TravelDate;
          const label = formatDate(row.TravelDate || row.BookingDate);
          return (
            <span className="flex flex-col text-sm">
              <span>{label}</span>
              {isFallback && <span className="text-xs text-base-content/60">Using booking date</span>}
            </span>
          );
        },
      },
      {
        key: 'actions',
        label: 'Actions',
        render: (_value, row) => (
          <div className="flex gap-2">
            {isStaff && row.Status === 'Pending' && (
              <button
                type="button"
                className="btn btn-success btn-xs"
                onClick={() => approveMutation.mutate(row.BookingId)}
                disabled={approveMutation.isLoading}
              >
                Approve
              </button>
            )}
            {isStaff && (
              <button
                type="button"
                className="btn btn-info btn-xs"
                onClick={() =>
                  navigate('/payments', {
                    state: {
                      prefillPayment: {
                        bookingId: row.BookingId,
                        amount: row.EstimatedAmount,
                      },
                    },
                  })
                }
              >
                Take Payment
              </button>
            )}
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => cancelMutation.mutate({ id: row.BookingId, bookingType: row.BookingType })}
              disabled={row.Status === 'Cancelled'}
            >
              Cancel
            </button>
          </div>
        ),
      },
    ],
    [approveMutation, cancelMutation, isStaff, navigate]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
      <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Bookings</h2>
        {bookingsQuery.isLoading && <LoadingScreen message="Loading bookings" />}
        {!bookingsQuery.isLoading && !bookingsQuery.data?.length && <EmptyState title="No bookings yet" />}
        {bookingsQuery.data?.length && <DataTable columns={columns} data={bookingsQuery.data} />}
      </section>
      <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Create booking</h3>
        <BookingForm
          key={formKey}
          onSubmit={handleCreate}
          loading={createMutation.isLoading}
          showUserField={isStaff}
          initialValues={prefill}
        />
      </section>
    </div>
  );
};

export default BookingsPage;
