'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Eye, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const chartData = [
    { month: 'Jan', leads: 45, contacts: 32 },
    { month: 'Feb', leads: 52, contacts: 38 },
    { month: 'Mar', leads: 48, contacts: 35 },
    { month: 'Apr', leads: 61, contacts: 44 },
    { month: 'May', leads: 55, contacts: 40 },
    { month: 'Jun', leads: 67, contacts: 48 },
  ];

  const topPages = [
    { page: 'Home', views: 1240, bounce: '32%' },
    { page: 'Menu', views: 856, bounce: '28%' },
    { page: 'Gallery', views: 742, bounce: '35%' },
    { page: 'About', views: 634, bounce: '24%' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-4xl font-bold font-playfair text-gradient">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card">
          <Eye className="text-blue-400 mb-2" size={24} />
          <p className="text-sm text-muted">Total Views</p>
          <p className="text-3xl font-bold">12,543</p>
          <p className="text-xs text-green-400 mt-2">↑ 24% from last month</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="card">
          <Users className="text-green-400 mb-2" size={24} />
          <p className="text-sm text-muted">New Visitors</p>
          <p className="text-3xl font-bold">3,210</p>
          <p className="text-xs text-green-400 mt-2">↑ 18% from last month</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="card">
          <Activity className="text-purple-400 mb-2" size={24} />
          <p className="text-sm text-muted">Bounce Rate</p>
          <p className="text-3xl font-bold">32%</p>
          <p className="text-xs text-green-400 mt-2">↓ 8% improvement</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="card">
          <TrendingUp className="text-orange-400 mb-2" size={24} />
          <p className="text-sm text-muted">Conversion</p>
          <p className="text-3xl font-bold">3.5%</p>
          <p className="text-xs text-green-400 mt-2">↑ 1.2% from last month</p>
        </motion.div>
      </div>

      {/* Top Pages */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card">
        <h2 className="text-xl font-bold mb-6">Top Pages</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3">Page</th>
                <th className="text-left px-4 py-3">Views</th>
                <th className="text-left px-4 py-3">Bounce Rate</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page, i) => (
                <tr key={i} className="border-b border-border hover:bg-card-hover">
                  <td className="px-4 py-3">{page.page}</td>
                  <td className="px-4 py-3 font-semibold">{page.views}</td>
                  <td className="px-4 py-3 text-muted">{page.bounce}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Monthly Trend */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card">
        <h2 className="text-xl font-bold mb-6">Monthly Trend</h2>
        <div className="space-y-4">
          {chartData.map((data, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span>{data.month}</span>
                <span className="text-muted">{data.leads} leads</span>
              </div>
              <div className="h-2 bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${(data.leads / 70) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
