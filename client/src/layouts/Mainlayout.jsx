import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Briefcase, User, LogOut } from 'lucide-react';

const MainLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    const linkClass = (path) => {
        const base = "flex items-center gap-3 text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-200";
        const active = "bg-indigo-50 text-indigo-600";
        const inactive = "text-slate-600 hover:text-slate-900 hover:bg-slate-50";
        return `${base} ${isActive(path) ? active : inactive}`;
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Resume', path: '/dashboard/resume', icon: FileText },
        { label: 'Saved Jobs', path: '/dashboard/jobs', icon: Briefcase },
        { label: 'Profile', path: '/dashboard/profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
            
            {/* Top Navbar */}
            <nav className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center gap-2.5">
                    <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm shadow-indigo-150">
                        <Briefcase className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900">Resume Matcher</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] uppercase">
                            {user?.email ? user.email.slice(0, 2) : 'US'}
                        </div>
                        <span className="text-xs font-medium text-slate-600 max-w-[150px] truncate">{user?.email}</span>
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-rose-50 transition-all duration-200"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span className="hidden xs:inline">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Mobile Horizontal Navigation (hidden on desktop) */}
            <div className="md:hidden border-b border-slate-100 bg-white px-4 py-2 flex justify-around overflow-x-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-lg transition-all ${
                                active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="flex flex-1">
                
                {/* Desktop Left Sidebar (hidden on mobile) */}
                <aside className="w-64 bg-white border-r border-slate-100 p-6 hidden md:flex flex-col gap-1.5 shrink-0">
                    <div className="px-3 mb-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</p>
                    </div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </aside>

                {/* Main Workspace */}
                <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
                    {children}
                </main>

            </div>
        </div>
    );
};

export default MainLayout;