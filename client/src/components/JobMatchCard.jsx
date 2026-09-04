import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Check, Briefcase, ArrowUpRight, Sparkles } from 'lucide-react';

const formatYears = (years) => {
    if (years === undefined || years === null) return '0 years';
    const num = Number(years);
    if (isNaN(num) || num === 0) return '0 years';
    // Format nicely without trailing zeros if whole number, otherwise up to 2 decimals
    return `${Number(num.toFixed(2))} ${num === 1 ? 'year' : 'years'}`;
};

const getScoreColor = (score) => {
    if (score >= 75) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', bar: 'bg-emerald-500', ring: '#10b981' };
    if (score >= 50) return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', bar: 'bg-indigo-600', ring: '#4f46e5' };
    if (score >= 30) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', bar: 'bg-amber-500', ring: '#f59e0b' };
    return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', bar: 'bg-slate-500', ring: '#64748b' };
};

const JobMatchCard = ({ match, onAnalyzeATS, onAnalyzeAI }) => {
    if (!match) return null;

    const {
        job = {},
        semanticScore = 0,
        skillsScore = 0,
        experienceScore = 0,
        finalScore = 0,
        matchedSkills = [],
        missingSkills = [],
        candidateYears = 0,
        requiredYears = 0
    } = match;

    const { title, company, location, _id, jobUrl } = job;
    const scoreColor = getScoreColor(finalScore);

    // SVG Circular Progress offset math
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (finalScore / 100) * circumference;

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-indigo-100 transition-all duration-200 flex flex-col justify-between space-y-5 animate-fadeIn">
            {/* CARD HEADER */}
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-slate-900 text-base leading-snug truncate" title={title}>
                                {title || 'Untitled Role'}
                            </h3>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 truncate">
                            <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{company || 'Company'}</span>
                        </p>
                        {location && (
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate pt-0.5">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{location}</span>
                            </p>
                        )}
                    </div>

                    {/* OVERALL MATCH SCORE (VISUALLY PROMINENT CIRCULAR PROGRESS) */}
                    <div className="flex flex-col items-center shrink-0">
                        <div className="relative flex items-center justify-center">
                            <svg className="w-16 h-16 transform -rotate-90">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r={radius}
                                    stroke="currentColor"
                                    strokeWidth="5"
                                    className="text-slate-100"
                                    fill="transparent"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r={radius}
                                    stroke={scoreColor.ring}
                                    strokeWidth="5"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-700 ease-out"
                                    fill="transparent"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-sm font-extrabold text-slate-900 leading-none">
                                    {Math.round(finalScore)}%
                                </span>
                            </div>
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">
                            Overall Match
                        </span>
                    </div>
                </div>

                {/* SUB-SCORES METRICS */}
                <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 space-y-2.5">
                    {/* Semantic Match */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-600">Semantic Match</span>
                            <span className="font-bold text-slate-900">{Math.round(semanticScore)}%</span>
                        </div>
                        <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(0, semanticScore))}%` }}
                            />
                        </div>
                    </div>

                    {/* Skills Match */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-600">Skills Match</span>
                            <span className="font-bold text-slate-900">{Math.round(skillsScore)}%</span>
                        </div>
                        <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(0, skillsScore))}%` }}
                            />
                        </div>
                    </div>

                    {/* Experience Match */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-600">Experience Match</span>
                            <span className="font-bold text-slate-900">{Math.round(experienceScore)}%</span>
                        </div>
                        <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(0, experienceScore))}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* MATCHED SKILLS */}
                <div className="space-y-1.5">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-600" /> Matched Skills
                    </h4>
                    {matchedSkills && matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {matchedSkills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/80"
                                >
                                    <Check className="h-3 w-3 text-emerald-600" />
                                    <span>{skill}</span>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No direct skill matches identified</p>
                    )}
                </div>

                {/* SKILL GAPS / MISSING SKILLS */}
                <div className="space-y-1.5">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Skill Gaps
                    </h4>
                    {missingSkills && missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {missingSkills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50/70 text-indigo-700 border border-indigo-100/70"
                                >
                                    • {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> No skill gaps identified!
                        </p>
                    )}
                </div>

                {/* EXPERIENCE SUMMARY */}
                <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-3 text-xs space-y-1">
                    <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">Experience</span>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-slate-600">
                        <span>Your experience: <strong className="text-slate-900 font-semibold">{formatYears(candidateYears)}</strong></span>
                        <span>
                            Required: {' '}
                            <strong className="text-slate-900 font-semibold">
                                {Number(requiredYears) === 0 ? 'Entry level' : formatYears(requiredYears)}
                            </strong>
                        </span>
                    </div>
                </div>
            </div>

            {/* CARD FOOTER BUTTONS */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <button
                        onClick={() => onAnalyzeATS && onAnalyzeATS(_id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-2xs cursor-pointer"
                        title="View numerical ATS compatibility score breakdown"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Analyze ATS</span>
                    </button>

                    <button
                        onClick={() => onAnalyzeAI && onAnalyzeAI(_id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
                        title="View AI explanation and personalized recommendations"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
                        <span>AI Analysis</span>
                    </button>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                        to="/dashboard/jobs"
                        className="inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer"
                    >
                        <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                        <span>View Job</span>
                    </Link>

                    {jobUrl && (
                        <a
                            href={jobUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all shrink-0"
                            title="Open job URL"
                        >
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobMatchCard;
