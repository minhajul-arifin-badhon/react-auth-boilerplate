import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SigninValidation } from '@/lib/validation';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthContext';
import { useSignInAccount } from '@/lib/react-query/queries';

const SigninForm = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

    // Query
    const { mutateAsync: signInAccount, isPending } = useSignInAccount();

    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
        const session = await signInAccount(user);

        if (!session) {
            toast({ title: 'Login failed. Please try again.', variant: 'error' });
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
                            Sign In
                        </h1>

                        <h2 className="p-6 text-lg text-dark-4">
                            {`Welcome back, you've been missed!`}
                        </h2>

                        <form onSubmit={form.handleSubmit(handleSignin)} className="mt-4 w-full">
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
                                                placeholder="Password"
                                                className="shad-input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <p className="p-5 text-center text-lg text-dark-2">
                                <Link
                                    to="/password-recovery"
                                    className="text-base text-dark-4 hover:text-primary-500"
                                >
                                    Forgot your Password?
                                </Link>
                            </p>

                            <Button type="submit" className="shad-button_primary my-4">
                                {isPending || isUserLoading ? (
                                    <ReloadIcon className="mr-2 size-4 animate-spin" />
                                ) : (
                                    ''
                                )}
                                Sign in
                            </Button>

                            <p className="p-5 text-center text-lg text-dark-2 xl:hidden">
                                Not a member yet?
                                <Link
                                    to="/sign-up"
                                    className="ml-2 text-lg font-semibold text-primary-500"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </form>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default SigninForm;
