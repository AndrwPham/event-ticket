// src/pages/CreateEvent.tsx
import React from 'react';

export default function CreateEvent() {
    const [step, setStep] = React.useState(1);

    const [eventName, setEventName] = React.useState('');
    const [venueName, setVenueName] = React.useState('');
    const [city, setCity] = React.useState('');
    const [district, setDistrict] = React.useState('');
    const [ward, setWard] = React.useState('');
    const [street, setStreet] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [organizerName, setOrganizerName] = React.useState('');
    const [organizerInfo, setOrganizerInfo] = React.useState('');

    const [startTime, setStartTime] = React.useState('');
    const [endTime, setEndTime] = React.useState(''); 
    
    const [accountOwner, setAccountOwner] = React.useState('');
    const [accountNumber, setAccountNumber] = React.useState('');
    const [bank, setBank] = React.useState('');
    const [branch, setBranch] = React.useState('');


    const isFormValid =
        step === 1
            ? eventName && venueName && city && district && ward && street && category && description && organizerName && organizerInfo
            : step === 2
                ? startTime && endTime
                : accountOwner && accountNumber && bank && branch;

    const handleSave = () => {
        const formData = {
            eventName, venueName, city, district, ward, street, category, description, organizerName, organizerInfo,
            startTime, endTime,
            accountOwner, accountNumber, bank, branch
        };

        // Save to localStorage or send to API
        localStorage.setItem('draftEvent', JSON.stringify(formData));
        console.log(formData);
    };


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
                        {['Event information', 'Show time & Ticket', 'Payment'].map((label, index) => {
                            const isActive = step === index + 1;
                            return (
                            <div key={label} className="flex items-center space-x-2">
                                <div className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${isActive ? 'bg-[#1D0E3C] text-white' : 'border border-gray-400 text-gray-500'}`}>
                                {index + 1}
                                </div>
                                <span className={`text-sm ${isActive ? 'text-[#1D0E3C] font-medium border-b-2 border-[#1D0E3C]' : 'text-gray-500'}`}>
                                {label}
                                </span>
                            </div>
                            );
                        })}
                    </div>


                    {/* Save + Continue buttons */}
                    <div className="space-x-3">
                        <button 
                            className="px-4 py-1 border border-gray-400 rounded text-sm text-gray-800 hover:bg-gray-100"
                            onClick={handleSave}
                            >
                            Save</button>
                        <button
                            type="button"
                            disabled={!isFormValid}
                            onClick={() => {
                                if (step < 3) {
                                    setStep(step + 1);
                                }
                            }}
                            className={`px-4 py-1 rounded text-sm transition ${
                                isFormValid
                                ? 'bg-[#1D0E3C] text-white hover:bg-[#311f5a] cursor-pointer'
                                : 'bg-gray-300 text-white opacity-50 cursor-not-allowed'
                            }`}
                            >
                            {step < 3 ? 'Continue' : 'Finish'}
                        </button>
                        <button
                            type="button"
                            disabled={step === 1}
                            onClick={() => {
                                if (step > 1) {
                                    setStep(step - 1);
                                }
                            }}
                            className={`px-4 py-1 rounded text-sm transition ${
                                !(step === 1)
                                ? 'bg-[#1D0E3C] text-white hover:bg-[#311f5a] cursor-pointer'
                                : 'bg-gray-300 text-white opacity-50 cursor-not-allowed'
                            }`}
                            >
                            Back
                        </button>


                    </div>
                </div>

                {step === 1 && (
                    <>
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
                            <input value={eventName} onChange={(e) => setEventName(e.target.value)} type="text" placeholder="Event Name" className="w-full border px-4 py-2 rounded" />

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
                                <input value={venueName} onChange={(e) => setVenueName(e.target.value)} type="text" placeholder="Venue Name" className="w-full border px-4 py-2 rounded" />
                                <div className="grid grid-cols-2 gap-4">
                                <input value={city} onChange={(e) => setCity(e.target.value)} type="text" placeholder="City/Province" className="border px-4 py-2 rounded" />
                                <input value={district} onChange={(e) => setDistrict(e.target.value)} type="text" placeholder="District" className="border px-4 py-2 rounded" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                <input value={ward} onChange={(e) => setWard(e.target.value)} type="text" placeholder="Ward" className="border px-4 py-2 rounded" />
                                <input value={street} onChange={(e) => setStreet(e.target.value)} type="text" placeholder="Street" className="border px-4 py-2 rounded" />
                                </div>
                            </fieldset>

                            {/* Category */}
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border px-4 py-2 rounded">
                                <option disabled>Select event category</option>
                                <option>Music</option>
                                <option>Conference</option>
                                <option>Workshop</option>
                            </select>

                            {/* Description */}
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                                    value={organizerName}
                                    onChange={(e) => setOrganizerName(e.target.value)}
                                    type="text"
                                    placeholder="Organizer Name"
                                    className="w-full border rounded px-4 py-2"
                                />
                                </div>

                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Information</label>
                                <textarea
                                    value={organizerInfo} 
                                    onChange={(e) => setOrganizerInfo(e.target.value)}
                                    rows={4}
                                    placeholder="Organizer information"
                                    className="w-full border rounded px-4 py-2"
                                />
                                    </div>
                                </div>
                            </div>


                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h3 className="text-lg font-medium mt-8 mb-4">Event date and time</h3>
                        <div className="space-y-6">
                        <div className="text-sm font-medium text-gray-800">Event date and time</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 mb-1">Start time show</label>
                                    <input
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full border px-4 py-2 rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 mb-1">End time show</label>
                                    <input
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full border px-4 py-2 rounded"
                                    />
                                </div>
                            </div>
                        </div>


                        <h3 className="text-lg font-medium mb-2">Ticket Type</h3>
                        <div className="bg-gray-600 text-white rounded flex items-center justify-between px-6 py-3">
                        <span className="font-medium">Standard</span>
                        <button className="text-white hover:text-red-300">🗑 Delete</button>
                        </div>
                        <p className="mt-4 text-sm text-[#1D0E3C] hover:underline cursor-pointer">
                        ➕ Add another ticket type
                        </p>
                    </>
                )}

                {step === 3 && (
                    <div className="max-w-2xl mt-10 space-y-6">
                        <h2 className="text-xl font-semibold text-center">Payment information</h2>

                        <div className="grid grid-cols-4 items-center gap-4">
                        <label className="col-span-1 text-right text-sm font-medium">Account owner:</label>
                        <input
                            value={accountOwner}
                            onChange={(e) => setAccountOwner(e.target.value)}
                            className="col-span-3 border px-4 py-2 rounded"
                            type="text"
                        />

                        <label className="col-span-1 text-right text-sm font-medium">Account number:</label>
                        <input
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="col-span-3 border px-4 py-2 rounded"
                            type="text"
                        />

                        <label className="col-span-1 text-right text-sm font-medium">Bank:</label>
                        <input
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                            className="col-span-3 border px-4 py-2 rounded"
                            type="text"
                        />

                        <label className="col-span-1 text-right text-sm font-medium">Branch:</label>
                        <input
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="col-span-3 border px-4 py-2 rounded"
                            type="text"
                        />
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
