import React from "react";
// Import Syncfusion components directly
import {
    RichTextEditorComponent,
    Inject,
    Toolbar,
    Image,
    Link,
    HtmlEditor,
    QuickToolbar,
    ChangeEventArgs,
} from "@syncfusion/ej2-react-richtexteditor";

import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-react-richtexteditor/styles/material.css";

import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('YOUR_LICENSE');

const CreateEvent = () => {
    const [step, setStep] = React.useState(1);

    const [eventLogo, setEventLogo] = React.useState<File | null>(null);
    const [eventLogoPreview, setEventLogoPreview] = React.useState<
        string | null
    >(null);

    const [eventCover, setEventCover] = React.useState<File | null>(null);
    const [eventCoverPreview, setEventCoverPreview] = React.useState<
        string | null
    >(null);

    const [organLogo, setOrganLogo] = React.useState<File | null>(null);
    const [organLogoPreview, setOrganLogoPreview] = React.useState<
        string | null
    >(null);

    const [eventType, setEventType] = React.useState<'online' | 'onsite'>('online');
    const [eventName, setEventName] = React.useState("");
    const [venueName, setVenueName] = React.useState("");
    const [city, setCity] = React.useState("");
    const [district, setDistrict] = React.useState("");
    const [ward, setWard] = React.useState("");
    const [street, setStreet] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [description, setDescription] = React.useState<string>(
        "<p>Initial event description here.</p>",
    );
    const [organizerName, setOrganizerName] = React.useState("");
    const [organizerInfo, setOrganizerInfo] = React.useState("");

    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");

    const [showTicketModal, setShowTicketModal] = React.useState(false);

    type TicketType = {
        name: string;
        price: number;
        total: number;
        min: number;
        max: number;
    };
    const [ticketTypes, setTicketTypes] = React.useState<TicketType[]>([]);
    const [ticketName, setTicketName] = React.useState('');
    const [price, setPrice] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const [min, setMin] = React.useState(0);
    const [max, setMax] = React.useState(0);

    const [accountOwner, setAccountOwner] = React.useState("");
    const [accountNumber, setAccountNumber] = React.useState("");
    const [bank, setBank] = React.useState("");
    const [branch, setBranch] = React.useState("");

    const isAddressValid = eventType === 'online' || (
        venueName && city && district && ward && street
    );

    
    let isFormValid = false;
    if (step === 1) {
        isFormValid = Boolean(
            eventName &&
                isAddressValid &&
                category &&
                organizerName &&
                organizerInfo,
        );
    } else if (step === 2) {
        isFormValid = Boolean(startTime && endTime);
    } else {
        isFormValid = Boolean(accountOwner && accountNumber && bank && branch);
    }

    const handleSave = () => {
        const formData = {
            eventName,
            eventType,
            venueName,
            city,
            district,
            ward,
            street,
            category,
            description,
            organizerName,
            organizerInfo,
            startTime,
            endTime,
            accountOwner,
            accountNumber,
            bank,
            branch,
        };
        localStorage.setItem("draftEvent", JSON.stringify(formData));
        console.log(formData);
    };

    const handleEventLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEventLogo(file);
            setEventLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleEventCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEventCover(file);
            setEventCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleOrganLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOrganLogo(file);
            setOrganLogoPreview(URL.createObjectURL(file));
        }
    };

    // Toolbar settings for the Rich Text Editor
    const toolbarSettings = {
        items: [
            "Bold",
            "Italic",
            "Underline",
            "StrikeThrough",
            "FontName",
            "FontSize",
            "FontColor",
            "BackgroundColor",
            "LowerCase",
            "UpperCase",
            "|",
            "Formats",
            "Alignments",
            "OrderedList",
            "UnorderedList",
            "Outdent",
            "Indent",
            "|",
            "CreateLink",
            "Image",
            "|",
            "ClearFormat",
            "Print",
            "SourceCode",
            "FullScreen",
            "|",
            "Undo",
            "Redo",
        ],
    };

    const handleDescriptionChange = (args: ChangeEventArgs) => {
        setDescription(args.value || "");
    };

    return (
        <div className="min-h-screen bg-white text-black flex">
            <aside className="w-64 bg-[#1D0E3C] text-white p-6 space-y-4">
                <h2 className="text-lg font-semibold">Organizer Center</h2>
                <ul className="space-y-2 text-sm">
                    <li>
                        <a href="/my-events" className="hover:underline">
                            My Events
                        </a>
                    </li>
                    <li>
                        <a href="/reports" className="hover:underline">
                            Report Management
                        </a>
                    </li>
                </ul>
            </aside>

            <main className="flex-1 p-10">
                <div className="bg-white border-b py-4 px-6 flex items-center justify-between">
                    <div className="flex space-x-12 ml-10">
                        {[
                            "Event information",
                            "Show time & Ticket",
                            "Payment",
                        ].map((label, index) => {
                            const isActive = step === index + 1;
                            return (
                                <div
                                    key={label}
                                    className="flex items-center space-x-2"
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${isActive ? "bg-[#1D0E3C] text-white" : "border border-gray-400 text-gray-500"}`}
                                    >
                                        {index + 1}
                                    </div>
                                    <span
                                        className={`text-sm ${isActive ? "text-[#1D0E3C] font-medium border-b-2 border-[#1D0E3C]" : "text-gray-500"}`}
                                    >
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="space-x-3">
                        <button
                            className="px-4 py-1 border border-gray-400 rounded text-sm text-gray-800 hover:bg-gray-100"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            disabled={!isFormValid}
                            onClick={() => {
                                if (step < 3) {
                                    setStep(step + 1);
                                }
                            }}
                            className={`px-4 py-1 rounded text-sm transition ${isFormValid ? "bg-[#1D0E3C] text-white hover:bg-[#311f5a] cursor-pointer" : "bg-gray-300 text-white opacity-50 cursor-not-allowed"}`}
                        >
                            {step < 3 ? "Continue" : "Finish"}
                        </button>
                        <button
                            type="button"
                            disabled={step === 1}
                            onClick={() => {
                                if (step > 1) {
                                    setStep(step - 1);
                                }
                            }}
                            className={`px-4 py-1 rounded text-sm transition ${step !== 1 ? "bg-[#1D0E3C] text-white hover:bg-[#311f5a] cursor-pointer" : "bg-gray-300 text-white opacity-50 cursor-not-allowed"}`}
                        >
                            Back
                        </button>
                    </div>
                </div>

                {step === 1 && (
                    <>
                        <h3 className="text-lg font-medium mt-8 mb-4">
                            Upload image
                        </h3>
                        <div className="grid grid-cols-10 gap-4 mb-10">
                            <div className="col-span-3 relative">
                                <label
                                    htmlFor="event-logo-upload"
                                    className="border border-dashed border-gray-300 rounded-lg h-56 flex items-center justify-center text-gray-400 flex-col text-center text-sm cursor-pointer hover:bg-gray-50"
                                >
                                    {eventLogoPreview ? (
                                        <img
                                            src={eventLogoPreview}
                                            alt="Logo preview"
                                            className="object-contain h-full rounded"
                                        />
                                    ) : (
                                        <>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 mb-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 11l4 4 4-4"
                                                />
                                            </svg>
                                            <p>
                                                Add event logo
                                                <br />
                                                (720×958)
                                            </p>
                                        </>
                                    )}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="event-logo-upload"
                                    onChange={handleEventLogoChange}
                                    className="hidden"
                                />
                            </div>
                            <div className="col-span-7 relative">
                                <label
                                    htmlFor="event-cover-upload"
                                    className="border border-dashed border-gray-300 rounded-lg h-56 flex items-center justify-center text-gray-400 flex-col text-center text-sm cursor-pointer hover:bg-gray-50"
                                >
                                    {eventCoverPreview ? (
                                        <img
                                            src={eventCoverPreview}
                                            alt="Cover preview"
                                            className="object-contain h-full rounded"
                                        />
                                    ) : (
                                        <>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 mb-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 11l4 4 4-4"
                                                />
                                            </svg>
                                            <p>
                                                Add event cover
                                                <br />
                                                (720×958)
                                            </p>
                                        </>
                                    )}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="event-cover-upload"
                                    onChange={handleEventCoverChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <form className="space-y-6">
                            <input
                                value={eventName}
                                onChange={(e) => {
                                    setEventName(e.target.value);
                                }}
                                type="text"
                                placeholder="Event Name"
                                className="w-full border px-4 py-2 rounded"
                            />

                            <fieldset className="space-y-4">
                                <legend className="text-sm font-medium text-gray-600">
                                    Event Address
                                </legend>
                                <div className="flex gap-4">
                                    <label
                                        htmlFor="location-online"
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            id="location-online"
                                            type="radio"
                                            name="locationType"
                                            checked={eventType === 'online'}
                                            onChange={() => setEventType('online')}
                                        />{" "}
                                        Online Event
                                    </label>
                                    <label
                                        htmlFor="location-onsite"
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            id="location-onsite"
                                            type="radio"
                                            name="locationType"
                                            checked={eventType === 'onsite'}
                                            onChange={() => setEventType('onsite')}
                                        />{" "}
                                        Onsite Event
                                    </label>
                                </div>
                                {eventType === 'onsite' && (
                                    <div>
                                        <input
                                            value={venueName}
                                            onChange={(e) => {
                                                setVenueName(e.target.value);
                                            }}
                                            type="text"
                                            placeholder="Venue Name"
                                            className="w-full border px-4 py-2 rounded"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                value={city}
                                                onChange={(e) => {
                                                    setCity(e.target.value);
                                                }}
                                                type="text"
                                                placeholder="City/Province"
                                                className="border px-4 py-2 rounded"
                                            />
                                            <input
                                                value={district}
                                                onChange={(e) => {
                                                    setDistrict(e.target.value);
                                                }}
                                                type="text"
                                                placeholder="District"
                                                className="border px-4 py-2 rounded"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                value={ward}
                                                onChange={(e) => {
                                                    setWard(e.target.value);
                                                }}
                                                type="text"
                                                placeholder="Ward"
                                                className="border px-4 py-2 rounded"
                                            />
                                            <input
                                                value={street}
                                                onChange={(e) => {
                                                    setStreet(e.target.value);
                                                }}
                                                type="text"
                                                placeholder="Street"
                                                className="border px-4 py-2 rounded"
                                            />
                                        </div>
                                    </div>
                                )}
                            </fieldset>

                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                }}
                                className="w-full border px-4 py-2 rounded"
                            >
                                <option value="" disabled>
                                    Select event category
                                </option>
                                <option value="Music">Music</option>
                                <option value="Conference">Conference</option>
                                <option value="Workshop">Workshop</option>
                            </select>

                            <div>
                                <label
                                    htmlFor="event-description-editor"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Event Description
                                </label>
                                <RichTextEditorComponent
                                    id="event-description-editor"
                                    height="350px"
                                    value={description}
                                    change={handleDescriptionChange}
                                    toolbarSettings={toolbarSettings}
                                >
                                    <Inject
                                        services={[
                                            Toolbar,
                                            Image,
                                            Link,
                                            HtmlEditor,
                                            QuickToolbar,
                                        ]}
                                    />
                                </RichTextEditorComponent>
                            </div>

                            <div className="grid grid-cols-12 gap-4 mt-8">
                                <div className="col-span-3 relative">
                                    <label
                                        htmlFor="organizer-logo-upload"
                                        className="border border-dashed border-gray-300 rounded-lg h-56 flex items-center justify-center text-gray-400 flex-col text-center text-sm cursor-pointer hover:bg-gray-50"
                                    >
                                        {organLogoPreview ? (
                                            <img
                                                src={organLogoPreview}
                                                alt="Organizer Logo preview"
                                                className="object-contain h-full rounded"
                                            />
                                        ) : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-8 w-8 mb-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 11l4 4 4-4"
                                                    />
                                                </svg>
                                                <p>
                                                    Add organizer logo
                                                    <br />
                                                    (720×958)
                                                </p>
                                            </>
                                        )}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="organizer-logo-upload"
                                        onChange={handleOrganLogoChange}
                                        className="hidden"
                                    />
                                </div>

                                <div className="col-span-9 space-y-4">
                                    <div>
                                        <label
                                            htmlFor="organizer-name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Organizer Name
                                        </label>
                                        <input
                                            id="organizer-name"
                                            value={organizerName}
                                            onChange={(e) => {
                                                setOrganizerName(
                                                    e.target.value,
                                                );
                                            }}
                                            type="text"
                                            placeholder="Organizer Name"
                                            className="w-full border rounded px-4 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="organizer-info"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Organizer Information
                                        </label>
                                        <textarea
                                            id="organizer-info"
                                            value={organizerInfo}
                                            onChange={(e) => {
                                                setOrganizerInfo(
                                                    e.target.value,
                                                );
                                            }}
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
                        <h3 className="text-lg font-medium mt-8 mb-4">
                            Event date and time
                        </h3>
                        <div className="space-y-6">
                            <div className="text-sm font-medium text-gray-800">
                                Event date and time
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label
                                        htmlFor="start-time"
                                        className="text-sm text-gray-600 mb-1"
                                    >
                                        Start time show
                                    </label>
                                    <input
                                        id="start-time"
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) => {
                                            setStartTime(e.target.value);
                                        }}
                                        className="w-full border px-4 py-2 rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label
                                        htmlFor="end-time"
                                        className="text-sm text-gray-600 mb-1"
                                    >
                                        End time show
                                    </label>
                                    <input
                                        id="end-time"
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={(e) => {
                                            setEndTime(e.target.value);
                                        }}
                                        className="w-full border px-4 py-2 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                            Ticket Type
                        </h3>
                        <div className="space-y-2 mt-4">
                            {ticketTypes.map((ticket, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center bg-gray-700 text-white px-4 py-3 rounded"
                                >
                                    <span className="font-semibold">{ticket.name}</span>
                                    <button
                                        onClick={() => {
                                            const updated = [...ticketTypes];
                                            updated.splice(index, 1);
                                            setTicketTypes(updated);
                                        }}
                                        className="text-white hover:text-red-400 flex items-center"
                                    >
                                        🗑 Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowTicketModal(true)}
                            className="flex items-center text-purple-600 hover:underline mt-4"
                        >
                            <span className="mr-1 text-xl">＋</span> Add another ticket type
                        </button>

                        {showTicketModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-md shadow-md max-w-3xl w-full relative">
                                    <button
                                        className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black"
                                        onClick={() => setShowTicketModal(false)}
                                    >
                                        &times;
                                    </button>

                                    <h3 className="text-center text-lg font-semibold text-[#1D0E3C] mb-4">
                                        Add another ticket type
                                    </h3>

                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Ticket name"
                                            className="w-full border rounded px-4 py-2"
                                            value={ticketName}
                                            onChange={(e) => setTicketName(e.target.value)}
                                        />

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <input value={price} onChange={(e) => setPrice(Number(e.target.value))} type="number" placeholder="Price" className="border px-3 py-2 rounded" />
                                            <input value={total} onChange={(e) => setTotal(Number(e.target.value))} type="number" placeholder="Total number of ticket" className="border px-3 py-2 rounded" />
                                            <input value={min} onChange={(e) => setMin(Number(e.target.value))} type="number" placeholder="Minimum per purchase" className="border px-3 py-2 rounded" />
                                            <input value={max} onChange={(e) => setMax(Number(e.target.value))} type="number" placeholder="Maximum per purchase" className="border px-3 py-2 rounded" />
                                        </div>

                                        <button
                                            className="w-full mt-4 bg-[#1D0E3C] text-white py-2 rounded hover:bg-[#311f5a]"
                                            onClick={() => {
                                                if (!ticketName.trim()) return alert("Please enter ticket name");
                                                if (min > max) return alert("Min tickets cannot exceed max tickets");
                                                if (min < 1) return alert("Min tickets must be at least 1");
                                                if (max < 1) return alert("Max tickets must be at least 1");
                                                if (total < 1) return alert("Total tickets must be at least 1");
                                                if (price < 0) return alert("Price cannot be negative");
                                                if (total < min) return alert("Total tickets must be at least equal to minimum tickets"); 
                                                if (total < max) return alert("Total tickets must be at least equal to maximum tickets");

                                                const newTicket = {
                                                    name: ticketName.trim(),
                                                    price,
                                                    total,
                                                    min,
                                                    max,
                                                };

                                                setTicketTypes([...ticketTypes, newTicket]);

                                                // Reset modal and inputs
                                                setTicketName('');
                                                setPrice(0);
                                                setTotal(10);
                                                setMin(1);
                                                setMax(10);
                                                setShowTicketModal(false);
                                            }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {step === 3 && (
                    <div className="max-w-2xl mt-10 space-y-6">
                        <h2 className="text-xl font-semibold text-center">
                            Payment information
                        </h2>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label
                                htmlFor="account-owner"
                                className="col-span-1 text-right text-sm font-medium"
                            >
                                Account owner:
                            </label>
                            <input
                                id="account-owner"
                                value={accountOwner}
                                onChange={(e) => {
                                    setAccountOwner(e.target.value);
                                }}
                                className="col-span-3 border px-4 py-2 rounded"
                                type="text"
                            />

                            <label
                                htmlFor="account-number"
                                className="col-span-1 text-right text-sm font-medium"
                            >
                                Account number:
                            </label>
                            <input
                                id="account-number"
                                value={accountNumber}
                                onChange={(e) => {
                                    setAccountNumber(e.target.value);
                                }}
                                className="col-span-3 border px-4 py-2 rounded"
                                type="text"
                            />

                            <label
                                htmlFor="bank"
                                className="col-span-1 text-right text-sm font-medium"
                            >
                                Bank:
                            </label>
                            <input
                                id="bank"
                                value={bank}
                                onChange={(e) => {
                                    setBank(e.target.value);
                                }}
                                className="col-span-3 border px-4 py-2 rounded"
                                type="text"
                            />

                            <label
                                htmlFor="branch"
                                className="col-span-1 text-right text-sm font-medium"
                            >
                                Branch:
                            </label>
                            <input
                                id="branch"
                                value={branch}
                                onChange={(e) => {
                                    setBranch(e.target.value);
                                }}
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
 
export default CreateEvent;