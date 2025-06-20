import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import ContactSales from "./pages/contactSales/page";
import CreateEvent from "./pages/createEvent/page";
import Ticket from "./pages/ticket/page";
//import Login from "./pages/login/page";
import LogIn from "./components/log-in";
import SignUp from "./pages/signUp/page";
import Home from "./pages/home/page";
import SearchPage from "./pages/search/page";
import Payment from "./pages/payment/Payment";
import TicketDetails from "./pages/ticket/TicketDetails";
import CardPaymentPage from "./pages/payment/CardPaymentPage";
import SeatMap from "./pages/seatMap/SeatMap";
import SuccessPage from "./pages/payment/SuccessPage";
import CancelPage from "./pages/payment/CancelPage";
import MyProfile from "./pages/myProfile/page";

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
                        <Route path="/event/:id" element={<TicketDetails />} />
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
                            path="/event/:id/payment/card"
                            element={<CardPaymentPage />}
                        />
                        <Route
                            path="/event/:id/payment/success"
                            element={<SuccessPage />}
                        />
                        <Route
                            path="/event/:id/payment/cancel"
                            element={<CancelPage />}
                        />
                        <Route
                            path="/event/:id/select-seats"
                            element={<SeatMap />}
                        />
                        <Route path="/profile" element={<MyProfile />} />
                    </Routes>
                </main>
                {/*{isSignUpOpen && <SignUp onClose={() => { setIsSignUpOpen(false); }} />}*/}
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
