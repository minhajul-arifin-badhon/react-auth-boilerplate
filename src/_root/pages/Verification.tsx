import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpdateVerification } from '@/lib/react-query/queries';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const Verification = () => {
    const query = useQuery();
    const userId = query.get('userId') ?? '';
    const secret = query.get('secret') ?? '';
    const expire = query.get('expire') ?? '';

    const isExpired = (expiration: string | null) => {
        if (!expiration) return false;
        const expirationTime = new Date(expiration).getTime();
        const currentTime = new Date().getTime();

        return currentTime > expirationTime;
    };

    const [error, setError] = useState<string | null>();
    const { mutateAsync: updateVerification, isPending } = useUpdateVerification();

    useEffect(() => {
        if (!userId || !secret || !expire) {
            setError('Missing required parameters.');
            return;
        }

        if (isExpired(expire)) {
            setError('The verification link has expired. Try sending a new link to your email.');
            return;
        }

        (async function () {
            const response = await updateVerification({ userId, secret });

            if (response.status != 200) setError(response.message);
        })();
    }, []);

    return (
        <div className="w-full bg-gray-100">
            <Card className="mx-auto mt-10 flex max-w-4xl">
                <CardHeader>
                    <CardTitle>Account Verification</CardTitle>
                    <CardDescription>
                        {isPending && <span>Verifying your email...</span>}
                        {!isPending && !error && (
                            <span>
                                Your email has been successfully verified!
                                <Link to="/" className="text-primary-500 hover:text-primary-600">
                                    <span> Return </span>
                                </Link>
                                to the app to keep using.
                            </span>
                        )}
                        {error && <span>{error}</span>}
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
};

export default Verification;
