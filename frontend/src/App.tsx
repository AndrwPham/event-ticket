import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import ContactSales from "./pages/contactSales/page";
import CreateEvent from "./pages/createEvent/page";
import Ticket from "./pages/ticket/page";
import LogIn from "./components/log-in";
import SignUp from "./components/sign-up";
import Home from "./pages/home/page";
import SearchPage from "./pages/search/page";
import Payment from "./pages/payment/Payment";
import TicketDetails from "./pages/ticket/TicketDetails";
import CardPaymentPage from "./pages/payment/CardPaymentPage";
import SeatMap from "./pages/seatMap/SeatMap";
import CancelPage from "./pages/payment/CancelPage";
import MyProfile from "./pages/myProfile/page";
import AboutUsPage from "./pages/footer/AboutUsPage";
import CustomerTermsPage from "./pages/footer/CustomerTermsPage";
import HelpCenterPage from "./pages/footer/HelpCenterPage";
import HowItWorksPage from "./pages/footer/HowItWorksPage";
import OrganizerTermsPage from "./pages/footer/OrganizerTermsPage";
import PressPage from "./pages/footer/PressPage";
import PrivacyPage from "./pages/footer/PrivacyPage";
import TermsPage from "./pages/footer/TermsPage";
import PaymentSuccess from "./pages/payment/PaymentSuccess";

function App() {
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [isLogInOpen, setIsLogInOpen] = useState(false);
    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-gray-100">
                <Navbar
                    onSignUpClick={() => {
                        setIsSignUpOpen(true);
                    }}
                    onLogInClick={() => {
                        setIsLogInOpen(true);
                    }}
                />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/event/:eventId"
                            element={<TicketDetails />}
                        />
                        <Route
                            path="/event/:id/payment"
                            element={<Payment />}
                        />
                        <Route path="/home" element={<Home />} />
                        <Route
                            path="/contact-sales"
                            element={<ContactSales />}
                        />
                        <Route path="/create-event" element={<CreateEvent />} />
                        <Route path="/ticket" element={<Ticket />} />

                        <Route path="/search" element={<SearchPage />} />
                        <Route
                            path="/event/:eventId/payment/card"
                            element={<CardPaymentPage />}
                        />
                        <Route
                            path="/event/:eventId/payment/cancel"
                            element={<CancelPage />}
                        />
                        <Route
                            path="/event/:eventid/payment/success/:orderId"
                            element={<PaymentSuccess />}
                        />
                        <Route
                            path="/event/:eventId/seats"
                            element={<SeatMap />}
                        />
                        <Route path="/profile" element={<MyProfile />} />
                        <Route path="/about-us" element={<AboutUsPage />} />
                        <Route path="/customer-terms" element={<CustomerTermsPage />} />
                        <Route path="/help-center" element={<HelpCenterPage />} />
                        <Route path="/how-it-works" element={<HowItWorksPage />} />
                        <Route path="/organizer-terms" element={<OrganizerTermsPage />} />
                        <Route path="/press" element={<PressPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                    </Routes>
                </main>
                {isSignUpOpen && (
                    <SignUp
                        onClose={() => {
                            setIsSignUpOpen(false);
                        }}
                    />
                )}
                {isLogInOpen && (
                    <LogIn
                        onClose={() => {
                            setIsLogInOpen(false);
                        }}
                        onSwitchToSignUp={() => {
                            setIsLogInOpen(false);
                            setIsSignUpOpen(true);
                        }}
                    />
                )}
                <Footer />
            </div>
        </Router>
    );
}
export default App;
