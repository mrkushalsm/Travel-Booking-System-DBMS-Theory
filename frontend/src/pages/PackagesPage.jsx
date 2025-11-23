import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { serviceApi } from '../api';
import ServiceCard from '../components/ServiceCard';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';

const PackagesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ maxPrice: '', durationMin: '', durationMax: '' });
  const packagesQuery = useQuery({
    queryKey: ['packages', filters],
    queryFn: () => serviceApi.packages(filters),
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleBook = (serviceId) => {
    navigate('/bookings', {
      state: {
        prefillBooking: {
          bookingType: 'Package',
          serviceId: String(serviceId),
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Curated tour packages</h2>
        <div className="grid gap-4 pt-4 md:grid-cols-3">
          {[
            { name: 'maxPrice', label: 'Budget (₹)' },
            { name: 'durationMin', label: 'Min days' },
            { name: 'durationMax', label: 'Max days' },
          ].map((input) => (
            <label key={input.name} className="form-control">
              <span className="label-text">{input.label}</span>
              <input
                className="input input-bordered"
                name={input.name}
                value={filters[input.name]}
                onChange={onChange}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {packagesQuery.isLoading && <LoadingScreen message="Loading packages" />}
        {!packagesQuery.isLoading && !packagesQuery.data?.length && <EmptyState title="No packages" />}
        {packagesQuery.data?.map((pkg) => (
          <ServiceCard
            key={pkg.PackageId}
            title={pkg.Name}
            subtitle={pkg.Description}
            price={pkg.Price}
            meta={[`${pkg.DurationDays} days`, pkg.Includes, `${pkg.Availability} slots`]}
            actionLabel="Book"
            onAction={() => handleBook(pkg.PackageId)}
          />
        ))}
      </section>
    </div>
  );
};

export default PackagesPage;
