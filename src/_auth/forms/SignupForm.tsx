import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignupValidation } from '@/lib/validation';
// import { createUserAccount } from '@/lib/appwrite/api';
// import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/components/ui/use-toast';
import { ReloadIcon } from '@radix-ui/react-icons';

import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queries';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';

const SignupForm = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: ''
        }
    });

    // Queries
    const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
    const { mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount();

    // Handler
    const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
        try {
            const newUser = await createUserAccount(user);

            if (!newUser) {
                toast({ title: 'Sign up failed. Please try again.', variant: 'error' });

                return;
            }

            const session = await signInAccount({
                email: user.email,
                password: user.password
            });

            if (!session) {
                toast({
                    title: 'Something went wrong. Please login your new account',
                    variant: 'error'
                });

                navigate('/sign-in');

                return;
            }

            const isLoggedIn = await checkAuthUser();

            if (isLoggedIn) {
                form.reset();

                navigate('/home');
            } else {
                toast({ title: 'Login failed. Please try again.', variant: 'error' });
                return;
            }
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <div className="flex size-full flex-row overflow-hidden xl:h-5/6 xl:w-10/12 xl:rounded-2xl xl:shadow-lg">
            <div className="xl:flex-center auth-bg hidden bg-primary-500 text-white xl:h-full xl:w-1/2">
                <div className="flex-center w-10/12 flex-col text-center xl:w-8/12">
                    <h1 className="text-3xl font-extrabold text-light-1 lg:text-5xl">
                        Welcome Back!
                    </h1>
                    <div className="py-10">
                        <h2 className="py-1 text-xl font-thin text-light-1">
                            To keep connected with us please
                        </h2>

                        <h2 className="py-1 text-xl font-thin text-light-1">
                            login with your personal info
                        </h2>
                    </div>

                    <Link to="/sign-in" className="ml-2 text-lg font-semibold text-primary-500">
                        <Button className="shad-button_ghost my-4">Sign In</Button>
                    </Link>
                </div>
            </div>

            <div className="flex-center size-full bg-white text-white xl:w-1/2">
                <Form {...form}>
                    <div className="flex-center w-10/12 flex-col text-center xl:w-9/12">
                        <h1 className="text-3xl font-extrabold text-primary-500 lg:text-5xl">
                            Create Account
                        </h1>

                        <h2 className="p-6 text-lg text-dark-4">
                            {`We are excited to have you onboard!`}
                        </h2>

                        <form onSubmit={form.handleSubmit(handleSignup)} className="mt-4 w-full">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="shad-input"
                                                placeholder="Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="shad-input"
                                                placeholder="Username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                className="shad-input"
                                                placeholder="Email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="shad-input"
                                                placeholder="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="shad-button_primary my-4">
                                {isCreatingAccount || isSigningInUser || isUserLoading ? (
                                    <ReloadIcon className="mr-2 size-4 animate-spin" />
                                ) : (
                                    ''
                                )}
                                Sign Up
                            </Button>

                            <p className="p-5 text-center text-lg text-dark-2 xl:hidden">
                                Already a member?
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

export default SignupForm;
