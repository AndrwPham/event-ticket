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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/home" element={<Home />} />
        <Route path="/contact-sales" element={<ContactSales />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;