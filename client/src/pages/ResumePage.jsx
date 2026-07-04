import { uploadResume } from '../services/resumeService';
import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

const ResumePage = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
        setSuccess('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess('');

        try {
            const response = await uploadResume(file);
            setSuccess('Resume uploaded successfully.');
            setResumeUrl(response.data.resumeUrl);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">Resume</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">

                {/* Dashed Drag/Select Area */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Choose Resume (PDF only)
                    </label>
                    <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50 rounded-2xl p-8 cursor-pointer transition-all duration-200">
                        <UploadCloud className="h-10 w-10 text-slate-400 mb-3" />
                        <span className="text-sm font-semibold text-slate-800">Select Resume File</span>
                        <span className="text-xs text-slate-400 mt-1">PDF format only (Max 5MB)</span>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Selected file details */}
                {file && (
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl animate-fadeIn">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-650 shrink-0">
                                <FileText className="h-4.5 w-4.5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-850 truncate">{file.name}</p>
                                <p className="text-[10px] text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status messages */}
                {error && (
                    <div className="bg-rose-50 text-rose-700 border border-rose-100 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn">
                        <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-50 text-emerald-705 border border-emerald-100 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{success}</span>
                    </div>
                )}

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <span>Upload Resume</span>
                    )}
                </button>

                {/* Link Output Container */}
                {resumeUrl && (
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Uploaded Cloudinary URL</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-slate-200/60 min-w-0">
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline truncate break-all flex items-center gap-1 shrink"
                            >
                                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{resumeUrl}</span>
                            </a>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ResumePage;