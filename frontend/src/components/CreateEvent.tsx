// src/pages/CreateEvent.tsx
import React from 'react';

export default function CreateEvent() {
  return (
    <div className="min-h-screen bg-white text-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1D0E3C] text-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">Organizer Center</h2>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:underline">My Events</a></li>
          <li><a href="#" className="hover:underline">Report Management</a></li>
        </ul>
      </aside>

      

      {/* Main Form */}
      <main className="flex-1 p-10">
        {/* Top Stepper Bar */}
        <div className="bg-white border-b py-4 px-6 flex items-center justify-between">
        {/* Stepper shifted slightly right */}
        <div className="flex space-x-12 ml-10">
            {/* Step 1 */}
            <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-[#1D0E3C] text-white text-sm flex items-center justify-center">1</div>
            <span className="font-medium text-[#1D0E3C] border-b-2 border-[#1D0E3C] pb-0.5">Event information</span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-6 h-6 rounded-full border border-gray-400 text-sm flex items-center justify-center">2</div>
            <span className="text-sm">Show time & Ticket</span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-6 h-6 rounded-full border border-gray-400 text-sm flex items-center justify-center">3</div>
            <span className="text-sm">Payment</span>
            </div>
        </div>

        {/* Save + Continue buttons */}
        <div className="space-x-3">
            <button className="px-4 py-1 border border-gray-400 rounded text-sm text-gray-800 hover:bg-gray-100">Save</button>
            <button className="px-4 py-1 bg-[#1D0E3C] text-white rounded text-sm hover:bg-[#311f5a]">Continue</button>
        </div>
        </div>

        {/* Upload Section Title */}
        <h3 className="text-lg font-medium mt-8 mb-4">Upload image</h3>

        {/* Upload Section */}
        <div className="grid grid-cols-10 gap-4 mb-10">
            {/* Event Logo - 3/10 of the width */}
            <div className="col-span-3 border border-dashed border-gray-300 rounded-lg h-56 flex items-center justify-center text-gray-400 flex-col text-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11l4 4 4-4" />
                </svg>
                <p>Add event logo<br />(720×958)</p>
            </div>

            {/* Event Cover - 7/10 of the width */}
            <div className="col-span-7 border border-dashed border-gray-300 rounded-lg h-72 flex items-center justify-center text-gray-400 flex-col text-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11l4 4 4-4" />
                </svg>
                <p>Add event cover image<br />(1280×720)</p>
            </div>
        </div>



        {/* Event Info */}
        <form className="space-y-6">
          <input type="text" placeholder="Event Name" className="w-full border px-4 py-2 rounded" />

          <fieldset className="space-y-4">
            <legend className="text-sm font-medium text-gray-600">Event Address</legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="locationType" /> Online Event
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="locationType" /> Onsite Event
              </label>
            </div>
            <input type="text" placeholder="Venue Name" className="w-full border px-4 py-2 rounded" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="City/Province" className="border px-4 py-2 rounded" />
              <input type="text" placeholder="District" className="border px-4 py-2 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Ward" className="border px-4 py-2 rounded" />
              <input type="text" placeholder="Street" className="border px-4 py-2 rounded" />
            </div>
          </fieldset>

          {/* Category */}
          <select className="w-full border px-4 py-2 rounded">
            <option>Select event category</option>
            <option>Music</option>
            <option>Conference</option>
            <option>Workshop</option>
          </select>

          {/* Description */}
          <textarea
            rows={8}
            placeholder="Event Description (intro, details, terms & conditions)"
            className="w-full border px-4 py-2 rounded"
          />

          {/* Organizer Info Section */}
        <div className="grid grid-cols-12 gap-4 mt-8">
        {/* Organizer Logo (left side - smaller) */}
        <div className="col-span-3 border border-dashed border-gray-300 rounded-lg h-56 flex items-center justify-center text-gray-400 flex-col text-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11l4 4 4-4" />
            </svg>
            <p>Add organizer logo<br />(720×958)</p>
        </div>

        {/* Organizer Name + Info (right side - wider) */}
        <div className="col-span-9 space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Name</label>
            <input
                type="text"
                placeholder="Organizer Name"
                className="w-full border rounded px-4 py-2"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Information</label>
            <textarea
                rows={4}
                placeholder="Organizer information"
                className="w-full border rounded px-4 py-2"
            />
            </div>
        </div>
        </div>


        </form>
      </main>
    </div>
  );
}
