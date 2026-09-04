import React from 'react';
import { 
    Sparkles, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    RefreshCw, 
    Check, 
    TrendingUp, 
    Lightbulb, 
    Briefcase, 
    FolderGit2, 
    ShieldCheck, 
    ListOrdered 
} from 'lucide-react';

const GeneralAIAnalysisView = ({ analysis, loading, error, onRetry, hasResume }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-indigo-100 p-10 shadow-xs text-center space-y-4 animate-pulse my-6">
                <div className="h-14 w-14 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900">Analyzing your resume...</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Evaluating resume structure, technical strengths, impact statements, and ATS alignment using AI.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-4 my-6">
                <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-rose-900">Analysis Error</h3>
                    <p className="text-xs text-rose-700 max-w-md mx-auto leading-relaxed">
                        Unable to analyze your resume right now. Please try again.
                    </p>
                    {error !== "Unable to analyze your resume right now. Please try again." && (
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
        );
    }

    if (!hasResume) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3 my-6 shadow-xs">
                <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
                    <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">No Resume Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Upload your resume to generate an AI analysis.
                </p>
            </div>
        );
    }

    if (!analysis) {
        return null;
    }

    const {
        overallAssessment = '',
        strengths = [],
        weaknesses = [],
        skillSuggestions = [],
        experienceSuggestions = [],
        projectSuggestions = [],
        atsSuggestions = [],
        actionPlan = []
    } = analysis;

    return (
        <div className="space-y-8 animate-fadeIn pt-4">
            
            {/* HEADER CARD */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-7 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                        <span>AI Resume Analysis</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                        Resume Insights & Recommendation Report
                    </h2>
                    <p className="text-xs text-slate-300">
                        Your resume has been analyzed by AI. Review your strengths, areas for improvement, and customized roadmap below.
                    </p>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
                    >
                        <RefreshCw className="h-3.5 w-3.5 text-indigo-300" />
                        <span>Re-analyze</span>
                    </button>
                )}
            </div>

            {/* 1. OVERALL ASSESSMENT */}
            {overallAssessment && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-7 shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                            Overall Assessment
                        </h3>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/80 p-4 md:p-5 rounded-xl border border-slate-100">
                        {overallAssessment}
                    </p>
                </div>
            )}

            {/* 2. STRENGTHS & AREAS TO IMPROVE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* STRENGTHS */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                            Strengths
                        </h3>
                    </div>
                    
                    {Array.isArray(strengths) && strengths.length > 0 ? (
                        <div className="space-y-2.5">
                            {strengths.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-800 font-medium">
                                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span className="leading-snug">{item}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No specific strengths listed.</p>
                    )}
                </div>

                {/* AREAS TO IMPROVE */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                            Areas to Improve
                        </h3>
                    </div>
                    
                    {Array.isArray(weaknesses) && weaknesses.length > 0 ? (
                        <div className="space-y-2.5">
                            {weaknesses.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/40 border border-amber-100 text-xs text-slate-800 font-medium">
                                    <span className="text-amber-500 font-extrabold shrink-0 mt-0.5">•</span>
                                    <span className="leading-snug">{item}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No areas to improve listed.</p>
                    )}
                </div>

            </div>

            {/* 3. SUGGESTION SECTIONS (SKILLS, EXPERIENCE, PROJECTS) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* SKILL SUGGESTIONS */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Lightbulb className="h-4 w-4" />
                        </div>
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            Skill Suggestions
                        </h3>
                    </div>

                    {Array.isArray(skillSuggestions) && skillSuggestions.length > 0 ? (
                        <ul className="space-y-2.5">
                            {skillSuggestions.map((item, idx) => (
                                <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-normal flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold shrink-0">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No skill suggestions available.</p>
                    )}
                </div>

                {/* EXPERIENCE IMPROVEMENTS */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Briefcase className="h-4 w-4" />
                        </div>
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            Experience Improvements
                        </h3>
                    </div>

                    {Array.isArray(experienceSuggestions) && experienceSuggestions.length > 0 ? (
                        <ul className="space-y-2.5">
                            {experienceSuggestions.map((item, idx) => (
                                <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-normal flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold shrink-0">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No experience improvements available.</p>
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

                    {Array.isArray(projectSuggestions) && projectSuggestions.length > 0 ? (
                        <ul className="space-y-2.5">
                            {projectSuggestions.map((item, idx) => (
                                <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-normal flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold shrink-0">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No project improvements available.</p>
                    )}
                </div>

            </div>

            {/* 4. ATS IMPROVEMENTS */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                            ATS Improvements
                        </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium italic">
                        Suggestions for making the resume more ATS-friendly without keyword stuffing.
                    </span>
                </div>

                {Array.isArray(atsSuggestions) && atsSuggestions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {atsSuggestions.map((item, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-purple-50/40 border border-purple-100/80 text-xs text-slate-800 leading-relaxed flex items-start gap-3">
                                <span className="text-purple-600 font-extrabold shrink-0 mt-0.5">•</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic">No ATS improvement suggestions available.</p>
                )}
            </div>

            {/* 5. ACTION PLAN (PROMINENT NUMBERED ROADMAP) */}
            <div className="bg-white rounded-2xl border border-indigo-200 p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-indigo-100">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                        <ListOrdered className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
                            Action Plan
                        </h3>
                        <p className="text-xs text-slate-500">Step-by-step roadmap to optimize your resume for recruiters & AI parsing</p>
                    </div>
                </div>

                {Array.isArray(actionPlan) && actionPlan.length > 0 ? (
                    <div className="space-y-3">
                        {actionPlan.map((step, idx) => {
                            const stepNum = String(idx + 1).padStart(2, '0');
                            return (
                                <div 
                                    key={idx} 
                                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-slate-200/80 hover:border-indigo-200 transition-all shadow-2xs"
                                >
                                    <div className="text-lg font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl shrink-0">
                                        {stepNum}
                                    </div>
                                    <div className="text-xs md:text-sm text-slate-800 font-semibold leading-relaxed pt-1">
                                        {step}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic">No action plan steps available.</p>
                )}
            </div>

        </div>
    );
};

export default GeneralAIAnalysisView;
