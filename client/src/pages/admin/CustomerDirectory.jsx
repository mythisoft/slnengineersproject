import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, MapPin, Plus, Search } from 'lucide-react';
import { fetchApi } from '../../utils/api';

export default function CustomerDirectory() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: 'Residential',
    area: '',
    city: 'Hyderabad',
    notes: '',
  });

  const loadCustomers = () => {
    setLoading(true);
    fetchApi('/admin/customers')
      .then((res) => {
        if (res.success) setCustomers(res.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetchApi('/admin/customers', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          propertyType: formData.propertyType,
          address: { area: formData.area, city: formData.city },
          notes: formData.notes,
        }),
      });
      setShowModal(false);
      loadCustomers();
    } catch (e) {
      alert(e.message || 'Failed to create customer');
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.address?.area || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Customer Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Client directory linked with site inspection enquiries and completed projects.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm flex items-center gap-1.5 text-xs">
          <Plus size={15} /> Add Customer
        </button>
      </div>

      <div className="card p-3 bg-white border-slate-200">
        <input
          type="text"
          placeholder="Search by customer name, phone, or location..."
          className="form-input text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card bg-white border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Property & Area</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr><td colSpan="5" className="py-8 text-center text-slate-400">Loading directory...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-slate-400">No customer records found.</td></tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4">
                      <a href={`tel:${c.phone}`} className="text-sky-700 font-semibold">{c.phone}</a>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{c.email || '—'}</td>
                    <td className="py-3 px-4">
                      <span className="badge badge-slate mr-2">{c.propertyType}</span>
                      {c.address?.area ? `${c.address.area}, ${c.address.city}` : c.address?.city || 'Hyderabad'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{c.notes || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add New Customer</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="form-label text-xs">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input text-xs"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label text-xs">Phone Number *</label>
                <input
                  type="tel"
                  required
                  className="form-input text-xs"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label text-xs">Email Address</label>
                <input
                  type="email"
                  className="form-input text-xs"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Area / Locality</label>
                  <input
                    type="text"
                    className="form-input text-xs"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Property Type</label>
                  <select
                    className="form-select text-xs"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment Complex">Apartment Complex</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label text-xs">Notes</label>
                <textarea
                  rows="2"
                  className="form-textarea text-xs"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline btn-sm text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm text-xs">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
