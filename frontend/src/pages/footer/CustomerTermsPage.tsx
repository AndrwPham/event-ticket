import { FC } from "react";

const CustomerTermsPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Customer Terms of Use</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="space-y-6 text-gray-700">
            <p>Last updated: June 24, 2025</p>
            <p>Please read these Terms of Use carefully before using the NeoTickets service.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">1. Introduction</h2>
            <p>Welcome to NeoTickets. By purchasing a ticket or registering on our site, you agree to be bound by these terms.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">2. Account Registration</h2>
            <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account and password.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">3. Ticket Purchase & Payment</h2>
            <p>All ticket sales are final. Prices are listed in Vietnamese Dong (VND) unless otherwise specified. We accept payments through our designated payment gateways. You agree to pay all charges incurred by you or any users of your account.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">4. Event Conduct</h2>
            <p>You agree to abide by the rules and policies of the venue and event organizer. Failure to do so may result in your ejection from the event without a refund.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerTermsPage;