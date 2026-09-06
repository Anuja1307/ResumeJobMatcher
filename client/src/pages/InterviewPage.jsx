import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    startInterview, 
    submitAnswer, 
    getInterviewSession, 
    completeInterview 
} from '../services/interviewService';
import { 
    Briefcase, 
    MapPin, 
    Loader2, 
    AlertCircle, 
    CheckCircle2,
    ArrowRight,
    XCircle,
    LayoutDashboard,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Check
} from 'lucide-react';

const InterviewPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    
    const [session, setSession] = useState(null);
    const [job, setJob] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [evaluation, setEvaluation] = useState(null);
    const [nextQuestion, setNextQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [error, setError] = useState('');
    const [showContinue, setShowContinue] = useState(false);
    const [interviewCompleted, setInterviewCompleted] = useState(false);
    const [finalResult, setFinalResult] = useState(null);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (sessionId) {
            loadSession();
        }
    }, [sessionId]);

    const loadSession = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getInterviewSession(sessionId);
            if (response.data?.success) {
                const sessionData = response.data.session;
                setSession(sessionData);
                setJob(sessionData.jobId);
                
                if (sessionData.status === 'completed') {
                    setInterviewCompleted(true);
                    setFinalResult({
                        overallScore: sessionData.overallScore,
                        questionsAnswered: sessionData.questions.filter(q => q.answer).length || sessionData.questions.length,
                        completedAt: sessionData.completedAt || new Date()
                    });
                } else {
                    // Find the first unanswered question
                    const unansweredQuestion = sessionData.questions.find(q => !q.answer);
                    if (unansweredQuestion) {
                        setCurrentQuestion(unansweredQuestion);
                    } else if (sessionData.questions.length > 0) {
                        // If all existing questions are answered, set current to last question or waiting complete
                        setCurrentQuestion(null);
                    }
                }
            } else {
                setError('Unable to load this interview.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load this interview.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            setError('Please provide an answer before submitting.');
            return;
        }

        setSubmitting(true);
        setError('');
        try {
            const response = await submitAnswer(sessionId, answer.trim());
            if (response.data?.success) {
                const evalData = response.data.evaluation;
                const nextQData = response.data.nextQuestion;
                
                setEvaluation(evalData);
                setNextQuestion(nextQData);
                setShowContinue(true);

                // Update session state locally
                setSession((prev) => {
                    if (!prev) return prev;
                    const updatedQuestions = prev.questions.map((q) =>
                        q.question === currentQuestion.question && !q.answer
                            ? {
                                ...q,
                                answer: answer.trim(),
                                score: evalData.score,
                                strengths: evalData.strengths || [],
                                improvements: evalData.improvements || [],
                                idealAnswerPoints: evalData.idealAnswerPoints || []
                            }
                            : q
                    );
                    
                    const questionExists = updatedQuestions.some(q => q.question === nextQData.question);
                    const finalQuestions = questionExists ? updatedQuestions : [...updatedQuestions, nextQData];

                    return {
                        ...prev,
                        questions: finalQuestions
                    };
                });

                setAnswer('');
            } else {
                setError('Unable to evaluate your answer. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to evaluate your answer. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleContinue = () => {
        setEvaluation(null);
        setShowContinue(false);
        if (nextQuestion) {
            setCurrentQuestion(nextQuestion);
            setNextQuestion(null);
        } else {
            // Find unanswered question if any
            const unanswered = session?.questions.find(q => !q.answer);
            setCurrentQuestion(unanswered || null);
        }
    };

    const handleCompleteInterview = async () => {
        setCompleting(true);
        setError('');
        try {
            const response = await completeInterview(sessionId);
            if (response.data?.success) {
                setFinalResult({
                    overallScore: response.data.overallScore,
                    questionsAnswered: response.data.questionsAnswered,
                    completedAt: response.data.completedAt || new Date()
                });
                setInterviewCompleted(true);
            } else {
                setError('Unable to complete the interview. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to complete the interview. Please try again.');
        } finally {
            setCompleting(false);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'medium':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'hard':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getScoreColor = (score) => {
        if (score >= 8) return 'text-emerald-600';
        if (score >= 6) return 'text-indigo-600';
        if (score >= 4) return 'text-amber-600';
        return 'text-rose-600';
    };

    const answeredQuestions = session?.questions?.filter(q => q.answer) || [];
    const totalQuestionsCount = session?.questions?.length || 1;
    const currentQuestionIndex = answeredQuestions.length + (currentQuestion ? 1 : 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fadeIn">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                <p className="text-sm text-slate-500 font-medium mt-3">Loading interview session...</p>
            </div>
        );
    }

    if (error && !session) {
        return (
            <div className="max-w-5xl animate-fadeIn space-y-6">
                <div className="bg-rose-50 text-rose-700 border border-rose-100 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn">
                    <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/dashboard/jobs')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Return to Jobs</span>
                    </button>
                    <button
                        onClick={loadSession}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                        Retry Loading
                    </button>
                </div>
            </div>
        );
    }

    if (interviewCompleted && finalResult) {
        return (
            <div className="max-w-5xl animate-fadeIn space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-xs">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Interview Complete</h1>
                        <p className="text-sm text-slate-500">Great job! You've completed your interview evaluation session.</p>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-slate-50 border border-indigo-100 rounded-2xl p-6 space-y-4 max-w-md mx-auto shadow-2xs">
                        <div className="text-center space-y-1">
                            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Overall Score</p>
                            <p className={`text-5xl font-extrabold ${getScoreColor(finalResult.overallScore)}`}>
                                {typeof finalResult.overallScore === 'number' ? finalResult.overallScore.toFixed(1) : finalResult.overallScore}
                                <span className="text-2xl text-slate-400 font-semibold"> / 10</span>
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-100/80">
                            <div className="text-center">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Questions Answered</p>
                                <p className="text-xl font-extrabold text-slate-900">{finalResult.questionsAnswered}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Completed Date</p>
                                <p className="text-xs font-bold text-slate-700 mt-1">
                                    {new Date(finalResult.completedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {answeredQuestions.length > 0 && (
                        <div className="pt-4 border-t border-slate-100 max-w-2xl mx-auto space-y-3 text-left">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">Summary of Evaluated Questions</h3>
                            <div className="space-y-3">
                                {answeredQuestions.map((q, idx) => (
                                    <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2 text-xs">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="font-bold text-slate-900">Q{idx + 1}: {q.question}</span>
                                            {q.score !== undefined && (
                                                <span className={`font-extrabold shrink-0 px-2 py-0.5 rounded-md bg-white border ${getScoreColor(q.score)}`}>
                                                    {q.score}/10
                                                </span>
                                            )}
                                        </div>
                                        {q.answer && (
                                            <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                                                "{q.answer}"
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center gap-3 pt-4">
                        <button
                            onClick={() => navigate('/dashboard/jobs')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Back to Jobs</span>
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl animate-fadeIn space-y-6 pb-12">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Interview Copilot</h1>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md">
                                <Sparkles className="h-3 w-3 text-indigo-600" /> AI
                            </span>
                        </div>
                        {job && (
                            <div className="space-y-1">
                                <h2 className="text-base font-extrabold text-slate-800">{job.title}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                                        {job.company}
                                    </span>
                                    {job.location && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                            {job.location}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Header Actions */}
                    {answeredQuestions.length > 0 && (
                        <button
                            onClick={handleCompleteInterview}
                            disabled={completing || submitting}
                            className="self-start sm:self-center bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                            {completing ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Completing...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>Complete Interview</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Progress Bar */}
                {session && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-extrabold text-slate-700">Interview Progress</span>
                            <span className="font-semibold text-slate-600">
                                Question {currentQuestionIndex} of {Math.max(totalQuestionsCount, currentQuestionIndex)}
                            </span>
                        </div>
                        <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                            <div 
                                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                                style={{ 
                                    width: `${(currentQuestionIndex / Math.max(totalQuestionsCount, currentQuestionIndex)) * 100}%` 
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-rose-50 text-rose-700 border border-rose-100 px-4 py-3 rounded-xl text-xs flex items-start justify-between gap-2.5 animate-fadeIn">
                    <div className="flex items-start gap-2.5">
                        <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                    <button 
                        onClick={() => setError('')} 
                        className="text-rose-400 hover:text-rose-600 font-bold text-xs cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Main Question & Answer Card */}
            {currentQuestion && !showContinue && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                                {currentQuestion.difficulty || 'Medium'}
                            </span>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60">
                                {currentQuestion.questionType || 'Technical'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                            "{currentQuestion.question}"
                        </h3>
                        {currentQuestion.topic && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="font-semibold">Topic:</span>
                                <span className="font-bold text-slate-700">{currentQuestion.topic}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-100">
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                            Your Answer
                        </label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            rows={6}
                            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none font-sans"
                            disabled={submitting}
                        />
                        <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>Be detailed and provide real examples from your experience</span>
                            <span className="font-medium">{answer.length} characters</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmitAnswer}
                        disabled={submitting || !answer.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Evaluating your answer...</span>
                            </>
                        ) : (
                            <>
                                <span>Submit Answer</span>
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Evaluation Card */}
            {evaluation && showContinue && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6 animate-fadeIn">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <div className="h-8 w-8 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base">Your Evaluation</h3>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-slate-50 border border-indigo-100/80 rounded-xl p-5 text-center">
                        <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Your Score</p>
                        <p className={`text-4xl font-extrabold ${getScoreColor(evaluation.score)}`}>
                            {evaluation.score} <span className="text-xl text-slate-400 font-semibold">/ 10</span>
                        </p>
                    </div>

                    {evaluation.strengths && evaluation.strengths.length > 0 && (
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Check className="h-4 w-4 text-emerald-600" />
                                Strengths
                            </h4>
                            <div className="space-y-2">
                                {evaluation.strengths.map((strength, idx) => (
                                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-emerald-50/60 border border-emerald-100/80 p-3 rounded-xl">
                                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                        <span className="leading-relaxed">{strength}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {evaluation.improvements && evaluation.improvements.length > 0 && (
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <XCircle className="h-4 w-4 text-amber-600" />
                                Areas to Improve
                            </h4>
                            <div className="space-y-2">
                                {evaluation.improvements.map((improvement, idx) => (
                                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-amber-50/60 border border-amber-100/80 p-3 rounded-xl">
                                        <span className="text-amber-600 font-bold shrink-0">•</span>
                                        <span className="leading-relaxed">{improvement}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {evaluation.idealAnswerPoints && evaluation.idealAnswerPoints.length > 0 && (
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4 text-indigo-600" />
                                Ideal Answer Points
                            </h4>
                            <div className="space-y-2">
                                {evaluation.idealAnswerPoints.map((point, idx) => (
                                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-indigo-50/50 border border-indigo-100/70 p-3 rounded-xl">
                                        <span className="text-indigo-600 font-bold shrink-0">•</span>
                                        <span className="leading-relaxed">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Next Question Card */}
            {nextQuestion && showContinue && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5 animate-fadeIn">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <div className="h-8 w-8 bg-purple-50 border border-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-900 text-base">Next Question</h3>
                            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">AI Follow-up Question</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getDifficultyColor(nextQuestion.difficulty)}`}>
                            {nextQuestion.difficulty || 'Medium'}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60">
                            {nextQuestion.questionType || 'Technical'}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                            "{nextQuestion.question}"
                        </h3>
                        {nextQuestion.topic && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="font-semibold">Topic:</span>
                                <span className="font-bold text-slate-700">{nextQuestion.topic}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleContinue}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                        <span>Continue</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Complete Interview Card when no active unanswered question */}
            {!currentQuestion && !showContinue && !interviewCompleted && session && session.questions.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center space-y-4 animate-fadeIn">
                    <div className="flex justify-center">
                        <div className="h-14 w-14 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="h-7 w-7" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-extrabold text-slate-900">Interview Session Ready for Completion</h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                            You've answered the interview questions. Complete your session to calculate your overall evaluation score.
                        </p>
                    </div>
                    <button
                        onClick={handleCompleteInterview}
                        disabled={completing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-xs font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm transition cursor-pointer mx-auto"
                    >
                        {completing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Finalizing interview...</span>
                            </>
                        ) : (
                            <>
                                <span>Complete Interview</span>
                                <CheckCircle2 className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Previous Questions Collapsible History */}
            {answeredQuestions.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="w-full p-4 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                                Answered Questions ({answeredQuestions.length})
                            </span>
                        </div>
                        {showHistory ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                    </button>

                    {showHistory && (
                        <div className="p-4 space-y-4 border-t border-slate-200/70">
                            {answeredQuestions.map((q, idx) => (
                                <div key={idx} className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-4 space-y-3 text-xs">
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="space-y-1">
                                            <span className="font-extrabold text-slate-900">Question {idx + 1}:</span>
                                            <p className="font-semibold text-slate-800">{q.question}</p>
                                        </div>
                                        {q.score !== undefined && (
                                            <span className={`font-extrabold text-xs shrink-0 px-2.5 py-1 rounded-lg bg-white border ${getScoreColor(q.score)}`}>
                                                {q.score} / 10
                                            </span>
                                        )}
                                    </div>
                                    <div className="bg-white border border-slate-200/70 rounded-lg p-3 text-slate-700">
                                        <span className="font-bold text-[10px] uppercase text-slate-400 block mb-1">Your Answer</span>
                                        <p className="leading-relaxed">{q.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InterviewPage;