import {useAuth} from '../context/AuthContext';
import {Navigate} from 'react-router-dom';

const ProtectedRoute=({children})=>{
    const {token,loading}=useAuth();

    if(loading){
        return <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
        </div>;
    }

    if(!token){
        return <Navigate to="/login" replace />;
    }

    return children;

}

export default ProtectedRoute;