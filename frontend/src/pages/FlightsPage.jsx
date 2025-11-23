import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { serviceApi } from '../api';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import ServiceCard from '../components/ServiceCard';

const FlightsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ source: '', destination: '', airline: '' });

  const flightsQuery = useQuery({
    queryKey: ['flights', filters],
    queryFn: () => serviceApi.flights(filters),
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

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
            actionLabel="Book"
            onAction={() => handleBook(flight.FlightId)}
          />
        ))}
      </section>
    </div>
  );
};

export default FlightsPage;
