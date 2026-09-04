import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Briefcase, User, LogOut, Sparkles } from 'lucide-react';

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

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Resume', path: '/dashboard/resume', icon: FileText },
        { label: 'Saved Jobs', path: '/dashboard/jobs', icon: Briefcase },
        { label: 'Profile', path: '/dashboard/profile', icon: User },
    ];

    const getInitials = (name, email) => {
        if (name && name.trim()) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        if (email) {
            return email.slice(0, 2).toUpperCase();
        }
        return 'US';
    };

    return (
        <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans text-slate-900 antialiased">
            
            {/* Top Navbar */}
            <header className="bg-white border-b border-slate-200/70 px-6 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-xs">
                <Link to="/dashboard" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-tr from-indigo-600 to-indigo-500 p-2.5 rounded-xl text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
                        <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-lg font-extrabold tracking-tight text-slate-900">Resume Matcher</span>
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md">
                                <Sparkles className="h-2.5 w-2.5" /> AI
                            </span>
                        </div>
                    </div>
                </Link>
                
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full">
                        <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] uppercase shadow-xs">
                            {getInitials(user?.name, user?.email)}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 max-w-[160px] truncate">
                            {user?.name || user?.email}
                        </span>
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className="text-xs font-semibold text-slate-600 hover:text-rose-600 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-200"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden xs:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Mobile Navigation */}
            <div className="md:hidden border-b border-slate-200/70 bg-white px-4 py-2 flex justify-around sticky top-[61px] z-30 shadow-xs">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl transition-all ${
                                active 
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="flex flex-1">
                {/* Desktop Left Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200/70 p-6 hidden md:flex flex-col gap-1.5 shrink-0">
                    <div className="px-3 mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Career Workspace</p>
                    </div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                className={`flex items-center gap-3 text-sm font-semibold py-2.5 px-3.5 rounded-xl transition-all duration-200 ${
                                    active 
                                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/80 shadow-xs' 
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className={`h-4.5 w-4.5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;