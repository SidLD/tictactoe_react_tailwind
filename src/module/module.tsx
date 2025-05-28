

import { auth } from '@/lib/service';
import { Navigate } from "react-router-dom"
import DashboardLayout from '@/layouts/private.laytout';
import Guest from '@/layouts/guest.layout';

export const PublicLayout = () => {
    
    if(auth.isAuthenticated()){
        return  <Navigate to={'/game'} />;
    }
    return (
        <Guest />
    )
}

export const PrivateLayout = () => {
    if (!auth.isAuthenticated()) {
        return <Navigate to={"/"} />;
    }
    else if (auth.getExpiration() * 1000 <= Date.now()) {
        auth.clear()
        alert("Session Expired")
        return <Navigate to={"/"} />;
        
    }else{
        return <DashboardLayout />
    }   
}
