import { FC } from "react";

const OrganizerTermsPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Organizer Terms of Use</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="space-y-6 text-gray-700">
            <p>Last updated: June 24, 2025</p>
            <p>These terms govern your use of NeoTickets to create and manage events.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">1. Listing Events</h2>
            <p>As an organizer, you agree to provide accurate and complete information about your event. You are responsible for the content you post and for complying with all applicable laws.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">2. Fees and Payouts</h2>
            <p>We charge a service fee on each ticket sold through our platform. Payouts will be transferred to your designated bank account after the event has concluded, according to the schedule outlined in your organizer dashboard.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">3. Event Cancellation</h2>
            <p>If you cancel an event, you are responsible for providing refunds to all ticket holders. We will facilitate this process through our platform, and you will be responsible for any associated fees.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">4. Organizer Responsibilities</h2>
            <p>You are solely responsible for hosting and managing your event, including venue management, safety, and ensuring the event is delivered as described.</p>
        </div>
      </div>
    </div>
  );
};

export default OrganizerTermsPage;