import React from 'react';
import { Input } from '../atoms/Input';
import { Textarea } from '../atoms/Textarea';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { TodoRequestDto } from '../../services/api';

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
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
    ];

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
    ];

    return (
        <div className="mb-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter todo title"
                        label="Title"
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
                        label="Due Date"
                        required
                    />
                </div>

                <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter todo description"
                    label="Description"
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        options={priorityOptions}
                        label="Priority"
                    />
                    <Select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        options={statusOptions}
                        label="Status"
                    />
                </div>

                <div className="flex space-x-4">
                    <Button type="submit" variant="success">
                        {submitText}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}; 