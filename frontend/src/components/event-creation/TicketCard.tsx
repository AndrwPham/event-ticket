import React, { useState } from 'react';
import { Ticket } from '@/types/event';

interface TicketCardProps {
    ticket: Ticket;
    onDelete: (ticketId: string) => void;
}

// A helper for formatting currency
const formatCurrency = (price: number, currency: 'VND' | 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
};

export const TicketCard = ({ ticket, onDelete }: TicketCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // IMPROVEMENT: A ticket can only be expanded if its description is not empty.
    const canExpand = ticket.description && ticket.description.trim() !== '';

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300">
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Main Ticket Info */}
                <div className="flex-grow space-y-1">
                    <p className="font-bold text-lg text-primary">{ticket.label}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                            <strong className="font-medium">Price:</strong> {ticket.price > 0 ? formatCurrency(ticket.price, ticket.currency) : 'Free'}
                        </span>
                        <span>
                            <strong className="font-medium">Quantity:</strong> {ticket.quantity.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                    {/* IMPROVEMENT: The expand button is now only rendered if `canExpand` is true. */}
                    {canExpand && (
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)} 
                            className="p-1.5 text-gray-500 hover:text-primary transition-colors"
                            aria-label={isExpanded ? "Hide description" : "Show description"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    )}
                    <button 
                        onClick={() => onDelete(ticket.id)} 
                        className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                        aria-label={`Delete ${ticket.label} ticket`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Expandable Description Area */}
            {/* IMPROVEMENT: This whole block is now conditional on `canExpand`. */}
            {canExpand && (
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-40' : 'max-h-0'}`}>
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-700">
                            {/* IMPROVEMENT: Added the semi-bold label before the description text. */}
                            <span className="font-semibold">Description: </span>
                            {ticket.description}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
