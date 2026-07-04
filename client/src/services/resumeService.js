import api from './api';

export const uploadResume=async (file)=>{
    const formData=new FormData();
    formData.append('resume',file);

    return await api.post('/resume/upload',formData,{
        headers:{
            'Content-Type':'multipart/form-data'
        }
    });

    }
