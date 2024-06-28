import { Routes, Route } from 'react-router-dom';
import { Landing } from './_root/pages';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import { AuthLayout } from './_auth/AuthLayout';
import { Toaster } from './components/ui/toaster';
import PasswordRecoveryForm from './_auth/forms/PasswordRecoveryForm';
import ResetPasswordForm from './_auth/forms/ResetPasswordForm';
import Verification from './_root/pages/Verification';
import AppLayout from './_app/AppLayout';
import { RootLayout } from './_root/RootLayout';
import { Home } from './_app/pages';

function App() {
    return (
        <main className="flex min-h-screen">
            <Routes>
                {/* Auth routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/sign-in" element={<SigninForm />}></Route>
                    <Route path="/sign-up" element={<SignupForm />}></Route>
                    <Route path="/password-recovery" element={<PasswordRecoveryForm />}></Route>
                    <Route path="/reset-password" element={<ResetPasswordForm />}></Route>
                </Route>

                {/* private routes */}
                <Route element={<AppLayout />}>
                    <Route path="/home" element={<Home />}></Route>
                </Route>

                {/* public routes */}
                <Route element={<RootLayout />}>
                    <Route index element={<Landing />}></Route>
                    <Route path="/verification" element={<Verification />}></Route>
                </Route>
            </Routes>
            <Toaster />
        </main>
    );
}

export default App;
