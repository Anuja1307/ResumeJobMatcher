import {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {useNavigate,Link} from 'react-router-dom';
import {userLogin} from '../services/authService';




const LoginPage = ()=>{

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [error,setError]=useState('');
    const [loading,setLoading]=useState(false);

    const {login}=useAuth();
    const navigate=useNavigate();

    const handleSubmit=async (e)=>{
        e.preventDefault();
        setLoading(true);
        setError('');
        try{
            const response=await userLogin(email,password);
            const token=response.data.token;
            console.log("token:", token);
            login({email},token);
            console.log("User logged in successfully");
            navigate('/dashboard');
        } 
        catch (err) {
            setError(err.response?.data?.message || 'Login failed. Try again.');
        } 
        finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
                <p className="text-gray-500 mb-6">Login to your account</p>

                
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="anuja@gmail.com"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                <p className="text-sm text-center text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline font-medium">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
};



    


export default LoginPage