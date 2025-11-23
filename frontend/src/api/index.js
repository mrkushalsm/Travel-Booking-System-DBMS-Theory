import api from './client';

const unwrap = (promise) => promise.then((res) => res.data.data ?? res.data);

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me'),
};

export const serviceApi = {
  flights: (params) => unwrap(api.get('/flights', { params })).then((data) => data.flights ?? data),
  createFlight: (payload) => unwrap(api.post('/flights', payload)),
  updateFlight: (id, payload) => unwrap(api.put(`/flights/${id}`, payload)),
  deleteFlight: (id) => unwrap(api.delete(`/flights/${id}`)),
  hotels: (params) => unwrap(api.get('/hotels', { params })).then((data) => data.hotels ?? data),
  createHotel: (payload) => unwrap(api.post('/hotels', payload)),
  updateHotel: (id, payload) => unwrap(api.put(`/hotels/${id}`, payload)),
  deleteHotel: (id) => unwrap(api.delete(`/hotels/${id}`)),
  packages: (params) => unwrap(api.get('/packages', { params })).then((data) => data.packages ?? data),
  createPackage: (payload) => unwrap(api.post('/packages', payload)),
  updatePackage: (id, payload) => unwrap(api.put(`/packages/${id}`, payload)),
  deletePackage: (id) => unwrap(api.delete(`/packages/${id}`)),
};

export const bookingApi = {
  list: (params) => unwrap(api.get('/bookings', { params })).then((data) => data.bookings ?? data),
  create: (payload) => unwrap(api.post('/bookings', payload)),
  update: (id, payload) => unwrap(api.put(`/bookings/${id}`, payload)),
  cancel: (id) => unwrap(api.post(`/bookings/${id}/cancel`)),
  status: (id, payload) => unwrap(api.patch(`/bookings/${id}/status`, payload)),
  approve: (id) => unwrap(api.post(`/bookings/${id}/approve`)),
};

export const paymentApi = {
  list: (params) => unwrap(api.get('/payments', { params })).then((data) => data.payments ?? data),
  create: (payload) => unwrap(api.post('/payments', payload)),
  update: (id, payload) => unwrap(api.put(`/payments/${id}`, payload)),
  complete: (id) => unwrap(api.post(`/payments/${id}/complete`)),
};

export const reportApi = {
  overview: () => unwrap(api.get('/reports/overview')),
  sales: () => unwrap(api.get('/reports/sales')).then((data) => data.breakdown ?? data),
  customers: () => unwrap(api.get('/reports/customers')).then((data) => data.customers ?? data),
  trends: () => unwrap(api.get('/reports/trends')).then((data) => data.trends ?? data),
};

export const userApi = {
  list: () => unwrap(api.get('/users')),
  update: (id, payload) => unwrap(api.put(`/users/${id}`, payload)),
};
