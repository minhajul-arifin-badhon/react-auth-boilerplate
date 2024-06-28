import { useUserContext } from '@/context/AuthContext';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Topbar } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useCreateVerification } from '@/lib/react-query/queries';
import { useToast } from '@/components/ui/use-toast';

const AppLayout = () => {
    const { toast } = useToast();
    const { user, isAuthenticated } = useUserContext();
    const { mutateAsync: createVerification } = useCreateVerification();

    const handleSendVerificationLink = async () => {
        const response = await createVerification();

        if (response.status == 200)
            toast({
                title: 'Verify Account',
                description: 'A verification link has been sent to your email',
                variant: 'success'
            });
        else
            toast({
                title: 'Verify Account',
                description: response.message,
                variant: 'error'
            });
    };

    return (
        <>
            {!isAuthenticated ? (
                <Navigate to="/sign-in"></Navigate>
            ) : (
                <div className="min-h-screen w-full bg-white">
                    <Topbar></Topbar>

                    <div className="flex-center">
                        {!user.verified && (
                            <Card className="mt-10 flex w-10/12 flex-row justify-between">
                                <CardHeader>
                                    <CardTitle>Unverified!</CardTitle>
                                    <CardDescription>
                                        Please, verifiy your account to get full access.
                                    </CardDescription>
                                </CardHeader>
                                <div className="flex items-center justify-end p-6">
                                    <Button
                                        className="bg-primary-500"
                                        onClick={() => handleSendVerificationLink()}
                                    >
                                        Verify Account
                                    </Button>
                                </div>
                            </Card>
                        )}
                        {user.verified && <Outlet />}
                    </div>
                </div>
            )}
        </>
    );
};

export default AppLayout;
