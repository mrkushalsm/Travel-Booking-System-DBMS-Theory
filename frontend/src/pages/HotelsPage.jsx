import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { serviceApi } from '../api';
import ServiceCard from '../components/ServiceCard';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';

const HotelsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ location: '', amenities: '' });
  const hotelsQuery = useQuery({
    queryKey: ['hotels', filters],
    queryFn: () => serviceApi.hotels(filters),
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleBook = (serviceId) => {
    navigate('/bookings', {
      state: {
        prefillBooking: {
          bookingType: 'Hotel',
          serviceId: String(serviceId),
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Explore hotels</h2>
        <div className="grid gap-4 pt-4 md:grid-cols-2">
          <label className="form-control">
            <span className="label-text">Location</span>
            <input className="input input-bordered" name="location" value={filters.location} onChange={onChange} />
          </label>
          <label className="form-control">
            <span className="label-text">Amenities (comma separated)</span>
            <input className="input input-bordered" name="amenities" value={filters.amenities} onChange={onChange} />
          </label>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {hotelsQuery.isLoading && <LoadingScreen message="Loading hotels" />}
        {!hotelsQuery.isLoading && !hotelsQuery.data?.length && <EmptyState title="No hotels match filters" />}
        {hotelsQuery.data?.map((hotel) => (
          <ServiceCard
            key={hotel.HotelId}
            title={hotel.Name}
            subtitle={hotel.Location}
            price={hotel.PricePerNight}
            meta={[hotel.Amenities, `${hotel.AvailableRooms} rooms`].filter(Boolean)}
            actionLabel="Book"
            onAction={() => handleBook(hotel.HotelId)}
          />
        ))}
      </section>
    </div>
  );
};

export default HotelsPage;
