import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import robotImage from "../../assets/images/robot.jpg";

import TicketCard from "../../components/TicketCard";
import { myTickets } from "../../data/my_tickets_db";

const Ticket = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeSubTab, setActiveSubTab] = useState("Upcoming");

  // Enhanced filtering logic for both sets of tabs
  const displayedTickets = useMemo(() => {
    const now = new Date();

    // 1. Filter by "Upcoming" or "Past" first
    const temporalFilteredTickets = myTickets.filter((ticket) => {
      const ticketDate = new Date(ticket.date);
      if (activeSubTab === "Upcoming") {
        return ticketDate >= now;
      } else {
        // "Past"
        return ticketDate < now;
      }
    });

    // 2. Then, filter by status if "All" is not selected
    if (activeTab === "All") {
      return temporalFilteredTickets;
    }

    return temporalFilteredTickets.filter(
      (ticket) => ticket.status === activeTab
    );
  }, [activeTab, activeSubTab]);

  const renderContent = () => {
    if (displayedTickets.length === 0) {
      return (
        <div className="text-center py-10">
          <img
            src={robotImage}
            alt="No tickets found"
            className="mx-auto mb-6 h-48 w-48 rounded-full object-cover"
          />
          <p className="text-gray-500 mb-6">
            No tickets match the selected filters.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6 pt-6">
        {displayedTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-500">Account of</h3>
                <p className="font-bold text-lg">Nguyen Van A</p>
              </div>
              <nav className="space-y-2 text-gray-600">
                <h4 className="font-bold text-black px-4 pt-2">
                  Account Settings
                </h4>
                <div className="pl-4">
                  <Link
                    to="/profile"
                    className="block py-2 px-4 rounded-md hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/ticket"
                    className="block py-2 px-4 rounded-md bg-gray-100 font-bold text-black"
                  >
                    My Tickets
                  </Link>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-12 lg:col-span-9">
            <h1 className="text-3xl font-bold mb-6">My Tickets</h1>

            {/* Centered Main filter tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {["All", "Finished", "Pending", "Cancelled"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-32 py-2 rounded-full text-sm font-semibold transition-colors flex items-center justify-center ${
                      activeTab === tab
                        ? "bg-[#1A0B49] text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Centered Upcoming/Past sub-tabs */}
            <div className="flex justify-center border-b">
              <div className="flex">
                {["Upcoming", "Past"].map((subTab) => (
                  <button
                    key={subTab}
                    onClick={() => setActiveSubTab(subTab)}
                    className={`px-12 py-3 text-sm font-medium transition-colors ${
                      activeSubTab === subTab
                        ? "border-b-2 border-[#1A0B49] text-[#1A0B49]"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {subTab}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div>{renderContent()}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Ticket;