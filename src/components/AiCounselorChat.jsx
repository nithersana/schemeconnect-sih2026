import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, Volume2, HelpCircle, ArrowRight, Lightbulb, ShieldCheck } from 'lucide-react';
import { speakText } from '../utils/speech';

export function AiCounselorChat({ lang = "ta", t, isEmbedded = false, currentProfile = null }) {
  const [isOpen, setIsOpen] = useState(isEmbedded);
  const [input, setInput] = useState("");

  const getGreeting = (currentLang) => {
    if (currentLang === 'ta') {
      return "வணக்கம்! நான் உங்கள் SchemeConnect AI மித்ரா. நீங்கள் தகுதியுள்ளவராக இருந்தாலும் அல்லது தகுதியற்றவராக இருந்தாலும், உங்கள் தற்போதைய நிலைக்கு ஏற்ற அரசு கடன்கள், மாற்று திட்டங்கள் மற்றும் மானியங்கள் பற்றி என்னிடம் எந்த கேள்வியும் கேட்கலாம்!";
    } else if (currentLang === 'hi') {
      return "नमस्ते! मैं आपका SchemeConnect एआई मित्र हूँ। चाहे आप पात्र हों या अपात्र, आपके वर्तमान विवरण के अनुसार उपलब्ध सरकारी योजनाओं, वैकल्पिक ऋणों और सब्सिडी के बारे में कुछ भी पूछें!";
    } else {
      return "Hello! I am SchemeConnect AI Mitra. Whether you are eligible or currently ineligible for specific schemes, ask me anything about loans, alternate grants, or steps to qualify based on what you have right now!";
    }
  };

  const getQuickPrompts = (currentLang) => {
    if (currentLang === 'ta') {
      return [
        "வருமானம் ₹5 லட்சத்திற்கு மேல் இருந்தால் என்ன கடன் உண்டு?",
        "சாதிச் சான்றிதழ் இல்லாமல் என்னென்ன கடன்கள் பெறலாம்?",
        "PMEGP 35% மானியத்திற்கு எப்படி விண்ணப்பிப்பது?",
        "NSFDC மற்றும் தாட்கோ (TAHDCO) கடன் வித்தியாசம் என்ன?",
        "பிஎம் விஸ்வகர்மா ₹15,000 கருவித்தொகுப்பு பெறுவது எப்படி?"
      ];
    } else if (currentLang === 'hi') {
      return [
        "आय ₹5 लाख से अधिक होने पर कौन सा लोन मिलेगा?",
        "बिना जाति प्रमाण पत्र के कौन से लोन उपलब्ध हैं?",
        "PMEGP 35% सब्सिडी योजना में कैसे आवेदन करें?",
        "मुद्रा (MUDRA) लोन के लिए क्या प्रक्रिया है?",
        "पीएम विश्वकर्मा टूलकिट योजना का लाभ कैसे लें?"
      ];
    } else {
      return [
        "I earn above ₹5 Lakhs, what loans can I get?",
        "What loans can I get without a caste certificate?",
        "How to apply for PMEGP 35% subsidy?",
        "What is the difference between NSFDC and TAHDCO?",
        "How to get PM Vishwakarma ₹15,000 toolkit voucher?"
      ];
    }
  };

  const [messages, setMessages] = useState([
    { sender: "bot", text: getGreeting(lang) }
  ]);

  // Update greeting and chat context when overall language changes
  useEffect(() => {
    setMessages([
      { sender: "bot", text: getGreeting(lang) }
    ]);
  }, [lang]);

  const generateIntelligentResponse = (userMsg) => {
    const lower = userMsg.toLowerCase();

    // 1. TAMIL RESPONSES
    if (lang === 'ta' || userMsg.match(/[\u0B80-\u0BFF]/)) {
      // Ineligible / High income queries
      if (lower.includes("5 லட்சம்") || lower.includes("அதிகம்") || lower.includes("தகுதி இல்லை") || lower.includes("வருமானம்") || lower.includes("ineligible") || lower.includes("above")) {
        return "உங்களின் ஆண்டு வருமானம் ₹5.00 லட்சத்திற்கு மேல் இருந்தாலும் கவலைப்பட தேவையில்லை! உங்களுக்காக பின்வரும் சிறந்த மாற்று திட்டங்கள் உள்ளன:\n\n" +
          "1. **PMEGP திட்டம் (KVIC)**: உற்பத்தி தொழிலுக்கு ₹50 லட்சம் வரையிலும், சேவை தொழிலுக்கு ₹20 லட்சம் வரையிலும் 15% முதல் 35% அரசு மானியத்துடன் கடன் கிடைக்கும் (இதற்கு எவ்வித குடும்ப வருமான உச்சவரம்பும் கிடையாது!).\n" +
          "2. **முத்ரா கடன் (MUDRA Kishore / Tarun)**: ₹50,000 முதல் ₹10 லட்சம் வரை பிணையமில்லா கடன் அனைத்து பொதுத்துறை வங்கிகளிலும் கிடைக்கும்.\n" +
          "3. **CGTMSE கிரெடிட் கேரண்டி**: ₹2 கோடி வரை எந்த சொத்து பிணையமும் இன்றி மத்திய அரசு உத்தரவாதத்துடன் தொழில் கடன் பெறலாம்.";
      }
      // Missing Caste Certificate
      else if (lower.includes("சாதி") || lower.includes("சான்றிதழ் இல்லை") || lower.includes("caste") || lower.includes("certificate")) {
        return "உங்களிடம் சாதிச் சான்றிதழ் இல்லையென்றாலும் பின்வரும் திட்டங்களில் உடனடியாக பயன்பெறலாம்:\n\n" +
          "• **PM SVANidhi**: தெருவோர வியாபாரிகளுக்கு ஆதார் அட்டை மட்டுமே போதுமானது (₹10,000 முதல் ₹50,000 வரை 7% வட்டி மானியத்துடன்).\n" +
          "• **PM Vishwakarma**: 18 வகையான கைவினைஞர்களுக்கு சாதி தேவையின்றி ₹15,000 இலவச கருவித்தொகுப்பு மற்றும் 5% வட்டியில் ₹3 லட்சம் கடன்.\n" +
          "• **PMEGP & MUDRA**: பொதுப்பிரிவிலும் 15% முதல் 25% மானியத்துடன் தொழில் கடன் பெறலாம்.\n\n" +
          "💡 *குறிப்பு*: நீங்கள் SC பிரிவினர் எனில், தமிழ்நாடு இ-சேவை (e-District) மையம் மூலம் 7 நாட்களில் சாதிச் சான்றிதழைப் பெற்று 5% NSFDC சலுகைக் கடனையும் பெற முடியும்.";
      }
      // PMEGP Scheme
      else if (lower.includes("pmegp") || lower.includes("மானியம்")) {
        return "**PMEGP (பிரதமரின் வேலைவாய்ப்பு உருவாக்கும் திட்டம்)**:\n" +
          "• உற்பத்தி பிரிவிற்கு: ₹50 லட்சம் வரை கடன்.\n" +
          "• சேவை பிரிவிற்கு: ₹20 லட்சம் வரை கடன்.\n" +
          "• அரசு மானியம்: நகர்ப்புறத்தில் 25%, கிராமப்புறத்தில் 35% நேரடி மூலதன மானியம்.\n" +
          "• தகுதி: 8-ஆம் வகுப்பு தேர்ச்சி பெற்றிருந்தால் போதுமானது. ஆன்லைனில் kviconline.gov.in மூலம் 1-க்ளிக்கில் விண்ணப்பிக்கலாம்.";
      }
      // TAHDCO / NSFDC differences
      else if (lower.includes("தாட்கோ") || lower.includes("nsfdc") || lower.includes("tahdco")) {
        return "**தாட்கோ (TAHDCO) vs NSFDC வித்தியாசம்**:\n\n" +
          "• **TAHDCO (தமிழக அரசு)**: திட்ட மதிப்பீட்டில் 35% (அதிகபட்சம் ₹3.5 லட்சம்) நேரடி அரசு மானியமாக வழங்குகிறது. வணிக வாகனங்கள், கடை அமைக்க ஏற்றது.\n" +
          "• **NSFDC (மத்திய அரசு)**: 90% திட்ட செலவை வெறும் 5.0% முதல் 6.5% குறைந்த வட்டியில் 6 முதல் 12 மாத தவணை தள்ளிவைப்பு (Moratorium) சலுகையுடன் வழங்குகிறது.\n" +
          "இரண்டு திட்டங்களையும் இணைத்து எங்கள் தளம் மூலம் நீங்கள் அதிகபட்ச பலன் பெறலாம்!";
      }
      // Vishwakarma
      else if (lower.includes("விஸ்வகர்மா") || lower.includes("vishwakarma") || lower.includes("கருவி")) {
        return "**பிஎம் விஸ்வகர்மா திட்டம் (PM Vishwakarma)**:\n" +
          "1. 5 நாள் இலவச திறன் பயிற்சி + நாளொன்றுக்கு ₹500 உதவித்தொகை.\n" +
          "2. ₹15,000 நவீன தொழில் கருவித்தொகுப்பு e-Voucher.\n" +
          "3. பிணையமில்லா 5% சலுகை வட்டியில் ₹1 லட்சம் (முதல் கட்டம்) + ₹2 லட்சம் (இரண்டாம் கட்டம்) கடன்.\n" +
          "அருகிலுள்ள CSC இ-சேவை மையத்தில் கைரேகை பதிவு செய்து இன்றே விண்ணப்பிக்கலாம்.";
      }
      // Default Tamil
      else {
        return "உங்கள் கேள்விக்கு நன்றி! நீங்கள் தகுதியுள்ளவராக இருந்தாலும் அல்லது வருமானம்/ஆவணங்கள் காரணமாக தற்போது தகுதி பெறாவிட்டாலும், அரசு நலத்திட்டங்கள், PMEGP, முத்ரா, வட்டி மானியங்கள் அல்லது உங்கள் பகுதிக்கு அருகிலுள்ள தாட்கோ/வங்கி கிளைகள் குறித்து எதை வேண்டுமானாலும் கேளுங்கள்.";
      }
    }

    // 2. HINDI RESPONSES
    else if (lang === 'hi' || userMsg.match(/[\u0900-\u097F]/)) {
      if (lower.includes("5 लाख") || lower.includes("अधिक") || lower.includes("अपात्र") || lower.includes("आय") || lower.includes("ineligible")) {
        return "यदि आपकी वार्षिक आय ₹5.00 लाख से अधिक है, तब भी आपके लिए कई बेहतरीन सरकारी योजनाएं उपलब्ध हैं:\n\n" +
          "1. **PMEGP योजना**: ₹50 लाख तक का ऋण (विनिर्माण हेतु) और 35% तक सरकारी सब्सिडी (कोई पारिवारिक आय सीमा नहीं)।\n" +
          "2. **मुद्रा (MUDRA) ऋण**: ₹10 लाख तक बिना गारंटी ऋण।\n" +
          "3. **CGTMSE योजना**: ₹2 करोड़ तक कोलेटरल-फ्री ऋण।";
      } else if (lower.includes("जाति") || lower.includes("प्रमाण पत्र") || lower.includes("caste")) {
        return "बिना जाति प्रमाण पत्र के भी आप **पीएम स्वनिधि (₹50,000 तक)**, **पीएम विश्वकर्मा (₹15,000 टूलकिट + 5% लोन)** और **मुद्रा लोन** आसानी से प्राप्त कर सकते हैं।";
      } else {
        return "नमस्ते! मैं आपका SchemeConnect एआई मित्र हूँ। आप ऋण पात्रता, सब्सिडी, आवश्यक दस्तावेज़ या नजदीकी बैंक शाखाओं के बारे में कोई भी प्रश्न पूछ सकते हैं।";
      }
    }

    // 3. ENGLISH RESPONSES
    else {
      if (lower.includes("5 lakh") || lower.includes("above") || lower.includes("ineligible") || lower.includes("income") || lower.includes("exceed")) {
        return "Even if your annual family income exceeds the ₹5.00 Lakh concessional ceiling, you can immediately access several high-impact schemes:\n\n" +
          "1. **PMEGP (KVIC/MSME)**: Loans up to ₹50 Lakhs for manufacturing and ₹20 Lakhs for services with **25%–35% direct government capital subsidy** (No family income cap!).\n" +
          "2. **MUDRA Scheme (Kishore/Tarun)**: Up to ₹10 Lakhs collateral-free credit from all commercial and rural banks.\n" +
          "3. **CGTMSE Credit Guarantee**: Up to ₹2 Crores collateral-free working capital backed by the Government of India.\n" +
          "4. **Stand-Up India**: Composite bank loans between ₹10 Lakhs and ₹1 Crore for SC/ST and Women entrepreneurs.";
      } else if (lower.includes("caste") || lower.includes("certificate") || lower.includes("document") || lower.includes("without")) {
        return "No Community Certificate? You can still qualify for these major schemes today:\n\n" +
          "• **PM SVANidhi**: Collateral-free working capital up to ₹50,000 for vendors with only Aadhaar & Bank Passbook.\n" +
          "• **PM Vishwakarma**: ₹15,000 free modern toolkit voucher + 5% subsidized loan up to ₹3 Lakhs for 18 artisan trades.\n" +
          "• **PMEGP & MUDRA**: Open to General/OBC categories with 15% to 25% subsidies.\n\n" +
          "💡 *Pro-Tip*: If you belong to the SC community, apply via your state e-District portal to receive your certificate in 7 days and unlock 5% NSFDC loans.";
      } else if (lower.includes("pmegp") || lower.includes("subsidy")) {
        return "**PMEGP (Prime Minister's Employment Generation Programme)**:\n" +
          "• Manufacturing Units: Up to ₹50 Lakhs.\n" +
          "• Service Units: Up to ₹20 Lakhs.\n" +
          "• Govt Subsidy: 25% in urban areas and 35% in rural areas for special categories.\n" +
          "• Qualification: 8th standard pass. Apply directly online at kviconline.gov.in.";
      } else if (lower.includes("tahdco") || lower.includes("nsfdc")) {
        return "**TAHDCO vs NSFDC Comparison**:\n\n" +
          "• **TAHDCO (Tamil Nadu)**: Grants up to **35% direct front-ended capital subsidy** (max ₹3.5 Lakhs) for SC/ST individuals.\n" +
          "• **NSFDC (National Level)**: Provides **90% concessional loan financing at 5.0% to 6.5% interest** with 3 to 12 months moratorium grace periods.\n" +
          "SchemeConnect allows you to converge both for maximum financial benefit!";
      } else {
        return "I am here to guide both eligible and currently ineligible entrepreneurs. Feel free to ask about alternate subsidies, dynamic EMI calculations, or locating active Channel Partners in your district!";
      }
    }
  };

  const handleSend = (textToSend = null) => {
    const userMsg = (textToSend || input).trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    if (!textToSend) setInput("");

    // Generate intelligent AI counselor response
    setTimeout(() => {
      const botReply = generateIntelligentResponse(userMsg);
      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
    }, 400);
  };

  const handleSpeak = (text) => {
    speakText(text, lang);
  };

  const quickPrompts = getQuickPrompts(lang);

  // If Embedded inside AI Counselor Tab
  if (isEmbedded) {
    return (
      <div className="space-y-4">
        {/* Chat History Box */}
        <div className="h-96 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed whitespace-pre-line shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-normal'
                }`}
              >
                {m.text}
                {m.sender === 'bot' && (
                  <button
                    onClick={() => handleSpeak(m.text)}
                    className="mt-2 text-[10px] text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 block"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{lang === 'ta' ? "குரலில் கேட்க" : "Listen in Voice"}</span>
                  </button>
                )}
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>{lang === 'ta' ? "பரிந்துரைக்கப்பட்ட கேள்விகள்:" : "Suggested Questions for All Users:"}</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="text-[11px] font-semibold px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl border border-purple-200 transition text-left"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t?.type_message || "Ask anything about loans, ineligible alternatives, or subsidies..."}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Floating Drawer Mode
  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-3 rounded-full shadow-2xl flex items-center space-x-2.5 transition-all transform hover:scale-105 border border-purple-400/40"
        >
          <Bot className="w-5 h-5 animate-bounce" />
          <span className="text-xs font-black">
            {lang === 'ta' ? "AI மித்ரா ஆலோசகர்" : (lang === 'hi' ? "एआई मित्र सहायक" : "AI Mitra Advisor")}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      )}

      {/* Floating Chat Modal Box */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-fadeIn">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-black">
                  {lang === 'ta' ? "AI மித்ரா நலத்திட்ட வழிகாட்டி" : (lang === 'hi' ? "एआई मित्र योजना सहायक" : "AI Mitra Scheme Advisor")}
                </h3>
                <p className="text-[10px] text-purple-200">
                  {lang === 'ta' ? "தகுதியுள்ள & தகுதியற்ற பயனாளிகளுக்கான வழிகாட்டல்" : "Guidance for Eligible & Ineligible Users"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed whitespace-pre-line shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex flex-wrap gap-1">
            {quickPrompts.slice(0, 3).map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="text-[10px] font-semibold px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg border border-purple-200 transition text-left"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'ta' ? "கேள்விகளை தட்டச்சு செய்க..." : "Ask any question..."}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
