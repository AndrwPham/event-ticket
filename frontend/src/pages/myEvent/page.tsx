import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogIn from "../../components/log-in";
import SignUp from "../../components/sign-up";

const MyEventPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showSignUp, setShowSignUp] = useState(false);

    if (!isAuthenticated) {
        return showSignUp ? (
            <SignUp
                onClose={() => {
                    navigate("/");
                }}
            />
        ) : (
            <LogIn
                onClose={() => {
                    navigate("/");
                }}
                onSwitchToSignUp={() => {
                    setShowSignUp(true);
                }}
            />
        );
    }

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6">My Events</h1>
                <p className="text-gray-600">This page is visible only to logged in users.</p>
            </div>
        </div>
    );
};

export default MyEventPage;