import React from 'react';

export const OrganizerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-secondary flex">
      <aside className="w-64 bg-primary text-white p-6 space-y-4">
        <h2 className="text-xl font-semibold">Organizer Center</h2>
        <ul className="space-y-2">
          <li><a href="/my-events" className="hover:underline">My Events</a></li>
          <li><a href="/reports" className="hover:underline">Report Management</a></li>
        </ul>
      </aside>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
};
