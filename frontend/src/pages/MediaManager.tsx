import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function MediaManager() {
    const [files, setFiles] = useState<any[]>([]);

    useEffect(() => {
        api.get('/media').then(res => setFiles(res.data.data)).catch(() => { });
    }, []);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        for (const f of acceptedFiles) {
            const fd = new FormData();
            fd.append('file', f);
            try {
                const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                setFiles(prev => [res.data, ...(prev||[])]);
                toast.success('Uploaded');
            } catch (err: any) {
                toast.error(err?.response?.data?.message || 'Upload failed');
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxSize: 10 * 1024 * 1024 });

    const remove = async (id: number) => {
        await api.delete(`/media/${id}`).catch(() => { });
        setFiles(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="p-2 sm:p-4">
            {/* Upload Box */}
            <div
                {...getRootProps()}
                className="border-dashed border-2 p-4 sm:p-6 rounded text-center mb-4 cursor-pointer transition hover:bg-slate-50"
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-sm sm:text-base">Drop files here...</p>
                ) : (
                    <p className="text-sm sm:text-base">
                        Drag & drop files here, or click to select
                    </p>
                )}
            </div>

            {/* File Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {Array.isArray(files) && files.length > 0 ? (
                    files.map((f) => (
                        <div
                            key={f.id}
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                        >
                            {f.mime?.startsWith("image") ? (
                                <img
                                    src={f.url}
                                    alt={f.original_name}
                                    className="h-28 sm:h-32 w-full object-cover"
                                />
                            ) : (
                                <div className="h-28 sm:h-32 flex items-center justify-center bg-gray-100 text-xs text-gray-700 p-2 text-center break-words">
                                    {f.original_name}
                                </div>
                            )}
                            <div className="flex justify-between items-center px-2 py-1 sm:px-3 sm:py-2 text-[11px] sm:text-xs bg-white border-t">
                                <div>{(f.size / 1024).toFixed(1)}KB</div>
                                <button
                                    className="text-red-600 hover:text-red-800 font-medium"
                                    onClick={() => remove(f.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-center py-8 border rounded col-span-full">
                        📁 No files found
                    </div>
                )}
            </div>
        </div>

    );
}
