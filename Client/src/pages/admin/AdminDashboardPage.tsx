import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Building2, FileText, Users, ArrowUpRight, Plus, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface DashboardStats {
  listingsCount: number;
  articlesCount: number;
  leadsCount: number;
  recentListings: Array<{
    id: string | number;
    title: string;
    location: string;
    price: string;
    verified: boolean;
    created_at: string;
  }>;
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    listingsCount: 0,
    articlesCount: 0,
    leadsCount: 0,
    recentListings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        // Query listings count
        const { count: listingsCount, data: recentListings } = await supabase
          .from('properties')
          .select('id, title, location, price, verified, created_at', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(5);

        // Query articles count
        const { count: articlesCount } = await supabase
          .from('articles')
          .select('id', { count: 'exact', head: true });

        // Query leads count (may not exist yet if phase 6 migration pending)
        let leadsCount = 0;
        try {
          const { count } = await supabase
            .from('eligibility_leads')
            .select('id', { count: 'exact', head: true });
          leadsCount = count || 0;
        } catch {
          leadsCount = 0;
        }

        setStats({
          listingsCount: listingsCount || 0,
          articlesCount: articlesCount || 0,
          leadsCount: leadsCount || 0,
          recentListings: recentListings || [],
        });
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your listings, blog posts, and customer eligibility leads.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="bg-accent hover:bg-accent/90 text-white shadow-sm">
            <Link to="/admin/listings" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Listing
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/blog" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Article
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Properties Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-accent flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <Link
              to="/admin/listings"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              Manage
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Listings</p>
          <p className="text-3xl font-heading font-bold text-primary mt-1">
            {loading ? '...' : stats.listingsCount}
          </p>
          <p className="text-xs text-slate-500 mt-2">Active properties published on public site</p>
        </div>

        {/* Blog Articles Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <Link
              to="/admin/blog"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              Manage
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Blog Articles</p>
          <p className="text-3xl font-heading font-bold text-primary mt-1">
            {loading ? '...' : stats.articlesCount}
          </p>
          <p className="text-xs text-slate-500 mt-2">Insights, guides, and investment news</p>
        </div>

        {/* Eligibility Leads Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <Link
              to="/admin/leads"
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              View Pipeline
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Eligibility Leads</p>
          <p className="text-3xl font-heading font-bold text-primary mt-1">
            {loading ? '...' : stats.leadsCount}
          </p>
          <p className="text-xs text-slate-500 mt-2">Funnel submissions ready for consultation</p>
        </div>
      </div>

      {/* Recent Listings Overview */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-heading font-bold text-primary">Recent Property Listings</h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest additions to your real estate portfolio</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/listings">View All</Link>
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading recent listings...</div>
        ) : stats.recentListings.length === 0 ? (
          <div className="py-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No properties found</p>
            <p className="text-xs text-slate-400 mt-1">Create your first property listing to get started.</p>
            <Button asChild size="sm" className="mt-4 bg-accent hover:bg-accent/90 text-white">
              <Link to="/admin/listings">Create Listing</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase font-semibold text-slate-400">
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentListings.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 font-medium text-primary">{prop.title}</td>
                    <td className="py-3.5 text-slate-600">{prop.location}</td>
                    <td className="py-3.5 font-semibold text-slate-800">{prop.price}</td>
                    <td className="py-3.5">
                      {prop.verified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700">
                          <Clock className="w-3.5 h-3.5" />
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-slate-500 text-xs">
                      {prop.created_at ? new Date(prop.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
