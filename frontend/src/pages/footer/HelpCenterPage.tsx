import { FC } from "react";

const HelpCenterPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Help Center</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="space-y-8 text-gray-700">
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">How do I buy a ticket?</h2>
                <p>Simply browse for an event on our homepage or search page, select the event, choose your ticket type, and proceed to payment on NeoTickets. It’s that easy!</p>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Can I get a refund?</h2>
                <p>All ticket sales are considered final. Refunds are only issued if an event is canceled by the organizer. Please refer to our Customer Terms of Use for more details.</p>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">How do I find my tickets after purchase?</h2>
                <p>Your tickets will be available in the "My Tickets" section of your profile after a successful purchase. You will also receive a confirmation email with the ticket details.</p>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">How do I create my own event?</h2>
                <p>You can start creating your event by navigating to the "Create Event" page from the main menu. Our easy-to-use form will guide you through the process.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;