import { useState } from 'react';

const defaultState = {
  bookingType: 'Flight',
  serviceId: '',
  bookingDate: '',
  travelDate: '',
  numberOfTravellers: 1,
  userId: '',
};

const withInitialValues = (values = {}) => ({
  ...defaultState,
  ...values,
  serviceId: values.serviceId ? String(values.serviceId) : defaultState.serviceId,
  userId: values.userId ? String(values.userId) : defaultState.userId,
  travelDate: values.travelDate ? String(values.travelDate) : defaultState.travelDate,
});

const BookingForm = ({ onSubmit, loading, showUserField = false, initialValues }) => {
  const [form, setForm] = useState(() => withInitialValues(initialValues));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = { ...form, numberOfTravellers: Number(form.numberOfTravellers) };
    if (!showUserField) {
      delete payload.userId;
    }
    Promise.resolve(onSubmit(payload)).then(() => setForm(withInitialValues(initialValues)));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showUserField && (
        <label className="form-control">
          <div className="label">
            <span className="label-text">User ID</span>
          </div>
          <input
            className="input input-bordered"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            placeholder="Assign booking to user"
            required
          />
        </label>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Service Type</span>
          </div>
          <select
            className="select select-bordered"
            name="bookingType"
            value={form.bookingType}
            onChange={handleChange}
          >
            <option value="Flight">Flight</option>
            <option value="Hotel">Hotel</option>
            <option value="Package">Package</option>
          </select>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Service ID</span>
          </div>
          <input
            className="input input-bordered"
            name="serviceId"
            value={form.serviceId}
            onChange={handleChange}
            placeholder="e.g. FlightId"
            required
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="form-control">
          <div className="label">
            <span className="label-text">Booking Date</span>
          </div>
          <input
            type="date"
            className="input input-bordered"
            name="bookingDate"
            value={form.bookingDate}
            onChange={handleChange}
            required
          />
        </label>
        <label className="form-control">
          <div className="label">
            <span className="label-text">Travel Date</span>
          </div>
          <input
            type="date"
            className="input input-bordered"
            name="travelDate"
            value={form.travelDate}
            onChange={handleChange}
            required
          />
        </label>
        <label className="form-control">
          <div className="label">
            <span className="label-text">Travellers</span>
          </div>
          <input
            type="number"
            min={1}
            className="input input-bordered"
            name="numberOfTravellers"
            value={form.numberOfTravellers}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Creating...' : 'Create Booking'}
      </button>
    </form>
  );
};

export default BookingForm;
