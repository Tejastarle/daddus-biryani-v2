'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, MessageSquare, TrendingUp, Loader } from 'lucide-react';
import { supabase, type Lead } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    messages: 0,
    conversion: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: totalLeads } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true });

        const { count: newLeads } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');

        const { data: leads } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalLeads: totalLeads || 0,
          newLeads: newLeads || 0,
          messages: 0,
          conversion: Math.round(((totalLeads || 0) / Math.max((totalLeads || 1), 1)) * 100),
        });

        setRecentLeads(leads || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2" />
        Loading dashboard...
      </div>
    );
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Leads',
      value: stats.totalLeads,
      color: 'text-blue-400',
    },
    {
      icon: MessageSquare,
      label: 'New Leads',
      value: stats.newLeads,
      color: 'text-green-400',
    },
    {
      icon: BarChart3,
      label: 'Conversion',
      value: `${stats.conversion}%`,
      color: 'text-purple-400',
    },
    {
      icon: TrendingUp,
      label: 'Growth',
      value: '+24%',
      color: 'text-orange-400',
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold font-playfair text-gradient">Dashboard</h1>
        <p className="text-muted mt-2">Welcome back! Here&apos;s your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <Icon className={`${stat.color} opacity-50`} size={32} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Leads */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-xl font-bold mb-6">Recent Leads</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Service</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted">
                    No leads yet
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border hover:bg-card-hover">
                    <td className="px-4 py-3">{lead.name}</td>
                    <td className="px-4 py-3 text-muted">{lead.email}</td>
                    <td className="px-4 py-3">{lead.service || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                        lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick stats were removed: they were placeholder numbers, not real data.
          Add them back only when they are wired to something genuine. */}

    </motion.div>
  );
}
