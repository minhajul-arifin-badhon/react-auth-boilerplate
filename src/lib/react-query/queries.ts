import { INewUser, IResetPassword, IUpdateUser, IVerification } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createUserAccount,
    createVerification,
    getCurrentUser,
    getUserById,
    getUsers,
    requestPasswordRecovery,
    resetPassword,
    signInAccount,
    signOutAccount,
    updateUser,
    updateVerification
} from '../appwrite/api';
import { QUERY_KEYS } from './queryKeys';

// ============================================================
// Auth
// ============================================================

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string }) => signInAccount(user)
    });
};

export const useRequestPasswordRecovery = () => {
    return useMutation({
        mutationFn: (user: { email: string }) => requestPasswordRecovery(user)
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data: IResetPassword) => resetPassword(data)
    });
};

export const useCreateVerification = () => {
    return useMutation({
        mutationFn: () => createVerification()
    });
};

export const useUpdateVerification = () => {
    return useMutation({
        mutationFn: (data: IVerification) => updateVerification(data)
    });
};

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    });
};

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    });
};

export const useGetUsers = (limit?: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: () => getUsers(limit)
    });
};

export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: IUpdateUser) => updateUser(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id]
            });
        }
    });
};
