import React, { useState, useEffect } from 'react';
import { Ticket } from '@/types/event';

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (ticket: Omit<Ticket, 'id'>) => void;
    // IMPROVEMENT: Added prop to receive existing tickets.
    existingTickets: Ticket[];
}

interface FormInputs {
    label: string;
    quantity: string;
    description?: string;
    price: string;
    currency: 'VND' | 'USD';
}

type FormErrors = {
    [K in keyof FormInputs]?: string;
};

const initialInputs: FormInputs = {
    label: 'GENERAL_ADMISSION',
    quantity: '100',
    description: '',
    price: '50000',
    currency: 'VND',
};

const FormField = ({ label, children, error }: {label: string, children: React.ReactNode, error?: string}) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
        {children}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
);

export const TicketModal = ({ isOpen, onClose, onSave, existingTickets }: TicketModalProps) => {
    const [inputs, setInputs] = useState<FormInputs>(initialInputs);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (isOpen) {
            setInputs(initialInputs);
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        const quantity = Number(inputs.quantity);
        const price = Number(inputs.price);
        const trimmedLabel = inputs.label.trim();

        if (!trimmedLabel) {
            newErrors.label = "Ticket label is required.";
        } 
        // IMPROVEMENT: Added validation for unique ticket labels.
        else if (existingTickets.some(ticket => ticket.label.toLowerCase() === trimmedLabel.toLowerCase())) {
            newErrors.label = "This ticket label already exists.";
        }

        if (isNaN(quantity) || quantity <= 0) {
            newErrors.quantity = "Quantity must be a positive number.";
        }
        if (quantity > 10000) {
            newErrors.quantity = "Quantity cannot exceed 10,000.";
        }
        if (isNaN(price) || price < 0) {
            newErrors.price = "Price must be a valid non-negative number.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        const isValid = validate();
        if (isValid) {
            const finalTicketData: Omit<Ticket, 'id'> = {
                label: inputs.label.trim(),
                quantity: Number(inputs.quantity),
                price: Number(inputs.price),
                description: inputs.description,
                currency: inputs.currency
            };
            onSave(finalTicketData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all" onClick={e => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Add Ticket Class</h3>

                    <FormField label="Label" error={errors.label}>
                        <input type="text" name="label" value={inputs.label} onChange={handleChange} className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.label ? 'border-red-500' : ''}`}/>
                    </FormField>

                    <FormField label="Quantity" error={errors.quantity}>
                        <input type="text" name="quantity" value={inputs.quantity} onChange={handleChange} inputMode="numeric" pattern="[0-9]*" placeholder="e.g., 100" className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.quantity ? 'border-red-500' : ''}`}/>
                    </FormField>

                    <FormField label="Description (Optional)" error={errors.description}>
                        <textarea name="description" value={inputs.description} onChange={handleChange} rows={3} placeholder="e.g., Early bird special, includes a free drink." className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
                    </FormField>

                    <div className="flex items-start gap-4">
                        <div className="flex-grow">
                            <FormField label="Price" error={errors.price}>
                                <input type="text" name="price" value={inputs.price} onChange={handleChange} inputMode="decimal" pattern="[0-9.]*" placeholder="e.g., 50000" className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.price ? 'border-red-500' : ''}`}/>
                            </FormField>
                        </div>
                        <div className="flex-shrink-0">
                            <FormField label="Currency" error={errors.currency}>
                                <select name="currency" value={inputs.currency} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                                    <option value="VND">VND</option>
                                    <option value="USD">USD</option>
                                </select>
                            </FormField>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button className="w-full mt-2 bg-primary text-white py-2.5 rounded-md hover:bg-primary-dark font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" onClick={handleSave}>
                            Save Ticket Class
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
