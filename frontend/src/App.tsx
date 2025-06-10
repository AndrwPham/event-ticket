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

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-gray-100">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/event/:id" element={<TicketDetails />} />
                        <Route path="/payment" element={<Payment />} />
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
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
