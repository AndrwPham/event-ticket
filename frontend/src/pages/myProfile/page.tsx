import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Define the user profile type based on your backend response
type UserProfile = {
    username: string;
    // Add other fields if needed
};

// Add response types
// For attendee info GET
interface AttendeeInfo {
    first_name?: string;
    last_name?: string;
    phone?: string;
}
// For error responses
interface ErrorResponse {
    message: string | string[];
}

const MyProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false); // For success message
    const [error, setError] = useState<string | null>(null); // For error feedback

    const isFormValid = Boolean(firstName && lastName && phone);

    useEffect(() => {
        // No need to get token from localStorage
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/auth/me`,
                    {
                        method: "GET",
                        credentials: "include", // Send cookies
                    },
                );

                if (!response.ok) throw new Error("Failed to fetch profile");

                const data = (await response.json()) as UserProfile;

                setProfile(data);
                console.log("Fetched profile:", data); // Log fetched profile
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };

        void fetchProfile();
    }, []);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/user/attendee`,
                    {
                        method: "GET",
                        credentials: "include", // Send cookies
                    },
                );

                if (!response.ok)
                    throw new Error("Failed to fetch personal info");

                const dataArr = await response.json();
                const data = Array.isArray(dataArr) ? dataArr[0] : dataArr;
                setFirstName(data?.first_name ?? "");
                setLastName(data?.last_name ?? "");
                setPhone(data?.phone ?? "");
            } catch (err) {
                console.error("Failed to fetch personal info:", err);
            }
        };

        void fetchInfo();
    }, []); // refetch info after successful update

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setSuccess(false);
        setError(null);
        console.log("Submitting PATCH /user/attendee", {
            firstName,
            lastName,
            phone,
        });
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/user/attendee`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        phone: phone,
                    }),
                },
            );
            console.log("PATCH response status:", response.status);
            if (!response.ok) {
                const errorData = (await response.json()) as ErrorResponse;
                setError(
                    Array.isArray(errorData.message)
                        ? errorData.message.join(", ")
                        : errorData.message,
                );
                throw new Error(
                    Array.isArray(errorData.message)
                        ? errorData.message.join(", ")
                        : errorData.message,
                );
            }
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            console.error("Failed to update personal info:", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-white">
            {/* This container is restored to its original size */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-12 gap-12">
                    {/* Sidebar: Unchanged */}
                    <aside className="col-span-12 lg:col-span-3">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-500">
                                    Account of
                                </h3>
                                <p className="font-bold text-lg">
                                    {profile ? profile.username : "Loading..."}
                                </p>
                            </div>
                            <nav className="space-y-2 text-gray-600">
                                <h4 className="font-bold text-black px-4 pt-2">
                                    Account Settings
                                </h4>
                                <div className="pl-4">
                                    <Link
                                        to="/profile"
                                        className="block py-2 px-4 rounded-md bg-gray-100 font-bold text-black"
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/ticket"
                                        className="block py-2 px-4 rounded-md hover:bg-gray-100"
                                    >
                                        My Tickets
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content: I've adjusted the column span to make this part smaller */}
                    <main className="col-span-12 lg:col-span-5">
                        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                        <p className="text-gray-600 mb-8">
                            Providing accurate info will support you in ticket
                            booking or verification
                        </p>
                        {success && (
                            <div className="mb-4 text-green-600 font-semibold">
                                Profile updated!
                            </div>
                        )}
                        {error && (
                            <div className="mb-4 text-red-600 font-semibold">
                                {error}
                            </div>
                        )}
                        <form
                            onSubmit={(e) => {
                                void handleSubmit(e);
                            }}
                            className="space-y-6"
                        >
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="lastName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="0123456789"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="flex justify-start">
                                <button
                                    type="submit"
                                    className="bg-[#1A0B49] text-white font-semibold py-2 px-6 rounded-md hover:bg-opacity-90"
                                    disabled={!isFormValid || isLoading}
                                >
                                    {isLoading
                                        ? "Changing Info..."
                                        : "Change Info"}
                                </button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
