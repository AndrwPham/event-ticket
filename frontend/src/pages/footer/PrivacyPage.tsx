import { FC } from "react";

const PrivacyPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Privacy Policy</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="space-y-6 text-gray-700">
            <p>Last updated: June 24, 2025</p>
            <p>Your privacy is important to us at NeoTickets. This Privacy Policy explains how we collect, use, and protect your information.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, purchase tickets, or contact us. This may include your name, email, phone number, and payment information.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">2. How We Use Your Information</h2>
            <p>We use your information to process transactions, provide customer support, send you marketing communications (which you can opt out of), and improve our services.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">3. Data Sharing</h2>
            <p>We may share your information with event organizers for the events you purchase tickets for. We do not sell your personal information to third parties.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">4. Data Security</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information. All payment transactions are processed through a secure gateway provider and are not stored on our servers.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;