// import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useEffect, useState } from 'react';

import { IUser } from '@/types';
import { getCurrentUser } from '@/lib/appwrite/api';

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
    verified: false,
    label: ''
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean
};

type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // get the user if already exists
    const checkAuthUser = async () => {
        setIsLoading(true);
        try {
            const userCookie = localStorage.getItem('userCookie');
            if (userCookie) {
                setIsAuthenticated(true);
                setUser(JSON.parse(userCookie));
                return true;
            }

            const currentAccount = await getCurrentUser();
            console.log(currentAccount);

            if (currentAccount) {
                const userData = {
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                    verified: currentAccount.verified,
                    label: currentAccount.label
                };

                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem('userCookie', JSON.stringify(userData));
                return true;
            }

            return false;
        } catch (error) {
            setIsAuthenticated(false);
            setUser(INITIAL_USER);
            localStorage.removeItem('userCookie');
            console.error(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthUser();
    }, []);

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
