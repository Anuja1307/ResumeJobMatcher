import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadResume, getResumeAnalysis } from '../services/resumeService';
import GeneralAIAnalysisView from '../components/GeneralAIAnalysisView';
import { 
    FileText, 
    Upload, 
    RefreshCw, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    Sparkles, 
    Lock, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Globe, 
    Link2,
    Briefcase, 
    GraduationCap, 
    FolderGit2, 
    Award, 
    Trophy, 
    Languages 
} from 'lucide-react';

const ResumePage = () => {
    const { user, updateUserResume, refreshUser } = useAuth();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // AI Resume Analysis state
    const [analysisData, setAnalysisData] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [analysisError, setAnalysisError] = useState('');
    const [showAnalysis, setShowAnalysis] = useState(false);
    
    const fileInputRef = useRef(null);

    const resumeData = user?.resume;
    const hasResume = Boolean(resumeData?.filename || resumeData?.path);

    const handleAnalyzeResume = async () => {
        setLoadingAnalysis(true);
        setAnalysisError('');
        setShowAnalysis(true);

        try {
            const response = await getResumeAnalysis();
            if (response.data?.success && response.data?.analysis) {
                setAnalysisData(response.data.analysis);
            } else {
                setAnalysisError(response.data?.message || 'Failed to analyze resume.');
            }
        } catch (err) {
            console.error("Resume analysis error:", err);
            const errorMessage = err.response?.data?.message || 'Unable to analyze your resume right now. Please try again.';
            setAnalysisError(errorMessage);
        } finally {
            setLoadingAnalysis(false);
        }
    };
    const structuredResume = resumeData?.structuredResume;

    const formattedDate = resumeData?.uploadedAt 
        ? new Date(resumeData.uploadedAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
        : null;

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            setError('Please select a valid PDF file.');
            return;
        }

        setFile(selectedFile);
        setError('');
        setSuccessMessage('');
        
        // Trigger upload immediately after user selects a valid PDF file
        performUpload(selectedFile);
    };

    const triggerFileInput = () => {
        setError('');
        setSuccessMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const performUpload = async (fileToUpload) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await uploadResume(fileToUpload);
            if (response.data?.success) {
                const updatedResume = {
                    filename: fileToUpload.name,
                    path: response.data.resumeUrl,
                    structuredResume: response.data.structuredResume,
                    uploadedAt: new Date().toISOString()
                };
                updateUserResume(updatedResume);
                await refreshUser();
                setSuccessMessage('Resume uploaded and analyzed successfully!');
                setFile(null);
            } else {
                setError(response.data?.message || 'Failed to process resume.');
            }
        } catch (err) {
            console.error("Resume upload error:", err);
            setError(err.response?.data?.message || 'Resume upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
            
            {/* PAGE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resume Management</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Upload your PDF resume to generate structured data for AI matching & insights.
                    </p>
                </div>
            </div>

            {/* Hidden File Input */}
            <input 
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* ALERTS */}
            {error && (
                <div className="bg-rose-50 text-rose-800 border border-rose-200 p-4 rounded-xl text-sm flex items-start gap-3 animate-fadeIn shadow-xs">
                    <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-bold">Upload Error</p>
                        <p className="text-xs text-rose-600 mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-xl text-sm flex items-start gap-3 animate-fadeIn shadow-xs">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-bold">Success</p>
                        <p className="text-xs text-emerald-600 mt-0.5">{successMessage}</p>
                    </div>
                </div>
            )}

            {/* LOADING STATE OVERLAY CARD */}
            {loading ? (
                <div className="bg-white rounded-2xl border border-indigo-100 p-8 shadow-sm text-center space-y-4 animate-pulse">
                    <div className="h-14 w-14 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                        <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-slate-900">Uploading and analyzing your resume...</h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Please wait while we process your resume with rule parsing and AI entity extraction.
                        </p>
                    </div>
                </div>
            ) : !hasResume ? (
                /* IF NO RESUME IS UPLOADED */
                <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs hover:border-indigo-200 transition-all text-center space-y-6 max-w-xl mx-auto">
                    <div className="h-16 w-16 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                        <FileText className="h-8 w-8" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-bold text-slate-900">No resume uploaded yet</h2>
                        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                            Upload your resume to unlock AI-powered resume analysis, job matching, and interview preparation.
                        </p>
                    </div>

                    {/* Features list */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left max-w-md mx-auto space-y-2">
                        {[
                            'AI resume analysis & structured extraction',
                            'Semantic job matching against saved positions',
                            'Skill gap evaluation & missing requirements',
                            'Interview copilot question preparation'
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={triggerFileInput}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-indigo-100 cursor-pointer"
                    >
                        <Upload className="h-4 w-4" />
                        <span>Upload Resume (PDF)</span>
                    </button>
                </div>
            ) : (
                /* IF RESUME IS ALREADY UPLOADED: COMPACT RESUME CARD */
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-4">
                        <div className="p-3.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl shrink-0">
                            <FileText className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h3 className="text-base font-extrabold text-slate-900 truncate max-w-[260px] sm:max-w-[360px]" title={resumeData.filename}>
                                    {resumeData.filename || 'Uploaded Resume'}
                                </h3>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Uploaded
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                                <span>PDF Document</span>
                                {formattedDate && (
                                    <>
                                        <span>•</span>
                                        <span>Last updated: {formattedDate}</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 pt-0.5">
                                Your resume is parsed and ready for AI career analysis.
                            </p>
                        </div>
                    </div>

                    <div className="shrink-0 pt-2 md:pt-0">
                        <button
                            onClick={triggerFileInput}
                            disabled={loading}
                            className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                            <span>Replace Resume</span>
                        </button>
                    </div>
                </div>
            )}

            {/* STRUCTURED RESUME OVERVIEW */}
            {hasResume && structuredResume && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Extracted Resume Overview</h2>
                    </div>

                    {/* PERSONAL INFORMATION */}
                    {structuredResume.personal && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-indigo-600" /> Personal Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                                {structuredResume.personal.name && (
                                    <div className="space-y-1">
                                        <span className="text-slate-400 font-medium">Name</span>
                                        <p className="font-bold text-slate-800">{structuredResume.personal.name}</p>
                                    </div>
                                )}
                                {structuredResume.personal.email && (
                                    <div className="space-y-1">
                                        <span className="text-slate-400 font-medium">Email</span>
                                        <p className="font-semibold text-slate-800 flex items-center gap-1">
                                            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{structuredResume.personal.email}</span>
                                        </p>
                                    </div>
                                )}
                                {structuredResume.personal.phone && (
                                    <div className="space-y-1">
                                        <span className="text-slate-400 font-medium">Phone</span>
                                        <p className="font-semibold text-slate-800 flex items-center gap-1">
                                            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            <span>{structuredResume.personal.phone}</span>
                                        </p>
                                    </div>
                                )}
                                {structuredResume.personal.location && (
                                    <div className="space-y-1">
                                        <span className="text-slate-400 font-medium">Location</span>
                                        <p className="font-semibold text-slate-800 flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            <span>{structuredResume.personal.location}</span>
                                        </p>
                                    </div>
                                )}
                                {structuredResume.personal.linkedin && (
                                    <div className="space-y-1">
                                        <span className="text-slate-400 font-medium">LinkedIn</span>
                                        <a href={structuredResume.personal.linkedin} target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 hover:underline flex items-center gap-1 truncate">
                                            <Link2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                                            <span className="truncate">{structuredResume.personal.linkedin}</span>
                                        </a>
                                    </div>
                                )}
                                {structuredResume.personal.github && (
                                    <div className="space-y-1">
                                        <span className="text-slate-400 font-medium">GitHub</span>
                                        <a href={structuredResume.personal.github} target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 hover:underline flex items-center gap-1 truncate">
                                            <Globe className="h-3.5 w-3.5 text-slate-700 shrink-0" />
                                            <span className="truncate">{structuredResume.personal.github}</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SUMMARY */}
                    {structuredResume.summary && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Executive Summary</h3>
                            <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                                {structuredResume.summary}
                            </p>
                        </div>
                    )}

                    {/* SKILLS */}
                    {Array.isArray(structuredResume.skills) && structuredResume.skills.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Extracted Skills</h3>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {structuredResume.skills.map((skill, index) => (
                                    <span 
                                        key={index} 
                                        className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EXPERIENCE */}
                    {Array.isArray(structuredResume.experience) && structuredResume.experience.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-indigo-600" /> Work Experience
                            </h3>
                            <div className="space-y-4">
                                {structuredResume.experience.map((exp, index) => (
                                    <div key={index} className="p-4 rounded-xl bg-slate-50/60 border border-slate-100 space-y-1.5">
                                        <div className="flex justify-between items-start flex-wrap gap-2">
                                            <h4 className="text-xs font-extrabold text-slate-900">{exp.role || 'Position'}</h4>
                                            {exp.company && (
                                                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
                                                    {exp.company}
                                                </span>
                                            )}
                                        </div>
                                        {exp.description && (
                                            <p className="text-xs text-slate-600 leading-relaxed pt-1">{exp.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EDUCATION */}
                    {Array.isArray(structuredResume.education) && structuredResume.education.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <GraduationCap className="h-3.5 w-3.5 text-indigo-600" /> Education
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {structuredResume.education.map((edu, index) => (
                                    <div key={index} className="p-4 rounded-xl bg-slate-50/60 border border-slate-100 space-y-1">
                                        <h4 className="text-xs font-extrabold text-slate-900">{edu.degree || edu.field || 'Degree'}</h4>
                                        <p className="text-xs font-semibold text-slate-700">{edu.institution}</p>
                                        <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                                            {(edu.startYear || edu.endYear) && (
                                                <span>{edu.startYear} - {edu.endYear || 'Present'}</span>
                                            )}
                                            {edu.cgpa && (
                                                <span className="font-semibold text-slate-700">CGPA: {edu.cgpa}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PROJECTS */}
                    {Array.isArray(structuredResume.projects) && structuredResume.projects.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <FolderGit2 className="h-3.5 w-3.5 text-indigo-600" /> Key Projects
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {structuredResume.projects.map((proj, index) => (
                                    <div key={index} className="p-4 rounded-xl bg-slate-50/60 border border-slate-100 space-y-2">
                                        <h4 className="text-xs font-extrabold text-slate-900">{proj.name}</h4>
                                        {proj.description && (
                                            <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                                        )}
                                        {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {proj.technologies.map((tech, tIdx) => (
                                                    <span key={tIdx} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CERTIFICATIONS & ACHIEVEMENTS */}
                    {((Array.isArray(structuredResume.certifications) && structuredResume.certifications.length > 0) ||
                      (Array.isArray(structuredResume.achievements) && structuredResume.achievements.length > 0) ||
                      (Array.isArray(structuredResume.languages) && structuredResume.languages.length > 0)) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {Array.isArray(structuredResume.certifications) && structuredResume.certifications.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Award className="h-3.5 w-3.5 text-indigo-600" /> Certifications
                                    </h3>
                                    <ul className="space-y-1.5 text-xs text-slate-700">
                                        {structuredResume.certifications.map((cert, idx) => (
                                            <li key={idx} className="flex items-start gap-1.5">
                                                <span className="text-indigo-500 font-bold">•</span>
                                                <span>{cert}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {Array.isArray(structuredResume.achievements) && structuredResume.achievements.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Trophy className="h-3.5 w-3.5 text-indigo-600" /> Achievements
                                    </h3>
                                    <ul className="space-y-1.5 text-xs text-slate-700">
                                        {structuredResume.achievements.map((ach, idx) => (
                                            <li key={idx} className="flex items-start gap-1.5">
                                                <span className="text-amber-500 font-bold">•</span>
                                                <span>{ach}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {Array.isArray(structuredResume.languages) && structuredResume.languages.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Languages className="h-3.5 w-3.5 text-indigo-600" /> Languages
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {structuredResume.languages.map((lang, idx) => (
                                            <span key={idx} className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* AI RESUME ANALYSIS ENTRY POINT CARD */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-6 shadow-md border border-slate-800 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-extrabold tracking-tight">AI Resume Analysis</h2>
                            <p className="text-xs text-slate-300 mt-0.5">
                                Get AI-powered feedback on your resume, strengths, weaknesses and improvement opportunities.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleAnalyzeResume}
                        disabled={loadingAnalysis || !hasResume}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
                    >
                        {loadingAnalysis ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin text-white" />
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 text-indigo-200" />
                                <span>{showAnalysis ? 'Re-analyze My Resume' : 'Analyze My Resume'}</span>
                            </>
                        )}
                    </button>
                </div>

                {!hasResume && (
                    <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-800/40 p-3 rounded-xl">
                        Please upload your PDF resume above to unlock AI-powered feedback and recommendations.
                    </p>
                )}
            </div>

            {/* AI RESUME ANALYSIS RESULTS VIEW */}
            {showAnalysis && (
                <GeneralAIAnalysisView
                    analysis={analysisData}
                    loading={loadingAnalysis}
                    error={analysisError}
                    onRetry={handleAnalyzeResume}
                    hasResume={hasResume}
                />
            )}

        </div>
    );
};

export default ResumePage;