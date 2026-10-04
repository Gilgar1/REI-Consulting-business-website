import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  Mail,
  Phone,
  Calendar,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface LeadItem {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  language: string | null;
  project_type: string | null;
  property_purpose: string | null;
  has_title: boolean | null;
  project_cost: number | null;
  own_funds: number | null;
  total_debt: number | null;
  total_savings: number | null;
  age: number | null;
  monthly_income: number | null;
  employment_type: string | null;
  location: string | null;
  matched_loan_type: string | null;
  score: number | null;
  band: 'qualified' | 'workable' | 'needs_work' | string;
  followed_up: boolean;
  created_at: string;
}

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBand, setSelectedBand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let query = supabase
        .from('eligibility_leads')
        .select('*');

      if (selectedBand !== 'all') {
        query = query.eq('band', selectedBand);
      }

      if (sortBy === 'score') {
        query = query.order('score', { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
      }

      const { data, error } = await query;

      if (error) {
        // If table doesn't exist yet (Phase 6 pending), don't crash
        console.warn('eligibility_leads table fetch notice:', error.message);
        setLeads([]);
        setErrorMsg('The eligibility_leads table is not yet migrated in Supabase. Run the schema migration or complete Phase 6 to see incoming leads.');
      } else {
        setLeads(data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedBand, sortBy, sortOrder]);

  const toggleFollowedUp = async (lead: LeadItem) => {
    const newStatus = !lead.followed_up;
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, followed_up: newStatus } : l))
    );

    try {
      const { error } = await supabase
        .from('eligibility_leads')
        .update({ followed_up: newStatus })
        .eq('id', lead.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Failed to update followed_up status:', err);
      // Revert optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, followed_up: lead.followed_up } : l))
      );
      alert('Could not update status: ' + err.message);
    }
  };

  const getBandBadge = (band: string) => {
    switch (band) {
      case 'qualified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Qualified (&ge;80)
          </span>
        );
      case 'workable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Workable (60–79)
          </span>
        );
      case 'needs_work':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Needs Work (&lt;60)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 capitalize">
            {band || 'Pending'}
          </span>
        );
    }
  };

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.full_name?.toLowerCase().includes(q) ||
      l.phone?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
            Eligibility Leads Pipeline
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Cold Facebook traffic scored via the eligibility tool. High-intent prospective clients ready for consultation.
          </p>
        </div>
        <Button
          onClick={fetchLeads}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Leads
        </Button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-sm flex items-start gap-2.5">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Phase 6 Funnel Seam Ready</p>
            <p className="text-xs text-amber-700 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search leads by name, phone, email, or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50/50"
          />
        </div>

        {/* Filter by Band */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedBand}
            onChange={(e) => setSelectedBand(e.target.value)}
            className="px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent w-full md:w-auto"
          >
            <option value="all">All Score Bands</option>
            <option value="qualified">Qualified (≥80)</option>
            <option value="workable">Workable (60–79)</option>
            <option value="needs_work">Needs Work (&lt;60)</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              setSortBy(sb as any);
              setSortOrder(so as any);
            }}
            className="px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent w-full md:w-auto"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="score-desc">Highest Score</option>
            <option value="score-asc">Lowest Score</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm font-medium text-slate-500">Loading leads pipeline...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-20 text-center px-4">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No leads found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {search
                ? `No leads matched "${search}".`
                : 'As prospective clients submit the /eligibility readiness assessment, their scores and contact information will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead>Applicant Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Project & Location</TableHead>
                  <TableHead>Score & Band</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Followed Up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name */}
                    <TableCell>
                      <div>
                        <p className="font-semibold text-primary">{item.full_name}</p>
                        <p className="text-xs text-slate-400">{item.employment_type || 'N/A'}</p>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <div className="space-y-0.5 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                          <a href={`tel:${item.phone}`} className="hover:underline font-medium text-slate-800">
                            {item.phone}
                          </a>
                        </div>
                        {item.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={`mailto:${item.email}`} className="hover:underline truncate max-w-[160px]">
                              {item.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Project */}
                    <TableCell>
                      <div className="text-xs text-slate-600">
                        <p className="font-medium text-slate-800 capitalize">
                          {item.project_type || 'Buy'} • {item.property_purpose || 'Residential'}
                        </p>
                        <p className="text-slate-400">
                          {item.location || 'Cameroon'} • {item.project_cost ? `${item.project_cost.toLocaleString()} XAF` : '—'}
                        </p>
                      </div>
                    </TableCell>

                    {/* Score & Band */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-primary">
                            {item.score ?? 0}
                          </span>
                          <span className="text-xs text-slate-400">/ 100</span>
                        </div>
                        {getBandBadge(item.band)}
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                    </TableCell>

                    {/* Followed up Switch */}
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-2">
                        <Switch
                          checked={item.followed_up}
                          onCheckedChange={() => toggleFollowedUp(item)}
                          title="Tick when you have followed up"
                        />
                        <span className="text-xs text-slate-500 font-medium">
                          {item.followed_up ? (
                            <span className="text-emerald-600 font-semibold">Done</span>
                          ) : (
                            <span className="text-amber-600">Pending</span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
