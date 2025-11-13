import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import NotificationPanel from '../components/NotificationPanel';



export default function DefaultLayout() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        // If your echo uses token on init, you might want to disconnect or update headers:
        navigate('/login');
    };





    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
            {/* Mobile top bar */}
            <header className="md:hidden flex justify-between items-center bg-white p-4 border-b">
                <h2 className="text-lg font-bold">Admin</h2>
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 rounded border md:hidden"
                >
                    ☰
                </button>
            </header>

            {/* Sidebar */}
            <aside
                className={`${open ? "block" : "hidden"
                    } md:block w-64 bg-white p-4 border-r md:min-h-screen absolute md:static top-16 left-0 z-50`}
            >
                <h2 className="text-lg font-bold mb-4 hidden md:block">Admin</h2>
                <nav className="space-y-2">
                    <Link className="block p-2 rounded hover:bg-slate-100" to="/">Dashboard</Link>
                    <Link className="block p-2 rounded hover:bg-slate-100" to="/builder">Form Builder</Link>
                    <Link className="block p-2 rounded hover:bg-slate-100" to="/media">Media Manager</Link>
                </nav>
                <div className="mt-6">
                    <button
                        onClick={logout}
                        className="w-full bg-red-500 text-white py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 mt-16 md:mt-0">
                <div className="flex justify-end mb-4">
                    <NotificationPanel />
                </div>
                <div className="bg-white p-4 rounded shadow overflow-x-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
