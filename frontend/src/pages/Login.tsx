import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { echo } from '../lib/echo';
import { useAuth } from './../contexts/AuthContext';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            const token = res.data.token || res.data.access_token || res.data.data?.token;
            if (!token) throw new Error('No token returned');
            localStorage.setItem('token', token);
            // update Echo auth header dynamically (if echo already initialized)
            try {
                if ((echo as any).options && (echo as any).options.auth) {
                    (echo as any).options.auth.headers = { Authorization: `Bearer ${token}` };
                } else if ((echo as any).connector && (echo as any).connector.options) {
                    (echo as any).connector.options.auth = { headers: { Authorization: `Bearer ${token}` } };
                }
            } catch (_) { }
            toast.success('Logged in');
            login(token);
            navigate('/');
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || 'Login failed';
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
                <label className="block mb-2">Email
                    <input className="w-full border p-2 mt-1" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <label className="block mb-4">Password
                    <input type="password" className="w-full border p-2 mt-1" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">Login</button>
            </form>
        </div>
    );
}
