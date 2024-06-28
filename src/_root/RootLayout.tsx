// import { useUserContext } from '@/context/AuthContext';
import React from 'react';
import { Outlet } from 'react-router-dom';

export const RootLayout = () => {
    // const { isAuthenticated } = useUserContext();

    return <Outlet></Outlet>;
};
