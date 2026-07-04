import { useState, useEffect } from 'react';
import { getJobs, saveJob, updateJob, deleteJob } from '../services/jobService';
import { Plus, Edit2, Trash2, Link2, MapPin, DollarSign, Building2, ClipboardList, AlertCircle, Loader2 } from 'lucide-react';

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

    // fetch all jobs on page load
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getJobs();
                setJobs(response.data.jobs);
            } catch (err) {
                setError('Failed to load jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // handle form field changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // open empty form for new job
    const handleAddNew = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
    };

    // open form pre-filled for editing
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
    };

    // save or update
    const handleSubmit = async () => {
        if (!form.title || !form.company || !form.location || !form.description) {
            setError('Title, company, location and description are required');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            if (editingId) {
                // update existing job
                const response = await updateJob(editingId, form);
                setJobs(jobs.map(j => j._id === editingId ? response.data.job : j));
            } else {
                // save new job
                const response = await saveJob(form);
                setJobs([...jobs, response.data.job]);
            }
            setShowForm(false);
            setForm(emptyForm);
            setEditingId(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    // delete job
    const handleDelete = async (id) => {
        try {
            await deleteJob(id);
            setJobs(jobs.filter(j => j._id !== id));
        } catch (err) {
            setError('Failed to delete job');
        }
    };

    const statusColors = {
        saved:        'bg-slate-50 text-slate-700 border-slate-200/80',
        applied:      'bg-blue-50 text-blue-700 border-blue-200/60',
        interviewing: 'bg-amber-50 text-amber-750 border-amber-200/60',
        rejected:     'bg-rose-50 text-rose-700 border-rose-200/60',
        offered:      'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fadeIn">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                <p className="text-sm text-slate-500 font-medium mt-3">Loading jobs...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl animate-fadeIn space-y-6">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2 pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Saved Jobs</h2>
                    <p className="text-sm text-slate-500 mt-1">Track vacancies, applications, and current progress</p>
                </div>
                {!showForm && (
                    <button
                        onClick={handleAddNew}
                        className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-705 transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Job</span>
                    </button>
                )}
            </div>

            {/* Error alerts */}
            {error && (
                <div className="bg-rose-50 text-rose-700 border border-rose-100 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn">
                    <AlertCircle className="h-4 w-4 text-rose-505 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Add / Edit Form Drawer */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5 animate-fadeIn">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 shrink-0">
                            <Plus className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-slate-800">
                            {editingId ? 'Edit Job Details' : 'Track New Position'}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['title', 'company', 'location', 'salary', 'jobUrl'].map(field => {
                            const labelMap = {
                                title: 'Job Title',
                                company: 'Company Name',
                                location: 'Location',
                                salary: 'Salary (Optional)',
                                jobUrl: 'Job Listing URL (Optional)'
                            };
                            return (
                                <div key={field} className={field === 'jobUrl' ? 'md:col-span-2' : ''}>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                        {labelMap[field]}
                                    </label>
                                    <input
                                        name={field}
                                        value={form[field]}
                                        onChange={handleChange}
                                        placeholder={field === 'salary' ? 'e.g. $100k - $120k' : field === 'jobUrl' ? 'https://example.com/posting' : field.charAt(0).toUpperCase() + field.slice(1)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            Job Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Paste requirements, keyword descriptors, or details here..."
                            rows={4}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            Application Status
                        </label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all capitalize"
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
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : editingId ? (
                                'Update Posting'
                            ) : (
                                'Save Posting'
                            )}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Job cards list */}
            {jobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm max-w-xl mx-auto my-6 animate-fadeIn">
                    <div className="h-14 w-14 bg-indigo-50 border border-indigo-100/50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ClipboardList className="h-7 w-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-850">No saved positions yet</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                        Add postings you find online to start matches and tracking your progression across applications.
                    </p>
                    <button
                        onClick={handleAddNew}
                        className="mt-5 bg-indigo-650 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm"
                    >
                        + Track Your First Job
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {jobs.map(job => (
                        <div key={job._id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-200 flex flex-col justify-between gap-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="space-y-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 leading-snug truncate" title={job.title}>{job.title}</h3>
                                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                            <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{job.company}</span>
                                        </p>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${statusColors[job.status]}`}>
                                        {job.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 py-1.5 border-y border-slate-50">
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

                                <p className="text-xs text-slate-550 leading-relaxed line-clamp-3">{job.description}</p>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100/80 mt-1">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleEdit(job)}
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-all"
                                    >
                                        <Edit2 className="h-3.5 w-3.5" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-all"
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
                                        className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1.5"
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