import { FC } from "react";

const PressPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Press</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="space-y-6 text-gray-700">
            <p className="text-lg">For all media and press inquiries about NeoTickets, please contact our communications team. We are available to provide information about our company, our dual-purpose platform for ticket buyers and event creators, and our impact on the events industry.</p>
            
            <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="font-bold text-gray-800">Media Contact:</h3>
                <p>Email: <a href="mailto:press@neotickets.com" className="text-indigo-600 hover:underline">press@neotickets.com</a></p>
                <p>Phone: +84 123 456 789</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">Recent News</h2>
            <div className="border-t pt-4">
                <h3 className="font-semibold text-lg">NeoTickets Empowers Local Creators with New Event Management Suite</h3>
                <p className="text-sm text-gray-500">June 24, 2025</p>
                <p className="mt-2">NeoTickets, the all-in-one platform for discovering and creating events, today announced the launch of its new Organizer Dashboard, providing powerful, easy-to-use tools for event creators to manage their events from start to finish...</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PressPage;