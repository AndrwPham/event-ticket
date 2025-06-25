import { FC } from "react";

const HowItWorksPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">How NeoTickets Works</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="space-y-10 text-gray-700">
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">For Attendees</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">1. Discover Events</h3>
                        <p>Use our powerful search and filtering tools to discover a wide range of events—from concerts and festivals to workshops and conferences.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">2. Purchase Tickets Securely</h3>
                        <p>Choose your event, select your preferred seats or ticket types, and complete your purchase through our secure payment gateway.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">3. Access & Enjoy</h3>
                        <p>Find your tickets anytime in the "My Tickets" section of your account. Simply present the ticket at the event and enjoy the experience!</p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">For Organizers</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">1. Create Your Event</h3>
                        <p>Sign up as an organizer and use our intuitive event creation form to list your event in minutes. Add details, images, and set up your ticket types.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">2. Sell Tickets & Promote</h3>
                        <p>Publish your event to reach a large audience on NeoTickets. Manage your ticket sales, monitor real-time data, and use our tools to promote your event.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">3. Manage and Get Paid</h3>
                        <p>Easily manage attendees and check them in on event day. After your successful event, receive a secure and timely payout directly to your bank account.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;