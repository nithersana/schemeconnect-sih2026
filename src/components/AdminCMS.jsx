import React, { useState } from 'react';
import { 
  Users, TrendingUp, Landmark, Clock, Award, Plus, 
  BarChart3, PieChart, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { SCHEMES_DATABASE } from '../data/schemes';

export function AdminCMS({ lang, t }) {
  const [schemes, setSchemes] = useState(SCHEMES_DATABASE);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newScheme, setNewScheme] = useState({
    id: "NEW_SCHEME",
    name: "",
    ministry: "Ministry of Social Justice & Empowerment",
    benefit_amount: "₹50,000 Grant",
    subsidy: "100% Direct Benefit Transfer",
    min_age: 18,
    max_age: 65,
    max_annual_income: 300000,
    genders: ["All"],
    castes: ["SC", "ST"],
    occupations: ["Artisan", "Street Vendor"],
    states: ["All"],
    documents_required: ["Aadhaar Card", "Community Certificate", "Bank Passbook"],
    portal_url: "https://socialjustice.gov.in"
  });

  const handleAddScheme = (e) => {
    e.preventDefault();
    if (!newScheme.name) return;
    setSchemes([...schemes, { ...newScheme, id: `SCHEME_${Date.now()}` }]);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Ministry of Social Justice & Empowerment (MoSJE) CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.admin_title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time access rate telemetry, demographic coverage, and live scheme configuration.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Welfare Scheme</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 card-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.total_citizens}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900">48,290</span>
          <span className="text-[11px] font-semibold text-emerald-600 block mt-1">↑ +28% this month</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 card-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.funds_unlocked}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900">₹ 64.2 Cr</span>
          <span className="text-[11px] font-semibold text-emerald-600 block mt-1">Across 10+ Flagship Schemes</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 card-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.avg_match_speed}</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900">1.8 Sec</span>
          <span className="text-[11px] font-semibold text-purple-600 block mt-1">Sub-2 second deterministic rule engine</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 card-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Access Rate Surge</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900">3–5% ➔ 28%</span>
          <span className="text-[11px] font-semibold text-amber-600 block mt-1">Marginalized entrepreneur penetration</span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Language Diversity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 card-shadow">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-blue-600" />
            <span>{t.lang_dist}</span>
          </h3>

          <div className="space-y-3">
            {[
              { lang: "Tamil (தமிழ்)", pct: 42, color: "bg-blue-600" },
              { lang: "Hindi (हिंदी)", pct: 28, color: "bg-emerald-600" },
              { lang: "Telugu (తెలుగు)", pct: 12, color: "bg-purple-600" },
              { lang: "English", pct: 10, color: "bg-amber-600" },
              { lang: "Others", pct: 8, color: "bg-slate-400" },
            ].map((item) => (
              <div key={item.lang}>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">{item.lang}</span>
                  <span className="font-bold text-slate-900">{item.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Demographics Coverage */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 card-shadow">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Target Social Category Distribution</span>
          </h3>

          <div className="space-y-3">
            {[
              { cat: "Scheduled Caste (SC)", pct: 44, color: "bg-blue-600" },
              { cat: "Other Backward Classes (OBC)", pct: 26, color: "bg-emerald-600" },
              { cat: "Scheduled Tribe (ST)", pct: 21, color: "bg-amber-600" },
              { cat: "Women & General SHGs", pct: 9, color: "bg-purple-600" },
            ].map((item) => (
              <div key={item.cat}>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">{item.cat}</span>
                  <span className="font-bold text-slate-900">{item.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Live Scheme CMS Table */}
      <div className="bg-white rounded-2xl border border-slate-200 card-shadow overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Configured Welfare Schemes ({schemes.length})</h3>
            <p className="text-xs text-slate-400">Non-technical MoSJE admins can modify criteria in real-time.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Scheme Name</th>
                <th className="px-5 py-3">Target Category</th>
                <th className="px-5 py-3">Benefit Amount</th>
                <th className="px-5 py-3">Max Income</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {schemes.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {s.name}
                    <span className="block text-[10px] text-slate-400 font-normal">{s.ministry}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      {s.castes.join(', ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-700">
                    {s.benefit_amount}
                  </td>
                  <td className="px-5 py-3.5 font-medium">
                    ₹{s.max_annual_income.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Active</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Scheme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 card-shadow border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Add New Welfare Scheme</h3>
            <form onSubmit={handleAddScheme} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Scheme Title</label>
                <input
                  type="text"
                  placeholder="e.g. Tamil Nadu SC Youth Startup Grant"
                  value={newScheme.name}
                  onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
                  className="w-full p-2.5 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Benefit Amount</label>
                <input
                  type="text"
                  value={newScheme.benefit_amount}
                  onChange={(e) => setNewScheme({ ...newScheme, benefit_amount: e.target.value })}
                  className="w-full p-2.5 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Income Ceiling (₹)</label>
                <input
                  type="number"
                  value={newScheme.max_annual_income}
                  onChange={(e) => setNewScheme({ ...newScheme, max_annual_income: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold"
                >
                  Save Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
