import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ResetPasswordValidation } from '@/lib/validation';
import { Link, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useResetPassword } from '@/lib/react-query/queries';

// Custom hook to parse query parameters
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const ResetPasswordForm = () => {
    console.log('Here is reset password form');

    const { toast } = useToast();
    const query = useQuery();
    const userId = query.get('userId') ?? '';
    const secret = query.get('secret') ?? '';

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId || !secret) setError('Missing required parameters.');
    }, [userId, secret]);

    // Query
    const { mutateAsync: resetPassword, isPending } = useResetPassword();

    const form = useForm<z.infer<typeof ResetPasswordValidation>>({
        resolver: zodResolver(ResetPasswordValidation),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const handleResetPassword = async (data: z.infer<typeof ResetPasswordValidation>) => {
        const response = await resetPassword({
            userId: userId,
            secret: secret,
            password: data.password
        });

        if (response.status != 200) setError(response.message);
        else {
            toast({
                title: 'Success',
                description: 'Please, sign in with your new password now.',
                variant: 'success'
            });
            form.reset();
        }
    };

    return (
        <div className="flex size-full flex-row overflow-hidden xl:h-5/6 xl:w-10/12 xl:rounded-2xl xl:shadow-lg">
            <div className="xl:flex-center auth-bg hidden bg-primary-500 text-white xl:h-full xl:w-1/2">
                <div className="flex-center w-10/12 flex-col text-center xl:w-8/12">
                    <h1 className="text-3xl font-extrabold text-light-1 lg:text-5xl">
                        Hello, Friend!
                    </h1>
                    <div className="py-10">
                        <h2 className="py-1 text-xl font-thin text-light-1">
                            Enter your personal details
                        </h2>

                        <h2 className="py-1 text-xl font-thin text-light-1">
                            and start your journey with us
                        </h2>
                    </div>

                    <Link to="/sign-up" className="ml-2 text-lg font-semibold text-primary-500">
                        <Button className="shad-button_ghost my-4">Sign Up</Button>
                    </Link>
                </div>
            </div>

            <div className="flex-center size-full bg-white text-white xl:w-1/2">
                <Form {...form}>
                    <div className="flex-center w-10/12 flex-col text-center xl:w-9/12">
                        <h1 className="text-3xl font-extrabold text-primary-500 lg:text-5xl">
                            Recover Account
                        </h1>

                        <h2 className="p-6 text-lg text-dark-4">
                            {`Enter your new password below`}
                        </h2>

                        <form
                            onSubmit={form.handleSubmit(handleResetPassword)}
                            className="mt-4 w-full"
                        >
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="shad-input"
                                                placeholder="Password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="shad-input"
                                                placeholder="Confirm Password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <FormMessage>{error}</FormMessage>}
                            <Button
                                type="submit"
                                className="shad-button_primary my-4"
                                disabled={!userId || !secret}
                            >
                                {isPending ? (
                                    <ReloadIcon className="mr-2 size-4 animate-spin" />
                                ) : (
                                    ''
                                )}
                                Reset Password
                            </Button>
                            <p className="p-5 text-center text-lg text-dark-2">
                                Want to try again?
                                <Link
                                    to="/sign-in"
                                    className="ml-2 text-lg font-semibold text-primary-500"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </form>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
