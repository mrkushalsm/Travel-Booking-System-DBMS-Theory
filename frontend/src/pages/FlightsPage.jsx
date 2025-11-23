import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../api';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../context/AuthContext';

const defaultFlightForm = {
  airline: '',
  source: '',
  destination: '',
  departureDate: '',
  departureTime: '',
  arrivalDate: '',
  arrivalTime: '',
  price: '',
  totalSeats: '',
  availableSeats: '',
};

const FlightsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState({ source: '', destination: '', airline: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [form, setForm] = useState(defaultFlightForm);
  const canManage = ['Staff', 'Admin'].includes(user?.role);

  const closeModal = () => {
    setModalOpen(false);
    setEditingFlight(null);
    setForm(defaultFlightForm);
  };

  const flightsQuery = useQuery({
    queryKey: ['flights', filters],
    queryFn: () => serviceApi.flights(filters),
  });

  const upsertFlightMutation = useMutation({
    mutationFn: ({ id, payload }) => (id ? serviceApi.updateFlight(id, payload) : serviceApi.createFlight(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      closeModal();
    },
  });

  const deleteFlightMutation = useMutation({
    mutationFn: (id) => serviceApi.deleteFlight(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['flights'] }),
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (flight = null) => {
    if (flight) {
      setEditingFlight(flight);
      setForm({
        airline: flight.Airline || '',
        source: flight.Source || '',
        destination: flight.Destination || '',
        departureDate: flight.DepartureDate || '',
        departureTime: flight.DepartureTime || '',
        arrivalDate: flight.ArrivalDate || '',
        arrivalTime: flight.ArrivalTime || '',
        price: (flight.price ?? flight.Price ?? '').toString(),
        totalSeats: (flight.TotalSeats ?? '').toString(),
        availableSeats: (flight.AvailableSeats ?? '').toString(),
      });
    } else {
      setEditingFlight(null);
      setForm(defaultFlightForm);
    }
    setModalOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      airline: form.airline,
      source: form.source,
      destination: form.destination,
      departureDate: form.departureDate,
      departureTime: form.departureTime,
      arrivalDate: form.arrivalDate,
      arrivalTime: form.arrivalTime,
      price: Number(form.price),
      totalSeats: Number(form.totalSeats),
    };
    if (form.availableSeats) {
      payload.availableSeats = Number(form.availableSeats);
    }
    upsertFlightMutation.mutate({ id: editingFlight?.FlightId, payload });
  };

  const handleDelete = (id) => deleteFlightMutation.mutate(id);

  const handleBook = (serviceId) => {
    navigate('/bookings', {
      state: {
        prefillBooking: {
          bookingType: 'Flight',
          serviceId: String(serviceId),
        },
      },
    });
  };

  const deletingId = deleteFlightMutation.variables;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Search flights</h2>
        <div className="grid gap-4 pt-4 md:grid-cols-3">
          {['source', 'destination', 'airline'].map((field) => (
            <label key={field} className="form-control">
              <span className="label-text capitalize">{field}</span>
              <input
                className="input input-bordered"
                name={field}
                value={filters[field]}
                onChange={onChange}
                placeholder={`Filter by ${field}`}
              />
            </label>
          ))}
        </div>
        {canManage && (
          <div className="mt-4 flex justify-end">
            <button type="button" className="btn btn-primary" onClick={() => openModal()}>
              Add Flight
            </button>
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {flightsQuery.isLoading && <LoadingScreen message="Fetching flights" />}
        {!flightsQuery.isLoading && !flightsQuery.data?.length && (
          <EmptyState title="No flights found" message="Try a broader search." />
        )}
        {flightsQuery.data?.map((flight) => (
          <ServiceCard
            key={flight.FlightId}
            title={`${flight.Airline} • ${flight.Source} → ${flight.Destination}`}
            subtitle={`${flight.DepartureDate} at ${flight.DepartureTime}`}
            price={flight.price ?? flight.Price}
            meta={[`${flight.AvailableSeats} seats`, `Arrives ${flight.ArrivalTime}`]}
            actionLabel={user?.role === 'Customer' ? 'Book' : undefined}
            onAction={user?.role === 'Customer' ? () => handleBook(flight.FlightId) : undefined}
            actions=
              {canManage && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() => openModal(flight)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-error btn-xs"
                    onClick={() => handleDelete(flight.FlightId)}
                    disabled={deleteFlightMutation.isLoading && deletingId === flight.FlightId}
                  >
                    Delete
                  </button>
                </div>
              )}
          />
        ))}
      </section>

      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="text-xl font-semibold">
              {editingFlight ? 'Update flight' : 'Add new flight'}
            </h3>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="form-control">
                  <span className="label-text">Airline</span>
                  <input className="input input-bordered" name="airline" value={form.airline} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Source</span>
                  <input className="input input-bordered" name="source" value={form.source} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Destination</span>
                  <input className="input input-bordered" name="destination" value={form.destination} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Price (₹)</span>
                  <input className="input input-bordered" name="price" type="number" min={0} value={form.price} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Departure Date</span>
                  <input className="input input-bordered" type="date" name="departureDate" value={form.departureDate} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Departure Time</span>
                  <input className="input input-bordered" type="time" name="departureTime" value={form.departureTime} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Arrival Date</span>
                  <input className="input input-bordered" type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Arrival Time</span>
                  <input className="input input-bordered" type="time" name="arrivalTime" value={form.arrivalTime} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Total Seats</span>
                  <input className="input input-bordered" type="number" min={1} name="totalSeats" value={form.totalSeats} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Available Seats</span>
                  <input className="input input-bordered" type="number" min={0} name="availableSeats" value={form.availableSeats} onChange={handleFormChange} />
                  <span className="label-text-alt">Leave blank to match total seats</span>
                </label>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={upsertFlightMutation.isLoading}>
                  {upsertFlightMutation.isLoading ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop">
            <button type="button" onClick={closeModal}>
              close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightsPage;
