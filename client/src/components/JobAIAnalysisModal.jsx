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
    FileText, 
    BarChart3, 
    ListOrdered, 
    Info, 
    Lightbulb, 
    FolderGit2, 
    ShieldCheck 
} from 'lucide-react';

const getScoreLabel = (score) => {
    if (score >= 90) return { label: 'Excellent Match', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', ring: '#10b981' };
    if (score >= 75) return { label: 'Strong Match', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', ring: '#6366f1' };
    if (score >= 60) return { label: 'Moderate Match', color: 'bg-amber-100 text-amber-800 border-amber-300', ring: '#f59e0b' };
    return { label: 'Needs Improvement', color: 'bg-rose-100 text-rose-800 border-rose-300', ring: '#f43f5e' };
};

const JobAIAnalysisModal = ({ isOpen, onClose, data, loading, error, onRetry }) => {
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

    const { job = {}, ats = {}, analysis = {} } = data || {};

    const {
        atsScore = 0,
        skillsScore = 0,
        keywordScore = 0,
        semanticScore = 0,
        experienceScore = 0,
        completenessScore = 0,
        missingSkills: atsMissingSkills = [],
        missingKeywords: atsMissingKeywords = []
    } = ats;

    const {
        overallAssessment = '',
        whyYouMatch = [],
        whyYouDontMatch = [],
        missingSkills: aiMissingSkills = [],
        missingKeywords: aiMissingKeywords = [],
        resumeImprovements = [],
        projectImprovements = [],
        atsImprovements = [],
        actionPlan = []
    } = analysis;

    // Combine missing skills cleanly without duplicates
    const combinedMissingSkills = Array.from(
        new Set([...(aiMissingSkills || []), ...(atsMissingSkills || [])])
    );

    // Combine missing keywords cleanly without duplicates
    const combinedMissingKeywords = Array.from(
        new Set([...(aiMissingKeywords || []), ...(atsMissingKeywords || [])])
    );

    const scoreMeta = getScoreLabel(atsScore);
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (atsScore / 100) * circumference;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
            <div 
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl my-8 overflow-hidden flex flex-col max-h-[92vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* MODAL HEADER */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative flex items-start justify-between gap-4 shrink-0 border-b border-slate-800">
                    <div className="space-y-1 min-w-0 pr-8">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold uppercase tracking-wider">
                            <Sparkles className="h-3 w-3 text-indigo-400" />
                            <span>AI Job Analysis</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-extrabold text-white truncate" title={job.title}>
                            {job.title || 'Job Analysis'}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-0.5">
                            {job.company && (
                                <span className="flex items-center gap-1 font-medium">
                                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                    {job.company}
                                </span>
                            )}
                            {job.location && (
                                <span className="flex items-center gap-1 font-medium">
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
                        <div className="py-20 text-center space-y-4">
                            <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-extrabold text-slate-900">Analyzing your resume for this job...</h3>
                                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                    Performing semantic comparison, keyword matching, ATS scoring, and generating personalized recommendations.
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
                                <p className="text-xs text-rose-700 max-w-md mx-auto leading-relaxed">
                                    Unable to generate analysis for this job right now. Please try again.
                                </p>
                                {error !== "Unable to generate analysis for this job right now. Please try again." && (
                                    <p className="text-[11px] text-rose-500 font-mono mt-1">{error}</p>
                                )}
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
                            {/* DISTINCTION BETWEEN ATS & AI ANALYSIS */}
                            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-600 text-white rounded-xl shrink-0 mt-0.5 sm:mt-0">
                                        <Info className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        <p className="text-slate-700">
                                            <strong className="text-indigo-900 font-bold">ATS:</strong> Measures how well your resume matches the job using skills, keywords, semantic relevance, experience and completeness.
                                        </p>
                                        <p className="text-slate-700">
                                            <strong className="text-indigo-900 font-bold">AI Analysis:</strong> Explains the match and provides personalized recommendations for improving your resume.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* COMPACT ATS SCORE SUMMARY AT TOP */}
                            {ats && (
                                <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-5 w-full md:w-auto">
                                        <div className="relative flex items-center justify-center shrink-0">
                                            <svg className="w-24 h-24 transform -rotate-90">
                                                <circle
                                                    cx="48"
                                                    cy="48"
                                                    r={radius}
                                                    stroke="currentColor"
                                                    strokeWidth="7"
                                                    className="text-slate-200"
                                                    fill="transparent"
                                                />
                                                <circle
                                                    cx="48"
                                                    cy="48"
                                                    r={radius}
                                                    stroke={scoreMeta.ring}
                                                    strokeWidth="7"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={strokeDashoffset}
                                                    strokeLinecap="round"
                                                    className="transition-all duration-700 ease-out"
                                                    fill="transparent"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                <span className="text-xl font-extrabold text-slate-900 leading-none">
                                                    {Math.round(atsScore)}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                                ATS Score
                                            </span>
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${scoreMeta.color}`}>
                                                {scoreMeta.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ATS Metrics Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full md:w-auto text-center border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-6">
                                        {[
                                            { label: 'Skills Match', value: `${Math.round(skillsScore)}%` },
                                            { label: 'Keyword Match', value: `${Math.round(keywordScore)}%` },
                                            { label: 'Semantic Relevance', value: `${Math.round(semanticScore)}%` },
                                            { label: 'Experience', value: `${Math.round(experienceScore)}%` },
                                            { label: 'Resume Completeness', value: `${Math.round(completenessScore)}%` }
                                        ].map((m, idx) => (
                                            <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs space-y-0.5">
                                                <span className="text-[10px] font-bold text-slate-500 block truncate" title={m.label}>
                                                    {m.label}
                                                </span>
                                                <span className="text-xs font-black text-slate-900">{m.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* OVERALL ASSESSMENT */}
                            {overallAssessment && (
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <Sparkles className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                            Overall Assessment
                                        </h3>
                                    </div>
                                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                                        {overallAssessment}
                                    </p>
                                </div>
                            )}

                            {/* WHY YOU MATCH & WHY YOU DON'T MATCH */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* WHY YOU MATCH */}
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                            Why You Match
                                        </h3>
                                    </div>

                                    {Array.isArray(whyYouMatch) && whyYouMatch.length > 0 ? (
                                        <div className="space-y-2.5">
                                            {whyYouMatch.map((reason, idx) => (
                                                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-800 font-medium">
                                                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                                    <span className="leading-snug">{reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No matching factors highlighted.</p>
                                    )}
                                </div>

                                {/* WHY YOU DON'T MATCH */}
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                                            <Info className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                            Why You Don't Match
                                        </h3>
                                    </div>

                                    {Array.isArray(whyYouDontMatch) && whyYouDontMatch.length > 0 ? (
                                        <div className="space-y-2.5">
                                            {whyYouDontMatch.map((reason, idx) => (
                                                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 font-medium">
                                                    <span className="text-slate-400 font-extrabold shrink-0 mt-0.5">•</span>
                                                    <span className="leading-snug">{reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                            <Check className="h-3.5 w-3.5" /> No match gaps identified!
                                        </p>
                                    )}
                                </div>

                            </div>

                            {/* MISSING SKILLS */}
                            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                                        <Tag className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                        Missing Skills
                                    </h3>
                                </div>

                                {combinedMissingSkills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {combinedMissingSkills.map((skill, idx) => (
                                            <span 
                                                key={idx}
                                                className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs"
                                            >
                                                • {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-emerald-700 font-medium">No missing skills identified for this job.</p>
                                )}
                            </div>

                            {/* MISSING KEYWORDS (VERY IMPORTANT - PROMINENT & CLEARLY VISIBLE) */}
                            <div className="bg-rose-50/80 border border-rose-200 p-6 rounded-2xl shadow-2xs space-y-4">
                                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-rose-200/80">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-xs font-black text-rose-900 uppercase tracking-wider">
                                            Missing Keywords
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-md border border-rose-200">
                                        Critical for ATS
                                    </span>
                                </div>

                                {combinedMissingKeywords.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {combinedMissingKeywords.map((keyword, idx) => (
                                            <span 
                                                key={idx}
                                                className="inline-flex items-center bg-white text-rose-900 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs"
                                            >
                                                • {keyword}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-emerald-700 font-medium">No missing keywords identified.</p>
                                )}

                                <div className="pt-2 border-t border-rose-200/60">
                                    <p className="text-xs text-slate-600 leading-relaxed italic font-normal">
                                        "These terms are important to this job. Only add them to your resume when they accurately represent your experience."
                                    </p>
                                </div>
                            </div>

                            {/* RESUME, PROJECT & ATS IMPROVEMENTS GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* RESUME IMPROVEMENTS */}
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <Lightbulb className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                            Resume Improvements
                                        </h3>
                                    </div>

                                    {Array.isArray(resumeImprovements) && resumeImprovements.length > 0 ? (
                                        <ul className="space-y-2.5">
                                            {resumeImprovements.map((item, idx) => (
                                                <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-normal flex items-start gap-2">
                                                    <span className="text-indigo-500 font-bold shrink-0">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No specific resume improvements listed.</p>
                                    )}
                                </div>

                                {/* PROJECT IMPROVEMENTS */}
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <FolderGit2 className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                            Project Improvements
                                        </h3>
                                    </div>

                                    {Array.isArray(projectImprovements) && projectImprovements.length > 0 ? (
                                        <ul className="space-y-2.5">
                                            {projectImprovements.map((item, idx) => (
                                                <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-normal flex items-start gap-2">
                                                    <span className="text-indigo-500 font-bold shrink-0">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No project improvements listed.</p>
                                    )}
                                </div>

                                {/* ATS IMPROVEMENTS */}
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                            ATS Improvements
                                        </h3>
                                    </div>

                                    {Array.isArray(atsImprovements) && atsImprovements.length > 0 ? (
                                        <ul className="space-y-2.5">
                                            {atsImprovements.map((item, idx) => (
                                                <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-normal flex items-start gap-2">
                                                    <span className="text-purple-600 font-bold shrink-0">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No ATS improvements listed.</p>
                                    )}
                                </div>

                            </div>

                            {/* RECOMMENDED ACTION PLAN */}
                            <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-sm space-y-5">
                                <div className="flex items-center gap-2.5 pb-2 border-b border-indigo-100">
                                    <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                                        <ListOrdered className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                                            Recommended Action Plan
                                        </h3>
                                        <p className="text-xs text-slate-500">Targeted steps to maximize match potential for this role</p>
                                    </div>
                                </div>

                                {Array.isArray(actionPlan) && actionPlan.length > 0 ? (
                                    <div className="space-y-3">
                                        {actionPlan.map((step, idx) => {
                                            const stepNum = String(idx + 1).padStart(2, '0');
                                            return (
                                                <div 
                                                    key={idx} 
                                                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-slate-200/80 shadow-2xs"
                                                >
                                                    <div className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg shrink-0">
                                                        {stepNum}
                                                    </div>
                                                    <div className="text-xs text-slate-800 font-semibold leading-relaxed pt-0.5">
                                                        {step}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">No action plan steps listed.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* MODAL FOOTER */}
                <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                        Close Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobAIAnalysisModal;
