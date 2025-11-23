import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../api';
import ServiceCard from '../components/ServiceCard';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const defaultPackageForm = {
  name: '',
  description: '',
  includes: '',
  durationDays: '',
  price: '',
  availability: '',
};

const PackagesPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState({ maxPrice: '', durationMin: '', durationMax: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [form, setForm] = useState(defaultPackageForm);
  const canManage = ['Staff', 'Admin'].includes(user?.role);
  const packagesQuery = useQuery({
    queryKey: ['packages', filters],
    queryFn: () => serviceApi.packages(filters),
  });

  const closeModal = () => {
    setModalOpen(false);
    setEditingPackage(null);
    setForm(defaultPackageForm);
  };

  const upsertPackageMutation = useMutation({
    mutationFn: ({ id, payload }) => (id ? serviceApi.updatePackage(id, payload) : serviceApi.createPackage(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      closeModal();
    },
  });

  const deletePackageMutation = useMutation({
    mutationFn: (id) => serviceApi.deletePackage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packages'] }),
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

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setForm({
        name: pkg.Name || '',
        description: pkg.Description || '',
        includes: pkg.Includes || '',
        durationDays: (pkg.DurationDays ?? '').toString(),
        price: (pkg.Price ?? '').toString(),
        availability: (pkg.Availability ?? '').toString(),
      });
    } else {
      setEditingPackage(null);
      setForm(defaultPackageForm);
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
      name: form.name,
      description: form.description,
      includes: form.includes,
      durationDays: Number(form.durationDays),
      price: Number(form.price),
      availability: Number(form.availability),
    };
    upsertPackageMutation.mutate({ id: editingPackage?.PackageId, payload });
  };

  const handleDelete = (id) => deletePackageMutation.mutate(id);
  const deletingId = deletePackageMutation.variables;

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
        {canManage && (
          <div className="mt-4 flex justify-end">
            <button type="button" className="btn btn-primary" onClick={() => openModal()}>
              Add Package
            </button>
          </div>
        )}
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
            actionLabel={user?.role === 'Customer' ? 'Book' : undefined}
            onAction={user?.role === 'Customer' ? () => handleBook(pkg.PackageId) : undefined}
            actions=
              {canManage && (
                <div className="flex gap-2">
                  <button type="button" className="btn btn-ghost btn-xs" onClick={() => openModal(pkg)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-error btn-xs"
                    onClick={() => handleDelete(pkg.PackageId)}
                    disabled={deletePackageMutation.isLoading && deletingId === pkg.PackageId}
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
            <h3 className="text-xl font-semibold">{editingPackage ? 'Update package' : 'Add new package'}</h3>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <label className="form-control">
                  <span className="label-text">Name</span>
                  <input className="input input-bordered" name="name" value={form.name} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Description</span>
                  <textarea className="textarea textarea-bordered" name="description" value={form.description} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Includes</span>
                  <input className="input input-bordered" name="includes" value={form.includes} onChange={handleFormChange} required />
                </label>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="form-control">
                    <span className="label-text">Duration (days)</span>
                    <input
                      className="input input-bordered"
                      name="durationDays"
                      type="number"
                      min={1}
                      value={form.durationDays}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label className="form-control">
                    <span className="label-text">Price (₹)</span>
                    <input
                      className="input input-bordered"
                      name="price"
                      type="number"
                      min={0}
                      value={form.price}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label className="form-control">
                    <span className="label-text">Availability</span>
                    <input
                      className="input input-bordered"
                      name="availability"
                      type="number"
                      min={0}
                      value={form.availability}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                </div>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={upsertPackageMutation.isLoading}>
                  {upsertPackageMutation.isLoading ? 'Saving...' : 'Save changes'}
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

export default PackagesPage;
