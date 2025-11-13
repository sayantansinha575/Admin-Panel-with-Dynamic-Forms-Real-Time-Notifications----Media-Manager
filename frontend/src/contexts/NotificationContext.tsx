import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import { echo } from '../lib/echo';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

type Noti = { id: number; title: string; message: string; type?: string; created_at?: string; meta?: any; read_at?: string };

const NotificationContext = createContext<{ items: Noti[]; markRead: (id: number) => Promise<void> } | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<Noti[]>([]);
    const { token } = useAuth();

    useEffect(() => {
        if (!token) return;
        let mounted = true;
        api.get('/notifications').then(res => {
            if (!mounted) return;
            const data = res.data.data || res.data || [];
            setItems(Array.isArray(data) ? data : []);
        }).catch(() => { /* ignore for now */ });  

        // subscribe to public channel 'notifications'
        try {
            echo.subscribe('notifications').bind('App\\Events\\NotificationCreated', (payload: any) => {
                const noti = typeof payload === 'string' ? JSON.parse(payload) : payload;
                console.log('📢 Notification:', noti);

                setItems(prev => [noti, ...prev]);
                toast(`${noti.title}: ${noti.message}`);
            });
        } catch (e) {
            // if echo fails silently, console for dev
            // console.error('Echo subscribe', e);
        }

        return () => { mounted = false; try { echo.leaveChannel('notifications'); } catch (_) { } };
    }, [token]);

    const markRead = async (id: number) => {
        await api.post(`/notifications/mark-read/${id}`).catch(() => { });
        setItems(prev => prev.map(p => p.id === id ? { ...p, read_at: new Date().toISOString() } : p));
    };

    return <NotificationContext.Provider value={{ items, markRead }}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used in NotificationProvider');
    return ctx;
};
