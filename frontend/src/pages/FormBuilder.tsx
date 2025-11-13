import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import api from '../lib/api';
import toast from 'react-hot-toast';

type Field = {
    id: string;
    type: 'text' | 'number' | 'date' | 'email' | 'dropdown' | 'checkbox';
    label: string;
    options?: string[];
    order?: number;
    placeholder?: string;
};

const initial: Field[] = [];

export default function FormBuilder() {
    const [fields, setFields] = useState<Field[]>(initial);
    const [name, setName] = useState('');

    function addField(type: Field['type']) {
        setFields(prev => [...prev, { id: uuidv4(), type, label: `${type} field`, options: type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined }]);
    }

    function onDragEnd(result: any) {
        if (!result.destination) return;
        const list = Array.from(fields);
        const [m] = list.splice(result.source.index, 1);
        list.splice(result.destination.index, 0, m);
        setFields(list.map((f, i) => ({ ...f, order: i })));
    }

    async function save() {
        try {
            const payload = { name, structure: JSON.stringify(fields), fields: fields.map(f => ({ type: f.type, label: f.label, options: f.options ?? [], order: f.order ?? 0 })) };
            await api.post('/forms', payload);
            toast.success('Form saved — server will broadcast a notification');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Save failed');
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sidebar: Add Fields */}
            <div className="bg-white p-4 rounded shadow md:col-span-1">
                <h3 className="font-bold mb-2">Add fields</h3>
                <div className="space-y-2">
                    <button onClick={() => addField('text')} className="w-full p-2 border rounded">Text</button>
                    <button onClick={() => addField('number')} className="w-full p-2 border rounded">Number</button>
                    <button onClick={() => addField('email')} className="w-full p-2 border rounded">Email</button>
                    <button onClick={() => addField('dropdown')} className="w-full p-2 border rounded">Dropdown</button>
                    <button onClick={() => addField('checkbox')} className="w-full p-2 border rounded">Checkbox</button>
                    <button onClick={() => addField('date')} className="w-full p-2 border rounded">Date</button>
                </div>
            </div>

            {/* Canvas Builder */}
            <div className="bg-white p-4 rounded shadow md:col-span-1">
                <h3 className="font-bold mb-2">Canvas</h3>
                <input
                    className="w-full border p-2 mb-3 rounded"
                    placeholder="Form name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="canvas">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                                {fields.map((f, i) => (
                                    <Draggable key={f.id} draggableId={f.id} index={i}>
                                        {(p) => (
                                            <div
                                                ref={p.innerRef}
                                                {...p.draggableProps}
                                                {...p.dragHandleProps}
                                                className="p-3 border rounded space-y-2 bg-gray-50"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <strong className="text-gray-700">{f.type}</strong>
                                                    <button
                                                        onClick={() =>
                                                            setFields(fields.filter((x) => x.id !== f.id))
                                                        }
                                                        className="text-red-500 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>

                                                {/* Editable Label */}
                                                <input
                                                    className="w-full border p-1 rounded"
                                                    value={f.label || ""}
                                                    onChange={(e) => {
                                                        const updated = [...fields];
                                                        updated[i].label = e.target.value;
                                                        setFields(updated);
                                                    }}
                                                    placeholder="Label (e.g. Name)"
                                                />

                                                {/* Editable Placeholder */}
                                                {["text", "number", "date"].includes(f.type) && (
                                                    <input
                                                        className="w-full border p-1 rounded"
                                                        value={f.placeholder || ""}
                                                        onChange={(e) => {
                                                            const updated = [...fields];
                                                            updated[i].placeholder = e.target.value;
                                                            setFields(updated);
                                                        }}
                                                        placeholder="Placeholder (optional)"
                                                    />
                                                )}

                                                {/* Dropdown options */}
                                                {f.type === "dropdown" && (
                                                    <div>
                                                        <label className="text-sm text-gray-600 mb-1 block">
                                                            Options
                                                        </label>
                                                        {(f.options || []).map((opt, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center mb-1"
                                                            >
                                                                <input
                                                                    className="flex-1 border p-1 rounded"
                                                                    value={opt}
                                                                    onChange={(e) => {
                                                                        const updated = [...fields];
                                                                        if (!updated[i].options)
                                                                            updated[i].options = [];
                                                                        updated[i].options[idx] =
                                                                            e.target.value;
                                                                        setFields(updated);
                                                                    }}
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        const updated = [...fields];
                                                                        if (updated[i].options)
                                                                            updated[i].options =
                                                                                updated[i].options.filter(
                                                                                    (_, j) => j !== idx
                                                                                );
                                                                        setFields(updated);
                                                                    }}
                                                                    className="ml-2 text-red-500"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => {
                                                                const updated = [...fields];
                                                                updated[i].options = [
                                                                    ...(f.options || []),
                                                                    "New Option",
                                                                ];
                                                                setFields(updated);
                                                            }}
                                                            className="text-sm text-blue-500 mt-1"
                                                        >
                                                            + Add option
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Checkbox options */}
                                                {f.type === "checkbox" && (
                                                    <div>
                                                        <label className="text-sm text-gray-600 mb-1 block">
                                                            Checkbox Options
                                                        </label>
                                                        {(f.options || []).map((opt, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center mb-1"
                                                            >
                                                                <input
                                                                    className="flex-1 border p-1 rounded"
                                                                    value={opt}
                                                                    onChange={(e) => {
                                                                        const updated = [...fields];
                                                                        if (!updated[i].options)
                                                                            updated[i].options = [];
                                                                        updated[i].options[idx] =
                                                                            e.target.value;
                                                                        setFields(updated);
                                                                    }}
                                                                    placeholder={`Option ${idx + 1}`}
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        const updated = [...fields];
                                                                        if (updated[i].options)
                                                                            updated[i].options =
                                                                                updated[i].options.filter(
                                                                                    (_, j) => j !== idx
                                                                                );
                                                                        setFields(updated);
                                                                    }}
                                                                    className="ml-2 text-red-500"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                const updated = [...fields];
                                                                updated[i].options = [
                                                                    ...(f.options || []),
                                                                    "New Checkbox",
                                                                ];
                                                                setFields(updated);
                                                            }}
                                                            className="text-sm text-blue-500 mt-1"
                                                        >
                                                            + Add checkbox
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <div className="mt-4">
                    <button
                        onClick={save}
                        className="bg-green-600 text-white px-4 py-2 rounded w-full md:w-auto"
                    >
                        Save Form
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white p-4 rounded shadow md:col-span-1">
                <h3 className="font-bold mb-2">Preview</h3>
                <form className="space-y-3">
                    {fields.map((f) => (
                        <div key={f.id}>
                            <label className="block text-sm mb-1">{f.label}</label>
                            {f.type === "text" && (
                                <input
                                    className="w-full border p-2 rounded"
                                    placeholder={f.placeholder || ""}
                                />
                            )}
                            {f.type === "number" && (
                                <input type="number" className="w-full border p-2 rounded" />
                            )}
                            {f.type === "email" && (
                                <input type="email" className="w-full border p-2 rounded" />
                            )}
                            {f.type === "date" && (
                                <input type="date" className="w-full border p-2 rounded" />
                            )}
                            {f.type === "dropdown" && (
                                <select className="w-full border p-2 rounded">
                                    {(f.options || []).map((opt) => (
                                        <option key={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}
                            {f.type === "checkbox" && (
                                <div className="space-y-1">
                                    {(f.options || []).map((opt, idx) => (
                                        <label key={idx} className="flex items-center space-x-2">
                                            <input type="checkbox" className="border" />
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </form>
            </div>
        </div>

    );
}
