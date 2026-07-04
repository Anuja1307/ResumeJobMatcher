import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

          
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-lg font-bold text-blue-600">Resume Job Matcher</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user?.email}</span>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="flex flex-1">

                
                <aside className="w-56 bg-white shadow-sm p-6 flex flex-col gap-2">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/dashboard/resume"
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50"
                    >
                        Resume
                    </Link>
                    <Link
                        to="/dashboard/jobs"
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50"
                    >
                        Saved Jobs
                    </Link>
                    <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50"
                    >
                        Profile
                    </Link>
                </aside>

                
                <main className="flex-1 p-8">
                    {children}
                </main>

            </div>
        </div>
    );
};

export default MainLayout;