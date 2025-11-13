import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

export default function NotificationPanel() {
    const { items, markRead } = useNotifications();
  

    return (
        <div className="w-96 bg-white border rounded shadow p-3">
            <h4 className="font-bold mb-2">Notifications</h4>
            <div className="max-h-64 overflow-auto space-y-2">
                {items.length === 0 && <div className="text-sm text-gray-500">No notifications</div>}
                {items.map(n => (
                    <div key={n.id} className={`p-2 border rounded ${n.read_at ? 'bg-gray-50' : 'bg-white'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-semibold text-sm">{n.title}</div>
                                <div className="text-xs text-gray-600">{n.message}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-400">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</div>
                                {!n.read_at && <button onClick={() => markRead(n.id)} className="text-blue-600 text-xs mt-1">Mark</button>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
