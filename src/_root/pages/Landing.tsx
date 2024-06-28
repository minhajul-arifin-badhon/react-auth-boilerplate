import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
// import { useUserContext } from '@/context/AuthContext';

const Landing = () => {
    // const { user } = useUserContext();
    console.log('rendering home');
    return (
        <div className="flex-center w-full bg-gray-100">
            <Card className="flex-center mt-10 w-10/12">
                <CardHeader>
                    <CardTitle>Welcome to the landing page!</CardTitle>
                    <CardDescription className="flex-center gap-5 pt-5">
                        <Link to="/sign-up">
                            <Button>Sign up</Button>
                        </Link>

                        <Link to="/sign-in">
                            <Button>Sign In</Button>
                        </Link>
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
};

export default Landing;
