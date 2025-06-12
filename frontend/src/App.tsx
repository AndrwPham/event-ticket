import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import ContactSales from "./pages/contactSales/page";
import CreateEvent from "./pages/createEvent/page";
import Ticket from "./pages/ticket/page";
import Login from "./pages/login/page";
import SignUp from "./pages/signUp/page";
import Home from "./pages/home/page";
import SearchPage from "./pages/search/page";
import Payment from "./pages/payment/Payment";
import TicketDetails from "./pages/ticket/TicketDetails";
import CardPaymentPage from "./pages/payment/CardPaymentPage";
import SuccessPage from "./pages/payment/SuccessPage";
import CancelPage from "./pages/payment/CancelPage";
import EmbeddedPayment from "./pages/payment/EmbeddedPayment";

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-gray-100">
                <Navbar />
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
                        <Route path="/login" element={<Login />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route
                            path="/event/:id/payment/card"
                            element={<CardPaymentPage />}
                        />
                        <Route
                            path="/event/:id/embedded-payment"
                            element={<EmbeddedPayment />}
                        />
                        <Route
                            path="/event/:id/payment/success"
                            element={<SuccessPage />}
                        />
                        <Route
                            path="/event/:id/payment/cancel"
                            element={<CancelPage />}
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
