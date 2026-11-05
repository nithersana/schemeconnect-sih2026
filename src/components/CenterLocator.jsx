import React, { useState, useMemo } from 'react';
import { 
  MapPin, Phone, Clock, Search, Building2, Navigation, 
  ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, 
  SlidersHorizontal, Filter, Sparkles, ExternalLink, Download
} from 'lucide-react';
import { CHANNEL_PARTNERS } from '../data/centers';

export function CenterLocator({ defaultDistrict = "Tiruchirappalli", lang = "ta", t }) {
  const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLoanType, setFilterLoanType] = useState('All');
  const [hideHighNPA, setHideHighNPA] = useState(true); // Default ON to protect users
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(CHANNEL_PARTNERS[0]);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const districts = ["Tiruchirappalli", "Madurai", "Salem", "Coimbatore", "All Districts"];

  const filteredPartners = useMemo(() => {
    return CHANNEL_PARTNERS.filter(p => {
      const matchesDist = selectedDistrict === "All Districts" || p.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchesCat = filterCategory === 'All' || p.partner_category === filterCategory;
      const matchesLoan = filterLoanType === 'All' || p.authorized_loans.some(l => l.toLowerCase().includes(filterLoanType.toLowerCase()));
      const matchesSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nodal_officer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNPA = !hideHighNPA || p.status !== 'INELIGIBLE_FROZEN';

      return matchesDist && matchesCat && matchesLoan && matchesSearch && matchesNPA;
    });
  }, [selectedDistrict, filterCategory, filterLoanType, searchQuery, hideHighNPA]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-800 px-3.5 py-1 rounded-full text-xs font-bold mb-2 border border-blue-200">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>{t?.locator_badge || "MoSJE 100+ Channel Finance Network"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t?.locator_title || "Geo-Spatial Channel Partner Locator & Smart Router"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          {t?.locator_desc || "Discover authorized State Channelizing Agencies (SCAs), Public Sector Banks, and RRBs equipped to process your loan. High-NPA distressed branches are dynamically filtered to eliminate application rejections."}
        </p>
      </div>

      {/* Smart Router Alert Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-2xl shadow-md mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-800/80 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wide">
              {t?.router_active_title || "Smart NPA-Aware Routing Algorithm Active"}
            </div>
            <div className="text-sm font-black text-white">
              {t?.router_active_desc || "Filtering 100+ Channel Partners by Real-Time Fund Utilization & NPA Ratios"}
            </div>
          </div>
        </div>

        {/* Toggle Hide High NPA */}
        <label className="flex items-center space-x-2.5 bg-white/10 px-3.5 py-2 rounded-xl cursor-pointer hover:bg-white/15 transition border border-white/20">
          <input
            type="checkbox"
            checked={hideHighNPA}
            onChange={(e) => setHideHighNPA(e.target.checked)}
            className="w-4 h-4 accent-emerald-500 rounded"
          />
          <span className="text-xs font-bold text-white">
            {t?.hide_npa_label || "Hide Ineligible / High-NPA Branches"} ({CHANNEL_PARTNERS.filter(p => p.status === 'INELIGIBLE_FROZEN').length} {lang === 'ta' ? "தடுக்கப்பட்டது" : "Protected"})
          </span>
        </label>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row gap-3 items-center justify-between">
        
        {/* District Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          {districts.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedDistrict === d
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d === 'All Districts' ? (lang === 'ta' ? 'அனைத்து மாவட்டங்கள்' : 'All Districts') : d}
            </button>
          ))}
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          
          {/* Partner Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">{t?.all_partners || "All Partner Types"}</option>
            <option value="SCA">SCA (TAHDCO / தாட்கோ)</option>
            <option value="PSB">PSB (SBI / IOB / Canara)</option>
            <option value="RRB">RRB (Tamil Nadu Grama Bank)</option>
          </select>

          {/* Loan Type Filter */}
          <select
            value={filterLoanType}
            onChange={(e) => setFilterLoanType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">{t?.all_loans || "All Authorized Loans"}</option>
            <option value="Micro Finance">Micro Finance (≤ ₹1.40L)</option>
            <option value="Term Loan">Term Loan (≤ ₹50.00L)</option>
            <option value="Educational">Educational Loans</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-52">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t?.search_partner || "Search branch or officer..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

      </div>

      {/* Main Grid: Partner Cards & Interactive Map Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PARTNER LIST (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>{lang === 'ta' ? `கண்டறியப்பட்ட முகமைகள் (${filteredPartners.length}):` : `Authorized Channel Partners Found (${filteredPartners.length}):`}</span>
            <span className="text-[11px] text-blue-600 font-semibold">{lang === 'ta' ? "குறைந்த வாராக்கடன் அடிப்படையில் வரிசைப்படுத்தப்பட்டது" : "Sorted by Proximity & Low NPA"}</span>
          </div>

          {filteredPartners.map((partner) => {
            const isSelected = selectedPartner?.id === partner.id;
            const isFrozen = partner.status === 'INELIGIBLE_FROZEN';

            return (
              <div 
                key={partner.id} 
                onClick={() => setSelectedPartner(partner)}
                className={`p-5 rounded-3xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-blue-50/50 border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                    : (isFrozen ? 'bg-rose-50/30 border-rose-200' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm')
                }`}
              >
                <div>
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {partner.type}
                    </span>

                    {/* Status Pill */}
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      partner.status === 'ACTIVE_ELIGIBLE' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : (partner.status === 'CAUTION_LIMITED' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-rose-100 text-rose-800 border border-rose-200')
                    }`}>
                      {partner.status === 'ACTIVE_ELIGIBLE' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {partner.status === 'CAUTION_LIMITED' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                      {partner.status === 'INELIGIBLE_FROZEN' && <XCircle className="w-3 h-3 text-rose-600" />}
                      <span>{partner.status === 'ACTIVE_ELIGIBLE' ? (lang === 'ta' ? 'செயல்பாட்டில் உள்ளது (குறைந்த NPA)' : partner.status_label) : (partner.status === 'INELIGIBLE_FROZEN' ? (lang === 'ta' ? 'தற்காலிகமாக நிறுத்தப்பட்டுள்ளது' : partner.status_label) : partner.status_label)}</span>
                    </span>
                  </div>

                  {/* Branch Name & Address */}
                  <h3 className="text-base font-black text-slate-900">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{partner.address}</span>
                  </p>

                  {/* Nodal Officer & NPA Health Grid */}
                  <div className="grid grid-cols-2 gap-2.5 mt-3 p-3 bg-slate-50/80 rounded-2xl text-xs border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">{t?.nodal_officer || "Nodal Officer"}:</span>
                      <span className="font-bold text-slate-800 text-[11px]">{partner.nodal_officer}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">{t?.npa_health || "NPA & Fund Health"}:</span>
                      <span className={`font-black text-[11px] ${
                        partner.npa_ratio <= 3.0 ? 'text-emerald-700' : (partner.npa_ratio <= 5.0 ? 'text-amber-700' : 'text-rose-700')
                      }`}>
                        NPA: {partner.npa_ratio}% • {partner.fund_utilization_rate}
                      </span>
                    </div>
                  </div>

                  {/* Authorized Loans Tags */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {t?.auth_schemes || "Authorized Schemes for Direct Processing:"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.authorized_loans.map((loan, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                          {loan}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-3 text-slate-500 font-medium text-[11px]">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-blue-600" />
                      {partner.phone}
                    </span>
                    <span>• {partner.distance_km} km {lang === 'ta' ? "தொலைவு" : "away"}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPartner(partner);
                      setShowVoucherModal(true);
                    }}
                    disabled={isFrozen}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isFrozen
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                  >
                    <span>{t?.btn_route_pass || "Route & Get Pass"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* INTERACTIVE MAP & SELECTED PARTNER DETAILS (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Simulated Leaflet / OpenStreetMap Visual Container */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  OpenStreetMap Live Radius View
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                GPS: {selectedDistrict}
              </span>
            </div>

            {/* Map Visual Box */}
            <div className="h-64 bg-slate-950 rounded-2xl relative border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
              
              {/* Map Grid Graphic */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              {/* District Center Pin */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-blue-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border border-blue-400/40">
                  📍 {lang === 'ta' ? "உங்கள் இருப்பிடம் (திருச்சி)" : "Your Location (Trichy Hub)"}
                </div>
                <div className="text-[10px] text-slate-400">
                  {lang === 'ta' ? "ஆரம்: 15 கி.மீ" : "Radius: 15 km"}
                </div>
              </div>

              {/* Partner Pins Scattered */}
              <div className="relative z-10 grid grid-cols-2 gap-2 my-auto">
                <div className="bg-emerald-950/80 border border-emerald-500/50 p-2 rounded-xl text-[10px] text-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="truncate">TAHDCO Nodal (1.8 km)</span>
                </div>
                <div className="bg-blue-950/80 border border-blue-500/50 p-2 rounded-xl text-[10px] text-blue-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span className="truncate">IOB Lead Bank (2.3 km)</span>
                </div>
                <div className="bg-emerald-950/80 border border-emerald-500/50 p-2 rounded-xl text-[10px] text-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="truncate">TNGB RRB (3.5 km)</span>
                </div>
                <div className="bg-rose-950/80 border border-rose-500/50 p-2 rounded-xl text-[10px] text-rose-300 flex items-center gap-1.5 opacity-60">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span className="truncate">{lang === 'ta' ? "நிறுத்தப்பட்ட வங்கி கிளை" : "Frozen Branch (Bypassed)"}</span>
                </div>
              </div>

              {/* Selected Focus Bar */}
              <div className="relative z-10 bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">{lang === 'ta' ? "தேர்ந்தெடுக்கப்பட்ட கிளை:" : "Selected Navigation Target:"}</span>
                  <span className="font-bold text-white text-xs">{selectedPartner?.name}</span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPartner?.name + " " + selectedPartner?.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-[10px] font-bold text-white flex items-center gap-1"
                >
                  <span>{lang === 'ta' ? "வரைபடம்" : "Open Maps"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>

            {/* Turn-by-Turn Info */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === 'ta' ? "பயண நேரம்:" : "Estimated Travel Time:"}</span>
                <span className="font-bold text-white">~8 {lang === 'ta' ? "நிமிடங்கள் (பேருந்து/வாகனம்)" : "Mins Drive / Bus"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === 'ta' ? "அலுவலக நேரம்:" : "Working Desk Hours:"}</span>
                <span className="font-bold text-white">{selectedPartner?.timings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === 'ta' ? "ஒற்றை சாளர நோடல் மையம்:" : "Single-Window Nodal Desk:"}</span>
                <span className="font-bold text-emerald-400">{lang === 'ta' ? "அங்கீகரிக்கப்பட்டது" : "Authorized & Verified"}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 1-Click Direct Application Voucher Modal */}
      {showVoucherModal && selectedPartner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-black text-slate-900 text-base">{t?.voucher_title || "Channel Partner Application Voucher"}</span>
              </div>
              <button 
                onClick={() => setShowVoucherModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 bg-slate-100 rounded-lg"
              >
                {lang === 'ta' ? "மூடுக" : "Close"}
              </button>
            </div>

            {/* Voucher Body */}
            <div className="my-5 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 text-slate-900 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-blue-900">{lang === 'ta' ? "சீட்டு எண்:" : "Voucher Ref:"} #SC-{Math.floor(100000 + Math.random() * 900000)}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  {t?.voucher_verified || "Fast-Track Verified"}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">{lang === 'ta' ? "ஒதுக்கப்பட்ட வங்கி / முகமை:" : "Assigned Channel Partner:"}</span>
                <div className="text-sm font-black text-slate-900">{selectedPartner.name}</div>
                <div className="text-xs text-slate-600">{selectedPartner.address}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-blue-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{t?.nodal_officer || "Nodal Officer"}:</span>
                  <span className="font-bold text-slate-800">{selectedPartner.nodal_officer}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{lang === 'ta' ? "தொடர்பு எண்:" : "Desk Contact:"}</span>
                  <span className="font-bold text-blue-700">{selectedPartner.phone}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-blue-100">
                📌 <b>{lang === 'ta' ? "பயனாளிகளுக்கான குறிப்பு: " : "Instructions for Beneficiary: "}</b>
                {lang === 'ta' 
                  ? "இந்த அனுமதி சீட்டுடன் உங்களது ஆதார் அட்டை, சாதிச் சான்றிதழ், வருமான சான்றிதழ் மற்றும் திட்ட மதிப்பீட்டு ஆவணங்களை கொண்டு செல்லவும்."
                  : "Present this physical or mobile voucher at the designated Nodal Desk along with your Aadhaar, Caste Certificate, and Project Quotation for single-window sanction."}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>{t?.btn_print_pass || "Print / Save Voucher Pass"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
