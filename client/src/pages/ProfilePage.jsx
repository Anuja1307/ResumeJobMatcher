import {useState,useEffect} from 'react';
import {getProfile} from '../services/authService'

const ProfilePage=()=>{
    const [profile,setProfile]=useState(null);
    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(() => {
            const fetchProfile = async () => {
                try {
                    const response = await getProfile();
                    setProfile(response.data.user);
                    console.log("Profile data fetched successfully:", response.data.user);
                    console.log("Profile data:", profile);
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to fetch profile. Try again.');
                } finally {
                    setLoading(false);
                }
            };

            fetchProfile();   //call it immediately after defining it because useEffect cannot be async directly
        }, []);

    if(loading){
        return <div className="p-8 text-3xl text-center">Loading...</div>
    }
    if(error){
        return <div className="p-8 text-3xl text-center text-red-500">{error}</div>
    }

    return (
         <div className="max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>

            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">

                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Name</p>
                    <p className="text-gray-800 font-medium">{profile.name}</p>
                </div>

                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-gray-800 font-medium">{profile.email}</p>
                </div>

            </div>
        </div>
    )



     
}

export default ProfilePage