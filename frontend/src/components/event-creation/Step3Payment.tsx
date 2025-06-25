import React from 'react';
import { EventFormData } from '@/types/event';

interface Step3Props {
    formData: EventFormData;
    setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
}

export const Step3Payment = ({ formData, setFormData }: Step3Props) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            payment: { ...prev.payment, [name]: value },
        }));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Payment Information</h2>
                <p className="text-gray-500 mt-1">
                    This is where the ticket revenue will be sent.
                </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <label htmlFor="accountOwner" className="md:col-span-1 text-sm font-medium text-gray-700 md:text-right">Account Owner</label>
                    <input id="accountOwner" name="accountOwner" value={formData.payment.accountOwner} onChange={handleChange} className="md:col-span-3 border-gray-300 rounded-md shadow-sm" type="text" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <label htmlFor="accountNumber" className="md:col-span-1 text-sm font-medium text-gray-700 md:text-right">Account Number</label>
                    <input id="accountNumber" name="accountNumber" value={formData.payment.accountNumber} onChange={handleChange} className="md:col-span-3 border-gray-300 rounded-md shadow-sm" type="text" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <label htmlFor="bank" className="md:col-span-1 text-sm font-medium text-gray-700 md:text-right">Bank Name</label>
                    <input id="bank" name="bank" value={formData.payment.bank} onChange={handleChange} className="md:col-span-3 border-gray-300 rounded-md shadow-sm" type="text" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <label htmlFor="branch" className="md:col-span-1 text-sm font-medium text-gray-700 md:text-right">Bank Branch (Optional)</label>
                    <input id="branch" name="branch" value={formData.payment.branch} onChange={handleChange} className="md:col-span-3 border-gray-300 rounded-md shadow-sm" type="text" />
                </div>
            </div>
        </div>
    );
};
