import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Briefcase,
  Star,
  QrCode,
  Share2,
  ExternalLink,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { fetchApi } from '../../utils/api';

const COLORS = ['#0284c7', '#059669', '#d97706', '#9333ea', '#e11d48', '#64748b'];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/admin/dashboard')
      .then((res) => {
        if (res.success) setDashboardData(res.data);
      })
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading dashboard analytics...</div>;
  }

  const { metrics, charts, recentEnquiries, recentLogs } = dashboardData || {
    metrics: {},
    charts: { ratingDistribution: [], enquiryStatusDistribution: [] },
    recentEnquiries: [],
    recentLogs: [],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time pipeline monitoring, customer QR feedback, and outbound engagement metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/enquiries" className="btn btn-primary btn-sm text-xs">
            <Inbox size={15} /> View Enquiries
          </Link>
          <Link to="/admin/qr-codes" className="btn btn-outline btn-sm text-xs">
            <QrCode size={15} /> Generate Review QR
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total & New Enquiries */}
        <div className="card p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Website Enquiries</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Inbox size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {metrics.totalEnquiries || 0}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="badge badge-amber font-bold">{metrics.newEnquiries || 0} New Pending</span>
            <span className="text-slate-400">Total logged</span>
          </div>
        </div>

        {/* Projects Active & Completed */}
        <div className="card p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Projects</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {metrics.publishedProjects || 0}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle size={14} className="text-emerald-600" />
            <span>{metrics.totalProjects || 0} total catalogued records</span>
          </div>
        </div>

        {/* Website Reviews & Avg Rating */}
        <div className="card p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Website Reviews</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1 flex items-baseline gap-2">
            <span>{metrics.averageWebsiteRating || '0.0'}</span>
            <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="text-xs text-slate-500">
            {metrics.totalReviews || 0} customer feedback records
          </div>
        </div>

        {/* QR Scans vs External Outbound Clicks */}
        <div className="card p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">QR Code Scans</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <QrCode size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {metrics.totalQrScans || 0}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <TrendingUp size={14} className="text-purple-600" />
            <span>Customer handover token scans</span>
          </div>
        </div>
      </div>

      {/* Clarification Callout regarding Outbound External Clicks */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-sky-950">
        <div>
          <strong className="font-bold text-sky-900">External Outbound Click Tracking:</strong>{' '}
          <span>{metrics.outboundGoogleClicks || 0} clicks on the Google Review redirect link, and {metrics.outboundSocialClicks || 0} clicks on other social handles.</span>
        </div>
        <span className="text-sky-700 font-medium italic shrink-0">
          * Note: Outbound clicks represent visitors redirected to external platforms, not confirmed Google reviews.
        </span>
      </div>

      {/* Visual Analytics Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Customer Rating Distribution */}
        <div className="card p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Customer Rating Distribution (Website Reviews)
              </h3>
              <p className="text-xs text-slate-500">Breakdown of submitted star ratings</p>
            </div>
            <Link to="/admin/reviews" className="text-xs font-semibold text-sky-700 hover:underline">
              Moderate Reviews →
            </Link>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.ratingDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="rating" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f4c81" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Enquiry Pipeline Status Breakdown */}
        <div className="card p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Enquiry Pipeline Statuses
              </h3>
              <p className="text-xs text-slate-500">Distribution across sales & inspection funnel</p>
            </div>
            <Link to="/admin/enquiries" className="text-xs font-semibold text-sky-700 hover:underline">
              Manage Funnel →
            </Link>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.enquiryStatusDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="status" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Tables: Recent Enquiries & Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enquiries */}
        <div className="card p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Recent Enquiries</h3>
            <Link to="/admin/enquiries" className="text-xs text-sky-700 font-semibold hover:underline">
              View All ({metrics.totalEnquiries})
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentEnquiries && recentEnquiries.length > 0 ? (
              recentEnquiries.map((enq) => (
                <div key={enq._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-800 block">{enq.customerName}</strong>
                    <span className="text-slate-500">{enq.serviceRequired} • {enq.location}</span>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${enq.status === 'New' ? 'badge-amber' : 'badge-blue'}`}>
                      {enq.status}
                    </span>
                    <span className="text-slate-400 block text-[10px] mt-0.5">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs">No enquiries yet</div>
            )}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="card p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Recent System Audit Trail</h3>
            <Link to="/admin/audit-logs" className="text-xs text-sky-700 font-semibold hover:underline">
              Full Logs
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentLogs && recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div key={log._id} className="py-3 flex items-start gap-3 text-xs">
                  <Clock size={15} className="text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-slate-800">{log.action}</span> on{' '}
                    <span className="font-semibold text-slate-600">{log.resource}</span> by{' '}
                    <span className="text-sky-700">{log.username}</span>
                  </div>
                  <span className="text-slate-400 text-[10px] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs">No audit logs recorded</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
