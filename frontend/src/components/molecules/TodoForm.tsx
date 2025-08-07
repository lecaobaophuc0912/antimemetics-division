import React from 'react';
import { Input } from '../atoms/Input';
import { Textarea } from '../atoms/Textarea';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import type { TodoRequestDto } from '@/declaration';

interface TodoFormProps {
    formData: TodoRequestDto;
    setFormData: (data: TodoRequestDto) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    title: string;
    submitText: string;
}

export const TodoForm: React.FC<TodoFormProps> = ({
    formData,
    setFormData,
    onSubmit,
    onCancel,
    title,
    submitText,
}) => {
    const priorityOptions = [
        { value: 'low', label: 'MINIMAL' },
        { value: 'medium', label: 'STANDARD' },
        { value: 'high', label: 'CRITICAL' }
    ];

    const statusOptions = [
        { value: 'pending', label: 'PENDING' },
        { value: 'in-progress', label: 'PROCESSING' },
        { value: 'completed', label: 'COMPLETED' }
    ];

    return (
        <div className="mb-8 glass border border-green-500/30 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-green-400 mb-4 neon-glow">{title}</h3>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter neural task identifier"
                        label="Task Identifier"
                        required
                    />
                    <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => {
                            const date = new Date(e.target.value);
                            if (date instanceof Date && !isNaN(date.getTime())) {
                                setFormData({ ...formData, dueDate: date.toISOString().split('T')[0] });
                            }
                        }}
                        label="Synchronization Date"
                        required
                    />
                </div>

                <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter neural task parameters"
                    label="Task Parameters"
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        options={priorityOptions}
                        label="Priority Level"
                    />
                    <Select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        options={statusOptions}
                        label="Processing Status"
                    />
                </div>

                <div className="flex space-x-4">
                    <Button type="submit" variant="success">
                        {submitText}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        TERMINATE
                    </Button>
                </div>
            </form>
        </div>
    );
}; 