import { FC } from "react";

const TermsPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Terms of Service</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="space-y-6 text-gray-700">
            <p>Last updated: June 24, 2025</p>
            <p>This page outlines the general terms and conditions for using the NeoTickets website and services. These apply to all users, including customers and organizers.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">1. Acceptance of Terms</h2>
            <p>By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">2. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of NeoTickets and its licensors. Our trademarks may not be used in connection with any product or service without the prior written consent of NeoTickets.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">3. Limitation of Liability</h2>
            <p>In no event shall NeoTickets, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">4. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of Vietnam, without regard to its conflict of law provisions.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;