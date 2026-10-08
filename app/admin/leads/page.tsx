'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, Eye, Loader, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  status: string;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchLeads = useCallback(async function fetchLeads() {
    try {
      setLoading(true);
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function updateLeadStatus(leadId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(leads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Error updating lead');
    }
  }

  async function deleteLead(leadId: string) {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const { error } = await supabase.from('leads').delete().eq('id', leadId);

      if (error) throw error;

      setLeads(leads.filter(lead => lead.id !== leadId));
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Error deleting lead');
    }
  }

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function exportToCSV() {
    const csv = [
      ['Name', 'Email', 'Phone', 'Service', 'Status', 'Date'],
      ...filteredLeads.map(lead => [
        lead.name,
        lead.email,
        lead.phone || '',
        lead.service || '',
        lead.status,
        new Date(lead.created_at).toLocaleDateString(),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold font-playfair text-gradient">Leads Management</h1>
        <button onClick={exportToCSV} className="btn-secondary flex items-center gap-2">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-muted" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setLeads([]);
          }}
          className="input-field"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
        </select>
        <button onClick={fetchLeads} className="btn-secondary">Refresh</button>
      </div>

      {/* Table */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin mr-2" />
            Loading leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-12 text-muted">
            No leads found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 font-semibold">Name</th>
                <th className="text-left px-6 py-4 font-semibold">Email</th>
                <th className="text-left px-6 py-4 font-semibold">Phone</th>
                <th className="text-left px-6 py-4 font-semibold">Service</th>
                <th className="text-left px-6 py-4 font-semibold">Status</th>
                <th className="text-left px-6 py-4 font-semibold">Date</th>
                <th className="text-left px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-border hover:bg-card-hover">
                  <td className="px-6 py-4 font-medium">{lead.name}</td>
                  <td className="px-6 py-4 text-muted">{lead.email}</td>
                  <td className="px-6 py-4 text-muted">{lead.phone || '-'}</td>
                  <td className="px-6 py-4 text-muted">{lead.service || '-'}</td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-transparent border border-current cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => alert(`Message: ${lead.message}`)}
                        className="p-2 hover:bg-card-hover rounded"
                      >
                        <Eye size={18} className="text-accent" />
                      </button>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="p-2 hover:bg-card-hover rounded"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card text-center">
          <p className="text-2xl font-bold text-accent">{filteredLeads.filter(l => l.status === 'new').length}</p>
          <p className="text-sm text-muted">New</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="card text-center">
          <p className="text-2xl font-bold text-accent">{filteredLeads.filter(l => l.status === 'contacted').length}</p>
          <p className="text-sm text-muted">Contacted</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="card text-center">
          <p className="text-2xl font-bold text-accent">{filteredLeads.filter(l => l.status === 'qualified').length}</p>
          <p className="text-sm text-muted">Qualified</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="card text-center">
          <p className="text-2xl font-bold text-accent">{filteredLeads.length}</p>
          <p className="text-sm text-muted">Total</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
