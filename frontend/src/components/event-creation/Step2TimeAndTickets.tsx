import React, { useState, useMemo } from 'react'; // FIX: Imported useMemo
import { EventFormData, SeatMapConfig, Ticket, ProvidedVenue } from '@/types/event'; // FIX: Imported ProvidedVenue
import { TicketModal } from './TicketModal';
import { TicketCard } from './TicketCard';
// FIX: Changed component name to match the file we are using
import { SeatMapEditor } from './SeatMapEditor'; 
import { allVenues } from '@/data/_mock_venues';

interface Step2Props {
    formData: EventFormData;
    updateFormData: <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => void;
}

export const Step2TimeAndTickets = ({ formData, updateFormData }: Step2Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormData('time', { ...formData.time, [e.target.name]: e.target.value });
    };

    const handleSeatMapConfigChange = (config: SeatMapConfig) => {
        updateFormData('seatMapConfig', config);
        if (formData.tickets.length > 0) {
            updateFormData('tickets', []);
        }
    };

    const selectedVenueData = useMemo(() => {
        // FIX: Compare strings to strings to prevent type mismatches
        return allVenues.find(v => String(v.id) === formData.providedVenueId) as ProvidedVenue | undefined;
    }, [formData.providedVenueId]);

    const showSeatMapEditor = formData.eventType === 'onsite' && formData.venueType === 'provided' && !!selectedVenueData;

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

            {/* Conditionally render Seat Map or standard Ticket Classes */}
            {/* FIX: Added a check to ensure selectedVenueData exists before trying to render the editor */}
            {showSeatMapEditor && selectedVenueData ? (
                <SeatMapEditor
                    venueLayout={selectedVenueData.layout}
                    initialConfig={formData.seatMapConfig || selectedVenueData.defaultSeatConfig}
                    onChange={handleSeatMapConfigChange}
                />
            ) : (
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Ticket Classes</h3>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-sm text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-md transition-colors">
                            <span className="text-xl leading-none">＋</span> Add Ticket Class
                        </button>
                    </div>
                    <div className="space-y-4">
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
            )}

            {!showSeatMapEditor && (
                <TicketModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddTicket}
                    existingTickets={formData.tickets}
                />
            )}
        </div>
    );
};
