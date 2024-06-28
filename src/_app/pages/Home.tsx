import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserContext } from '@/context/AuthContext';

const Home = () => {
    const { user } = useUserContext();
    console.log('rendering home');
    return (
        <Card className="mt-10 w-10/12">
            <CardHeader>
                {user.label != 'admin' ? (
                    <>
                        <CardTitle>Limited Access!</CardTitle>
                        <CardDescription>You do not have full access to view data.</CardDescription>
                    </>
                ) : (
                    <>
                        <CardTitle>Hello Admin!</CardTitle>
                        <CardDescription>Welcome to our app. </CardDescription>
                    </>
                )}
            </CardHeader>
        </Card>
    );
};

export default Home;
