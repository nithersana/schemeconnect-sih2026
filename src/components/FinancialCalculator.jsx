import React, { useState, useMemo } from 'react';
import { 
  Calculator, IndianRupee, Percent, Clock, ShieldCheck, 
  TrendingDown, Info, ArrowRight, Download, CheckCircle2, AlertTriangle, Sparkles, Building2
} from 'lucide-react';

export function FinancialCalculator({ initialProjectCost = 140000, initialSchemeType = "Micro Finance", lang = "ta", t }) {
  const [projectCost, setProjectCost] = useState(initialProjectCost);
  const [loanSharePct, setLoanSharePct] = useState(90); // 90% Scheme Concessional Lending
  const [interestRate, setInterestRate] = useState(6.5); // Concessional rate
  const [tenureMonths, setTenureMonths] = useState(36);
  const [moratoriumMonths, setMoratoriumMonths] = useState(3);
  const [activePreset, setActivePreset] = useState("micro"); // 'micro', 'term', 'edu', 'commercial', 'moneylender'
  const [showAmortization, setShowAmortization] = useState(false);

  // Apply Presets
  const applyPreset = (type) => {
    setActivePreset(type);
    if (type === 'micro') {
      setProjectCost(140000);
      setLoanSharePct(90);
      setInterestRate(5.0);
      setTenureMonths(36);
      setMoratoriumMonths(3);
    } else if (type === 'term') {
      setProjectCost(1500000);
      setLoanSharePct(90);
      setInterestRate(6.5);
      setTenureMonths(60);
      setMoratoriumMonths(6);
    } else if (type === 'edu') {
      setProjectCost(800000);
      setLoanSharePct(90);
      setInterestRate(4.0);
      setTenureMonths(84);
      setMoratoriumMonths(12);
    } else if (type === 'commercial') {
      setLoanSharePct(75);
      setInterestRate(12.5);
      setMoratoriumMonths(0);
    } else if (type === 'moneylender') {
      setLoanSharePct(100);
      setInterestRate(24.0);
      setMoratoriumMonths(0);
    }
  };

  // Calculations
  const loanAmount = useMemo(() => Math.round((projectCost * loanSharePct) / 100), [projectCost, loanSharePct]);
  const beneficiaryMargin = useMemo(() => Math.round(projectCost - loanAmount), [projectCost, loanAmount]);

  // Standard Monthly EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = useMemo(() => interestRate / 12 / 100, [interestRate]);
  const effectiveTenure = useMemo(() => Math.max(1, tenureMonths - moratoriumMonths), [tenureMonths, moratoriumMonths]);

  const monthlyEMI = useMemo(() => {
    if (loanAmount <= 0) return 0;
    if (monthlyRate === 0) return Math.round(loanAmount / effectiveTenure);
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, effectiveTenure)) / 
                (Math.pow(1 + monthlyRate, effectiveTenure) - 1);
    return Math.round(emi);
  }, [loanAmount, monthlyRate, effectiveTenure]);

  // Moratorium Monthly Simple Interest
  const moratoriumMonthlyInterest = useMemo(() => {
    return Math.round(loanAmount * monthlyRate);
  }, [loanAmount, monthlyRate]);

  // Total Repayment & Total Interest
  const totalMoratoriumInterest = useMemo(() => moratoriumMonthlyInterest * moratoriumMonths, [moratoriumMonthlyInterest, moratoriumMonths]);
  const totalPrincipalRepayment = useMemo(() => monthlyEMI * effectiveTenure, [monthlyEMI, effectiveTenure]);
  const totalRepayment = useMemo(() => totalPrincipalRepayment + totalMoratoriumInterest, [totalPrincipalRepayment, totalMoratoriumInterest]);
  const totalInterestPaid = useMemo(() => Math.max(0, totalRepayment - loanAmount), [totalRepayment, loanAmount]);

  // Market comparison at 20% interest rate without subsidy
  const marketMonthlyRate = 20.0 / 12 / 100;
  const marketEMI = useMemo(() => {
    const emi = (loanAmount * marketMonthlyRate * Math.pow(1 + marketMonthlyRate, tenureMonths)) / 
                (Math.pow(1 + marketMonthlyRate, tenureMonths) - 1);
    return Math.round(emi);
  }, [loanAmount, marketMonthlyRate, tenureMonths]);

  const marketTotalInterest = useMemo(() => Math.max(0, (marketEMI * tenureMonths) - loanAmount), [marketEMI, tenureMonths, loanAmount]);
  const totalSavings = useMemo(() => Math.max(0, marketTotalInterest - totalInterestPaid), [marketTotalInterest, totalInterestPaid]);

  // Generate Amortization Schedule (First 12 months sample + summary)
  const amortizationSchedule = useMemo(() => {
    const schedule = [];
    let balance = loanAmount;
    
    // Moratorium Phase
    for (let m = 1; m <= moratoriumMonths; m++) {
      schedule.push({
        month: m,
        phase: lang === 'ta' ? "அவகாச காலம் (Moratorium)" : (lang === 'hi' ? "मोराटोरियम अवधि" : "Moratorium Grace Period"),
        emi: moratoriumMonthlyInterest,
        principal: 0,
        interest: moratoriumMonthlyInterest,
        balance: balance
      });
    }

    // Repayment Phase (First 6 months + last month)
    for (let m = 1; m <= Math.min(12, effectiveTenure); m++) {
      const interestForMonth = Math.round(balance * monthlyRate);
      const principalForMonth = Math.min(balance, monthlyEMI - interestForMonth);
      balance = Math.max(0, balance - principalForMonth);
      schedule.push({
        month: moratoriumMonths + m,
        phase: lang === 'ta' ? "அசல் + வட்டி தவணை" : (lang === 'hi' ? "मूलधन + ईएमआई" : "Principal Repayment"),
        emi: monthlyEMI,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: balance
      });
    }
    return schedule;
  }, [loanAmount, moratoriumMonths, moratoriumMonthlyInterest, effectiveTenure, monthlyEMI, monthlyRate, lang]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-800 px-3.5 py-1 rounded-full text-xs font-bold mb-2 border border-blue-200">
          <Calculator className="w-3.5 h-3.5 text-blue-600" />
          <span>{t?.calc_badge || "MoSJE Concessional Credit & Moratorium Simulator"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t?.calc_title || "Interactive Scheme Financial Feasibility Calculator"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          {t?.calc_desc || "Simulate projected monthly EMIs with concessional interest rates (4.0% – 8.0%), 90% government cost coverage, and 3 to 12 months moratorium grace periods."}
        </p>
      </div>

      {/* Preset Quick Buttons */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          {t?.calc_preset_label || "Select Standard Scheme Preset:"}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          
          <button
            onClick={() => applyPreset('micro')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              activePreset === 'micro'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">{t?.preset_micro || "Micro Finance"}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded">5.0%</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">≤ ₹1.40L (3 Mo Grace)</span>
          </button>

          <button
            onClick={() => applyPreset('term')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              activePreset === 'term'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">{t?.preset_term || "Term Loan"}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded">6.5%</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">≤ ₹50L (6 Mo Grace)</span>
          </button>

          <button
            onClick={() => applyPreset('edu')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              activePreset === 'edu'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">{t?.preset_edu || "Education Loan"}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-purple-200 text-purple-800 rounded">4.0%</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">≤ ₹20L (12 Mo Grace)</span>
          </button>

          <button
            onClick={() => applyPreset('commercial')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              activePreset === 'commercial'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">{t?.preset_comm || "Commercial Bank"}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded">12.5%</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">{lang === 'ta' ? "சாதாரண தனியார் வங்கி" : "Market Bank Rate"}</span>
          </button>

          <button
            onClick={() => applyPreset('moneylender')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              activePreset === 'moneylender'
                ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900">{t?.preset_money || "Private Lender"}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-200 text-rose-800 rounded">24.0%</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">{lang === 'ta' ? "கந்துவட்டி கடன்" : "Predatory Credit"}</span>
          </button>

        </div>
      </div>

      {/* Main Grid: Controls on Left, Live Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: SLIDERS & PARAMETERS (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          
          {/* Total Project Cost */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-blue-600" />
                <span>{t?.label_total_cost || "Total Project / Study Cost:"}</span>
              </label>
              <div className="text-lg font-black text-blue-900 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                ₹{Number(projectCost).toLocaleString('en-IN')}
              </div>
            </div>
            <input
              type="range"
              min="20000"
              max="5000000"
              step="10000"
              value={projectCost}
              onChange={(e) => {
                setProjectCost(Number(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
              <span>₹20,000 (Micro)</span>
              <span>₹1.40 Lakh (Micro Cap)</span>
              <span>₹10 Lakhs</span>
              <span>₹50 Lakhs (Term Cap)</span>
            </div>
          </div>

          {/* Scheme Loan Coverage Ratio */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-700">{t?.label_share || "Scheme Concessional Funding Share:"}</span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {loanSharePct}% {lang === 'ta' ? "அரசு கடன்" : "Govt Share"} ({100 - loanSharePct}% {lang === 'ta' ? "பயனாளி பங்கு" : "Margin"})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px]">{lang === 'ta' ? "அரசு சலுகைக் கடன் தொகை:" : "Concessional Loan:"}</span>
                <div className="font-black text-slate-900 text-sm">₹{loanAmount.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px]">{lang === 'ta' ? "பயனாளி செலுத்த வேண்டிய பங்கு (10%):" : "Beneficiary Margin (10%):"}</span>
                <div className="font-black text-slate-900 text-sm">₹{beneficiaryMargin.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-blue-600" />
                <span>{t?.label_int_rate || "Annual Concessional Interest Rate:"}</span>
              </label>
              <div className="text-base font-black text-blue-900 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                {interestRate}% p.a.
              </div>
            </div>
            <input
              type="range"
              min="4.0"
              max="15.0"
              step="0.5"
              value={interestRate}
              onChange={(e) => {
                setInterestRate(Number(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
              <span>4.0% (Education/Women)</span>
              <span>5.0% (NSFDC Micro)</span>
              <span>6.5%–8.0% (Term Loan)</span>
              <span>15.0% (Commercial)</span>
            </div>
          </div>

          {/* Loan Tenure & Moratorium Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Total Tenure */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t?.label_tenure || "Total Tenure:"}</span>
                </label>
                <span className="text-xs font-bold text-slate-900">{tenureMonths} {lang === 'ta' ? "மாதங்கள்" : "Months"} ({Math.round(tenureMonths/12 * 10)/10} {lang === 'ta' ? "வருடங்கள்" : "Yrs"})</span>
              </div>
              <input
                type="range"
                min="12"
                max="84"
                step="6"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Moratorium Grace Period */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t?.label_moratorium || "Moratorium Grace Period:"}</span>
                </label>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {moratoriumMonths} {lang === 'ta' ? "மாதங்கள்" : "Months"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="3"
                value={moratoriumMonths}
                onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

          </div>

          {/* Moratorium Educational Callout */}
          <div className="flex items-start space-x-3 bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200/80">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-blue-900">{lang === 'ta' ? "அவகாசத்தின் முக்கியத்துவம்: " : "Why Moratorium Matters: "}</span>
              {lang === 'ta' 
                ? `முதல் ${moratoriumMonths} மாதங்களுக்கு அசல் கட்ட தேவையில்லை; வெறும் ₹${moratoriumMonthlyInterest.toLocaleString('en-IN')}/மாதம் மட்டுமே வட்டியாக செலுத்தினால் போதும். இதனால் தொழில் தொடங்கும் ஆரம்ப கட்டத்தில் சுமை குறைகிறது.`
                : `During the initial ${moratoriumMonths} months grace period, you only pay a nominal interest of ₹${moratoriumMonthlyInterest.toLocaleString('en-IN')}/mo to allow your business to stabilize before full principal EMI begins.`}
            </div>
          </div>

        </div>

        {/* RIGHT: LIVE OUTPUT & COMPARISON CARDS (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main EMI Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                {t?.projected_emi || "Projected Monthly EMI"}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                {lang === 'ta' ? "குறைந்த வட்டி சலுகை" : "Concessional Rate"}
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
              ₹{monthlyEMI.toLocaleString('en-IN')}
              <span className="text-sm font-semibold text-slate-300"> / {lang === 'ta' ? "மாதம்" : "month"}</span>
            </div>
            
            <p className="text-xs text-slate-300 mb-6">
              {lang === 'ta' ? `${moratoriumMonths} மாத அவகாசத்திற்கு பின் ${effectiveTenure} மாத தவணை தவணைகள்.` : `Post-${moratoriumMonths} month moratorium for ${effectiveTenure} repayment installments.`}
            </p>

            {/* Quick Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">{lang === 'ta' ? "அசல் கடன் தொகை:" : "Loan Principal:"}</span>
                <span className="font-bold text-white text-sm">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{lang === 'ta' ? "மொத்த வட்டி:" : "Total Interest:"}</span>
                <span className="font-bold text-emerald-400 text-sm">₹{totalInterestPaid.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>

          {/* Massive Savings Comparison Box */}
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{t?.govt_benefit || "Government Concessional Benefit"}</span>
            </div>
            <div className="text-2xl font-black text-emerald-900">
              ₹{totalSavings.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-emerald-700 mt-1 leading-normal">
              {t?.savings_subtext || "Estimated interest saved compared to private market lenders (20% p.a.). Protected under MoSJE/NSFDC guidelines."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{showAmortization ? (t?.btn_hide_schedule || "Hide Repayment Schedule") : (t?.btn_show_schedule || "View Month-by-Month Amortization")}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Amortization Table Accordion */}
      {showAmortization && (
        <div className="mt-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{lang === 'ta' ? "மாதாந்திர தவணை அட்டவணை" : "Amortization Schedule Breakdown"}</h3>
              <p className="text-xs text-slate-500">{lang === 'ta' ? "முதல் 12 மாத தவணை மாதிரி அட்டவணை" : "First 12-month sample projection for loan sanction review."}</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {tenureMonths} {lang === 'ta' ? "மாதங்கள்" : "Months Total"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">{lang === 'ta' ? "மாதம்" : "Month"}</th>
                  <th className="py-2.5 px-3">{lang === 'ta' ? "நிலை / கட்டம்" : "Phase / Stage"}</th>
                  <th className="py-2.5 px-3">{lang === 'ta' ? "செலுத்தும் தவணை" : "EMI Paid"}</th>
                  <th className="py-2.5 px-3">{lang === 'ta' ? "அசல்" : "Principal"}</th>
                  <th className="py-2.5 px-3">{lang === 'ta' ? "வட்டி" : "Interest"}</th>
                  <th className="py-2.5 px-3">{lang === 'ta' ? "மீதமுள்ள அசல்" : "Remaining Balance"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {amortizationSchedule.map((row) => (
                  <tr key={row.month} className={row.principal === 0 ? "bg-amber-50/50" : "hover:bg-slate-50"}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">M{row.month}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.principal === 0 ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {row.phase}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold">₹{row.emi.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3">₹{row.principal.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-slate-500">₹{row.interest.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">₹{row.balance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
