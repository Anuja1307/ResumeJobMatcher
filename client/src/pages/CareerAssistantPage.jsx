import { useState, useEffect, useRef } from 'react';
import { getJobs } from '../services/jobService';
import { sendCareerChatMessage } from '../services/careerChatService';
import { 
    Sparkles, 
    Send, 
    Briefcase, 
    Building2, 
    User, 
    ChevronDown, 
    ChevronUp, 
    FileText, 
    AlertCircle, 
    Loader2, 
    RotateCcw,
    HelpCircle,
    Info,
    CheckCircle2
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
    {
        title: "Missing Skills",
        prompt: "What skills am I missing for this job?",
        icon: HelpCircle,
        requiresJob: true
    },
    {
        title: "Resume Match",
        prompt: "How well does my resume match this job?",
        icon: FileText,
        requiresJob: true
    },
    {
        title: "Interview Insights",
        prompt: "What should I improve based on my interview?",
        icon: Sparkles,
        requiresJob: false
    },
    {
        title: "Application Strategy",
        prompt: "What should I focus on before applying?",
        icon: CheckCircle2,
        requiresJob: true
    }
];

const CareerAssistantPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [selectedJobId, setSelectedJobId] = useState('');
    
    // Conversation State
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [inputQuery, setInputQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastFailedQuery, setLastFailedQuery] = useState(null);

    // Ref for autoscrolling
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Fetch saved jobs on mount
    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const response = await getJobs();
                const jobList = response.data?.jobs || [];
                setJobs(jobList);
            } catch (err) {
                console.error("Failed to load saved jobs for Career Assistant:", err);
            } finally {
                setLoadingJobs(false);
            }
        };
        fetchSavedJobs();
    }, []);

    // Auto-scroll to bottom whenever messages or loading state change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Focus input after sending
    const focusInput = () => {
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 100);
    };

    // Handle job selection change
    const handleJobChange = (e) => {
        const newJobId = e.target.value;
        setSelectedJobId(newJobId);
        // Clear current conversation state when switching job context
        setMessages([]);
        setConversationId(null);
        setError('');
        setLastFailedQuery(null);
    };

    // Selected job object helper
    const selectedJob = jobs.find(j => j._id === selectedJobId);

    // Execute message dispatch
    const handleSend = async (overrideQuery) => {
        const queryToSend = (overrideQuery || inputQuery).trim();
        if (!queryToSend || loading) return;

        // Clear input & previous errors
        if (!overrideQuery) setInputQuery('');
        setError('');
        setLastFailedQuery(null);

        // Append user message immediately
        const userMsg = { role: 'user', content: queryToSend };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const res = await sendCareerChatMessage({
                query: queryToSend,
                jobId: selectedJobId || undefined,
                conversationId: conversationId || undefined
            });

            if (res.data?.success) {
                // Update conversationId if returning from backend
                if (res.data.conversationId) {
                    setConversationId(res.data.conversationId);
                }

                // Append assistant message
                const assistantMsg = {
                    role: 'assistant',
                    content: res.data.answer || 'No response generated.',
                    sources: res.data.sources || []
                };
                setMessages((prev) => [...prev, assistantMsg]);
            } else {
                throw new Error(res.data?.message || 'Failed to receive career guidance.');
            }
        } catch (err) {
            console.error("Career chat API error:", err);
            const userFriendlyMsg = err.response?.data?.message || 'Unable to connect to Career Assistant. Please check your connection and try again.';
            setError(userFriendlyMsg);
            setLastFailedQuery(queryToSend);
        } finally {
            setLoading(false);
            focusInput();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleRetry = () => {
        if (lastFailedQuery) {
            handleSend(lastFailedQuery);
        }
    };

    const formatSourceType = (type) => {
        if (!type) return 'Reference';
        const lower = type.toLowerCase();
        if (lower.includes('resume')) return 'Resume';
        if (lower.includes('job')) return 'Job';
        if (lower.includes('interview')) return 'Interview';
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const formatSimilarity = (score) => {
        if (typeof score !== 'number') return null;
        const percentage = Math.round(score * 100);
        return `${percentage}% match`;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-5xl mx-auto space-y-4 animate-fadeIn">
            
            {/* 1. HEADER & JOB SELECTOR BAR */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Career Assistant</h1>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Your AI-powered career copilot for resume, jobs and interview preparation.
                    </p>
                </div>

                {/* Job Context Selector */}
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 p-2 rounded-xl">
                    <Briefcase className="h-4 w-4 text-indigo-600 shrink-0 ml-1" />
                    <div className="flex-1 min-w-[200px]">
                        <select
                            value={selectedJobId}
                            onChange={handleJobChange}
                            disabled={loadingJobs}
                            className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer truncate"
                        >
                            <option value="">All / General Resume Context</option>
                            {jobs.map((job) => (
                                <option key={job._id} value={job._id}>
                                    {job.title} — {job.company}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* JOB CONTEXT INDICATOR BANNER */}
            {selectedJob && (
                <div className="bg-indigo-50/80 border border-indigo-100/90 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-indigo-900 shrink-0">
                    <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-indigo-700">Discussing:</span>
                        <span className="font-semibold truncate">
                            {selectedJob.title}
                        </span>
                        <span className="text-indigo-400">•</span>
                        <span className="text-indigo-700 truncate flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {selectedJob.company}
                        </span>
                    </div>
                    <button
                        onClick={() => handleJobChange({ target: { value: '' } })}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline shrink-0 cursor-pointer ml-2"
                    >
                        Clear job filter
                    </button>
                </div>
            )}

            {/* 2. CHAT MESSAGES AREA */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 md:p-6 overflow-y-auto flex flex-col space-y-4">
                
                {/* EMPTY STATE */}
                {messages.length === 0 ? (
                    <div className="my-auto py-8 text-center space-y-6 max-w-2xl mx-auto">
                        <div className="h-16 w-16 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-indigo-200">
                            <Sparkles className="h-8 w-8" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl font-extrabold text-slate-900">How can I help with your career?</h2>
                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                {selectedJob 
                                    ? `Ask any question regarding your resume alignment with ${selectedJob.title} at ${selectedJob.company}.`
                                    : 'Select a saved job to analyze skill gaps, or ask general questions about your resume and interview preparation.'}
                            </p>
                        </div>

                        {/* Prompt Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                            {SUGGESTED_PROMPTS.map((card, idx) => {
                                const IconComponent = card.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(card.prompt)}
                                        className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between w-full mb-2">
                                            <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                                                {card.title}
                                            </span>
                                            <IconComponent className="h-4 w-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-snug">
                                            "{card.prompt}"
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        {!selectedJobId && jobs.length > 0 && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-medium">
                                <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                                <span>Tip: Select a job from the top dropdown to get job-specific skill gap analysis.</span>
                            </div>
                        )}
                    </div>
                ) : (
                    /* CONVERSATION STREAM */
                    messages.map((msg, index) => {
                        const isUser = msg.role === 'user';
                        return (
                            <div
                                key={index}
                                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                            >
                                {/* Avatar */}
                                <div
                                    className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                                        isUser 
                                            ? 'bg-indigo-600 text-white font-bold text-xs' 
                                            : 'bg-gradient-to-tr from-slate-900 to-indigo-950 text-white'
                                    }`}
                                >
                                    {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-indigo-300" />}
                                </div>

                                {/* Message Content */}
                                <div className="space-y-2 max-w-[85%]">
                                    <div
                                        className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                                            isUser
                                                ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs font-medium'
                                                : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs shadow-2xs whitespace-pre-wrap'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>

                                    {/* Sources Section (if present for assistant message) */}
                                    {!isUser && msg.sources && msg.sources.length > 0 && (
                                        <SourcesAccordion sources={msg.sources} formatSourceType={formatSourceType} formatSimilarity={formatSimilarity} />
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}

                {/* LOADING / THINKING INDICATOR */}
                {loading && (
                    <div className="flex gap-3 mr-auto max-w-xl animate-fadeIn">
                        <div className="h-8 w-8 rounded-xl bg-slate-900 text-indigo-300 flex items-center justify-center shrink-0">
                            <Sparkles className="h-4 w-4 animate-spin" />
                        </div>
                        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-slate-600 flex items-center gap-2 shadow-2xs">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                            <span>Career Assistant is analyzing your query...</span>
                        </div>
                    </div>
                )}

                {/* ERROR ALERT */}
                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center justify-between gap-3 animate-fadeIn my-2">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                            <span>{error}</span>
                        </div>
                        {lastFailedQuery && (
                            <button
                                onClick={handleRetry}
                                className="inline-flex items-center gap-1 bg-white border border-rose-300 text-rose-800 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>Retry</span>
                            </button>
                        )}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 3. INPUT AREA */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs shrink-0 space-y-2">
                <div className="flex items-end gap-2">
                    <textarea
                        ref={textareaRef}
                        value={inputQuery}
                        onChange={(e) => setInputQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        rows={2}
                        placeholder={
                            selectedJob
                                ? `Ask about your resume, ${selectedJob.title}, or interview prep...`
                                : "Ask about your resume, saved jobs, or interview prep..."
                        }
                        className="flex-1 bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
                    />

                    <button
                        onClick={() => handleSend()}
                        disabled={loading || !inputQuery.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-3 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center"
                        title="Send Message"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                    <span>Press <kbd className="font-sans font-semibold bg-slate-100 border border-slate-200 px-1 rounded text-slate-600">Enter</kbd> to send, <kbd className="font-sans font-semibold bg-slate-100 border border-slate-200 px-1 rounded text-slate-600">Shift + Enter</kbd> for new line</span>
                    {conversationId && (
                        <span className="text-slate-400">Active Session Context</span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Collapsible Sources Component
const SourcesAccordion = ({ sources, formatSourceType, formatSimilarity }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border border-slate-200/70 rounded-xl bg-white overflow-hidden text-[11px] shadow-2xs">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-3 py-1.5 bg-slate-50/80 hover:bg-slate-100/80 text-slate-600 flex items-center justify-between transition-colors font-medium cursor-pointer"
            >
                <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Sources used ({sources.length})</span>
                </div>
                {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
            </button>

            {isExpanded && (
                <div className="p-3 space-y-2 border-t border-slate-100 bg-slate-50/30">
                    {sources.map((src, idx) => {
                        const typeLabel = formatSourceType(src.type);
                        const matchScore = formatSimilarity(src.similarity);
                        return (
                            <div key={idx} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white border border-slate-100">
                                <div className="space-y-0.5 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-slate-800">{typeLabel}</span>
                                        {src.source && (
                                            <>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-slate-600 truncate">{src.source}</span>
                                            </>
                                        )}
                                    </div>
                                    {src.text && (
                                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                                            {src.text}
                                        </p>
                                    )}
                                </div>

                                {matchScore && (
                                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[9px] border border-indigo-100 shrink-0">
                                        {matchScore}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CareerAssistantPage;
