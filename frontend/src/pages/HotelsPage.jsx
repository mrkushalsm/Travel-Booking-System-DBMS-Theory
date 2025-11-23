import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../api';
import ServiceCard from '../components/ServiceCard';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const defaultHotelForm = {
  name: '',
  location: '',
  amenities: '',
  roomTypes: '',
  pricePerNight: '',
  totalRooms: '',
  availableRooms: '',
};

const HotelsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState({ location: '', amenities: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [form, setForm] = useState(defaultHotelForm);
  const canManage = ['Staff', 'Admin'].includes(user?.role);
  const hotelsQuery = useQuery({
    queryKey: ['hotels', filters],
    queryFn: () => serviceApi.hotels(filters),
  });

  const closeModal = () => {
    setModalOpen(false);
    setEditingHotel(null);
    setForm(defaultHotelForm);
  };

  const upsertHotelMutation = useMutation({
    mutationFn: ({ id, payload }) => (id ? serviceApi.updateHotel(id, payload) : serviceApi.createHotel(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      closeModal();
    },
  });

  const deleteHotelMutation = useMutation({
    mutationFn: (id) => serviceApi.deleteHotel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hotels'] }),
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

  const openModal = (hotel = null) => {
    if (hotel) {
      setEditingHotel(hotel);
      setForm({
        name: hotel.Name || '',
        location: hotel.Location || '',
        amenities: hotel.Amenities || '',
        roomTypes: hotel.RoomTypes || '',
        pricePerNight: (hotel.PricePerNight ?? '').toString(),
        totalRooms: (hotel.TotalRooms ?? '').toString(),
        availableRooms: (hotel.AvailableRooms ?? '').toString(),
      });
    } else {
      setEditingHotel(null);
      setForm(defaultHotelForm);
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
      location: form.location,
      amenities: form.amenities,
      roomTypes: form.roomTypes,
      pricePerNight: Number(form.pricePerNight),
      totalRooms: Number(form.totalRooms),
    };
    if (form.availableRooms) {
      payload.availableRooms = Number(form.availableRooms);
    }
    upsertHotelMutation.mutate({ id: editingHotel?.HotelId, payload });
  };

  const handleDelete = (id) => deleteHotelMutation.mutate(id);
  const deletingId = deleteHotelMutation.variables;

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
        {canManage && (
          <div className="mt-4 flex justify-end">
            <button type="button" className="btn btn-primary" onClick={() => openModal()}>
              Add Hotel
            </button>
          </div>
        )}
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
            actionLabel={user?.role === 'Customer' ? 'Book' : undefined}
            onAction={user?.role === 'Customer' ? () => handleBook(hotel.HotelId) : undefined}
            actions=
              {canManage && (
                <div className="flex gap-2">
                  <button type="button" className="btn btn-ghost btn-xs" onClick={() => openModal(hotel)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-error btn-xs"
                    onClick={() => handleDelete(hotel.HotelId)}
                    disabled={deleteHotelMutation.isLoading && deletingId === hotel.HotelId}
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
            <h3 className="text-xl font-semibold">{editingHotel ? 'Update hotel' : 'Add new hotel'}</h3>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="form-control">
                  <span className="label-text">Name</span>
                  <input className="input input-bordered" name="name" value={form.name} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Location</span>
                  <input className="input input-bordered" name="location" value={form.location} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Amenities</span>
                  <input className="input input-bordered" name="amenities" value={form.amenities} onChange={handleFormChange} required />
                  <span className="label-text-alt">Comma separated list</span>
                </label>
                <label className="form-control">
                  <span className="label-text">Room Types</span>
                  <input className="input input-bordered" name="roomTypes" value={form.roomTypes} onChange={handleFormChange} required />
                </label>
                <label className="form-control">
                  <span className="label-text">Price per Night (₹)</span>
                  <input
                    className="input input-bordered"
                    name="pricePerNight"
                    type="number"
                    min={0}
                    value={form.pricePerNight}
                    onChange={handleFormChange}
                    required
                  />
                </label>
                <label className="form-control">
                  <span className="label-text">Total Rooms</span>
                  <input
                    className="input input-bordered"
                    name="totalRooms"
                    type="number"
                    min={1}
                    value={form.totalRooms}
                    onChange={handleFormChange}
                    required
                  />
                </label>
                <label className="form-control">
                  <span className="label-text">Available Rooms</span>
                  <input
                    className="input input-bordered"
                    name="availableRooms"
                    type="number"
                    min={0}
                    value={form.availableRooms}
                    onChange={handleFormChange}
                  />
                  <span className="label-text-alt">Leave blank to mirror total rooms</span>
                </label>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={upsertHotelMutation.isLoading}>
                  {upsertHotelMutation.isLoading ? 'Saving...' : 'Save changes'}
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

export default HotelsPage;
