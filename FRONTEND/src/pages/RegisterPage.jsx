import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function RegisterPage({ onRegister, onGoToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        try {
            setLoading(true);

            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: {
                        full_name: name.trim(),
                    },
                },
            });

            if (error) {
                setError(error.message || 'Registration failed.');
                return;
            }

            if (data.user) {
                setSuccess(
                    'Account created successfully! Please check your email if confirmation is required.'
                );

                if (onRegister) {
                    onRegister(data.user);
                }
            }
        } catch (error) {
            console.error('Register Error:', error);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[linear-gradient(135deg,#f7fff9_0%,#eefbf3_100%)] flex items-center justify-center px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-md rounded-[28px] border border-emerald-100 bg-white p-7 shadow-[0_25px_80px_-24px_rgba(22,101,52,0.35)]"
            >
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <User size={24} />
                    </div>

                    <h1 className="mt-5 text-3xl font-black text-slate-900">
                        Create account
                    </h1>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                        Create your KRISHQ account and start exploring plants and products.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <User size={16} />
                            Full name
                        </span>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                            placeholder="Aditya Pandey"
                            disabled={loading}
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Mail size={16} />
                            Email address
                        </span>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                            placeholder="you@example.com"
                            disabled={loading}
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Lock size={16} />
                            Password
                        </span>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                            placeholder="Minimum 6 characters"
                            disabled={loading}
                        />
                    </label>

                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                        {!loading && <ArrowRight size={16} />}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                        Already have an account?
                    </p>

                    <button
                        type="button"
                        onClick={onGoToLogin}
                        className="mt-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                        Sign in
                    </button>
                </div>
            </motion.div>
        </div>
    );
}