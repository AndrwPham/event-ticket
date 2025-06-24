import React, { useState } from 'react';
import { EventFormData, Ticket } from '@/types/event';
import { TicketModal } from './TicketModal';
// IMPROVEMENT: Import the new TicketCard component
import { TicketCard } from './TicketCard';

interface Step2Props {
    formData: EventFormData;
    updateFormData: <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => void;
}

export const Step2TimeAndTickets = ({ formData, updateFormData }: Step2Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormData('time', { ...formData.time, [e.target.name]: e.target.value });
    };

    const handleAddTicket = (newTicket: Omit<Ticket, 'id'>) => {
        const ticketWithId = { ...newTicket, id: crypto.randomUUID() };
        updateFormData('tickets', [...formData.tickets, ticketWithId]);
    };

    const handleDeleteTicket = (ticketId: string) => {
        updateFormData('tickets', formData.tickets.filter(t => t.id !== ticketId));
    };

    return (
        <div className="space-y-8">
            <section>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Event Date and Time</h3>
                <div className="grid md:grid-cols-2 gap-6 p-6 bg-white rounded-lg shadow-sm border">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="start" className="text-sm font-medium text-gray-600">Start Time</label>
                        <input id="start" name="start" type="datetime-local" value={formData.time.start} onChange={handleTimeChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="end" className="text-sm font-medium text-gray-600">End Time</label>
                        <input id="end" name="end" type="datetime-local" value={formData.time.end} onChange={handleTimeChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"/>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Ticket Classes</h3>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-sm text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-md transition-colors">
                        <span className="text-xl leading-none">＋</span> Add Ticket Class
                    </button>
                </div>
                <div className="space-y-4">
                    {/* IMPROVEMENT: Replaced the old list with the new TicketCard component */}
                    {formData.tickets.length > 0 ? (
                        formData.tickets.map(ticket => (
                            <TicketCard 
                                key={ticket.id}
                                ticket={ticket}
                                onDelete={handleDeleteTicket}
                            />
                        ))
                    ) : (
                            <div className="text-center text-gray-500 py-10 bg-gray-50 border-2 border-dashed rounded-lg">
                                <p>No ticket classes added yet.</p>
                                <p className="text-sm">Click 'Add Ticket Class' to create your first one.</p>
                            </div>
                        )}
                </div>
            </section>

            <TicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddTicket}
                // IMPROVEMENT: Pass existing tickets to the modal for uniqueness validation.
                existingTickets={formData.tickets}
            />
        </div>
    );
};
