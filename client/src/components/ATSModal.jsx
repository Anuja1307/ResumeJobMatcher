import React, { useEffect } from 'react';
import { 
    X, 
    Sparkles, 
    Check, 
    AlertCircle, 
    Loader2, 
    RefreshCw, 
    Building2, 
    MapPin, 
    CheckCircle2, 
    XCircle, 
    Tag, 
    Briefcase, 
    FileText, 
    BarChart3 
} from 'lucide-react';

const getScoreLabel = (score) => {
    if (score >= 90) return { label: 'Excellent Match', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', ring: '#10b981' };
    if (score >= 75) return { label: 'Strong Match', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', ring: '#6366f1' };
    if (score >= 60) return { label: 'Moderate Match', color: 'bg-amber-100 text-amber-800 border-amber-300', ring: '#f59e0b' };
    return { label: 'Needs Improvement', color: 'bg-rose-100 text-rose-800 border-rose-300', ring: '#f43f5e' };
};

const formatYears = (years) => {
    if (years === undefined || years === null) return '0 years';
    const num = Number(years);
    if (isNaN(num) || num === 0) return '0 years';
    return `${Number(num.toFixed(2))} ${num === 1 ? 'year' : 'years'}`;
};

const ATSModal = ({ isOpen, onClose, data, loading, error, onRetry }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const { job = {}, ats = {} } = data || {};
    const {
        atsScore = 0,
        skillsScore = 0,
        keywordScore = 0,
        semanticScore = 0,
        experienceScore = 0,
        completenessScore = 0,
        matchedSkills = [],
        missingSkills = [],
        matchedKeywords = [],
        missingKeywords = [],
        candidateYears = 0,
        requiredYears = 0
    } = ats;

    const scoreMeta = getScoreLabel(atsScore);

    // SVG Circle Math
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (atsScore / 100) * circumference;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
            <div 
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* MODAL HEADER */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative flex items-start justify-between gap-4 shrink-0">
                    <div className="space-y-1 min-w-0 pr-8">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold uppercase tracking-wider">
                            <Sparkles className="h-3 w-3 text-indigo-400" />
                            <span>ATS Compatibility Analysis</span>
                        </div>
                        <h2 className="text-xl font-extrabold text-white truncate" title={job.title}>
                            {job.title || 'Job Analysis'}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-0.5">
                            {job.company && (
                                <span className="flex items-center gap-1">
                                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                    {job.company}
                                </span>
                            )}
                            {job.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                    {job.location}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer shrink-0"
                        title="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* MODAL BODY */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1 text-slate-900">
                    {loading ? (
                        <div className="py-16 text-center space-y-4">
                            <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-extrabold text-slate-900">Analyzing your resume against this job...</h3>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Comparing keywords, skills, experience requirements, and semantic structure.
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-4 my-6">
                            <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-extrabold text-rose-900">Analysis Error</h3>
                                <p className="text-xs text-rose-700 max-w-md mx-auto">{error}</p>
                            </div>
                            {onRetry && (
                                <button
                                    onClick={onRetry}
                                    className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    <span>Retry Analysis</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* 1. OVERALL ATS SCORE DISPLAY */}
                            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="space-y-2 text-center sm:text-left flex-1">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                                        Overall ATS Match Score
                                    </span>
                                    <div className="flex items-center justify-center sm:justify-start gap-2.5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${scoreMeta.color}`}>
                                            {scoreMeta.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed max-w-md">
                                        This overall compatibility score measures how effectively your resume passes ATS keyword parsing, skill alignment, and structural experience rules.
                                    </p>
                                </div>

                                {/* Circular Score Gauge */}
                                <div className="relative flex items-center justify-center shrink-0">
                                    <svg className="w-28 h-28 transform -rotate-90">
                                        <circle
                                            cx="56"
                                            cy="56"
                                            r={radius}
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            className="text-slate-200"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="56"
                                            cy="56"
                                            r={radius}
                                            stroke={scoreMeta.ring}
                                            strokeWidth="8"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                            strokeLinecap="round"
                                            className="transition-all duration-700 ease-out"
                                            fill="transparent"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-2xl font-black text-slate-900 leading-none">
                                            {Math.round(atsScore)}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. SCORE BREAKDOWN SECTION */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <BarChart3 className="h-4 w-4 text-indigo-600" />
                                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                                        Score Breakdown
                                    </h3>
                                </div>

                                <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
                                    {[
                                        { label: 'Skills Match', score: skillsScore, weight: '25% weight', color: 'bg-emerald-500' },
                                        { label: 'Keyword Match', score: keywordScore, weight: '25% weight', color: 'bg-indigo-600' },
                                        { label: 'Semantic Relevance', score: semanticScore, weight: '20% weight', color: 'bg-blue-500' },
                                        { label: 'Experience', score: experienceScore, weight: '15% weight', color: 'bg-amber-500' },
                                        { label: 'Resume Completeness', score: completenessScore, weight: '15% weight', color: 'bg-purple-500' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between items-center text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800">{item.label}</span>
                                                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                                        {item.weight}
                                                    </span>
                                                </div>
                                                <span className="font-extrabold text-slate-900">{Math.round(item.score)} / 100</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                                                    style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3. SKILLS ANALYSIS */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <Tag className="h-4 w-4 text-emerald-600" />
                                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                                        Skills Analysis
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Matched Skills */}
                                    <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl space-y-2">
                                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                            Matched Skills
                                        </h4>
                                        {matchedSkills && matchedSkills.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {matchedSkills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-1 bg-white text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-xl shadow-2xs"
                                                    >
                                                        <Check className="h-3 w-3 text-emerald-600" />
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 italic">No matched skills identified.</p>
                                        )}
                                    </div>

                                    {/* Missing Skills */}
                                    <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-2xl space-y-2">
                                        <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                                            <XCircle className="h-3.5 w-3.5 text-amber-600" />
                                            Missing Skills
                                        </h4>
                                        {missingSkills && missingSkills.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {missingSkills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center bg-white text-amber-900 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-xl shadow-2xs"
                                                    >
                                                        • {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-emerald-700 font-medium">No missing skills identified!</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 4. KEYWORD ANALYSIS (VERY IMPORTANT - MANDATORY & CLEARLY VISIBLE) */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-indigo-600" />
                                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                                            Keyword Analysis
                                        </h3>
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500">
                                        ATS Parser Comparison
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {/* Matched Keywords */}
                                    <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2">
                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                            Matched Keywords
                                        </h4>
                                        {matchedKeywords && matchedKeywords.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {matchedKeywords.map((kw, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-1 bg-white text-slate-800 border border-slate-200 text-xs font-medium px-2.5 py-1 rounded-xl"
                                                    >
                                                        <Check className="h-3 w-3 text-emerald-600" />
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 italic">No matched keywords identified.</p>
                                        )}
                                    </div>

                                    {/* MISSING KEYWORDS - PROMINENT & CLEARLY VISIBLE */}
                                    <div className="bg-rose-50/80 border border-rose-200/80 p-4 rounded-2xl space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                                                <XCircle className="h-4 w-4 text-rose-600" />
                                                Missing Keywords
                                            </h4>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200">
                                                Action Required
                                            </span>
                                        </div>

                                        {missingKeywords && missingKeywords.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {missingKeywords.map((kw, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center bg-white text-rose-900 border border-rose-200 text-xs font-bold px-3 py-1 rounded-xl shadow-2xs"
                                                    >
                                                        • {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-emerald-700 font-medium">No missing keywords identified in job description!</p>
                                        )}

                                        <p className="text-[11px] text-slate-500 pt-2 border-t border-rose-100/60 leading-relaxed italic">
                                            "These keywords were identified from the job description and were not found in your resume."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 5. EXPERIENCE & RESUME COMPLETENESS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Experience Analysis */}
                                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-3">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                        <Briefcase className="h-3.5 w-3.5 text-indigo-600" />
                                        Experience Analysis
                                    </h4>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600">Your Experience:</span>
                                            <span className="font-extrabold text-slate-900">{formatYears(candidateYears)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600">Required Experience:</span>
                                            <span className="font-extrabold text-slate-900">
                                                {Number(requiredYears) === 0 ? 'Entry level' : formatYears(requiredYears)}
                                            </span>
                                        </div>
                                        <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center">
                                            <span className="font-bold text-slate-700">Experience Match:</span>
                                            <span className="font-extrabold text-indigo-700 text-sm">
                                                {Math.round(experienceScore)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Resume Completeness */}
                                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-3">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
                                        Resume Completeness
                                    </h4>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600">Completeness Score:</span>
                                            <span className="font-extrabold text-purple-700 text-sm">
                                                {Math.round(completenessScore)}%
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-200/60">
                                            "Measures how completely your resume covers the main resume sections."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* MODAL FOOTER */}
                <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                        Close Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ATSModal;
