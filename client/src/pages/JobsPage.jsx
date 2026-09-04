import { useState, useEffect } from 'react';
import { getJobs, saveJob, updateJob, deleteJob } from '../services/jobService';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Link2, 
    MapPin, 
    DollarSign, 
    Building2, 
    ClipboardList, 
    AlertCircle, 
    Loader2, 
    Briefcase,
    Sparkles,
    ArrowRight
} from 'lucide-react';

const STATUS_OPTIONS = ['saved', 'applied', 'interviewing', 'rejected', 'offered'];

const emptyForm = {
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    jobUrl: '',
    status: 'saved'
};

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getJobs();
                setJobs(response.data.jobs || []);
            } catch (err) {
                setError('Failed to load saved jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddNew = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
        setError('');
    };

    const handleEdit = (job) => {
        setForm({
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            salary: job.salary || '',
            jobUrl: job.jobUrl || '',
            status: job.status
        });
        setEditingId(job._id);
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async () => {
        if (!form.title || !form.company || !form.location || !form.description) {
            setError('Title, company, location, and description are required');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            if (editingId) {
                const response = await updateJob(editingId, form);
                setJobs(jobs.map(j => j._id === editingId ? response.data.job : j));
            } else {
                const response = await saveJob(form);
                setJobs([...jobs, response.data.job]);
            }
            setShowForm(false);
            setForm(emptyForm);
            setEditingId(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong while saving position.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteJob(id);
            setJobs(jobs.filter(j => j._id !== id));
        } catch (err) {
            setError('Failed to delete job posting');
        }
    };

    const statusColors = {
        saved:        'bg-slate-100 text-slate-700 border-slate-200/80',
        applied:      'bg-blue-50 text-blue-700 border-blue-200/60',
        interviewing: 'bg-amber-50 text-amber-700 border-amber-200/60',
        rejected:     'bg-rose-50 text-rose-700 border-rose-200/60',
        offered:      'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fadeIn">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                <p className="text-sm text-slate-500 font-medium mt-3">Loading your saved jobs...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl animate-fadeIn space-y-6 pb-12">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Saved Jobs</h1>
                    <p className="text-sm text-slate-500 mt-1">Track vacancies, job specs, and current application progress.</p>
                </div>
                {!showForm && (
                    <button
                        onClick={handleAddNew}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add New Job</span>
                    </button>
                )}
            </div>

            {/* AI Workflow Helper Card */}
            <div className="bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-slate-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                        <span className="font-extrabold text-slate-800">Future AI Matcher Flow: </span>
                        <span className="text-slate-600">
                            Saved Job → Resume Comparison → Semantic Matching & Skill Gaps → Interview Copilot
                        </span>
                    </div>
                </div>
            </div>

            {/* Error alert */}
            {error && (
                <div className="bg-rose-50 text-rose-700 border border-rose-100 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn">
                    <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Add / Edit Form Drawer */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-5 animate-fadeIn">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 shrink-0">
                            <Briefcase className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-slate-900">
                            {editingId ? 'Edit Job Details' : 'Track New Position'}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { name: 'title', label: 'Job Title', placeholder: 'Software Engineer / Frontend Dev' },
                            { name: 'company', label: 'Company Name', placeholder: 'Google / Tech Corp' },
                            { name: 'location', label: 'Location', placeholder: 'Remote / San Francisco, CA' },
                            { name: 'salary', label: 'Salary (Optional)', placeholder: 'e.g. $100k - $120k' },
                            { name: 'jobUrl', label: 'Job Listing URL (Optional)', placeholder: 'https://careers.company.com/job/123' }
                        ].map((fieldObj) => (
                            <div key={fieldObj.name} className={fieldObj.name === 'jobUrl' ? 'md:col-span-2' : ''}>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    {fieldObj.label}
                                </label>
                                <input
                                    name={fieldObj.name}
                                    value={form[fieldObj.name]}
                                    onChange={handleChange}
                                    placeholder={fieldObj.placeholder}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Job Description & Key Requirements
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Paste requirements, job description, or target qualifications..."
                            rows={4}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Application Status
                        </label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all capitalize"
                        >
                            {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-slate-100">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : editingId ? (
                                'Update Position'
                            ) : (
                                'Save Position'
                            )}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Job cards grid */}
            {jobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs max-w-xl mx-auto my-6 animate-fadeIn space-y-4">
                    <div className="h-14 w-14 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                        <ClipboardList className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">No saved jobs yet</h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                            Save jobs you're interested in to start building your job tracker.
                        </p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Browse / Add Job</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {jobs.map(job => (
                        <div key={job._id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="space-y-1 min-w-0">
                                        <h3 className="font-extrabold text-slate-900 text-sm leading-snug truncate" title={job.title}>
                                            {job.title}
                                        </h3>
                                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                            <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{job.company}</span>
                                        </p>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${statusColors[job.status] || statusColors.saved}`}>
                                        {job.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 py-1.5 border-y border-slate-100">
                                    <div className="flex items-center gap-1 min-w-0">
                                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                        <span className="truncate">{job.location}</span>
                                    </div>
                                    {job.salary && (
                                        <div className="flex items-center gap-1 min-w-0">
                                            <DollarSign className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{job.salary}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{job.description}</p>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleEdit(job)}
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-all cursor-pointer"
                                    >
                                        <Edit2 className="h-3.5 w-3.5" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-all cursor-pointer"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Delete</span>
                                    </button>
                                </div>

                                {job.jobUrl && (
                                    <a
                                        href={job.jobUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                                    >
                                        <span>Posting</span>
                                        <Link2 className="h-3.5 w-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobsPage;