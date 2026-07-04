import { useState, useEffect } from 'react';
import { getJobs, saveJob, updateJob, deleteJob } from '../services/jobService';

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
        saved:      'bg-gray-100 text-gray-600',
        applied:    'bg-blue-100 text-blue-600',
        interviewing:  'bg-yellow-100 text-yellow-600',
        rejected:   'bg-red-100 text-red-600',
        offered:      'bg-green-100 text-green-600',
    };

    if (loading) return <p className="text-gray-500">Loading...</p>;

    return (
        <div className="max-w-3xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Saved Jobs</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                    + Add Job
                </button>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Add / Edit Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-3">
                    <h3 className="font-semibold text-gray-700 mb-2">
                        {editingId ? 'Edit Job' : 'Add New Job'}
                    </h3>

                    {['title', 'company', 'location', 'salary', 'jobUrl'].map(field => (
                        <input
                            key={field}
                            name={field}
                            value={form[field]}
                            onChange={handleChange}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : editingId ? 'Update' : 'Save'}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Job list */}
            {jobs.length === 0 ? (
                <p className="text-gray-400 text-sm">No jobs saved yet. Click + Add Job to start.</p>
            ) : (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job._id} className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{job.title}</h3>
                                    <p className="text-sm text-gray-500">{job.company} — {job.location}</p>
                                    {job.salary && (
                                        <p className="text-sm text-gray-400 mt-1">{job.salary}</p>
                                    )}
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[job.status]}`}>
                                    {job.status}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mt-3 line-clamp-2">{job.description}</p>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleEdit(job)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(job._id)}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                                {job.jobUrl && (
                                    <a
                                        href={job.jobUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-gray-400 hover:underline ml-auto"
                                    >
                                        View Posting ↗
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