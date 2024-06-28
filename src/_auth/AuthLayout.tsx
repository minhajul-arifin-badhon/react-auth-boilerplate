import { useUserContext } from '@/context/AuthContext';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthLayout = () => {
    const { isAuthenticated } = useUserContext();

    return (
        <>
            {isAuthenticated ? (
                <Navigate to="/home"></Navigate>
            ) : (
                <div className="flex-center min-h-screen w-full bg-gray-100">
                    <Outlet></Outlet>
                </div>
            )}
        </>
    );
};
