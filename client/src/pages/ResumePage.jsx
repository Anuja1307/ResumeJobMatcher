import {uploadResume} from '../services/resumeService';
import {useState} from 'react';


const ResumePage=()=>{
    const [file,setFile]=useState(null);
    const [error,setError]=useState(null);
    const [success,setSuccess]=useState('');
    const [resumeUrl,setResumeUrl]=useState('');
    const [loading,setLoading]=useState(false);

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
        <div className="max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Resume</h2>

            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">

                {/* File input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose Resume (PDF only)
                    </label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    />
                </div>

                {/* Selected file name */}
                {file && (
                    <p className="text-sm text-gray-500">
                        Selected: <span className="font-medium text-gray-700">{file.name}</span>
                    </p>
                )}

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {success && (
                    <p className="text-sm text-green-600">{success}</p>
                )}

                {/* Upload button */}
                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Uploading...' : 'Upload Resume'}
                </button>

                
                {resumeUrl && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Uploaded URL:</p>
                        <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-600 hover:underline break-all"
                        >
                            {resumeUrl}
                        </a>
                    </div>
                )}

            </div>
        </div>

    )
}

export default ResumePage